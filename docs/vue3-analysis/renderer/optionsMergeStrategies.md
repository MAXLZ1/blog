# vue3中options选项的合并策略

在`vue3`中通过`resolveMergedOptions`函数进行合并`options`选项。

## resolveMergedOptions
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

如果组件中不存在全局`mixins`、局部`mixins`、`extends`，则不需要合并`options`操作。相反，首先合并全局`mixins`到一个空对象中，然后依次将`extends`、局部`mixins`中的`options`合并到这个对象中。处理好的`options`对象会被缓存到`instance.appContext.optionCache`中，以便后续使用。

对于组件内置的`options`选项，其合并策略都保存在`internalOptionMergeStrats`中。
```ts
export const internalOptionMergeStrats: Record<string, Function> = {
  data: mergeDataFn,
  props: mergeObjectOptions, // TODO
  emits: mergeObjectOptions, // TODO
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
}

if (__COMPAT__) {
  internalOptionMergeStrats.filters = mergeObjectOptions
}
```

## `options`合并策略

### `data`及`provide`合并策略

`data`及`provide`合并策略通过`mergeDataFn`函数实现。
```ts
function mergeDataFn(to: any, from: any) {
  if (!from) {
    return to
  }
  if (!to) {
    return from
  }
  return function mergedDataFn(this: ComponentPublicInstance) {
    return (
      __COMPAT__ && isCompatEnabled(DeprecationTypes.OPTIONS_DATA_MERGE, null)
        ? deepMergeData
        : extend
    )(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    )
  }
}

export function deepMergeData(to: any, from: any) {
  for (const key in from) {
    const toVal = to[key]
    const fromVal = from[key]
    if (key in to && isPlainObject(toVal) && isPlainObject(fromVal)) {
      __DEV__ && warnDeprecation(DeprecationTypes.OPTIONS_DATA_MERGE, null, key)
      deepMergeData(toVal, fromVal)
    } else {
      to[key] = fromVal
    }
  }
  return to
}

export const extend = Object.assign
```

`data`及`provide`的合并策略会受到兼容模式及`OPTIONS_DATA_MERGE`的影响。
  
在兼容模式下，如果`OPTIONS_DATA_MERGE`为`true`，会将`data`进行深度合并，否则进行浅层合并（只合并根级属性）。非兼容模式下，即`vue3`中，是浅层合并。

**示例：**
  
1. 使用兼容`vue2`的版本。`user`会被进行深拷贝。如果使用`configureCompat`将`OPTIONS_DATA_MERGE`修改为`false`，`user`会被浅拷贝。
```html
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/@vue/compat@3.2.37/dist/vue.esm-browser.prod.js"
    }
  }
</script>

<div id="app"></div>

<script type="module">
  import { createApp, configureCompat } from 'vue'

  configureCompat({
    OPTIONS_DATA_MERGE: false
  })
  
  createApp({
    mixins: [
      {
        data() {
          return {
            user: {
              name: 'Tom',
              id: 1
            }
          }
        }
      }
    ],
    data() {
      return {
        user: {
          id: 2
        }
      }
    },
    mounted() {
      // { user: { id: 2 } }
      console.log(this.$data.user)
    }
  }).mount('#app')
</script>
```
  
2. 使用非兼容版本的`vue3`。`user`被浅拷贝
```html
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.prod.js"
    }
  }
</script>

<div id="app"></div>

<script type="module">
  import { createApp, configureCompat } from 'vue'

  configureCompat({
    OPTIONS_DATA_MERGE: false
  })
  createApp({
    mixins: [
      {
        data() {
          return {
            user: {
              name: 'Tom',
              id: 1
            }
          }
        }
      }
    ],
    data() {
      return {
        user: {
          id: 2
        }
      }
    },
    mounted() {
      // { user: { id: 2 } }
      console.log(this.$data.user)
    }
  }).mount('#app')
</script>
```

### `props`、`emits`、`methods`、`computed`、`components`、`directives`、`filters`合并策略

`props`、`emits`、`methods`、`computed`、`components`、`directives`、`filters`的合并策略均是通过`mergeObjectOptions`函数进行实现。

```ts
function mergeObjectOptions(to: Object | undefined, from: Object | undefined) {
  return to ? extend(extend(Object.create(null), to), from) : from
}
```

`props`、`emits`、`methods`、`computed`、`components`、`directives`、`filters`这些`options`有个共同特点：它们都是一个对象（`emits`可以是数组）。它们的合并策略很简单，就是使用`Object.assign`进行浅拷贝。

**示例**

```html
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.prod.js"
    }
  }
</script>

<div id="app">
  <button  @click="handleClick">click me</button>
</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    extends: {
      methods: {
        handleClick() {
          console.log('from extends')
        }
      }
    },
    mixins: [
      {
        methods: {
          handleClick() {
            console.log('from mixins')
          }
        }
      }
    ],
    methods: {
      handleClick() {
        console.log('from component self')
      }
    }
  }).mount('#app')
</script>
```

