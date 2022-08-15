# 组件props的初始化过程

`props`初始化过程主要会经历三个阶段：

1. 对组件内声明的`props`进行标准化处理
2. 设置组件实例的`props`属性，确定`props`及`attrs`
3. 验证`props`

## `props`声明的标准化处理
`props`声明的标准化处理发生在创建组件实例的过程中，这个过程中会按照全局`mixin`注入的`props`、通过`extend`注入的`props`、通过局部`mixin`注入的`props`、组件自身定义的`props`的顺序来进行标准化。

`props`经过标准化后，会产生一个长度为2的数组，并将这个数组存储在组件实例的`propsOptions`中。这个数组的第一项是个对象，其中包含了`prop`的类型、`BooleanFlags.shouldCast`（表示`prop`类型中存在`Boolean`）、`BooleanFlags.shouldCastTrue`（表示`prop`类型中不存在`String`，或`Boolean`类型的索引小于`String`类型的索引）；数组第二项是个数组，这个数组中保存了一些`props`的`key`，这些`key`都存在默认值或需要进行`Boolean`转换。

`props`的标准化：
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
          // 如果prop类型中存在Boolean或存在默认值，则将key存入needCastKeys中
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

以下是几个`props`标准化的例子：

**使用数组声明`props`**

`props`声明：
```ts
defineProps(['foo', 'bar'])
```

经过标准化后产生的数组：
```ts
[
  {
    foo: {},
    bar: {}
  },
  []
]
```
由于使用数组声明`props`无法指定类型，也无法指定默认值，所以其类型是缺失的，数组第二项是个空数组。

**使用对象声明`props`**

`props`声明：
```ts
defineProps({
  foo: {
    type: String,
    default: 'foo'
  },
  bar: {
    type: [ Boolean, String ],
    default: ''
  }
})
```

经过标准化后产生的数组：
```ts
[
  {
    foo: {
      type: String,
      [BooleanFlags.shouldCast]: false,
      [BooleanFlags.shouldCastTrue]: true
    },
    bar: {
      type: [ Boolean, String ],
      [BooleanFlags.shouldCast]: true,
      [BooleanFlags.shouldCastTrue]: true,
      default: ''
    }
  },
  [ 'foo', 'bar' ]
]
```

## 确定`props`及`attrs`

在创建完组件实例后，会调用一个`initProps`函数初始化`props`（`packages/runtime-core/src/componentProps.ts`）

`initProps`函数接收四个参数：`instance`（组件实例）、`rawProps`（传递给组件的`props`）、`isStateful`（是否为有状态组件）、`isSSR`（是否为同构）

```ts
export function initProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  isStateful: number,
  isSSR = false
) {
  const props: Data = {}
  const attrs: Data = {}
  def(attrs, InternalObjectKey, 1)

  instance.propsDefaults = Object.create(null)

  setFullProps(instance, rawProps, props, attrs)

  // 确保所有声明的props键都存在
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = undefined
    }
  }

  // 验证props
  if (__DEV__) {
    validateProps(rawProps || {}, props, instance)
  }

  // 如果是有状态组件，将props（在客户端环境下，需要转为一个浅层的响应式对象）保存到instance.props中
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props)
  } else { // 函数式组件如何未声明props，会将attrs作为props
    if (!instance.type.props) {
      instance.props = attrs
    } else {
      instance.props = props
    }
  }
  instance.attrs = attrs
}
```

在`initProps`中有个关键步骤`setFullProps`，该函数作用是确定`props`及`attrs`。

`setFullProps`函数接收四个参数：`instance`（组件实例）、`rawProps`（传递给组件的`props`）、`props`（被确定为`prop`的值会被存入该对象中）、`attrs`（被确定为`attr`的值会被存入该对象中）
```ts
function setFullProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  props: Data,
  attrs: Data
) {
  const [options, needCastKeys] = instance.propsOptions
  let hasAttrsChanged = false
  // key类型中存在Boolean，或设置了默认值，会将prop暂存在该对象中
  let rawCastValues: Data | undefined
  if (rawProps) {
    for (let key in rawProps) {
      // 对于key、ref、空字符串等一些保留字跳过处理
      if (isReservedProp(key)) {
        continue
      }

      // 处理兼容模式
      if (__COMPAT__) {
        if (key.startsWith('onHook:')) {
          softAssertCompatEnabled(
            DeprecationTypes.INSTANCE_EVENT_HOOKS,
            instance,
            key.slice(2).toLowerCase()
          )
        }
        // 忽略inline-template
        if (key === 'inline-template') {
          continue
        }
      }

      const value = rawProps[key]
      
      let camelKey
      // 将key进行驼峰处理，因为props option在规范化期间也被转换为驼峰格式了
      if (options && hasOwn(options, (camelKey = camelize(key)))) {
        // 如果声明props时，key没有设置默认值并且key的类型中不存在Boolean，则可以直接赋值
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value
        } else {
          ;(rawCastValues || (rawCastValues = {}))[camelKey] = value
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {  // 将未声明的props被放入单独的attrs对象中
        if (__COMPAT__) {
          if (isOn(key) && key.endsWith('Native')) {
            key = key.slice(0, -6) // remove Native postfix
          } else if (shouldSkipAttr(key, instance)) {
            continue
          }
        }
        // 将value存入attrs中
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value
          hasAttrsChanged = true
        }
      }
    }
  }
  
  // 存在需要被转换的key
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props)
    const castValues = rawCastValues || EMPTY_OBJ
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i]
      // 处理prop的值
      props[key] = resolvePropValue(
        options!,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      )
    }
  }

  return hasAttrsChanged
}
```

