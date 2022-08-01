# 组件实例的创建过程

在`vue3`中通过`createComponentInstance`方法创建组件实例。`createComponentInstance`接收三个参数：`vnode`、`parent`（父组件实例）、`suspense`

```ts
export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null,
  suspense: SuspenseBoundary | null
) {
  const type = vnode.type as ConcreteComponent
  // app实例的上下文对象
  const appContext =
    (parent ? parent.appContext : vnode.appContext) || emptyAppContext

  const instance: ComponentInternalInstance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null!, // to be immediately set
    next: null,
    subTree: null!, // will be set synchronously right after creation
    effect: null!,
    update: null!, // will be set synchronously right after creation
    scope: new EffectScope(true /* detached */),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null!,
    renderCache: [],

    components: null,
    directives: null,

    // 规范化props options及emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),

    emit: null!, // to be set immediately
    emitted: null,

    propsDefaults: EMPTY_OBJ,

    inheritAttrs: type.inheritAttrs,

    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,

    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,

    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,

    // 一些生命周期钩子 
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  }
  // 设置组件实例代理的目标
  if (__DEV__) {
    instance.ctx = createDevRenderContext(instance)
  } else {
    instance.ctx = { _: instance }
  }
  // 设置组件实例的根实例
  instance.root = parent ? parent.root : instance
  // 绑定emit函数的第一个参数为组件实例
  instance.emit = emit.bind(null, instance)

  // 自定义元素的特殊处理
  if (vnode.ce) {
    vnode.ce(instance)
  }

  return instance
}
```

在创建组件实例过程中有步比较重要的操作就是规范化组件实例的`props`与`emits`。

## 规范化props

`normalizePropsOptions`方法可以接受三个参数：`comp`（组件或包含options的某些属性的对象）、`appContext`（`app`实例的上下文对象）、`asMixin`（作为`mixin`处理`props`， 默认`false`）
```ts
export function normalizePropsOptions(
  comp: ConcreteComponent,
  appContext: AppContext,
  asMixin = false
): NormalizedPropsOptions {
  // 从appContext获取缓存的进过处理好的props，如果有，直接返回
  const cache = appContext.propsCache
  const cached = cache.get(comp)
  if (cached) {
    return cached
  }

  const raw = comp.props
  const normalized: NormalizedPropsOptions[0] = {}
  const needCastKeys: NormalizedPropsOptions[1] = []

  // 处理通过mixin/extend注入的props
  let hasExtends = false
  // 如果支持 options api 并且comp不是function
  if (__FEATURE_OPTIONS_API__ && !isFunction(comp)) {
    const extendProps = (raw: ComponentOptions) => {
      if (__COMPAT__ && isFunction(raw)) {
        raw = raw.options
      }
      hasExtends = true
      const [props, keys] = normalizePropsOptions(raw, appContext, true)
      extend(normalized, props)
      if (keys) needCastKeys.push(...keys)
    }
    // 处理全局mixin注入的props
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps)
    }
    // 处理extent注入的props
    if (comp.extends) {
      extendProps(comp.extends)
    }
    // 处理局部mixin注入的props
    if (comp.mixins) {
      comp.mixins.forEach(extendProps)
    }
  }

  // 如果组件不存在props，也没有通过mixin、extends方式注入的props，则缓存一个空数组
  if (!raw && !hasExtends) {
    cache.set(comp, EMPTY_ARR as any)
    return EMPTY_ARR as any
  }

  // 如果组件本身的props是数组时，其中的元素必须为字符串
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if (__DEV__ && !isString(raw[i])) {
        warn(`props must be strings when using array syntax.`, raw[i])
      }
      // 将字符串props转为驼峰模式
      const normalizedKey = camelize(raw[i])
      // 验证props的命名是否符合要求，不准以$开头的props
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ
      }
    }
  } else if (raw) {
    if (__DEV__ && !isObject(raw)) {
      warn(`invalid props options`, raw)
    }
    for (const key in raw) {
      // 将key转为驼峰式
      const normalizedKey = camelize(key)
      // 验证props的命名是否符合要求，不准以$开头的props
      if (validatePropName(normalizedKey)) {
        const opt = raw[key]
        // 如果key所对应的opt是数组或方法，则将opt作为type
        const prop: NormalizedProp = (normalized[normalizedKey] =
          isArray(opt) || isFunction(opt) ? { type: opt } : opt)
        if (prop) {
          // 获取Boolean在prop.type中的索引，如果返回-1，代表prop.type中不允许Boolean类型
          const booleanIndex = getTypeIndex(Boolean, prop.type)
          // 获取String在prop.type中的索引
          const stringIndex = getTypeIndex(String, prop.type)
          prop[BooleanFlags.shouldCast] = booleanIndex > -1
          prop[BooleanFlags.shouldCastTrue] =
            stringIndex < 0 || booleanIndex < stringIndex
          // 如果prop需要进行Boolean转换或存在默认值，则将key存入needCastKeys中
          if (booleanIndex > -1 || hasOwn(prop, 'default')) {
            needCastKeys.push(normalizedKey)
          }
        }
      }
    }
  }

  // 将normalized和needCastKeys构造成一个数组并缓存到app实例的上下文对象中
  const res: NormalizedPropsOptions = [normalized, needCastKeys]
  cache.set(comp, res)
  return res
}
```


## 规范化emits
```ts
export function normalizeEmitsOptions(
  comp: ConcreteComponent,
  appContext: AppContext,
  asMixin = false
): ObjectEmitsOptions | null {
  // 尝试从emits缓存中获取emit
  const cache = appContext.emitsCache
  const cached = cache.get(comp)
  if (cached !== undefined) {
    return cached
  }

  const raw = comp.emits
  let normalized: ObjectEmitsOptions = {}

  // 处理通过mixin/extend注入的emits
  let hasExtends = false
  if (__FEATURE_OPTIONS_API__ && !isFunction(comp)) {
    const extendEmits = (raw: ComponentOptions) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw, appContext, true)
      // 只要存在通过mixins、extend方式注入的emits，将hasExtends设置为true
      if (normalizedFromExtend) {
        hasExtends = true
        extend(normalized, normalizedFromExtend)
      }
    }
    // 处理通过全局mixin注入的emits选项
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits)
    }
    // 处理通过extends注入的emits选项
    if (comp.extends) {
      extendEmits(comp.extends)
    }
    // 处理通过局部mixins注入的emits选项
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits)
    }
  }

  // 如果组件本身不存在emits，而且也没有通过mixin、extends等方式注入emits，则缓存一个null
  if (!raw && !hasExtends) {
    cache.set(comp, null)
    return null
  }

  if (isArray(raw)) {
    raw.forEach(key => (normalized[key] = null))
  } else {
    extend(normalized, raw)
  }

  // 将规范后的emits缓存至app实例的上下文对象中
  cache.set(comp, normalized)
  return normalized
}
```

可以看到如果通过全局`mixin`、局部`mixin`、`extends`及组件自身`props`同时定义`key`相同的`props`或`emits`，其优先级顺序为：组件自身`props`或`emits` > 局部`mixin` > `extends` > 全局`mixin`
