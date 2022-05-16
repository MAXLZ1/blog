# routerMatcher

::: tip
`matcher`是`vue-router`中一个重要的概念，那么`matcher`是个什么东西呢？它是做什么的呢？本文将对`matcher`进行详细解读。

文件位置：`src/matcher/index.ts`
:::

`vue-router`中通过一个`createRouterMatcher`来创建一个`routerMatcher`。`createRouterMatcher`接收两个参数：`routes`、`globalOptions`。其中`routes`为我们定义的路由表，也就是在`createRouter`时传入的`options.routes`，而`globalOptions`就是`createRouter`中的`options`。

首先我们看`createRouterMatcher`函数的返回值，`createRouterMatcher`返回一个对象，该对象有`addRoute`、`resolve`、`removeRoute`、`getRoute`、`getRecordMatcher`几个属性，而这几个属性从其命名上可以看出应该是一些路由操作方法。现在我们大致知道了`routerMatcher`是个什么东西。`routerMatcher`包含了对路由的一些操作方法，其中包含添加路由（`addRoute`）、路由地址标准化（`resolve`）、删除路由（`removeRoute`）、获取路由完整列表（`getRoutes`）、获取某个路由的`matcher`（`getRecordMatcher`）

```ts
export function createRouterMatcher(
  routes: RouteRecordRaw[],
  globalOptions: PathParserOptions
): RouterMatcher {
  // ...
  return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher }
}
```

接下来我们看下`createRouterMatcher`的中间过程：

先声明一个数组和一个Map，用来存储`RouteRecordMatcher`路由记录匹配器，然后`mergeOptions`

```ts
const matchers: RouteRecordMatcher[] = []
const matcherMap = new Map<RouteRecordName, RouteRecordMatcher>()
globalOptions = mergeOptions(
  { strict: false, end: true, sensitive: false } as PathParserOptions,
  globalOptions
)
```

::: tip
`RouteRecordMatcher`类型的定义：
```ts
export interface RouteRecordMatcher extends PathParser {
  record: RouteRecord
  parent: RouteRecordMatcher | undefined
  children: RouteRecordMatcher[]
  // aliases that must be removed when removing this record
  alias: RouteRecordMatcher[]
}
```
:::

这里`mergeOptions`的实现如下。它的作用是如果`partialOptions`中有`defaults`中的`key`值，那么就使用`partialOptions`中对应`key`的值替换`defaults`中的值

```ts
function mergeOptions<T>(defaults: T, partialOptions: Partial<T>): T {
  const options = {} as T
  for (const key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key]! : defaults[key]
  }

  return options
}
```

之后会声明`getRecordMatcher`、`removeRoute`、`addRoute`、`insertMatcher`、`getRoute`、`resolve`几个函数，先暂时不关心这几个函数的具体细节。

声明几个函数之后，会对路由进行初始化：遍历路由表，调用`addRoute`方法。

```ts
// add initial routes
routes.forEach(route => addRoute(route))
```

最后返回结果。

```ts
return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher }
```

接下来重点看下在`createRouterMatcher`中定义的几个函数：

### `addRoute`

`addRoute`函数接收三个参数：`record`、`parent`、`originalRecord`。

