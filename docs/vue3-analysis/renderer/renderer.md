# 渲染器

> 在介绍渲染器之前。我们先简单了解下渲染器的作用是什么。
> 
> 渲染器最主要的任务就是将虚拟DOM渲染成真实的DOM对象到对应的平台上，这里的平台可以是浏览器DOM平台，也可以是其他诸如canvas的一些平台。总之vue3的渲染器提供了跨平台的能力。
> 

## 渲染器的生成

当使用`createApp`创建应用实例时，会首先调用一个`ensureRenderer`方法。

```ts
export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args)
  // ...
  
  return app
}) as CreateAppFunction<Element>
```

`ensureRenderer`函数会返回一个渲染器`renderer`，这个`renderer`是个全局变量，如果不存在，会使用`createRenderer`方法进行创建，并将创建好的`renderer`赋值给这个全局变量。
```ts
function ensureRenderer() {
  return (
    renderer ||
    (renderer = createRenderer<Node, Element | ShadowRoot>(rendererOptions))
  )
}
```

`createRenderer`函数接收一个`options`参数，至于这个`options`中是什么，这里我们暂且先不深究。`createRenderer`函数中会调用`baseCreateRenderer`函数，并返回其结果。
```ts
export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  return baseCreateRenderer<HostNode, HostElement>(options)
}
```

至此，我们就找到了真正创建渲染器的方法`baseCreateRenderer`。当我们找到`baseCreateRenderer`的具体实现，你会发现这个函数是十分长的，单`baseCreateRenderer`这一个函数就占据了2044行代码。


我们搞清楚`baseCreateRenderer`是用来创建渲染器的，那么我们先找这个渲染器是什么。我们可以先看关于`baseCreateRenderer`函数的类型定义：

```ts
// overload 1: no hydration
function baseCreateRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>): Renderer<HostElement>

// overload 2: with hydration
function baseCreateRenderer(
  options: RendererOptions<Node, Element>,
  createHydrationFns: typeof createHydrationFunctions
): HydrationRenderer
```

从`baseCreateRenderer`函数类型声明中我们发现这个函数可以接受两个参数：`options`、`createHydrationFns`。并返回一个`Renderer`（或`HydrationRenderer`）类型的数据。从函数返回值类型定义来看，函数应该返回的是个渲染器。接下来我们看函数的返回值具体是什么。

## 渲染器

```ts
return {
  render,
  hydrate,
  createApp: createAppAPI(render, hydrate)
}
```

在`baseCreateRenderer`最后返回了一个对象，这个对象包含了三个属性：`render`（渲染函数）、`hydrate`（同构渲染）、`createApp`。这里的`createApp`是不是很熟悉，在`createApp`中调用`ensureRenderer`方法后面会紧跟着调用了`createApp`函数：
```ts
export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args)
  // ...
  
  return app
}) as CreateAppFunction<Element>
```

注意这里不要两个`createApp`混淆了。渲染器中的`createApp`并不是我们平时使用到的`createApp`。当我们调用`createApp`方法进行创建实例时，会调用渲染器中的`createApp`生成`app`实例。

接下来我们来看下渲染器中的`createApp`。首先`createApp`方法通过一个`createAppAPI`方法生成，这个方法接收渲染器中的`render`及`hydrate`：

```ts
export function createAppAPI<HostElement>(
  render: RootRenderFunction,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    // ...
  }
}
```

`createAppAPI`函数会返回一个闭包函数`createApp`。这个`createApp`就是通过`ensureRenderer().createApp(...args)`调用的方法了。接下来看`createApp`的具体实现：

<details>
<summary><code>createApp</code>完整代码</summary>

