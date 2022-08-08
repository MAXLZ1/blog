# 详解组件中的this

在`vue`组件中，我们可以轻松使用`this`来获取组件相关的一些数据（通过`data`、`setup`定义的数据，或`this.$data`、`this.$props`）或行为（通过method添加的方法或`this.$nextTick`、`this.$emit`）。

本文将详细探究如何通过`this`来获取组件相关数据或行为的。

## instance.ctx

首先，在创建组件实例的过程中，会为组件实例设置一个`ctx`属性：
```ts
// 位置：packages/runtime-core/src/component.ts
export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null,
  suspense: SuspenseBoundary | null
) {
  const type = vnode.type as ConcreteComponent
  const appContext =
    (parent ? parent.appContext : vnode.appContext) || emptyAppContext

  const instance: ComponentInternalInstance = {
    // ...
  }
  
  if (__DEV__) {
    instance.ctx = createDevRenderContext(instance)
  } else {
    instance.ctx = { _: instance }
  }
  // ...
  return instance
}
```

可以发现在生产环境与开发环境下`instance.ctx`进行了不同的赋值。在开发环境下会通过`createDevRenderContext`创建一个`context`，而在正式环境下会赋值一个包含`_`属性（`_`对应的值时组件实例）的对象。

```ts
export function createDevRenderContext(instance: ComponentInternalInstance) {
  const target: Record<string, any> = {}

  // expose internal instance for proxy handlers
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  })

  // expose public properties
  Object.keys(publicPropertiesMap).forEach(key => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: NOOP
    })
  })

  return target as ComponentRenderContext
}
```

`createDevRenderContext`方法中定义了一个对象`target`，然后通过`Object.defineProperty`向`target`添加了一些属性。首先是添加了`_`属性，其不可被枚举，当访问其`_`属性会返回组件实例。

然后是通过遍历`publicPropertiesMap`的`key`为`target`添加了一些属性，来看`publicPropertiesMap`是什么：
```ts
export const publicPropertiesMap: PublicPropertiesMap =
  extend(Object.create(null), {
    $: i => i,
    $el: i => i.vnode.el,
    $data: i => i.data,
    $props: i => (__DEV__ ? shallowReadonly(i.props) : i.props),
    $attrs: i => (__DEV__ ? shallowReadonly(i.attrs) : i.attrs),
    $slots: i => (__DEV__ ? shallowReadonly(i.slots) : i.slots),
    $refs: i => (__DEV__ ? shallowReadonly(i.refs) : i.refs),
    $parent: i => getPublicInstance(i.parent),
    $root: i => getPublicInstance(i.root),
    $emit: i => i.emit,
    $options: i => (__FEATURE_OPTIONS_API__ ? resolveMergedOptions(i) : i.type),
    $forceUpdate: i => i.f || (i.f = () => queueJob(i.update)),
    $nextTick: i => i.n || (i.n = nextTick.bind(i.proxy!)),
    $watch: i => (__FEATURE_OPTIONS_API__ ? instanceWatch.bind(i) : NOOP)
  } as PublicPropertiesMap)

if (__COMPAT__) {
  installCompatInstanceProperties(publicPropertiesMap)
}
```

`publicPropertiesMap`对象中包含了我们在组件中经常使用到的`$el`、`$data`、`$props`、`$nextTick`等属性。

在定义`publicPropertiesMap`后，还调用了一个`installCompatInstanceProperties`方法，在`installCompatInstanceProperties`方法中你会发现为`publicPropertiesMap`也添加了一些属性，如`$set`、`$delete`、`$mount`等，这些方法只会在兼容`vue2`的情况加才会被添加

到此，你可能会疑问，为什么在开发环境下才有`$el`、`$nextTicks`这些属性，而在生产环境下却没有这些属性呢。是不是意味着不可以在生产环境下使用`this.$el`等属性呢？显然不会是这样，我们继续往下看。

## applyOptions

在执行完组件的`setup`方法后，会执行一个`applyOptions`函数。在`applyOptions`中会对一些`options`进行初始化，如`props`、`inject`、`methods`、`data`等

```ts
// 位置： packages/runtime-core/src/component.ts
function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  // ...
  finishComponentSetup(instance, isSSR)
}

export function finishComponentSetup(
  instance: ComponentInternalInstance,
  isSSR: boolean,
  skipOptions?: boolean
) {
  // ...
  if (__FEATURE_OPTIONS_API__ && !(__COMPAT__ && skipOptions)) {
    setCurrentInstance(instance)
    pauseTracking()
    applyOptions(instance)
    resetTracking()
    unsetCurrentInstance()
  }
  // ...
}
```