`resolvePropValue`函数接收6个参数：`options`（被标准化的`props options`）、`props`（`props`的原始对象）、`key`、`value`（`key`对应的value）、`instance`（组件实例）、`isAbsent`（`key`是否不在`rawCastValues`中）
```ts
function resolvePropValue(
  options: NormalizedProps,
  props: Data,
  key: string,
  value: unknown,
  instance: ComponentInternalInstance,
  isAbsent: boolean
) {
  const opt = options[key]
  if (opt != null) {
    const hasDefault = hasOwn(opt, 'default')
    // 存在默认值，未传入对应的属性，此时value就是默认值
    if (hasDefault && value === undefined) {
      const defaultValue = opt.default
      // 如果type不是Function 并且默认值是用方法定义的
      if (opt.type !== Function && isFunction(defaultValue)) {
        const { propsDefaults } = instance
        // 如果在propsDefaults中存在对应的默认值，则使用该值，否则需要调用defaultValue函数获取
        if (key in propsDefaults) {
          value = propsDefaults[key]
        } else {
          // 设置当前组件实例
          setCurrentInstance(instance)
          // 调用defaultValue函数获取默认值，并将默认值缓存到instance.propsDefaults中
          value = propsDefaults[key] = defaultValue.call(
            __COMPAT__ &&
              isCompatEnabled(DeprecationTypes.PROPS_DEFAULT_THIS, instance)
              ? createPropsDefaultThis(instance, props, key)
              : null,
            props
          )
          // 取消当前实例
          unsetCurrentInstance()
        }
      } else {
        value = defaultValue
      }
    }
    // 如果声明的prop的类型存在Boolean
    if (opt[BooleanFlags.shouldCast]) {
      // 不存在默认值并且未传入prop，则默认值为false
      if (isAbsent && !hasDefault) {
        value = false
      } else if ( // 如果类型定义中不存在String类型或Boolean类型比String类型靠前，并且value为空字符串或value等于key的keba的形式
        opt[BooleanFlags.shouldCastTrue] &&
        (value === '' || value === hyphenate(key))
      ) {
        value = true
      }
    }
  }
  return value
}
```

**Boolean类型转换**

`<MyComponent>`的`props`声明如下
```ts
defineProps({
  isShow: Boolean
})
```

```ts
<!-- 等同于传入 :isShow="true" -->
<MyComponent isShow />

<!-- 等同于传入 :isShow="false" -->
<MyComponent />
```

## 验证`props`

当处理完`props`与`attrs`后，会调用`validateProps`方法对`props`进行校验。

`validateProps`接收三个参数：`rawProps`（传给组件的`props`）、`props`（被处理后的`props`）、`instance`（组件实例）

```ts
function validateProps(
  rawProps: Data,
  props: Data,
  instance: ComponentInternalInstance
) {
  const resolvedValues = toRaw(props)
  const options = instance.propsOptions[0]
  for (const key in options) {
    let opt = options[key]
    if (opt == null) continue
    validateProp(
      key,
      resolvedValues[key],
      opt,
      !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate(key))
    )
  }
}

function validateProp(
  name: string,
  value: unknown,
  prop: PropOptions,
  isAbsent: boolean
) {
  const { type, required, validator } = prop
  // 验证必填项
  if (required && isAbsent) {
    warn('Missing required prop: "' + name + '"')
    return
  }
  // value为null或undefined并且prop是可选的
  if (value == null && !prop.required) {
    return
  }
  // 类型校验
  if (type != null && type !== true) {
    let isValid = false
    const types = isArray(type) ? type : [type]
    const expectedTypes = []
    // 只要匹配类型中的任一类型，值就有效
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType(value, types[i])
      expectedTypes.push(expectedType || '')
      isValid = valid
    }
    if (!isValid) {
      warn(getInvalidTypeMessage(name, value, expectedTypes))
      return
    }
  }
  // 自定义校验
  if (validator && !validator(value)) {
    warn('Invalid prop: custom validator check failed for prop "' + name + '".')
  }
}

function assertType(value: unknown, type: PropConstructor): AssertionResult {
  let valid
  const expectedType = getType(type)
  if (isSimpleType(expectedType)) { // 简单类型的校验，包括String,Number,Boolean,Function,Symbol,BigInt
    const t = typeof value
    valid = t === expectedType.toLowerCase()
    if (!valid && t === 'object') {
      valid = value instanceof type
    }
  } else if (expectedType === 'Object') {
    valid = isObject(value)
  } else if (expectedType === 'Array') {
    valid = isArray(value)
  } else if (expectedType === 'null') {
    valid = value === null
  } else {
    valid = value instanceof type
  }
  return {
    valid,
    expectedType
  }
}
```
