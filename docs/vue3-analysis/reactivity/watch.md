# watch

::: tip
`watch`用来监听特定数据源，并在单独的回调函数中执行副作用。默认是惰性的——即回调仅在侦听源发生变化时被调用。

文件位置：`packages/runtime-core/src/apiWatch.ts`
:::

## 使用示例

监听一个`getter`函数：
```ts
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (newVal, oldVal) => {
    //... 
  }
)
```

监听一个`ref`：
```ts
const count = ref(0)
watch(
  count,
  (newVal, oldVal) => {
    //... 
  }
)
```

监听多个数据源：
```ts
const foo = ref('')
const bar = ref('')
watch(
  [ foo, bar ],
  ([ newFoo, newBar ], [ oldFoo, oldBar ]) => {
    // ...
  }
)
```

深度监听：
```ts
const state = reactive({ count: 0 })
watch(
  () => state,
  () => {
    // ...
  },
  { deep: true }
)

// or
watch(state, () => {
  // ...
})
```

## 源码分析

```ts
export function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>
): WatchStopHandle {
  if (__DEV__ && !isFunction(cb)) {
    warn(
      `\`watch(fn, options?)\` signature has been moved to a separate API. ` +
      `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
      `supports \`watch(source, cb, options?) signature.`
    )
  }
  return doWatch(source as any, cb, options)
}
```

`watch`接收三个参数：`source`监听的源、`cb`回调函数、`options`监听配置，`watch`函数返回一个停止监听函数。。

在`watch`中调用了一个叫做`doWatch`的函数，与`watch`作用相似的`watchEffect`、`watchPostEffect`、`watchSyncEffect`内部也都使用了这个`doWatch`函数。

```ts
export function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase
): WatchStopHandle {
  return doWatch(effect, null, options)
}

export function watchPostEffect(
  effect: WatchEffect,
  options?: DebuggerOptions
) {
  return doWatch(
    effect,
    null,
    (__DEV__
      ? Object.assign(options || {}, { flush: 'post' })
      : { flush: 'post' }) as WatchOptionsBase
  )
}

export function watchSyncEffect(
  effect: WatchEffect,
  options?: DebuggerOptions
) {
  return doWatch(
    effect,
    null,
    (__DEV__
      ? Object.assign(options || {}, { flush: 'sync' })
      : { flush: 'sync' }) as WatchOptionsBase
  )
}
```

可见`doWatch`是`watch API`的核心，接下来重点研究`doWatch`的实现。

### doWatch

`doWatch`源码过长，这里就不搬运了，在分析过程中，会展示相关代码。

`doWatch`函数接收三个参数：`source`监听的数据源，`cb`回调函数，`options`：监听配置。`doWatch`返回一个停止监听函数。

```ts
function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  { immediate, deep, flush, onTrack, onTrigger }: WatchOptions = EMPTY_OBJ
): WatchStopHandle {
  // ...
}
```

首先需要对`immediate`、`deep`做校验，如果`cb`为`null`，`immediate`、`deep`不为`undefined`进行提示。
```ts
if (__DEV__ && !cb) {
  if (immediate !== undefined) {
    warn(
      `watch() "immediate" option is only respected when using the ` +
        `watch(source, callback, options?) signature.`
    )
  }
  if (deep !== undefined) {
    warn(
      `watch() "deep" option is only respected when using the ` +
        `watch(source, callback, options?) signature.`
    )
  }
}
```

紧接着声明了一些变量：
```ts
const warnInvalidSource = (s: unknown) => {
  warn(
    `Invalid watch source: `,
    s,
    `A watch source can only be a getter/effect function, a ref, ` +
      `a reactive object, or an array of these types.`
  )
}