```ts
function createApp(rootComponent, rootProps = null) {
  if (!isFunction(rootComponent)) {
    rootComponent = { ...rootComponent }
  }

  if (rootProps != null && !isObject(rootProps)) {
    __DEV__ && warn(`root props passed to app.mount() must be an object.`)
    rootProps = null
  }

  const context = createAppContext()
  const installedPlugins = new Set()

  let isMounted = false

  const app: App = (context.app = {
    _uid: uid++,
    _component: rootComponent as ConcreteComponent,
    _props: rootProps,
    _container: null,
    _context: context,
    _instance: null,

    version,

    get config() {
      return context.config
    },

    set config(v) {
      if (__DEV__) {
        warn(
          `app.config cannot be replaced. Modify individual options instead.`
        )
      }
    },

    use(plugin: Plugin, ...options: any[]) {
      if (installedPlugins.has(plugin)) {
        __DEV__ && warn(`Plugin has already been applied to target app.`)
      } else if (plugin && isFunction(plugin.install)) {
        installedPlugins.add(plugin)
        plugin.install(app, ...options)
      } else if (isFunction(plugin)) {
        installedPlugins.add(plugin)
        plugin(app, ...options)
      } else if (__DEV__) {
        warn(
          `A plugin must either be a function or an object with an "install" ` +
            `function.`
        )
      }
      return app
    },

    mixin(mixin: ComponentOptions) {
      if (__FEATURE_OPTIONS_API__) {
        if (!context.mixins.includes(mixin)) {
          context.mixins.push(mixin)
        } else if (__DEV__) {
          warn(
            'Mixin has already been applied to target app' +
              (mixin.name ? `: ${mixin.name}` : '')
          )
        }
      } else if (__DEV__) {
        warn('Mixins are only available in builds supporting Options API')
      }
      return app
    },

    component(name: string, component?: Component): any {
      if (__DEV__) {
        validateComponentName(name, context.config)
      }
      if (!component) {
        return context.components[name]
      }
      if (__DEV__ && context.components[name]) {
        warn(`Component "${name}" has already been registered in target app.`)
      }
      context.components[name] = component
      return app
    },

    directive(name: string, directive?: Directive) {
      if (__DEV__) {
        validateDirectiveName(name)
      }

      if (!directive) {
        return context.directives[name] as any
      }
      if (__DEV__ && context.directives[name]) {
        warn(`Directive "${name}" has already been registered in target app.`)
      }
      context.directives[name] = directive
      return app
    },

    mount(
      rootContainer: HostElement,
      isHydrate?: boolean,
      isSVG?: boolean
    ): any {
      if (!isMounted) {
        // #5571
        if (__DEV__ && (rootContainer as any).__vue_app__) {
          warn(
            `There is already an app instance mounted on the host container.\n` +
              ` If you want to mount another app on the same host container,` +
              ` you need to unmount the previous app by calling \`app.unmount()\` first.`
          )
        }
        const vnode = createVNode(
          rootComponent as ConcreteComponent,
          rootProps
        )
        // store app context on the root VNode.
        // this will be set on the root instance on initial mount.
        vnode.appContext = context

        // HMR root reload
        if (__DEV__) {
          context.reload = () => {
            render(cloneVNode(vnode), rootContainer, isSVG)
          }
        }

        if (isHydrate && hydrate) {
          hydrate(vnode as VNode<Node, Element>, rootContainer as any)
        } else {
          render(vnode, rootContainer, isSVG)
        }
        isMounted = true
        app._container = rootContainer
        // for devtools and telemetry
        ;(rootContainer as any).__vue_app__ = app

        if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
          app._instance = vnode.component
          devtoolsInitApp(app, version)
        }

        return getExposeProxy(vnode.component!) || vnode.component!.proxy
      } else if (__DEV__) {
        warn(
          `App has already been mounted.\n` +
            `If you want to remount the same app, move your app creation logic ` +
            `into a factory function and create fresh app instances for each ` +
            `mount - e.g. \`const createMyApp = () => createApp(App)\``
        )
      }
    },

    unmount() {
      if (isMounted) {
        render(null, app._container)
        if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
          app._instance = null
          devtoolsUnmountApp(app)
        }
        delete app._container.__vue_app__
      } else if (__DEV__) {
        warn(`Cannot unmount an app that is not mounted.`)
      }
    },

    provide(key, value) {
      if (__DEV__ && (key as string | symbol) in context.provides) {
        warn(
          `App already provides property with key "${String(key)}". ` +
            `It will be overwritten with the new value.`
        )
      }

      context.provides[key as string | symbol] = value

      return app
    }
  })

  if (__COMPAT__) {
    installAppCompatProperties(app, context, render)
  }

  return app
}
```
</details>


这个`createApp`函数与`vue`提供的`createApp`一样，都接受一个根组件参数和一个`rootProps`（根组件的`props`）参数。

首先，如果根组件不是方法时，会将`rootComponent`使用解构的方式重新赋值为一个新的对象，然后判断`rootProps`如果不为`null`并且也不是个对象，则会将`rootProps`置为`null`。
```ts
if (!isFunction(rootComponent)) {
  rootComponent = { ...rootComponent }
}

