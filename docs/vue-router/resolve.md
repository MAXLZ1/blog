# resolve

::: tip
返回路由地址的标准化版本。
:::

`resolve`接收两个参数：`rawLocation`、`currentLocation`（可选）。其中`rawLocation`是待转换的路由，`rawLocation`可以是个对象也可以是个字符串。`currentLocation`不传默认是`currentRoute`。

在`resolve`中有是两个分支：
- 如果`rawLocation`是`string`类型
  调用`parseURL`解析`rawLocation`:
```ts
const locationNormalized = parseURL(
  parseQuery,
  rawLocation,
  currentLocation.path
)
```
`parseURL`接收三个参数：`parseQuery`（一个query解析函数）、`location`（被解析的`location`）、`currentLocation`（当前的`location`）。
```ts
export function parseURL(
  parseQuery: (search: string) => LocationQuery,
  location: string,
  currentLocation: string = '/'
): LocationNormalized {
  let path: string | undefined,
    query: LocationQuery = {},
    searchString = '',
    hash = ''

  // location中?的位置
  const searchPos = location.indexOf('?')
  // location中#的位置，如果location中有?，在?之后找#
  const hashPos = location.indexOf('#', searchPos > -1 ? searchPos : 0)

  // 如果
  if (searchPos > -1) {
    // 从location中截取[0, searchPos)位置的字符串作为path
    path = location.slice(0, searchPos)
    // 从location截取含search的字符串，不包含hash部分
    searchString = location.slice(
      searchPos + 1,
      hashPos > -1 ? hashPos : location.length
    )
    // 调用parseQuery生成query对象
    query = parseQuery(searchString)
  }
  // 如果location中有hash
  if (hashPos > -1) {
    path = path || location.slice(0, hashPos)
    // 从location中截取[hashPos, location.length)作为hash（包含#）
    hash = location.slice(hashPos, location.length)
  }

  // 解析以.开头的相对路径
  path = resolveRelativePath(path != null ? path : location, currentLocation)
  // empty path means a relative query or hash `?foo=f`, `#thing`

  return {
  	// fullPath = path + searchString + hash
    fullPath: path + (searchString && '?') + searchString + hash,
    path,
    query,
    hash,
  }
}
```
来看下，相对路径的解析过程：
```ts
export function resolveRelativePath(to: string, from: string): string {
  // 如果to以/开头，说明是个绝对路径，直接返回即可
  if (to.startsWith('/')) return to
  // 如果from不是以/开头，那么说明from不是绝对路径，也就无法推测出to的绝对路径，此时直接返回to
  if (__DEV__ && !from.startsWith('/')) {
    warn(
      `Cannot resolve a relative location without an absolute path. Trying to resolve "${to}" from "${from}". It should look like "/${from}".`
    )
    return to
  }

  if (!to) return from
  // 使用/分割from与to
  const fromSegments = from.split('/')
  const toSegments = to.split('/')

  // 初始化position默认为fromSegments的最后一个索引
  let position = fromSegments.length - 1
  let toPosition: number
  let segment: string

  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition]
    // 保证position不会小于0
    if (position === 1 || segment === '.') continue
    if (segment === '..') position--
    else break
  }

  return (
    fromSegments.slice(0, position).join('/') +
    '/' +
    toSegments
      .slice(toPosition - (toPosition === toSegments.length ? 1 : 0))
      .join('/')
  )
}
```
`to=cc`，`from=/aa/bb`，经过`resolveRelativePath`后：`/aa/cc`

`to=cc`，`from=/aa/bb/`，经过`resolveRelativePath`后：`/aa/bb/cc`

`to=./cc`，`from=/aa/bb`，经过`resolveRelativePath`后：`/aa/cc`

`to=./cc`，`from=/aa/bb/`，经过`resolveRelativePath`后：`/aa/bb/cc`

`to=../cc`，`from=/aa/bb`，经过`resolveRelativePath`后：`/aa`

`to=../cc`，`from=/aa/bb/`，经过`resolveRelativePath`后：`/aa/cc`

如果`from/`，`to=cc`、`to=./cc`、`to=../cc`、`to=../../cc`、`to=./../cc`、`to=.././cc`经过`resolveRelativePath`始终返回`/cc`

回到`resolve`中，解析完`rawLocation`后，调用`matcher.resolve`
```ts
const matchedRoute = matcher.resolve(
  { path: locationNormalized.path },
  currentLocation
)
// 使用routerHistory.createHref创建href
const href = routerHistory.createHref(locationNormalized.fullPath)
```

最后返回对象：
```ts
return assign(locationNormalized, matchedRoute, {
  // 对params中的value进行decodeURIComponent
  params:decodeParams(matchedRoute.params),
  // 对hash进行decodeURIComponent
  hash: decode(locationNormalized.hash),
  redirectedFrom: undefined,
  href,
})
```

- `rawLocation`不是`string`类型

```ts
let matcherLocation: MatcherLocationRaw

// 如果rawLocation中有path属性
if ('path' in rawLocation) {
  // rawLocation中的params会被忽略
  if (
    __DEV__ &&
    'params' in rawLocation &&
    !('name' in rawLocation) &&
    Object.keys(rawLocation.params).length
  ) {
    warn(
      `Path "${
        rawLocation.path
      }" was passed with params but they will be ignored. Use a named route alongside params instead.`
    )
  }
  // 处理path为绝对路径
  matcherLocation = assign({}, rawLocation, {
    path: parseURL(parseQuery, rawLocation.path, currentLocation.path).path,
  })
} else {
  // 删除空的参数
  const targetParams = assign({}, rawLocation.params)
  for (const key in targetParams) {
    if (targetParams[key] == null) {
      delete targetParams[key]
    }
  }
  // 对params进行编码
  matcherLocation = assign({}, rawLocation, {
    params: encodeParams(rawLocation.params),
  })
  // 将当前位置的params编码 当前位置的参数被解码，我们需要对它们进行编码以防匹配器合并参数
  currentLocation.params = encodeParams(currentLocation.params)
}

// 调用matcher.resolve获取路由相关信息
const matchedRoute = matcher.resolve(matcherLocation, currentLocation)
const hash = rawLocation.hash || ''

if (__DEV__ && hash && !hash.startsWith('#')) {
  warn(
    `A \`hash\` should always start with the character "#". Replace "${hash}" with "#${hash}".`
  )
}

// 由于matcher已经合并了当前位置的参数，所以需要进行解码
matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params))

// 生成完整path
const fullPath = stringifyURL(
  stringifyQuery,
  assign({}, rawLocation, {
    hash: encodeHash(hash),
    path: matchedRoute.path,
  })
)
// routerHistory.createHref会删除#之前的任意字符
const href = routerHistory.createHref(fullPath)
if (__DEV__) {
  if (href.startsWith('//')) {
    warn(
      `Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`
    )
  } else if (!matchedRoute.matched.length) {
    warn(
      `No match found for location with path "${
        'path' in rawLocation ? rawLocation.path : rawLocation
      }"`
    )
  }
}

return assign(
  {
    fullPath,
    hash,
    query:
    // 如果query是个嵌套对象，normalizeQuery会将嵌套的对象toString，如果用户使用qs等库，我们需要保持query的状态
    // https://github.com/vuejs/router/issues/328#issuecomment-649481567
      stringifyQuery === originalStringifyQuery
        ? normalizeQuery(rawLocation.query)
        : ((rawLocation.query || {}) as LocationQuery),
  },
  matchedRoute,
  {
    redirectedFrom: undefined,
    href,
  }
)
```