// 当前组件实例
const instance = currentInstance
// 副作用函数，在初始化effect时使用
let getter: () => any
// 强制触发监听
let forceTrigger = false
// 是否为多数据源。
let isMultiSource = false
```

然后根据传入的`soure`确定`getter`、`forceTrigger`、`isMultiSource`。这里分了5个分支：

- 如果`source`是`ref`类型，`getter`是个返回`source.value`的函数，`forceTrigger`取决于`source`是否是浅层响应式。
```ts
if (isRef(source)) {
  getter = () => source.value
  forceTrigger = isShallow(source)
}
```
- 如果`source`是`reactive`类型，`getter`是个返回`source`的函数，并将`deep`设置为`true`。
```ts
if (isReactive(source)) {
  getter = () => source
  deep = true
}
```
- 如果`source`是个数组，将`isMultiSource`设为`true`，`forceTrigger`取决于`source`是否有`reactive`类型的数据，`getter`函数中会遍历`source`，针对不同类型的`source`做不同处理。
```ts
if (isArray(source)) {
  isMultiSource = true
  forceTrigger = source.some(isReactive)
  getter = () =>
    source.map(s => {
      if (isRef(s)) {
        return s.value
      } else if (isReactive(s)) {
        return traverse(s)
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, ErrorCodes.WATCH_GETTER)
      } else {
        __DEV__ && warnInvalidSource(s)
      }
    })
}
```
- 如果`source`是个`function`。存在`cb`的情况下，`getter`函数中会执行`source`，这里`source`会通过`callWithErrorHandling`函数执行，在`callWithErrorHandling`中会处理`source`执行过程中出现的错误；不存在`cb`的话，在`getter`中，如果组件已经被卸载了，直接`return`，否则判断`cleanup`（`cleanup`是在`watchEffect`中通过`onCleanup`注册的清理函数），如果存在`cleanup`执行`cleanup`，接着执行`source`，并返回执行结果。`source`会被`callWithAsyncErrorHandling`包装，该函数作用会处理`source`执行过程中出现的错误，与`callWithErrorHandling`不同的是，`callWithAsyncErrorHandling`会处理异步错误。
```ts
if (isFunction(source)) {
  if (cb) {
    getter = () =>
      callWithErrorHandling(source, instance, ErrorCodes.WATCH_GETTER)
  } else {
    // watchEffect
    getter = () => {
      // 如果组件实例已经卸载，直接return
      if (instance && instance.isUnmounted) {
        return
      }
      // 如果清理函数，则执行清理函数
      if (cleanup) {
        cleanup()
      }
      // 执行source，传入onCleanup，用来注册清理函数
      return callWithAsyncErrorHandling(
        source,
        instance,
        ErrorCodes.WATCH_CALLBACK,
        [onCleanup]
      )
    }
  }
}
```

`callWithErrorHandling`函数可以接收四个参数：`fn`待执行的函数、`instance`组件实例、`type`fn执行过程中出现的错误类型、`args`fn执行所需的参数。
```ts
export function callWithErrorHandling(
  fn: Function,
  instance: ComponentInternalInstance | null,
  type: ErrorTypes,
  args?: unknown[]
) {
  let res
  try {
    res = args ? fn(...args) : fn()
  } catch (err) {
    handleError(err, instance, type)
  }
  return res
}
```

`callWithAsyncErrorHandling`的参数与`callWithErrorHandling`类似，与`callWithErrorHandling`不同的是，`callWithAsyncErrorHandling`可以接受一个`fn`数组。
```ts
export function callWithAsyncErrorHandling(
  fn: Function | Function[],
  instance: ComponentInternalInstance | null,
  type: ErrorTypes,
  args?: unknown[]
): any[] {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args)
    if (res && isPromise(res)) {
      res.catch(err => {
        handleError(err, instance, type)
      })
    }
    return res
  }

  const values = []
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args))
  }
  return values
}
```
- 其他情况，`getter`会被赋为一个空函数
```ts
getter = NOOP
__DEV__ && warnInvalidSource(source)
```

接下来会对`vue2`的数组的进行兼容性处理，[breaking-changes/watch](https://v3-migration.vuejs.org/breaking-changes/watch.html)
```ts
if (__COMPAT__ && cb && !deep) {
  const baseGetter = getter
  getter = () => {
    const val = baseGetter()
    if (
      isArray(val) &&
      checkCompatEnabled(DeprecationTypes.WATCH_ARRAY, instance)
    ) {
      traverse(val)
    }
    return val
  }
}
```

如果存在`cb`并且`deep`为`true`，那么需要对数据进行深度监听，这时，会重新对`getter`赋值，在新的`getter`函数中递归访问之前`getter`的返回结果。
```ts
if (cb && deep) {
  const baseGetter = getter
  getter = () => traverse(baseGetter())
}
```

`traverse`实现，递归遍历所有属性，`seen`用于防止循环引用问题。
```ts
export function traverse(value: unknown, seen?: Set<unknown>) {
  // 如果value不是对象或value不可被转为代理（经过markRaw处理），直接return value
  if (!isObject(value) || (value as any)[ReactiveFlags.SKIP]) {
    return value
  }
  // sean用于暂存访问过的属性，防止出现循环引用的问题
  // 如：
  // const obj = { a: 1 }
  // obj.b = obj
  seen = seen || new Set()
  // 如果seen中已经存在了value，意味着value中存在循环引用的情况，这时return value
  if (seen.has(value)) {
    return value
  }
  // 添加value到seen中
  seen.add(value)
  // 如果是ref，递归访问value.value
  if (isRef(value)) {
    traverse(value.value, seen)
  } else if (isArray(value)) { // 如果是数组，遍历数组并调用traverse递归访问元素内的属性
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen)
    }
  } else if (isSet(value) || isMap(value)) { // 如果是Set或Map，调用traverse递归访问集合中的值
    value.forEach((v: any) => {
      traverse(v, seen)
    })
  } else if (isPlainObject(value)) { // 如果是原始对象，调用traverse递归方位value中的属性
    for (const key in value) {
      traverse((value as any)[key], seen)
    }
  }
  // 最后需要返回value
  return value
}
```

到此，`getter`函数（`getter`函数中会尽可能访问响应式数据，尤其是`deep`为`true`并存在`cb`的情况时，会调用`traverse`完成对`source`的递归属性访问）、`forceTrigger`、`isMultiSource`已经被确定，接下来声明了两个变量：`cleanup`、`onCleanup`。`onCleanup`会作为参数传递给`watchEffect`中的`effect`函数。当`onCleanup`执行时，会将他的参数通过`callWithErrorHandling`封装赋给`cleanup`及`effect.onStop`（`effect`在后文中创建）。
```ts
let cleanup: () => void
let onCleanup: OnCleanup = (fn: () => void) => {
  cleanup = effect.onStop = () => {
    callWithErrorHandling(fn, instance, ErrorCodes.WATCH_CLEANUP)
  }
}
```

紧接着是一段`SSR`处理过程：
```ts
if (__SSR__ && isInSSRComponentSetup) {
  // we will also not call the invalidate callback (+ runner is not set up)
  onCleanup = NOOP
  if (!cb) {
    getter()
  } else if (immediate) {
    callWithAsyncErrorHandling(cb, instance, ErrorCodes.WATCH_CALLBACK, [
      getter(),
      isMultiSource ? [] : undefined,
      onCleanup
    ])
  }
  return NOOP
}
```

然后声明了一个`oldValue`和`job`变量。如果是多数据源`oldValue`是个数组，否则是个对象。

`job`函数的作用是触发`cb`(`watch`)或执行`effect.run`(`watchEffect`)。`job`函数中会首先判断`effect`的激活状态，如果未激活，则`return`。然后判断如果存在`cb`，调用`effet.run`获取最新值，下一步就是触发`cb`，这里触发`cb`需要满足以下条件的任意一个条件即可：
1. 深度监听`deep===true`
2. 强制触发`forceTrigger===true`
3. 如果多数据源，`newValue`中存在与`oldValue`中的值不相同的项（利用`Object.is`判断）；如果不是多数据源，`newValue`与`oldValue`不相同。
4. 开启了`vue2`兼容模式，并且`newValue`是个数组，并且开启了[WATCH_ARRAY](https://v3-migration.vuejs.org/migration-build.html#fully-compatible)

只要符合上述条件的任意一条，便可已触发`cb`，在触发`cb`之前会先调用`cleanup`函数。执行完`cb`后，需要将`newValue`赋值给`oldValue`。

如果不存在`cb`，那么直接调用`effect.run`即可。
```ts
let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE
const job: SchedulerJob = () => {
  if (!effect.active) {
    return
  }
  if (cb) {
    const newValue = effect.run()
    if (
      deep ||
      forceTrigger ||
      (isMultiSource
        ? (newValue as any[]).some((v, i) =>
          hasChanged(v, (oldValue as any[])[i])
        )
        : hasChanged(newValue, oldValue)) ||
      (__COMPAT__ &&
        isArray(newValue) &&
        isCompatEnabled(DeprecationTypes.WATCH_ARRAY, instance))
    ) {
      if (cleanup) {
        cleanup()
      }
      callWithAsyncErrorHandling(cb, instance, ErrorCodes.WATCH_CALLBACK, [
        newValue,
        // 如果oldValue为INITIAL_WATCHER_VALUE，说明是第一次watch，那么oldValue是undefined
        oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
        onCleanup
      ])
      oldValue = newValue
    }
  } else {
    effect.run()
  }
}
job.allowRecurse = !!cb
```

接下来声明了一个调度器`scheduler`，在`scheduler`中会根据`flush`的不同决定`job`的触发时机：
```ts
let scheduler: EffectScheduler
if (flush === 'sync') {
  scheduler = job as any 
} else if (flush === 'post') {
  // 延迟执行，将job添加到一个延迟队列，这个队列会在组件挂在后、更新的生命周期中执行
  scheduler = () => queuePostRenderEffect(job, instance && instance.suspense)
} else {
  // 默认 pre，将job添加到一个优先执行队列，该队列在挂载前执行
  scheduler = () => {
    if (!instance || instance.isMounted) {
      queuePreFlushCb(job)
    } else {
      job()
    }
  }
}
```

此时，`getter`与`scheduler`准备完成，创建`effect`实例。
```ts
const effect = new ReactiveEffect(getter, scheduler)
```

创建`effect`实例后，开始首次执行副作用函数。这里针对不同情况有多个分支：
- 如果存在`cb`的情况
  - 如果`immediate`为`true`，执行`job`，触发`cb`
  - 否则执行`effect.run()`进行依赖的收集，并将结果赋值给`oldValue`
- 如果`flush===post`，会将`effect.run`推入一个延迟队列中
- 其他情况，也就是`watchEffect`，则会执行`effect.run`进行依赖的收集

```ts
if (cb) {
  if (immediate) {
    job()
  } else {
    oldValue = effect.run()
  }
} else if (flush === 'post') {
  queuePostRenderEffect(
    effect.run.bind(effect),
    instance && instance.suspense
  )
} else {
  effect.run()
}
```

最后，返回一个函数，这个函数的作用是停止`watch`对数据源的监听。在函数内部调用`effect.stop()`将`effect`置为失活状态，如果存在组件实例，并且组件示例中存在`effectScope`，那么需要将`effect`从`effectScope`中移除。
```ts
return () => {
  effect.stop()
  if (instance && instance.scope) {
    remove(instance.scope.effects!, effect)
  }
}
```

## watchEffect、watchSyncEffect、watchPostEffect
`watchEffect`、`watchSyncEffect`、`watchPostEffect`的实现均是通过`doWatch`实现。

```ts
export function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase
): WatchStopHandle {
  return doWatch(effect, null, options)
}