if (rootProps != null && !isObject(rootProps)) {
  __DEV__ && warn(`root props passed to app.mount() must be an object.`)
  rootProps = null
}
```

然后调用`createAppContext()`方法创建一个上下文对象。
```ts
export function createAppContext(): AppContext {
  return {
    app: null as any,
    config: {
      // 一个判断是否为原生标签的函数
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      // 自定义options的合并策略
      optionMergeStrategies: {},
      errorHandler: undefined,
      warnHandler: undefined,
      // 组件模板的运行时编译器选项
      compilerOptions: {}
    },
    // 存储全局混入的mixin
    mixins: [],
    // 保存全局注册的组件
    components: {},
    // 保存注册的全局指令
    directives: {},
    // 保存全局provide的值
    provides: Object.create(null),
    // 缓存组件被解析过的options（合并了全局mixins、extends、局部mixins）
    optionsCache: new WeakMap(),
    // 缓存每个组件经过标准化的的props options
    propsCache: new WeakMap(),
    // 缓存每个组件经过标准化的的emits options
    emitsCache: new WeakMap()
  }
}
```

然后声明了一个`installedPlugins`集合和一个布尔类型的`isMounted`。其中`installedPlugins`会用来存储使用`use`安装的`plugin`，`isMounted`代表根组件是否已经挂载。

```ts
const installedPlugins = new Set()
let isMounted = false
```

紧接着声明了一个`app`变量，这个`app`变量就是`app`实例，在创建`app`的同时会将`app`添加到上下文中的`app`属性中。
```ts
const app: APP = (context.app = { //... })
```

然后会处理`vue2`的兼容。这里我们暂时不深究`vue2`的兼容处理。
```ts
if (__COMPAT__) {
  installAppCompatProperties(app, context, render)
}
```

最后返回`app`。至此`createaApp`执行完毕。

## app应用实例

接下来我们看下`app`实例的构造:

```ts
const app: App = (context.app = {
  _uid: uid++,
  _component: rootComponent as ConcreteComponent,
  _props: rootProps,
  _container: null,
  _context: context,
  _instance: null,

  version,

  get config() { // ... },

  set config(v) { // ... },

  use(plugin: Plugin, ...options: any[]) { //... },

  mixin(mixin: ComponentOptions) { //... },

  component(name: string, component?: Component): any { //... },

  directive(name: string, directive?: Directive) { //... },

  mount(
    rootContainer: HostElement,
    isHydrate?: boolean,
    isSVG?: boolean
  ): any { //... },

  unmount() { //... },

  provide(key, value) { //... }
})
```

- `_uid`：`app`的唯一标识，每次都会使用`uid`为新`app`的唯一标识，在赋值后，`uid`会进行自增，以便下一个`app`使用
- `_component`：根组件
- `_props`：根组件所需的`props`
- `_container`：需要将根组件渲染到的容器
- `_context`：`app`的上下文
- `_instance`：根组件的实例
- `version`：`vue`的版本
- `get config`：获取上下文中的`config`
  ```ts
  get config() {
    return context.config
  }
  ```
- `set config`：拦截`app.config`的`set`操作，防止`app.config`被修改
  ```ts
  set config(v) {
    if (__DEV__) {
      warn(
        `app.config cannot be replaced. Modify individual options instead.`
      )
    }
  }
  ```
  
### app.use()
使用`app.use`方法安装`plugin`。对于重复安装多次的`plugin`，只会进行安装一次，这都依靠`installedPlugins`，每次安装新的`plugin`后，都会将`plugin`存入`installedPlugins`，这样如果再次安装同样的`plugin`，就会避免多次安装。
```ts
use(plugin: Plugin, ...options: any[]) {
  // 如果已经安装过plugin，则不需要再次安装
  if (installedPlugins.has(plugin)) {
    __DEV__ && warn(`Plugin has already been applied to target app.`)
  } else if (plugin && isFunction(plugin.install)) { // 如果存在plugin，并且plugin.install是个方法
    // 将plugin添加到installedPlugins
    installedPlugins.add(plugin)
    // 调用plugin.install
    plugin.install(app, ...options)
  } else if (isFunction(plugin)) { 如果plugin是方法
    // 将plugin添加到installedPlugins
    installedPlugins.add(plugin)
    // 调plugin
    plugin(app, ...options)
  } else if (__DEV__) {
    warn(
      `A plugin must either be a function or an object with an "install" ` +
        `function.`
    )
  }
  // 最后返回app，以便可以链式调用app的方法
  return app
}
```

### app.mixin()
使用`app.mixin`进行全局混入，被混入的对象会被存在上下文中的`mixins`中。注意`mixin`只会在支持`options api`的版本中才能使用，在`mixin`中会通过`__FEATURE_OPTIONS_API__`进行判断，这个变量会在打包过程中借助`@rollup/plugin-replace`进行替换。
```ts
mixin(mixin: ComponentOptions) {
  if (__FEATURE_OPTIONS_API__) {
    if (!context.mixins.includes(mixin)) {
      context.mixins.push(mixin)
    } else if (__DEV__) {
      warn(
        'Mixin has already been applied to target app' +
          (mixin.name ? `: ${mixin.name}` : '')
      )
    }
  } else if (__DEV__) {
    warn('Mixins are only available in builds supporting Options API')
  }
  return app
}
```

### app.component()
使用`app.compoent`全局注册组件，也可用来获取`name`对应的组件。被注册的组件会被存在上下文中的`components`中。
```ts
component(name: string, component?: Component): any {
  // 验证组件名是否符合要求
  if (__DEV__) {
    validateComponentName(name, context.config)
  }
  // 如果不存在component，那么会返回name对应的组件
  if (!component) {
    return context.components[name]
  }
  if (__DEV__ && context.components[name]) {
    warn(`Component "${name}" has already been registered in target app.`)
  }
  context.components[name] = component
  return app
}
```

### app.directive()
注册全局指令，也可用来获取`name`对应的指令对象。注册的全局指令会被存入上下文中的`directives`中。
```ts
directive(name: string, directive?: Directive) {
  // 验证指令名称
  if (__DEV__) {
    validateDirectiveName(name)
  }
  // 如果不存在directive，则返回name对应的指令对象
  if (!directive) {
    return context.directives[name] as any
  }
  if (__DEV__ && context.directives[name]) {
    warn(`Directive "${name}" has already been registered in target app.`)
  }
  context.directives[name] = directive
  return app
}
```

### app.mount()
此处的`app.mount`并不是我们平时使用到的`mount`。创建完渲染器，执行完渲染器的`createApp`后，会重写`mount`方法，我们使用的`mount`方法是被重写的`mount`方法。

```ts
mount(
  rootContainer: HostElement,
  isHydrate?: boolean,
  isSVG?: boolean
): any {
  // 如果未挂载，开始挂载
  if (!isMounted) {
    // 如果存在rootContainer.__vue_app__，说明容器中已经存在一个app实例了，需要先使用unmount进行卸载
    if (__DEV__ && (rootContainer as any).__vue_app__) {
      warn(
        `There is already an app instance mounted on the host container.\n` +
          ` If you want to mount another app on the same host container,` +
          ` you need to unmount the previous app by calling \`app.unmount()\` first.`
      )
    }
    // 创建根组件的虚拟DOM
    const vnode = createVNode(
      rootComponent as ConcreteComponent,
      rootProps
    )
    // 将上下文添加到根组件虚拟dom的appContext属性中
    vnode.appContext = context

    // HMR root reload
    if (__DEV__) {
      context.reload = () => {
        render(cloneVNode(vnode), rootContainer, isSVG)
      }
    }

    // 同构渲染
    if (isHydrate && hydrate) {
      hydrate(vnode as VNode<Node, Element>, rootContainer as any)
    } else {
      // 客户端渲染
      render(vnode, rootContainer, isSVG)
    }
    // 渲染完成后将isMounted置为true
    isMounted = true
    // 将容器添加到app的_container属性中
    app._container = rootContainer
    // 将rootContainer.__vue_app__指向app实例
    ;(rootContainer as any).__vue_app__ = app

    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      // 将根组件实例赋给app._instance
      app._instance = vnode.component
      devtoolsInitApp(app, version)
    }

    // 返回根组件expose的属性
    return getExposeProxy(vnode.component!) || vnode.component!.proxy
  } else if (__DEV__) { // 已经挂载了
    warn(
      `App has already been mounted.\n` +
        `If you want to remount the same app, move your app creation logic ` +
        `into a factory function and create fresh app instances for each ` +
        `mount - e.g. \`const createMyApp = () => createApp(App)\``
    )
  }
}
```

### app.unmount()
卸载应用实例。

```ts
unmount() {
  // 如果已经挂载才能进行卸载
  if (isMounted) {
    // 调用redner函数，此时虚拟节点为null，代表会清空容器中的内容
    render(null, app._container)
    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      // 将app._instance置空
      app._instance = null
      devtoolsUnmountApp(app)
    }
    // 删除容器中的__vue_app__
    delete app._container.__vue_app__
  } else if (__DEV__) {
    warn(`Cannot unmount an app that is not mounted.`)
  }
}
```

### app.provide()
全局注入一些数据。这些数据会被存入上下文对象的`provides`中。
```ts
provide(key, value) {
  if (__DEV__ && (key as string | symbol) in context.provides) {
    warn(
      `App already provides property with key "${String(key)}". ` +
        `It will be overwritten with the new value.`
    )
  }

  context.provides[key as string | symbol] = value

  return app
}
```

## 总结
`vue3`中的渲染器主要作用就是将虚拟DOM转为真实DOM渲染到对应平台中，在这个渲染过程中会包括DOM的挂载、DOM的更新等操作。通过`baseCreateRenderer`方法创建一个渲染器`renderer`，`renderer`中有三个方法：`render`、`hydrate`、`createApp`（这里的`createApp`不是我们日常开发中使用到的`createApp`，这个`createApp`方法会在我们日常开发中使用到的`createApp`中被调用）。