```ts
function addRoute(
  record: RouteRecordRaw,
  parent?: RouteRecordMatcher,
  originalRecord?: RouteRecordMatcher
) {
  // used later on to remove by name
  const isRootAdd = !originalRecord
  // 标准化化路由记录
  const mainNormalizedRecord = normalizeRouteRecord(record)
  // aliasOf表示此记录是否是另一个记录的别名
  mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record
  const options: PathParserOptions = mergeOptions(globalOptions, record)
  // 声明一个记录的数组用来处理别名
  const normalizedRecords: typeof mainNormalizedRecord[] = [
    mainNormalizedRecord,
  ]
  // 如果record设置了别名
  if ('alias' in record) {
    // 别名数组
    const aliases =
      typeof record.alias === 'string' ? [record.alias] : record.alias!
    // 遍历别名数组，并根据别名创建记录存储到normalizedRecords中
    for (const alias of aliases) {
      normalizedRecords.push(
        assign({}, mainNormalizedRecord, {
          components: originalRecord
            ? originalRecord.record.components
            : mainNormalizedRecord.components,
          path: alias,
          // 如果有原始记录，aliasOf为原始记录，如果没有原始记录就是它自己
          aliasOf: originalRecord
            ? originalRecord.record
            : mainNormalizedRecord,
        }) as typeof mainNormalizedRecord
      )
    }
  }

  let matcher: RouteRecordMatcher
  let originalMatcher: RouteRecordMatcher | undefined

  // 遍历normalizedRecords
  for (const normalizedRecord of normalizedRecords) {
    
    // 处理normalizedRecord.path为完整的path
    const { path } = normalizedRecord
    // 如果path不是以/开头，那么说明它不是根路由，需要拼接为完整的path
    // { path: '/a', children: [ { path: 'b' } ] } -> { path: '/a', children: [ { path: '/a/b' } ] }
    if (parent && path[0] !== '/') {
      const parentPath = parent.record.path
      const connectingSlash =
        parentPath[parentPath.length - 1] === '/' ? '' : '/'
      normalizedRecord.path =
        parent.record.path + (path && connectingSlash + path)
    }

    // 提示*应使用正则表示式形式
    if (__DEV__ && normalizedRecord.path === '*') {
      throw new Error(
        'Catch all routes ("*") must now be defined using a param with a custom regexp.\n' +
          'See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.'
      )
    }

    // 创建一个路由记录匹配器
    matcher = createRouteRecordMatcher(normalizedRecord, parent, options)

    // 检查是否有丢失的参数
    if (__DEV__ && parent && path[0] === '/')
      checkMissingParamsInAbsolutePath(matcher, parent)

    // 如果有别名，将matcher放入原始记录的alias中，以便后续能够删除
    if (originalRecord) {
      originalRecord.alias.push(matcher)
      // 检查originalRecord与matcher中动态参数是否相同
      if (__DEV__) {
        checkSameParams(originalRecord, matcher)
      }
    } else { // 没有别名
      originalMatcher = originalMatcher || matcher
      // 如果matcher不是originalMatcher，说明originalMatcher是传入的，此时将matcher放入originalMatcher.alias中
      if (originalMatcher !== matcher) originalMatcher.alias.push(matcher)
      // 如果命名并且仅用于顶部记录，则删除路由（避免嵌套调用）
      if (isRootAdd && record.name && !isAliasRecord(matcher))
        removeRoute(record.name)
    }

    // 遍历children，递归addRoute
    if ('children' in mainNormalizedRecord) {
      const children = mainNormalizedRecord.children
      for (let i = 0; i < children.length; i++) {
        addRoute(
          children[i],
          matcher,
          originalRecord && originalRecord.children[i]
        )
      }
    }

    originalRecord = originalRecord || matcher
    // 添加matcher
    insertMatcher(matcher)
  }

  // 返回一个删除路由的方法
  return originalMatcher
    ? () => {
        removeRoute(originalMatcher!)
      }
    : noop
}
```

上述代码中`createRouteRecordMatcher`是什么呢？在看`createRouteRecordMatcher`之前，我们先看这么两个函数：`tokenizePath`、`tokensToParser`。`tokenizePath`将`path`转为一个`token`数组。`tokensToParser`会根据`token`数组创建一个路径解析器。

那么什么是`token`呢？我们看下`vue-router`中`token`的类型定义：

```ts
interface TokenStatic {
  type: TokenType.Static
  value: string
}

interface TokenParam {
  type: TokenType.Param
  regexp?: string
  value: string
  optional: boolean
  repeatable: boolean
}

interface TokenGroup {
  type: TokenType.Group
  value: Exclude<Token, TokenGroup>[]
}

export type Token = TokenStatic | TokenParam | TokenGroup
```

`token`分为三种：

- `TokenStatic`：一种静态的`token`，说明`token`不可变
- `TokenParam`：参数`token`，说明`token`是个参数
- `TokenGroup`：分组的`token`

这里我们举几个例子：

1. `/one/two/three`对应的`token`数组：
```ts
[
  [{ type: TokenType.Static, value: 'one' }],
  [{ type: TokenType.Static, value: 'two' }],
  [{ type: TokenType.Static, value: 'three' }]
]
```