export function watchPostEffect(
  effect: WatchEffect,
  options?: DebuggerOptions
) {
  return doWatch(
    effect,
    null,
    (__DEV__
      ? Object.assign(options || {}, { flush: 'post' })
      : { flush: 'post' }) as WatchOptionsBase
  )
}

export function watchSyncEffect(
  effect: WatchEffect,
  options?: DebuggerOptions
) {
  return doWatch(
    effect,
    null,
    (__DEV__
      ? Object.assign(options || {}, { flush: 'sync' })
      : { flush: 'sync' }) as WatchOptionsBase
  )
}
```

## watch与watchEffect的区别
`watch`只会追踪在`source`中明确的数据源，不会追踪回调函数中访问到的东西。而且只在数据源发生变化后触发回调。`watch`会避免在发生副作用时追踪依赖（当发生副作用时，会执行调度器，在调度器中会将`job`推入不同的任务队列，达到控制回调函数的触发时机的目的），因此，我们能更加精确地控制回调函数的触发时机。

`watchEffect`，会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式`property`

## 示例分析

为了更好地理解`watch`及`watchEffect`的流程，我们以下面几个例子来理解`watch`及`watchEffect`。

**例1**
```ts
const state = reactive({ str: 'foo', obj: { num: 1 } })
const flag = ref(true)