`applyOptions`函数接收一个参数：`instance`组件实例。

<details>
<summary><code>applyOptions</code>完整代码</summary>

```ts
export function applyOptions(instance: ComponentInternalInstance) {
  const options = resolveMergedOptions(instance)
  const publicThis = instance.proxy! as any
  const ctx = instance.ctx

  // do not cache property access on public proxy during state initialization
  shouldCacheAccess = false

  // call beforeCreate first before accessing other options since
  // the hook may mutate resolved options (#2791)
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, LifecycleHooks.BEFORE_CREATE)
  }

  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options

  const checkDuplicateProperties = __DEV__ ? createDuplicateChecker() : null

  if (__DEV__) {
    const [propsOptions] = instance.propsOptions
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties!(OptionTypes.PROPS, key)
      }
    }
  }

  // options initialization order (to be consistent with Vue 2):
  // - props (already done outside of this function)
  // - inject
  // - methods
  // - data (deferred since it relies on `this` access)
  // - computed
  // - watch (deferred since it relies on `this` access)

  if (injectOptions) {
    resolveInjections(
      injectOptions,
      ctx,
      checkDuplicateProperties,
      instance.appContext.config.unwrapInjectedRef
    )
  }

  if (methods) {
    for (const key in methods) {
      const methodHandler = (methods as MethodOptions)[key]
      if (isFunction(methodHandler)) {
        // In dev mode, we use the `createRenderContext` function to define
        // methods to the proxy target, and those are read-only but
        // reconfigurable, so it needs to be redefined here
        if (__DEV__) {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          })
        } else {
          ctx[key] = methodHandler.bind(publicThis)
        }
        if (__DEV__) {
          checkDuplicateProperties!(OptionTypes.METHODS, key)
        }
      } else if (__DEV__) {
        warn(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. ` +
            `Did you reference the function correctly?`
        )
      }
    }
  }

  if (dataOptions) {
    if (__DEV__ && !isFunction(dataOptions)) {
      warn(
        `The data option must be a function. ` +
          `Plain object usage is no longer supported.`
      )
    }
    const data = dataOptions.call(publicThis, publicThis)
    if (__DEV__ && isPromise(data)) {
      warn(
        `data() returned a Promise - note data() cannot be async; If you ` +
          `intend to perform data fetching before component renders, use ` +
          `async setup() + <Suspense>.`
      )
    }
    if (!isObject(data)) {
      __DEV__ && warn(`data() should return an object.`)
    } else {
      instance.data = reactive(data)
      if (__DEV__) {
        for (const key in data) {
          checkDuplicateProperties!(OptionTypes.DATA, key)
          // expose data on ctx during dev
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: NOOP
            })
          }
        }
      }
    }
  }

  // state initialization complete at this point - start caching access
  shouldCacheAccess = true

  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = (computedOptions as ComputedOptions)[key]
      const get = isFunction(opt)
        ? opt.bind(publicThis, publicThis)
        : isFunction(opt.get)
        ? opt.get.bind(publicThis, publicThis)
        : NOOP
      if (__DEV__ && get === NOOP) {
        warn(`Computed property "${key}" has no getter.`)
      }
      const set =
        !isFunction(opt) && isFunction(opt.set)
          ? opt.set.bind(publicThis)
          : __DEV__
          ? () => {
              warn(
                `Write operation failed: computed property "${key}" is readonly.`
              )
            }
          : NOOP
      const c = computed({
        get,
        set
      })
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: v => (c.value = v)
      })
      if (__DEV__) {
        checkDuplicateProperties!(OptionTypes.COMPUTED, key)
      }
    }
  }

  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key)
    }
  }

  if (provideOptions) {
    const provides = isFunction(provideOptions)
      ? provideOptions.call(publicThis)
      : provideOptions
    Reflect.ownKeys(provides).forEach(key => {
      provide(key, provides[key])
    })
  }

  if (created) {
    callHook(created, instance, LifecycleHooks.CREATED)
  }

  function registerLifecycleHook(
    register: Function,
    hook?: Function | Function[]
  ) {
    if (isArray(hook)) {
      hook.forEach(_hook => register(_hook.bind(publicThis)))
    } else if (hook) {
      register((hook as Function).bind(publicThis))
    }
  }

  registerLifecycleHook(onBeforeMount, beforeMount)
  registerLifecycleHook(onMounted, mounted)
  registerLifecycleHook(onBeforeUpdate, beforeUpdate)
  registerLifecycleHook(onUpdated, updated)
  registerLifecycleHook(onActivated, activated)
  registerLifecycleHook(onDeactivated, deactivated)
  registerLifecycleHook(onErrorCaptured, errorCaptured)
  registerLifecycleHook(onRenderTracked, renderTracked)
  registerLifecycleHook(onRenderTriggered, renderTriggered)
  registerLifecycleHook(onBeforeUnmount, beforeUnmount)
  registerLifecycleHook(onUnmounted, unmounted)
  registerLifecycleHook(onServerPrefetch, serverPrefetch)

  if (__COMPAT__) {
    if (
      beforeDestroy &&
      softAssertCompatEnabled(DeprecationTypes.OPTIONS_BEFORE_DESTROY, instance)
    ) {
      registerLifecycleHook(onBeforeUnmount, beforeDestroy)
    }
    if (
      destroyed &&
      softAssertCompatEnabled(DeprecationTypes.OPTIONS_DESTROYED, instance)
    ) {
      registerLifecycleHook(onUnmounted, destroyed)
    }
  }

  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {})
      expose.forEach(key => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: val => (publicThis[key] = val)
        })
      })
    } else if (!instance.exposed) {
      instance.exposed = {}
    }
  }

  // options that are handled when creating the instance but also need to be
  // applied from mixins
  if (render && instance.render === NOOP) {
    instance.render = render as InternalRenderFunction
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs
  }

  // asset options.
  if (components) instance.components = components as any
  if (directives) instance.directives = directives
  if (
    __COMPAT__ &&
    filters &&
    isCompatEnabled(DeprecationTypes.FILTERS, instance)
  ) {
    instance.filters = filters
  }
}
```
</details>

在`applyOptions`中首先会调用一个`resolveMergedOptions`方法，该方法会将组件中的`options`进行合并（将全局`mixins`或局部`mixins`注入或`extends`注入的的`options`与组件自身的`options`进行合并）并缓存到组件实例中。

```ts
export function resolveMergedOptions(
  instance: ComponentInternalInstance
): MergedComponentOptions {
  // base就是组件，其中包含了组件的options
  const base = instance.type as ComponentOptions
  // 获取组件中的局部mixins与extends
  const { mixins, extends: extendsOptions } = base
  // 获取全局mixins、options的缓存对象、合并策略
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext
  // 根据组件从缓存对象中获取已经合并好的options
  const cached = cache.get(base)

  let resolved: MergedComponentOptions
  
  // 如果存在已经合并好的options，则将cached赋值给resolved
  if (cached) {
    resolved = cached
  } else if (!globalMixins.length && !mixins && !extendsOptions) { // 未获得缓存options，并且不存在全局mixins、局部mixins、extends，base即为resolved
    if (
      __COMPAT__ &&
      isCompatEnabled(DeprecationTypes.PRIVATE_APIS, instance)
    ) {
      resolved = extend({}, base) as MergedComponentOptions
      resolved.parent = instance.parent && instance.parent.proxy
      resolved.propsData = instance.vnode.props
    } else {
      resolved = base as MergedComponentOptions
    }
  } else { // 其他情况，说明存在全局mixins或局部mixins或extends
    resolved = {}
    // 遍历globalMixins，将遍历globalMixins中的mixins合并到resolved中
    if (globalMixins.length) {
      globalMixins.forEach(m =>
        mergeOptions(resolved, m, optionMergeStrategies, true)
      )
    }
    // 将base合并到resolved中
    mergeOptions(resolved, base, optionMergeStrategies)
  }
  // 将合并后的options对象缓存起来
  cache.set(base, resolved)
  return resolved
}
```

`mergeOptions`：
```ts
export function mergeOptions(
  to: any, // 合并到的目标对象
  from: any, // 被合并的对象
  strats: Record<string, OptionMergeFunction>, // 合并策略
  asMixin = false // 是否正在合并mixins或extends中的options
) {
  // 如果被合并的选项是个函数，则取函数的options属性
  if (__COMPAT__ && isFunction(from)) {
    from = from.options
  }

  // 如果from中还存在mixins或extends，递归调用mergeOptions
  const { mixins, extends: extendsOptions } = from
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true)
  }
  if (mixins) {
    mixins.forEach((m: ComponentOptionsMixin) =>
      mergeOptions(to, m, strats, true)
    )
  }

  for (const key in from) {
    // mixins、extends中的expose会被忽略
    if (asMixin && key === 'expose') {
      __DEV__ &&
        warn(
          `"expose" option is ignored when declared in mixins or extends. ` +
            `It should only be declared in the base component itself.`
        )
    } else {
      // internalOptionMergeStrats中定义了组件options（如data、props、emits、created、watch等）的合并策略
      const strat = internalOptionMergeStrats[key] || (strats && strats[key])
      // 如果存在合并策略，调用合并策略生成合并结果，否则直接使用from中的值进行覆盖
      to[key] = strat ? strat(to[key], from[key]) : from[key]
    }
  }
  return to
}
```

当解析完组件`options`，会用两个变量`publicThis`、`ctx`，同时将一个全局变量`shouldCacheAccess`改为`false`。`shouldCacheAccess`为`false`的作用是在组件初始化期间，不缓存公共实例上的属性访问来源。

```ts
const publicThis = instance.proxy! as any
const ctx = instance.ctx