2. `/user/:id`对应的`token`数组是:
```ts
[
  [
    {
      type: TokenType.Static,
      value: 'user',
    },
  ],
  [
    {
      type: TokenType.Param,
      value: 'id',
      regexp: '',
      repeatable: false,
      optional: false,
    }
  ]
]
```

3. `/:id(\\d+)new`对应的`token`数组：
```ts
[
  [
    {
      type: TokenType.Param,
      value: 'id',
      regexp: '\\d+',
      repeatable: false,
      optional: false,
    },
    {
      type: TokenType.Static,
      value: 'new'
    }
  ]
]
```

从上面几个例子可以看出，`token`数组详细描述了`path`的每一级路由的组成。例如第3个例子`/:id(\\d+)new`，通过`token`数组我们能够知道他是一个一级路由（`token.lenght = 1`），并且它的这级路由是由两部分组成，其中第一部分是参数部分，第二部分是静态的，并且在参数部分还说明了参数的正则及是否重复、是否可选的配置。

知道了`token`是什么，接下来我们看下`tokenizePath`是如何将`path`转为`token`的：

```ts
export const enum TokenType {
  Static,
  Param,
  Group,
}

const ROOT_TOKEN: Token = {
  type: TokenType.Static,
  value: '',
}

export function tokenizePath(path: string): Array<Token[]> {
  if (!path) return [[]]
  if (path === '/') return [[ROOT_TOKEN]]
  // 如果path不是以/开头，抛出错误
  if (!path.startsWith('/')) {
    throw new Error(
      __DEV__
        ? `Route paths should start with a "/": "${path}" should be "/${path}".`
        : `Invalid path "${path}"`
    )
  }
  
  function crash(message: string) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`)
  }

  // token所处状态
  let state: TokenizerState = TokenizerState.Static
  // 前一个状态
  let previousState: TokenizerState = state
  const tokens: Array<Token[]> = []
  //  声明一个片段，该片段最终会被存入tokens中
  let segment!: Token[]

  // 添加segment至tokens中，同时segment重新变为空数组
  function finalizeSegment() {
    if (segment) tokens.push(segment)
    segment = []
  }

  let i = 0
  let char: string
  let buffer: string = ''
  // custom regexp for a param
  let customRe: string = ''

  // 消费buffer，即生成token添加到segment中
  function consumeBuffer() {
    if (!buffer) return

    if (state === TokenizerState.Static) {
      segment.push({
        type: TokenType.Static,
        value: buffer,
      })
    } else if (
      state === TokenizerState.Param ||
      state === TokenizerState.ParamRegExp ||
      state === TokenizerState.ParamRegExpEnd
    ) {
      if (segment.length > 1 && (char === '*' || char === '+'))
        crash(
          `A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`
        )
      segment.push({
        type: TokenType.Param,
        value: buffer,
        regexp: customRe,
        repeatable: char === '*' || char === '+',
        optional: char === '*' || char === '?',
      })
    } else {
      crash('Invalid state to consume buffer')
    }
    // 消费完后置空
    buffer = ''
  }

  function addCharToBuffer() {
    buffer += char
  }

  // 遍历path
  while (i < path.length) {
    char = path[i++]

    // path='/\\:'
    if (char === '\\' && state !== TokenizerState.ParamRegExp) {
      previousState = state
      state = TokenizerState.EscapeNext
      continue
    }

    switch (state) {
      case TokenizerState.Static:
        if (char === '/') {
          if (buffer) {
            consumeBuffer()
          }
          // char === /时说明已经遍历完一层路由，这时需要将segment添加到tokens中
          finalizeSegment()
        } else if (char === ':') { // char为:时，因为此时状态是TokenizerState.Static，所以:后是参数，此时要把state变为TokenizerState.Param
          consumeBuffer()
          state = TokenizerState.Param
        } else { // 其他情况拼接buffer
          addCharToBuffer()
        }
        break

      case TokenizerState.EscapeNext:
        addCharToBuffer()
        state = previousState
        break

      case TokenizerState.Param:
        if (char === '(') { // 碰到(，因为此时state为TokenizerState.Param，说明后面是正则表达式，所以修改state为TokenizerState.ParamRegExp
          state = TokenizerState.ParamRegExp
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer()
        } else { // 例如/:id/one，当遍历到第二个/时，消费buffer，state变为Static，并让i回退，回退后进入Static
          consumeBuffer()
          state = TokenizerState.Static
          if (char !== '*' && char !== '?' && char !== '+') i--
        }
        break

      case TokenizerState.ParamRegExp: 
        // it already works by escaping the closing )
        // TODO: is it worth handling nested regexp? like :p(?:prefix_([^/]+)_suffix)
        // https://paths.esm.dev/?p=AAMeJbiAwQEcDKbAoAAkP60PG2R6QAvgNaA6AFACM2ABuQBB#
        // is this really something people need since you can also write
        // /prefix_:p()_suffix
        if (char === ')') {
          // 如果是\\)的情况,customRe = customRe去掉\\ + char
          if (customRe[customRe.length - 1] == '\\')
            customRe = customRe.slice(0, -1) + char
          else state = TokenizerState.ParamRegExpEnd // 如果不是\\)说明正则表达式已经遍历完
        } else {
          customRe += char
        }
        break

      case TokenizerState.ParamRegExpEnd: // 正则表达式已经遍历完
        // 消费buffer
        consumeBuffer()
        // 重置state为Static
        state = TokenizerState.Static
        // 例如/:id(\\d+)new，当遍历到n时，使i回退，下一次进入Static分支中处理
        if (char !== '*' && char !== '?' && char !== '+') i--
        customRe = ''
        break

      default:
        crash('Unknown state')
        break
    }
  }

  // 如果遍历结束后，state还是ParamRegExp状态，说明正则是没有结束的，可能漏了)
  if (state === TokenizerState.ParamRegExp)
    crash(`Unfinished custom RegExp for param "${buffer}"`)

  // 遍历完path，进行最后一次消费buffer
  consumeBuffer()
  // 将segment放入tokens
  finalizeSegment()

  // 最后返回tokens
  return tokens
}
```

还是以第3个为例`/:id(\\d+)new`、，我们看一下`tokenizePath`的过程：

1. 遍历前的状态：`state=TokenizerState.Static; previousState=TokenizerState.Static; tokens=[]; segment; buffer=''; i=0; char=''; customRe='';`
2. 当`i=0`时，进入`TokenizerState.Static`分支，此时`char='/'; buffer='';`，不会执行`consumeBuffer`，执行`finalizeSegment`，该轮结束后发生变化的是`segment=[]; i=1; char='/';`
3. 当`i=1`时，进入`TokenizerState.Static`分支，此时`char=':'; buffer='';`，执行`consumeBuffer`，因为`buffer=''`，所以`consumeBuffer`中什么都没做，最后`state=TokenizerState.Param`，该轮结束后发生变化的是`state=TokenizerState.Param; i=2; char=':';`
4. 当`i=2`时，进入`TokenizerState.Param`分支，此时`char='i'; buffer='';`，执行`addCharToBuffer`，该轮结束后发生变化的是`buffer='i'; i=3; char='i';`
5. 当`i=3`时，过程同4，该轮结束后发生变化的是`buffer='id'; i=4; char='d';`
6. 当`i=4`时，进入`TokenizerState.Param`分支，此时`char='('; buffer='id';`，此时会将`state`变为`TokenizerState.ParamRegExp`，说明`(`后面是正则，该轮结束后发生变化的是`state=TokenizerState.ParamRegExp; i=5; char='(';`
7. 当`i=5`时，进入`TokenizerState.ParamRegExp`分支，此时`char='\\'; buffer='id';`，执行`customRe+=char`，该轮结束后发生变化的是`i=6; char='\\'; customRe='\\'`
8. 当`i=6`、`i=7`时，过程同5，最终发生变化的是`i=8; char='+'; customRe='\\d+'`
9. 当`i=8`时，进入`TokenizerState.ParamRegExp`分支，此时`char=')'; buffer='id'; customRe='\\d+'`，`state`变为`TokenizerState.ParamRegExpEnd`，代表正则结束，该轮结束后发生变化的是`state=TokenizerState.ParamRegExpEnd; i=9; char=')';`
10. 当`i=9`时，进入`TokenizerState.ParamRegExpEnd`分支，此时`char='n'; buffer='id'; customRe='\\d+'`，执行`consumeBuffer`，在`consumeBuffer`中会向`segment`添加一条`token`并将`buffer`置为空字符串，该`token`是`{type: TokenType.Param, value: 'id', regexp: '\\d+', repeatable: false, optional: false}`，执行完`consumeBuffer`后，`state`重置为`Static`，`customRe`重置为空字符串，`i`回退1，该轮结束后发生变化的是`segment=[{...}]; state=TokenizerState.Static; buffer=''; customRe=''; char='n';`，注意此时`i=9`
11. 上一轮结束后`i=9`，进入`TokenizerState.Static`分支，此时此时`char='n'; buffer='';`，执行`addCharToBuffer`方法，该轮结束后发生变化的是`buffer='n'; i=10; char='n'`
12. 当`i=10`、`i=11`时，过程同11，结束后发生变化的是`buffer='new'; i=12; char='w'`
13. 当`i=12`，结束遍历，执行`consumeBuffer`，向`segment`添加`{type: TokenType.Static, value: 'new'}`一条记录并将`buffer`置为空字符串。然后执行`finalizeSegment`，将`segment`添加到`tokens`中，并将`segment`置为空数组。最后返回的`tokens`如下：
```ts
[
  [
    {
      type: TokenType.Param,
      value: 'id',
      regexp: '\\d+',
      repeatable: false,
      optional: false,
    },
    {
      type: TokenType.Static,
      value: 'new'
    }
  ]
]
```

现在我们清楚了`tokens`的生成，接下里我们看下`tokensToParser`。

`tokensToParser`函数接收一个`token`数组和一个可选的`extraOptions`，在函数中会构造出`path`对应的正则表达式、动态参数列表`keys`、`token`对应的分数（相当于权重，该分数在后续`path`的比较中会用到）、一个可以从`path`中提取动态参数的函数（`parse`）、一个可以根据传入的动态参数生成`path`的函数（`stringify`），最后将其组成一个对象返回。

```ts
const BASE_PATH_PARSER_OPTIONS: Required<_PathParserOptions> = {
  sensitive: false,
  strict: false,
  start: true,
  end: true,
}
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g
export function tokensToParser(
  segments: Array<Token[]>,
  extraOptions?: _PathParserOptions
): PathParser {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions)

  // the amount of scores is the same as the length of segments except for the root segment "/"
  const score: Array<number[]> = []
  // 正则的字符串形式
  let pattern = options.start ? '^' : ''
  // 保存路由中的动态参数
  const keys: PathParserParamKey[] = []

  for (const segment of segments) {
    // 用一个数组保存token的分数
    const segmentScores: number[] = segment.length ? [] : [PathScore.Root]

    // options.strict代表是否禁止尾部/，如果禁止了pattern追加/
    if (options.strict && !segment.length) pattern += '/'
    // 开始遍历每个token
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex]
      // 当前子片段（单个token）的分数
      let subSegmentScore: number =
        PathScore.Segment +
        (options.sensitive ? PathScore.BonusCaseSensitive : 0)

      if (token.type === TokenType.Static) {
        // 在开始一个新的片段前pattern需要添加/
        if (!tokenIndex) pattern += '/'
        // 将token.value追加到pattern后，追加前token.value中的.、+、*、?、^、$等字符前面加上\\
        // 关于replace，参考MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace
        pattern += token.value.replace(REGEX_CHARS_RE, '\\$&')
        subSegmentScore += PathScore.Static
      } else if (token.type === TokenType.Param) {
        const { value, repeatable, optional, regexp } = token
        keys.push({
          name: value,
          repeatable,
          optional,
        })
        const re = regexp ? regexp : BASE_PARAM_PATTERN
        // 用户自定义的正则需要验证正则的正确性
        if (re !== BASE_PARAM_PATTERN) {
          subSegmentScore += PathScore.BonusCustomRegExp
          // 使用前确保正则时正确的
          try {
            new RegExp(`(${re})`)
          } catch (err) {
            throw new Error(
              `Invalid custom RegExp for param "${value}" (${re}): ` +
                (err as Error).message
            )
          }
        }

        // /:chapters*
        // when we repeat we must take care of the repeating leading slash
        let subPattern = repeatable ? `((?:${re})(?:/(?:${re}))*)` : `(${re})`

        // prepend the slash if we are starting a new segment
        if (!tokenIndex)
          subPattern =
            // avoid an optional / if there are more segments e.g. /:p?-static
            // or /:p?-:p2
            optional && segment.length < 2
              ? `(?:/${subPattern})`
              : '/' + subPattern
        if (optional) subPattern += '?'

        pattern += subPattern

        subSegmentScore += PathScore.Dynamic
        if (optional) subSegmentScore += PathScore.BonusOptional
        if (repeatable) subSegmentScore += PathScore.BonusRepeatable
        if (re === '.*') subSegmentScore += PathScore.BonusWildcard
      }

      segmentScores.push(subSegmentScore)
    }

    score.push(segmentScores)
  }

  // only apply the strict bonus to the last score
  if (options.strict && options.end) {
    const i = score.length - 1
    score[i][score[i].length - 1] += PathScore.BonusStrict
  }

  // TODO: dev only warn double trailing slash
  if (!options.strict) pattern += '/?'

  if (options.end) pattern += '$'
  // allow paths like /dynamic to only match dynamic or dynamic/... but not dynamic_something_else
  else if (options.strict) pattern += '(?:/|$)'

  // 根据组装好的pattern创建正则表达式，options.sensitive决定是否区分大小写
  const re = new RegExp(pattern, options.sensitive ? '' : 'i')

  // 根据path获取动态参数对象
  function parse(path: string): PathParams | null {
    const match = path.match(re)
    const params: PathParams = {}

    if (!match) return null

    for (let i = 1; i < match.length; i++) {
      const value: string = match[i] || ''
      const key = keys[i - 1]
      params[key.name] = value && key.repeatable ? value.split('/') : value
    }

    return params
  }

  // 根据传入的动态参数对象，转为对应的path
  function stringify(params: PathParams): string {
    let path = ''
    // for optional parameters to allow to be empty
    let avoidDuplicatedSlash: boolean = false
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith('/')) path += '/'
      avoidDuplicatedSlash = false

      for (const token of segment) {
        if (token.type === TokenType.Static) {
          path += token.value
        } else if (token.type === TokenType.Param) {
          const { value, repeatable, optional } = token
          const param: string | string[] = value in params ? params[value] : ''

          if (Array.isArray(param) && !repeatable)
            throw new Error(
              `Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`
            )
          const text: string = Array.isArray(param) ? param.join('/') : param
          if (!text) {
            if (optional) {
              // if we have more than one optional param like /:a?-static and there are more segments, we don't need to
              // care about the optional param
              if (segment.length < 2 && segments.length > 1) {
                // remove the last slash as we could be at the end
                if (path.endsWith('/')) path = path.slice(0, -1)
                // do not append a slash on the next iteration
                else avoidDuplicatedSlash = true
              }
            } else throw new Error(`Missing required param "${value}"`)
          }
          path += text
        }
      }
    }

    return path
  }

  return {
    re,
    score,
    keys,
    parse,
    stringify,
  }
}
```

清楚了`tokensToParser`和`tokenizePath`，我们来看`createRouteRecordMatcher`的实现：

```ts
export function createRouteRecordMatcher(
  record: Readonly<RouteRecord>,
  parent: RouteRecordMatcher | undefined,
  options?: PathParserOptions
): RouteRecordMatcher {
  // 生成parser对象
  const parser = tokensToParser(tokenizePath(record.path), options)

  // 如果有重复的动态参数命名进行提示
  if (__DEV__) {
    const existingKeys = new Set<string>()
    for (const key of parser.keys) {
      if (existingKeys.has(key.name))
        warn(
          `Found duplicated params with name "${key.name}" for path "${record.path}". Only the last one will be available on "$route.params".`
        )
      existingKeys.add(key.name)
    }
  }

  // 
  const matcher: RouteRecordMatcher = assign(parser, {
    record,
    parent,
    // these needs to be populated by the parent
    children: [],
    alias: [],
  })

  if (parent) {
    // 两者都是alias或两者都不是alias
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher)
  }

  return matcher
}
```

### `resolve`

`resolve`根据传入的`location`进行路由匹配，找到对应的`matcher`的路由信息。方法接收一个`location`和`currentLocation`参数，返回一个`MatcherLocation`类型的对象，该对象的属性包含：`name`、`path`、`params`、`matched`、`meta`。
```ts
function resolve(
    location: Readonly<MatcherLocationRaw>,
    currentLocation: Readonly<MatcherLocation>
  ): MatcherLocation {
    let matcher: RouteRecordMatcher | undefined
    let params: PathParams = {}
    let path: MatcherLocation['path']
    let name: MatcherLocation['name']

    if ('name' in location && location.name) { // 如果location存在name属性，可根据name从matcherMap获取matcher
      matcher = matcherMap.get(location.name)

      if (!matcher)
        throw createRouterError<MatcherError>(ErrorTypes.MATCHER_NOT_FOUND, {
          location,
        })

      name = matcher.record.name
      // 处理params
      params = assign(
        paramsFromLocation(
          currentLocation.params,
          matcher.keys.filter(k => !k.optional).map(k => k.name)
        ),
        location.params
      )
      // 如果不能通过params转为path抛出错误
      path = matcher.stringify(params)
    } else if ('path' in location) { // 如果location存在path属性，根据path从matchers获取对应matcher
      path = location.path

      if (__DEV__ && !path.startsWith('/')) {
        warn(
          `The Matcher cannot resolve relative paths but received "${path}". Unless you directly called \`matcher.resolve("${path}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`
        )
      }

      matcher = matchers.find(m => m.re.test(path))

      if (matcher) {
        // 通过parse函数获取params
        params = matcher.parse(path)!
        name = matcher.record.name
      }
    } else { // 如果location中没有name、path属性，就使用当前location的name或path获取matcher
      matcher = currentLocation.name
        ? matcherMap.get(currentLocation.name)
        : matchers.find(m => m.re.test(currentLocation.path))
      if (!matcher)
        throw createRouterError<MatcherError>(ErrorTypes.MATCHER_NOT_FOUND, {
          location,
          currentLocation,
        })
      name = matcher.record.name
      params = assign({}, currentLocation.params, location.params)
      path = matcher.stringify(params)
    }

    // 使用一个数组存储匹配到的所有路由
    const matched: MatcherLocation['matched'] = []
    let parentMatcher: RouteRecordMatcher | undefined = matcher
    while (parentMatcher) {
      // 父路由始终在数组的开头
      matched.unshift(parentMatcher.record)
      parentMatcher = parentMatcher.parent
    }

    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched),
    }
  }
