# resolve

::: tip
返回路由地址的标准化版本。
:::

`resolve`接收两个参数：`rawLocation`、`currentLocation`（可选）。其中`rawLocation`是待转换的路由，`rawLocation`可以是个对象也可以是个字符串。`currentLocation`不传默认是`currentRoute`

当`rawLocation`为字符串时，调用`parseURL`解析字符串，`parseURL`方法返回一个`LocationNormalized`类型的对象，这个对象包含了`path`、`fullPath`、`hash`、`query`。

```ts
const START_LOCATION_NORMALIZED: RouteLocationNormalizedLoaded = {
  path: '/',
  name: undefined,
  params: {},
  query: {},
  hash: '',
  fullPath: '/',
  matched: [],
  meta: {},
  redirectedFrom: undefined,
}
const currentRoute = shallowRef<RouteLocationNormalizedLoaded>(
  START_LOCATION_NORMALIZED
)

// ...
if (typeof rawLocation === 'string') {
  // 解析rawLocation
  const locationNormalized = parseURL(
    parseQuery,
    rawLocation,
    currentLocation.path
  )
  // 调用matcher.resolve获取rawLocation中的params、hash等信息
  const matchedRoute = matcher.resolve(
    { path: locationNormalized.path },
    currentLocation
  )

  // 删除locationNormalized.fullPath中#前的任意字符
  const href = routerHistory.createHref(locationNormalized.fullPath)
  // 开发环境下进行友好提示
  if (__DEV__) {
    if (href.startsWith('//')) // href如果以//开头
      warn(
        `Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`
      )
    else if (!matchedRoute.matched.length) { // 如果没有没配到的路由
      warn(`No match found for location with path "${rawLocation}"`)
    }
  }

  // 返回一个新的对象
  return assign(locationNormalized, matchedRoute, {
    params: decodeParams(matchedRoute.params),
    hash: decode(locationNormalized.hash),
    redirectedFrom: undefined,
    href,
  })
}
```

如果`rawLocation`不是字符串的话，流程如下：

```ts
let matcherLocation: MatcherLocationRaw

if ('path' in rawLocation) {
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
  // 当前位置的参数被解码，我们需要对它们进行编码以防匹配器合并参数
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
