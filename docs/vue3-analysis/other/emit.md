# emit的实现

在`vue`中可以通过`this.$emit/ctx.emit`触发自定义的事件。本文我们主要研究如何触发自定义的事件。

## emit的用法

`options`:

```vue
<template id="test">
  <select v-model="selected" @change="handleChange">
    <option v-for="item in list" :key="item" :value="item">{{ item }}</option>
  </select>
</template>

<script>
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'SelectDemo',
    emits: [ 'change' ],
    data() {
      return {
        selected: '',
        list: [ 'apple', 'banana', 'orange' ]
      }
    },
    methods: {
      handleChange(event) {
        this.$emit('change', event)
      }
    }
  })
</script>
```

`composite api`:

```vue
<template id="test">
  <select v-model="selected" @change="handleChange">
    <option v-for="item in list" :key="item" :value="item">{{ item }}</option>
  </select>
</template>

<script setup>
  import { reactive, ref } from 'vue'

  const emit = defineEmits([ 'change' ])
  
  const list = reactive([ 'apple', 'banana', 'orange' ])
  const selected = ref('')
  
  function handleChange(event) {
    emit('change', event)
  }
</script>
```

当应用`SelectDemo`组件时，可以添加一个`change`事件监听`value`的改变。

## emit的实现

当在组件中调用`this`的某些方法时，会被`instance.proxy`所拦截。如果获取`this.$emit`，则会被`proxy`的`get`拦截器拦截器，然后从`publicPropertiesMap`中获取对应的值。

_关于组件中的`this`可以参考：[详解组件中的this](https://maxlz1.github.io/blog/vue3-analysis/renderer/componentThis.html)，可以帮助你理解这里。_
```ts {14}
export const publicPropertiesMap: PublicPropertiesMap =
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /*#__PURE__*/ extend(Object.create(null), {
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

```

当使用`this.$emit`时，会获取到对应的`i => i.emit`，而在拦截器中会调用这个方法，返回`i.emit`。

```ts {11}
export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // ...

    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      if (key === '$attrs') {
        track(instance, TrackOpTypes.GET, key)
        __DEV__ && markAttrsAccessed()
      }
      return publicGetter(instance)
    }
    
    // ...
  }
}
```

可以发现`this.$emit`就是执行组件实例中的`emit`。

在创建组件实例的过程中，会立即对`instance.emit`进行赋值，并绑定`emit`中`this`指向组件实例：

```ts {10}
export function createComponentInstance() {
  const instance = {
    // ...
    
    emit: null,
    
    // ...
  }

  instance.emit = emit.bind(null, instance)
  
  // ...
}
```

`emit`源码：

```ts
export function emit(
  instance: ComponentInternalInstance,
  event: string,
  ...rawArgs: any[]
) {
  // 组件已经被卸载，直接return
  if (instance.isUnmounted) return
  // 获取props
  const props = instance.vnode.props || EMPTY_OBJ

  if (__DEV__) {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance
    if (emitsOptions) {
      if (
        !(event in emitsOptions) &&
        !(
          __COMPAT__ &&
          (event.startsWith('hook:') ||
            event.startsWith(compatModelEventPrefix))
        )
      ) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) { // event没有在props声明，也没有在emits中声明
          warn(
            `Component emitted event "${event}" but it is neither declared in ` +
              `the emits option nor as an "${toHandlerKey(event)}" prop.`
          )
        }
      } else {
        // 校验事件
        const validator = emitsOptions[event]
        if (isFunction(validator)) {
          const isValid = validator(...rawArgs)
          if (!isValid) {
            warn(
              `Invalid event arguments: event validation failed for event "${event}".`
            )
          }
        }
      }
    }
  }

  // 传入emit中的参数
  let args = rawArgs
  // 是否为v-model的update:xxx监听
  const isModelListener = event.startsWith('update:')

  // 对于v-model的update:xxx事件，可能需要修改参数
  const modelArg = isModelListener && event.slice(7)
  if (modelArg && modelArg in props) {
    const modifiersKey = `${
      modelArg === 'modelValue' ? 'model' : modelArg
    }Modifiers`
    // 获取修饰符
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ
    // 如果存在trim修饰符，对rawArgs中的参数进行trim操作
    if (trim) {
      args = rawArgs.map(a => a.trim())
    }
    // 如果存在number修饰符，对rawArgs中的参数转为Number
    if (number) {
      args = rawArgs.map(toNumber)
    }
  }

  if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
    devtoolsComponentEmit(instance, event, args)
  }

  if (__DEV__) {
    const lowerCaseEvent = event.toLowerCase()
    if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
      warn(
        `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(
            instance,
            instance.type
          )} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
      )
    }
  }

  let handlerName
  // 获取绑定的事件函数
  let handler =
    props[(handlerName = toHandlerKey(event))] ||
    // also try camelCase event handler (#2249)
    props[(handlerName = toHandlerKey(camelize(event)))]
  // 对于v-model update:xxx事件，支持kebab-case格式
  if (!handler && isModelListener) {
    handler = props[(handlerName = toHandlerKey(hyphenate(event)))]
  }

  // 执行事件函数
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      ErrorCodes.COMPONENT_EVENT_HANDLER,
      args
    )
  }

  // 只允许被调用一次的事件
  const onceHandler = props[handlerName + `Once`]
  if (onceHandler) {
    // instance.emitted为null，需要设置为以个新的对象
    // 否则如果instance.emitted中如果存在handlerName，说明事件已经被调用过一次了
    if (!instance.emitted) {
      instance.emitted = {} as Record<any, boolean>
    } else if (instance.emitted[handlerName]) {
      return
    }
    // 设置instance.emitted[handlerName]为true，标记事件已经被调用过一次，之后不会在执行
    instance.emitted[handlerName] = true
    // 执行事件
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      ErrorCodes.COMPONENT_EVENT_HANDLER,
      args
    )
  }

  if (__COMPAT__) {
    compatModelEmit(instance, event, args)
    return compatInstanceEmit(instance, event, args)
  }
}
```

`emit`主要做一下几件事：
1. 处理`update:xxx`事件是否需要处理参数，如对参数进行`trim`及`toNumber`操作
2. 从`instance.vnode.props`中获取对应的监听事件，并执行
3. 处理使用`.once`修饰过的事件，对于这类事件，调用过一次后，会将其事件名缓存到`instance.emitted`中，防止之后再次调用