watch(
  [ flag, () => state.obj ],
  ([ newFlag, newObj ], [ oldFlag, oldObj ]) => {
    console.log(newFlag)
    console.log(newObj.num)
    console.log(oldFlag)
    console.log(oldObj && oldObj.num)
  },
  {
    immediate: true,
    flush: 'sync'
  }
)

state.obj.num = 2

state.obj = {
  num: 2
}
```

在`watch`中调用`doWatch`方法，在`doWatch`会构造`getter`函数，因为所监听的数据源是个数组，所以`getter`函数返回值也是个数组，因为数据源的第一项是个`ref`，所以`getter`返回值第一项是`ref.value`，数据源的第二项是个`function`，所以`getter`返回值第二项是`() => state.obj`的返回值，也就是`state.obj`，由于我们未指定`depp`，最终生成的`getter`是`() => [ref.value, state.obj]`。

然后利用`getter`与`scheduler`生成`effect`，因为我们指定了`immediate: true`，所以会立即执行`job`函数，在`job`函数中，会执行`effect.run()`（这个过程中最终执行`getter`函数，而在执行`getter`函数的过程中会被对应响应式对象的`proxy`所拦截，进而收集依赖），然后将`effect.run()`的结果赋值给`newValue`。然后对位比较`newValue`与`oldValue`中的元素，因为`oldValue`此时是个空数组，所以会触发`cb`，在`cb`触发过程中将`newValue`、`oldValue`依次传入，此时打印`true 1 undefined undefined`，当`cb`执行完，将`newValue`赋值为`oldValue`。

当执行`state.obj.num = 2`时。因为在上一次的依赖收集过程中（也就是`getter`执行过程中），并没有访问到`num`属性，也就不会收集它的依赖，所以该步骤不会影响到`watch`。

当`state.obj = { num: 2 }`时，会触发到`obj`对应的依赖，而在依赖触发过程中会执行调度器，因为`flush`为`sync`，所以调度器就是`job`，当执行`job`时，通过`effect.run()`得到`newValue`，因为这时`oldValue`中的`state.value`与`newValue`中的`state.value`已经不是同一个对象了，所以触发`cb`。打印`true 2 true 2`。

为什么第二次打印`newObj.num`与`oldObj.num`相同？因为`oldValue`中的`oldObj`保存的是`state.obj`的引用地址，一旦`state.obj`发生改变，`oldValue`也会对应改变。

**例2**
```ts
const state = reactive({ str: 'foo', obj: { num: 1 } })
const flag = ref(true)

