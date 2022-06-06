# createRouter

::: tip
创建一个可以被 Vue 应用程序使用的路由实例。

文件位置：`src/router.ts`
:::

首先我们先看`createRouter`所接受的参数：一个`RouterOptions`类型的`options`。

```ts
export interface RouterOptions extends PathParserOptions {
  // 用于路由实现历史记录，可使用createWebHistory、createWebHashHistory、createMemoryHistory进行创建
  history: RouterHistory
  // 需要注册的路由表
  routes: RouteRecordRaw[]
  // 在页面之间导航时控制滚动的函数
  scrollBehavior?: RouterScrollBehavior
  // 用于自定义如何解析查询
  parseQuery?: typeof originalParseQuery
  // 用于自定义查询对象如何转为字符串
  stringifyQuery?: typeof originalStringifyQuery
  // 激活RouterLink的默认类
  linkActiveClass?: string
  // 精准激活RouterLink的默认类
  linkExactActiveClass?: string
}
```

可以看到`RouterOptions`继承了`PathParserOptions`，那么说明`PathParserOptions`还有些配置：

```ts
export interface _PathParserOptions {
  // 使用正则时区分大小写，默认false
  sensitive?: boolean
  // 是否禁止尾随斜杠，默认false
  strict?: boolean
  // 正则表达式前应该加^，默认true
  start?: boolean
  // 正则表达式以$结尾，默认为true
  end?: boolean
}

export type PathParserOptions = Pick<
  _PathParserOptions,
  'end' | 'sensitive' | 'strict'
>
```

看完`createRouter`的参数，我们来看下`createRouter`具体做了什么。`createRouter`方法共885（包含空行）行，乍一看可能会觉得方法很复杂，仔细观察，其实很大一部分代码都是声明一些函数。我们可以先暂时抛开这些函数声明看其余部分。

首先会使用`createRouterMatcher`方法创建了一个路由匹配器`matcher`，从`options`中提取`parseQuery`、`stringifyQuery`、`history`属性，如果`options`中没有`history`，抛出错误。

```ts
const matcher = createRouterMatcher(options.routes, options)
const parseQuery = options.parseQuery || originalParseQuery
const stringifyQuery = options.stringifyQuery || originalStringifyQuery
const routerHistory = options.history
if (__DEV__ && !routerHistory)
  throw new Error(
    'Provide the "history" option when calling "createRouter()":' +
    ' https://next.router.vuejs.org/api/#history.'
  )
```

紧接着声明了一些全局守卫相关的变量，和一些关于`params`的处理方法，其中有关全局守卫的变量都是通过`useCallbacks`创建的，`params`相关方法通过`applyToParams`创建。

```ts
// 全局前置守卫相关方法
const beforeGuards = useCallbacks<NavigationGuardWithThis<undefined>>()
// 全局解析守卫相关方法
const beforeResolveGuards = useCallbacks<NavigationGuardWithThis<undefined>>()
// 全局后置钩子方法
const afterGuards = useCallbacks<NavigationHookAfter>()

// 当前路由，浅层响应式对象
const currentRoute = shallowRef<RouteLocationNormalizedLoaded>(
  START_LOCATION_NORMALIZED
)
let pendingLocation: RouteLocation = START_LOCATION_NORMALIZED

// 如果浏览器环境下设置了scrollBehavior，那么需要防止页面自动恢复页面位置
// https://developer.mozilla.org/zh-CN/docs/Web/API/History/scrollRestoration
if (isBrowser && options.scrollBehavior && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

// 标准化params，转字符串
const normalizeParams = applyToParams.bind(
  null,
  paramValue => '' + paramValue
)
// 编码param
const encodeParams = applyToParams.bind(null, encodeParam)
// 解码params
const decodeParams: (params: RouteParams | undefined) => RouteParams =
  applyToParams.bind(null, decode)
```

关于`useCallbacks`的实现：在`useCallbacks`中声明一个`handlers`数组用来保存所有添加的方法，`useCallbacks`的返回值中包括三个方法：`add`（添加一个`handler`，并返回一个删除`handler`的函数）、`list`（返回所有`handler`）、`reset`（清空所有`handler`）
```ts
export function useCallbacks<T>() {
  let handlers: T[] = []

  function add(handler: T): () => void {
    handlers.push(handler)
    return () => {
      const i = handlers.indexOf(handler)
      if (i > -1) handlers.splice(i, 1)
    }
  }

  function reset() {
    handlers = []
  }

  return {
    add,
    list: () => handlers,
    reset,
  }
}
```

`applyToParams`的实现：接收一个处理函数和`params`对象，遍历`params`对象，并对每一个属性值执行`fn`并将结果赋给一个新的对象。
```ts
export function applyToParams(
  fn: (v: string | number | null | undefined) => string,
  params: RouteParamsRaw | undefined
): RouteParams {
  const newParams: RouteParams = {}

  for (const key in params) {
    const value = params[key]
    newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value)
  }

  return newParams
}
```

然后声明了大量的函数，包括`addRoute`、`removeRoute`、`getRoutes`等，这些函数也就是我们日常使用的`addRoute`、`removeRoute`等。

在`createRouter`的最后创建了一个`router`对象，并将其返回，该对象几乎包含了声明的所有函数。

**总结**

`createRouter`函数中声明了很多函数，这些函数就是我们日常使用的一些方法，如`addRoute`、`removeRoute`等，在函数的最后，声明了一个`router`对象，前面所声明的函数多数都会被包含在这个对象里，最终会将`router`返回。在`router`中有个重要的`install`方法，在`Vue`中使用`vue-router`时，会调用这个方法，在`install`中其中最重要的操作之一，就是将`router`和`currentRoute`注入给`app`实例，这样我们就可以在`vue`实例中通过`inject`获取这两个对象（`useRouter`和`useRoute`的实现）。
关于`install`的过程可参考：[app.use(router)](https://maxlz1.github.io/blog/vue-router/router-install.html)