```

### `removeRoute`

删除路由。接收一个`matcherRef`参数，`removeRoute`会将`matcherRef`对应的`matcher`从`matcherMap`和`matchers`中删除，并清空`matcherRef`对应`matcher`的`children`与`alias`属性。由于`matcherRef`对应的`matcher`被删除后，其子孙及别名也就没用了，也需要把他们从`matcherMap`中和`matchers`中删除。
```ts
function removeRoute(matcherRef: RouteRecordName | RouteRecordMatcher) {
  // 如果是路由名字：string或symbol
  if (isRouteName(matcherRef)) {
    const matcher = matcherMap.get(matcherRef)
    if (matcher) {
      // 删除matcher
      matcherMap.delete(matcherRef)
      matchers.splice(matchers.indexOf(matcher), 1)
      // 清空matcher中的children与alias，
      matcher.children.forEach(removeRoute)
      matcher.alias.forEach(removeRoute)
    }
  } else {
    const index = matchers.indexOf(matcherRef)
    if (index > -1) {
      matchers.splice(index, 1)
      if (matcherRef.record.name) matcherMap.delete(matcherRef.record.name)
      matcherRef.children.forEach(removeRoute)
      matcherRef.alias.forEach(removeRoute)
    }
  }
}
```

### `getRoutes`

获取所有`matcher`。
```ts
function getRoutes() {
  return matchers
}
```

### `getRecordMatcher`

根据路由名获取对应`matcher`。
```ts
function getRecordMatcher(name: RouteRecordName) {
  return matcherMap.get(name)
}
```

在`addRoute`最后调用了`insertMatcher`进行`matcher`的添加，这里我们看下是如何添加`marcher`的

在添加`matcher`时，并不是直接`matchers.add`，而是根据`matcher.score`进行排序。比较分数时根据数组中的每一项挨个比较，不是比较总分。

```ts
function insertMatcher(matcher: RouteRecordMatcher) {
  let i = 0
  while (
    i < matchers.length &&
    comparePathParserScore(matcher, matchers[i]) >= 0 &&
    (matcher.record.path !== matchers[i].record.path ||
      !isRecordChildOf(matcher, matchers[i]))
  )
    i++
  matchers.splice(i, 0, matcher)
  // only add the original record to the name map
  if (matcher.record.name && !isAliasRecord(matcher))
    matcherMap.set(matcher.record.name, matcher)
}
```

```ts
function compareScoreArray(a: number[], b: number[]): number {
  let i = 0
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i]
    if (diff) return diff

    i++
  }

  if (a.length < b.length) {
    return a.length === 1 && a[0] === PathScore.Static + PathScore.Segment
      ? -1
      : 1
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === PathScore.Static + PathScore.Segment
      ? 1
      : -1
  }

  return 0
}