shouldCacheAccess = false
```

紧接着会调用`beforeCreate`钩子函数。
```ts
if (options.beforeCreate) {
  callHook(options.beforeCreate, instance, LifecycleHooks.BEFORE_CREATE)
}
```

`callHook`：
```ts
function callHook(
  hook: Function,
  instance: ComponentInternalInstance,
  type: LifecycleHooks
) {
  callWithAsyncErrorHandling(
    isArray(hook)
      ? hook.map(h => h.bind(instance.proxy!))
      : hook.bind(instance.proxy!),
    instance,
    type
  )
}
```

在`callHook`中，我们发现用`bind`改变了`hook`的`this`执行，而这个`this`就是指向了`instance.proxy`。这就说明我们在组件中所使用到的`this`其实指向的就是`instance.proxy`。

继续观察`applyOptions`的剩余代码，你会发现`methods`中的各个函数、`data`函数等都会将`this`指向`instance.proxy`.


## instance.proxy

现在，我们知道了组件中的`this`会指向组件实例的`proxy`属性，接下里，我们看下`instance.proxy`是什么。

在执行组件的`setup`之前（如果存在`setup`），有这样一步操作：
```ts
// 位置： packages/runtime-core/src/component.ts
function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  // ...
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers))
  // ...
}
```

这里创建了一个`instance.ctx`的代理对象，并使用`markRaw`进行包裹，保证其不会不会被代理。然后将这个代理对象赋值给`instance.proxy`。

来看下这个代理对象对`instance.ctx`都拦截了什么操作。

```ts
export const PublicInstanceProxyHandlers: ProxyHandler<any> = {
  get({ _: instance }: ComponentRenderContext, key: string) {
    // ...
  },

  set(
    { _: instance }: ComponentRenderContext,
    key: string,
    value: any
  ): boolean {
    // ...
  },

  has(
    {
      _: { data, setupState, accessCache, ctx, appContext, propsOptions }
    }: ComponentRenderContext,
    key: string
  ) {
    // ...
  },

  defineProperty(
    target: ComponentRenderContext,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    // ...
  }
}
```

可以看到当访问`instance.proxy`的属性、设置`instance.proxy`的属性、对`instance.proxy`执行`key in instance.proxy`或`Object.defineProperty`操作，均会被拦截器所拦截。

### get拦截器

当在组件中使用`this.$data`、`this.$nextTick`等来获取数据或某些方法时，会被`instance.proxy`的`get`拦截器所拦截。

```ts
get({ _: instance }: ComponentRenderContext, key: string) {
  const { ctx, setupState, data, props, accessCache, type, appContext } =
    instance

  // 开发环境下，this.__isVue代表这是个Vue实例
  if (__DEV__ && key === '__isVue') {
    return true
  }
  
  // 开发环境下优先考略<script setup>绑定
  if (
    __DEV__ &&
    setupState !== EMPTY_OBJ &&
    setupState.__isScriptSetup &&
    hasOwn(setupState, key)
  ) {
    return setupState[key]
  }

  // 在从组件中获取某个key对应的值时，最耗时的是通过hasOwn判断对象中是否还有key值
  // 为了减少耗时，在第一次找到对应的key时，会将key的来源进行缓存，这样下一次就可以直接根据这个来源，从指定对象中获取值，避免了hasOwn的判断
  
  let normalizedProps
  // 当key不以$开头
  if (key[0] !== '$') {
    // 从accessCache中获取key的来源（属于setup的返回结果或data的返回结果等）
    const n = accessCache![key]
    if (n !== undefined) {
      // 根据key的来源，获取对应值
      switch (n) {
        case AccessTypes.SETUP:
          return setupState[key]
        case AccessTypes.DATA:
          return data[key]
        case AccessTypes.CONTEXT:
          return ctx[key]
        case AccessTypes.PROPS:
          return props![key]
        // default: just fallthrough
      }
    } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) { // 如果key在setupState中，将key的来源标记为AccessTypes.SETUP
      accessCache![key] = AccessTypes.SETUP
      return setupState[key]
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) { // 如果key在data中，将key的来源标记为AccessTypes.DATA
      accessCache![key] = AccessTypes.DATA
      return data[key]
    } else if (
      (normalizedProps = instance.propsOptions[0]) &&
      hasOwn(normalizedProps, key)
    ) { // 如果key在normalizedProps中，说明key是个props key，将key的来源标记为AccessTypes.PROPS
      accessCache![key] = AccessTypes.PROPS
      return props![key]
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) { // 如果key在ctx中，将key的来源标记为AccessTypes.CONTEXT
      accessCache![key] = AccessTypes.CONTEXT
      return ctx[key]
    } else if (!__FEATURE_OPTIONS_API__ || shouldCacheAccess) { // 如果不允许options api或shouldCacheAccess（一个全局变量，options初始化时，会设为false）为true，将key的来源标记为AccessTypes.OTHER
      accessCache![key] = AccessTypes.OTHER
    }
  }

  const publicGetter = publicPropertiesMap[key]
  let cssModule, globalProperties
  // 如果存在$xx公共属性
  if (publicGetter) {
    if (key === '$attrs') { // 如果key是$attrs，则调用track收集依赖
      track(instance, TrackOpTypes.GET, key)
      // markAttrsAccessed函数会将accessedAttrs标记为true，表示在渲染期间使用到了$attrs属性
      __DEV__ && markAttrsAccessed()
    }
    return publicGetter(instance)
  } else if (
    // css module (injected by vue-loader)
    // 获取CSS Module （__cssModules是通过vue-lodaer/@vitejs/plugin-vue进行注入的属性）
    (cssModule = type.__cssModules) &&
    (cssModule = cssModule[key])
  ) {
    return cssModule
  } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) { // 用户可以设置$开头的自定义属性
    accessCache![key] = AccessTypes.CONTEXT
    return ctx[key]
  } else if ( // 全局属性
    ((globalProperties = appContext.config.globalProperties),
    hasOwn(globalProperties, key))
  ) {
    if (__COMPAT__) {
      const desc = Object.getOwnPropertyDescriptor(globalProperties, key)!
      if (desc.get) {
        return desc.get.call(instance.proxy)
      } else {
        const val = globalProperties[key]
        return isFunction(val)
          ? Object.assign(val.bind(instance.proxy), val)
          : val
      }
    } else {
      return globalProperties[key]
    }
  } else if (
    __DEV__ &&
    currentRenderingInstance &&
    (!isString(key) ||
      // #1091 avoid internal isRef/isVNode checks on component instance leading
      // to infinite warning loop
      key.indexOf('__v') !== 0)
  ) {
    if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
      warn(
        `Property ${JSON.stringify(
          key
        )} must be accessed via $data because it starts with a reserved ` +
          `character ("$" or "_") and is not proxied on the render context.`
      )
    } else if (instance === currentRenderingInstance) {
      warn(
        `Property ${JSON.stringify(key)} was accessed during render ` +
          `but is not defined on instance.`
      )
    }
  }
}
```

从`get`拦截器的拦截过程，我们可以发现使用`this.xxx`获取属性时，搜索的顺序：

- **如果属性不以`$`开头，其搜索顺序如下：**
1. `instance.setupState`，即`setup`的返回结果
2. `instance.data`，即`data`的返回结果
3. `instance.propsOptions[0]`，即`props`，`instance.propsOptions[0]`中是被标准化的`props`声明，获取`props`属性是通过`instance.props`来获取
4. `instance.ctx`，一些自定义的`options`属性或计算属性会被保存到`instance.ctx`中

- **如果属性以`$`开头，其搜索顺序如下：**
1. `publicPropertiesMap`，`publicPropertiesMap`中保存了`$`、`$el`、`$data`、`$nextTick`等属性
2. `CSS Module`，从`instance.type.__cssModules`中查找对应属性
3. `instance.ctx`，一些自定义的`options`属性会被保存到`instance.ctx`中
4. `instance.ctx`，一些自定义的`options`属性或计算属性会被保存到`instance.ctx`中

当`data`、`setup`、`props`、`computed`中存在相同属性时，其优先级应该为：`setup`>`data`>`props`>`computed`

### set拦截器

当在组件中使用`this.xxx = xxx`修改数据时，会被`instance.proxy`的`set`拦截器所拦截。

```ts
set(
  { _: instance }: ComponentRenderContext,
  key: string,
  value: any
): boolean {
  const { data, setupState, ctx } = instance
  // 修改setup中的值
  if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
    setupState[key] = value
    return true
  } else if (data !== EMPTY_OBJ && hasOwn(data, key)) { // 修改data中的值
    data[key] = value
    return true
  } else if (hasOwn(instance.props, key)) { // props中的值不允许被修改
    __DEV__ &&
      warn(
        `Attempting to mutate prop "${key}". Props are readonly.`,
        instance
      )
    return false
  }
  if (key[0] === '$' && key.slice(1) in instance) { // $el、$data、$props等属性不允许被修改
    __DEV__ &&
      warn(
        `Attempting to mutate public property "${key}". ` +
          `Properties starting with $ are reserved and readonly.`,
        instance
      )
    return false
  } else { // 其他值的修改会修改ctx中的值
    if (__DEV__ && key in instance.appContext.config.globalProperties) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        value
      })
    } else {
      ctx[key] = value
    }
  }
  return true
}
```

通过`this`进行修改属性时，其修改顺序为：

1. 如果`key`在`instance.setupState`中，则修改`setupState`中对应的数据
2. 如果`key`在`instance.data`中，则修改`instance.data`中对应的数据
3. 如果`key`在`props`中，不允许进行修改
4. 如果`key`是`$el`、`$data`、`$prpos`等以`$`开头的属性，不允许进行修改
5. 其余情况，修改`instance.ctx`中的数据

### has拦截器

当在组件中使用`key in this`判断某个`key`是否在`this`中时，会被`instance.proxy`的`has`拦截器所拦截。

```ts
has(
  {
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }: ComponentRenderContext,
  key: string
) {
  let normalizedProps
  return (
    // 先在accessCache中尝试获取key，如果accessCache中存在，则返回true
    !!accessCache![key] ||
    // 尝试在data的自身属性中寻找key，找到返回true
    (data !== EMPTY_OBJ && hasOwn(data, key)) ||
    // 尝试在setupState的自身属性中寻找key，找到返回true
    (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) ||
    // 尝试在normalizedProps的自身属性中寻找key，找到返回true
    ((normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key)) ||
    // 尝试在ctx的自身属性中寻找key，找到返回true
    hasOwn(ctx, key) ||
    // 尝试在publicPropertiesMap的自身属性中寻找key，找到返回true
    hasOwn(publicPropertiesMap, key) ||
    // 尝试在全局属性对象的自身属性中寻找key，找到返回true
    hasOwn(appContext.config.globalProperties, key)
  )
}
```

### defineProperty拦截器

当在组件中对`this`使用`Object.defineProperty`操作时，会被`instance.proxy`的`defineProperty`拦截器所拦截。

```ts
defineProperty(
  target: ComponentRenderContext,
  key: string,
  descriptor: PropertyDescriptor
) {
  if (descriptor.get != null) {
    target._.accessCache![key] = 0
  } else if (hasOwn(descriptor, 'value')) { // 利用this.set修改值
    this.set!(target, key, descriptor.value, null)
  }
  return Reflect.defineProperty(target, key, descriptor)
}
```

## 总结

组件中的`this`最终会指向组件实例的`proxy`属性，`instance.proxy`是`instance.ctx`的`proxy`代理。当我们通过`this`获取或设置某些属性时，会被`proxy`对应的拦截器进行拦截，并进一步处理。

在通过`this`获取属性的过程中，在第一次获取属性时，会将`key`的来源保存到`instance.accessCache`中，这样后续再获取属性时，就可以根据`key`的来源，直接到指定对象中获取对应的值。

如果`data`、`setup`、`props`、`computed`中存在相同属性时，其优先级应该为：`setup`>`data`>`props`>`computed`。