当点击按钮，控制台打印`from component self`。如果将组件自身的`handleClick`注释掉，再点击按钮，控制台打印`from mixins`。这是因为`options`合并的顺序是全局`mixins`、`extends`、局部`mixins`、组件自身`options`，那么`options`的优先级就是这个顺序的倒序。

### 生命周期钩子`options`合并策略

生命周期钩子相关`options`的合并策略均是通过`mergeAsArray`函数完成的。

```ts
function mergeAsArray<T = Function>(to: T[] | T | undefined, from: T | T[]) {
  return to ? [...new Set([].concat(to as any, from as any))] : from
}
```

生命周期钩子相关`options`，会被合并至一个去重的数组中，数组中的顺序依次为：全局`mixins`、`extends`、局部`mixins`、组件自身`options`。

**示例**

```html
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.prod.js"
    }
  }
</script>

<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  
  const app = createApp({
    mixins: [
      {
        beforeCreate() {
          console.log('from component mixins')
        }
      }
    ],
    extends: {
      beforeCreate() {
        console.log('from extends')
      }
    },
    beforeCreate() {
      console.log('from component self')
    }
  })
  
  app.mixin({
    beforeCreate() {
      console.log('from global mixins')
    }
  })
  
  app.mount('#app')
</script>
```

上述代码依次打印：`from global mixins`、`from extends`、`from component mixins`、 `from component self`

### `watch`合并策略

`watch`的合并策略通过`mergeWatchOptions`函数实现。

```ts
function mergeWatchOptions(
  to: ComponentWatchOptions | undefined,
  from: ComponentWatchOptions | undefined
) {
  if (!to) return from
  if (!from) return to
  const merged = extend(Object.create(null), to)
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key])
  }
  return merged
}
```

`watch`的合并策略与生命周期钩子的合并策略相同，相同`key`的`watcher`会被合并到一个去重的数组中。

**示例**
```html
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.prod.js"
    }
  }
</script>

<div id="app">
  <button @click="handleClick">click me</button>
</div>

<script type="module">
  import { createApp, ref } from 'vue'

  const app = createApp({
    mixins: [
      {
        watch: {
          count() {
            console.log('from component mixins')
          }
        }
      }
    ],
    extends: {
      watch: {
        count() {
          console.log('from extends')
        }
      }
    },
    watch: {
      count() {
        console.log('from component self')
      }
    },
    setup() {
      const count = ref(0)
      function handleClick() {
        count.value++
      }
      return {
        count,
        handleClick
      }
    }
  })

  app.mixin({
    watch: {
      count() {
        console.log('from global mixins')
      }
    }
  })
  
  app.mount('#app')
</script>
```

### `inject`合并策略

`inject`的合并通过`mergeInject`函数实现。

```ts
function mergeInject(
  to: ComponentInjectOptions | undefined,
  from: ComponentInjectOptions
) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from))
}

function normalizeInject(
  raw: ComponentInjectOptions | undefined
): ObjectInjectOptions | undefined {
  if (isArray(raw)) {
    const res: ObjectInjectOptions = {}
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i]
    }
    return res
  }
  return raw
}
```

`inject`的合并与`props`、`computed`等类似，也是通过`mergeObjectOptions`方法进行浅拷贝，不同的是，由于`inject`可以是数组，所以需要调用`normalizeInject`将`inject`标准化为对象。

## 总结

`options`的合并顺序：全局`mixins` -> `extends` -> 局部`mixins` -> 组件自身`options`

| options                                                                  | 合并策略                                                  | 说明                                                                                                                                          |
|--------------------------------------------------------------------------|-------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `data`、`provide`                                                         | 可进行深度合并，也可进行浅层合并。取决于是否在兼容模式中，及`OPTIONS_DATA_MERGE`的值。 | 在兼容模式中，如果`MODE`为`2`（`vue2`模式），默认会进行深度合并；如果`MODE`为`3`（`vue3`模式），默认进行浅层合并。两种模式下都可以通过更改`OPTIONS_DATA_MERGE`（`false`为浅层合并，`true`为深层合并）的值改变合并策略。 |
| `props`、`emits`、`methods`、`computed`、`components`、`directives`、`filters` | 浅层合并                                                  |                                                                                                                                             |
| `beforeCreate`等生命周期钩子                                                    | 合并至一个去重的数组中                                           | 执行顺序与`options`合并顺序相同                                                                                                                        |
| `watch`                                                                  | 相同`key`的`watcher`合并至一个去重的数组中                          | 执行顺序与`options`合并顺序相同                                                                                                                        |
| `inject`                                                                  | 浅层拷贝                                                  | 由于`inject`可能是数组，所以合并前需要标准化为对象                                                                                                               |