watchEffect(() => {
  console.log(flag.value)
  console.log(state.obj.num)
})


state.obj.num = 2

state.obj = {
  num: 3
}
```
与例1相同，例2先生成`getter`（`getter`中会调用`source`）与`scheduler`，然后生成`effect`。因为`watchEffect`是没有`cb`参数，也未指定`flush`，所以会直接执行`effct.run()`。在`effect.run`执行过程中，会调用`source`，在`source`执行过程中会将`effect`收集到`flag.dep`及`targetMap[toRaw(state)].obj`、`targetMap[toRaw(state).obj].num`中。所以第一次打印`true 1`。

当执行`state.obj.num = 2`，会触发`targetMap[toRaw(state).obj].num`中的依赖，也就是`effect`，在触发依赖过程中会执行`effect.scheduler`，将`job`推入一个`pendingPreFlushCbs`队列中。

当执行`state.obj = { num: 3 }`，会触发`targetMap[toRaw(state)].obj`中的依赖，也就是`effect`，在触发依赖过程中会执行`effect.scheduler`，将`job`推入一个`pendingPreFlushCbs`队列中。

最后会执行`pendingPreFlushCbs`队列中的`job`，在执行之前会对`pendingPreFlushCbs`进行去重，也就是说最后只会执行一个`job`。最终打印`true 3`。

## 总结

`watch`、`watchEffect`、`watchSyncEffect`、`watchPostEffect`的实现均是通过一个`doWatch`函数实现。

`dowatch`中会首先生成一个`getter`函数。如果是`watch`API，那么这个`getter`函数中会根据传入参数，访问监听数据源中的属性（可能会递归访问对象中的属性，取决于`deep`），并返回与数据源数据类型一致的数据（如果数据源是`ref`类型，`getter`函数返回`ref.value`；如果数据源类型是`reactive`，`getter`函数返回值也是`reactive`；如果数据源是数组，那么`getter`函数返回值也应该是数组；如果数据源是函数类型，那么`getter`函数返回值是数据源的返回值）。如果是`watchEffect`等API，那么`getter`函数中会执行`source`函数。

然后定义一个`job`函数。如果是`watch`，`job`函数中会执行`effect.run`获取新的值，并比较新旧值，是否执行`cb`；如果是`watchEffect`等API，`job`中执行`effect.run`。那么如何只监听到`state.obj.num`的变换呢？

当声明完`job`，会紧跟着定义一个调度器，这个调度器的作用是根据`flush`将`job`放到不同的任务队列中。

然后根据`getter`与`调度器`scheduler`初始化一个`ReactiveEffect`实例。

接着进行初始化：如果是`watch`，如果是立即执行，则马上执行`job`，否则执行`effect.run`更新`oldValue`；如果`flush`是`post`，会将`effect.run`函数放到延迟队列中延迟执行；其他情况执行`effect.run`。

最后返回一个停止`watch`的函数。