export function comparePathParserScore(a: PathParser, b: PathParser): number {
  let i = 0
  const aScore = a.score
  const bScore = b.score
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i])
    if (comp) return comp

    i++
  }

  return bScore.length - aScore.length
}
```

假设`matcherA`是需要添加的，`matchers`中此时只有一个`matcherB`，`matcherA.score=[[1, 2]]`，`matcherB.score=[[1,3]]`，那么`matcherA`是怎么添加到`matchers`中的呢？过程如下：

1. 初始化`matchers`索引`i=0`
2. 首先比较`matcherA.score[0][0]`与`matcherB.score[0][0]`，`matcherB.score[0][0]-matcherA.score[0][0] === 0`继续比较
3. `matcherA.score[0][1]`与`matcherB.score[0][1]`，因为`matcherB.score[0][1]-matcherA.score[0][1] > 0`，`i++`
4. `i=1`时，由于`i=matchers.length`，结束循环
5. 执行`matchers.splice(i, 0, matcher)`，此时`i=1`,所以`matcherA`会被添加到索引为1的位置

如果`matcherA.score=[[1,3,4]]`呢？ 在比较时因为前两个索引对应的值都是一样的，这时会进入`compareScoreArray`的以下分支：

```ts
if (a.length > b.length) {
  return b.length === 1 && b[0] === PathScore.Static + PathScore.Segment
    ? 1
    : -1
}
```

以上结果返回-1，`matcherA`会被添加到索引为0的位置。

如果`matcherA.score=[[1]]`，进入`compareScoreArray`的以下分支：

```ts
if (a.length < b.length) {
  return a.length === 1 && a[0] === PathScore.Static + PathScore.Segment
    ? -1
    : 1
}
```

因为`matcherA.score[0].length === 1`，这时就需要考虑`token`的类型里，假设`token`是个`Static`类型的，那么返回-1，`matcherA`添加到索引为0的位置。如果`token`不是`Static`类型的，返回1，`matcherA`添加到索引为1的位置


**总结**

经过上面分析，我们知道了`routerMatcher`是什么，如何实现的

`routerMatcher`中通过维护一个`matchers`、`matcherMap`来实现对`matcher`的增删改查，其中`matchers`中是按`score`进行了排序，`matcherMap`中的`key`是注册路由时路由表的`name`。

`matchers`、`matcherMap`存储的是`RouteRecordMatcher`，`RouteRecordMatcher`中包含了路由`path`对应的正则`re`、路由的分数`score`、动态参数列表`keys`、可从`path`中提取动态参数的`parse(path)`函数、可传入参数对象将其转为对应`path`的`stringify(param)`函数、父`matcher`（`parent`）、路由的标准化版本`record`、子`matcher`（`children`）、由别名产生的`matcher`（`alias`）

```ts
export interface PathParser {
  re: RegExp
  score: Array<number[]>
  keys: PathParserParamKey[]
  parse(path: string): PathParams | null
  stringify(params: PathParams): string
}
export interface RouteRecordMatcher extends PathParser {
  record: RouteRecord
  parent: RouteRecordMatcher | undefined
  children: RouteRecordMatcher[]
  // aliases that must be removed when removing this record
  alias: RouteRecordMatcher[]
}
```

在生成`RouteRecordMatcher`的过程中会将`path`转换成`token`数组（二维数组，第一维度中每个维度代表一级路由，第二维度中每个维度代表路由的组成），路由正则的生成、动态参数的提取、分数的计算、`stringify`全都依托这个`token`数组实现
