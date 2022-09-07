# scheduler

`scheduler`即调度器是`vue3`中比较重要的一个概念。通过`scheduler`进行调度任务（`job`），保证了`vue`中相关`API`及生命周期函数、组件渲染顺序的正确性。

我们知道，使用`watchEffect`进行侦听数据源时，侦听器将会在组件渲染之前执行；`watchSyncEffect`进行侦听数据源时，侦听器在依赖发生变化后立即执行；而`watchPostEffect`进行侦听数据源时，侦听器会在组件渲染后才执行。针对不同的侦听器的执行顺序，就是通过`scheduler`进行统一调度而实现的。

## scheduler的实现

在`scheduler`中主要通过三个队列实现任务调度，这三个对列分别为：

- `pendingPreFlushCbs`：组件更新前置任务队列
- `queue`：组件更新任务队列
- `pendingPostFlushCbs`：组件更新后置任务队列

如何使用这几个队列？`vue`中有三个方法分别用来进行对`pendingPreFlushCbs`、`queue`、`pendingPostFlushCbs`入队操作。

```ts
// 前置任务队列入队
export function queuePreFlushCb(cb: SchedulerJob) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex)
}

// 后置任务队列入队
export function queuePostFlushCb(cb: SchedulerJobs) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex)
}

function queueCb(
  cb: SchedulerJobs,
  activeQueue: SchedulerJob[] | null,
  pendingQueue: SchedulerJob[],
  index: number
) {
  // 如果cb不是数组
  if (!isArray(cb)) {
    // 激活队列为空或cb不在激活队列中，需要将cb添加到对应队列中
    if (
      !activeQueue ||
      !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)
    ) {
      pendingQueue.push(cb)
    }
  }
  // cb是数组
  else {
    // 如果 cb 是一个数组，那么它是一个组件生命周期钩子
    // 其已经被去重了，因此我们可以在此处跳过重复检查以提高性能
    pendingQueue.push(...cb)
  }
  queueFlush()
}

// queue队列入队
export function queueJob(job: SchedulerJob) {
  // 当满足以下情况中的一种才可以入队
  // 1. queue长度为0
  // 2. queue中不存在job（如果job是watch()回调，搜索从flushIndex + 1开始，否则从flushIndex开始），并且job不等于currentPreFlushParentJob
  if (
    (!queue.length ||
      !queue.includes(
        job,
        isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
      )) &&
    job !== currentPreFlushParentJob
  ) {
    // job.id为null直接入队
    if (job.id == null) {
      queue.push(job)
    } else {
      // 插队，插队后queue索引区间[flushIndex + 1, end]内的job.id是非递减的
      // findInsertionIndex方法通过二分法寻找[flushIndex + 1, end]区间内大于等于job.id的第一个索引
      queue.splice(findInsertionIndex(job.id), 0, job)
    }
    queueFlush()
  }
}
```

三个队列的入队几乎是相似的，都不允许队列中存在重复`job`（从队列的`flushIndex`或`flushIndex + 1`开始搜索）。不同的是`queue`允许插队。

### queueFlush
`job`入队后，会调用一个`queueFlush`函数：

```ts
function queueFlush() {
  // isFlushing表示是否正在执行队列
  // isFlushPending表示是否正在等待执行队列
  // 如果此时未在执行队列也没有正在等待执行队列，则需要将isFlushPending设置为true，表示队列进入等待执行状态
  // 同时在下一个微任务队列执行flushJobs，即在下一个微任务队列执行队列
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}
```

**为什么需要将flushJobs放入下一个微任务队列，而不是宏任务队列？**

首先微任务比宏任务有更高的优先级，当同时存在宏任务和微任务时，会先执行全部的微任务，然后再执行宏任务，这说明通过微任务，可以将`flushJobs`尽可能的提前执行。如果使用宏任务，如果在`queueJob`之前有多个宏任务，则必须等待这些宏任务执行完后，才能执行`queueJob`，这样以来`flushJobs`的执行就会非常靠后。

### flushJobs

在`flushJobs`中会依次执行`pendingPreFlushCbs`、`queue`、`pendingPostFlushCbs`中的任务，如果此时还有剩余`job`，则继续执行`flushJobs`，知道将三个队列中的任务都执行完。

```ts
function flushJobs(seen?: CountMap) {
  // 将isFlushPending置为false，isFlushing置为true
  // 因为此时已经要开始执行队列了
  isFlushPending = false
  isFlushing = true
  if (__DEV__) {
    seen = seen || new Map()
  }

  // 执行前置任务队列
  flushPreFlushCbs(seen)

  // queue按job.id升序排列
  // 这可确保：
  // 1. 组件从父组件先更新然后子组件更新。（因为 parent 总是在 child 之前创建，所以它的redner effect会具有较高的优先级） 
  // 2. 如果在 parent 组件更新期间卸载组件，则可以跳过其更新
  queue.sort((a, b) => getId(a) - getId(b))

  // 用于检测是否是无限递归，最多 100 层递归，否则就报错，只会开发模式下检查
  const check = __DEV__
    ? (job: SchedulerJob) => checkRecursiveUpdates(seen!, job)
    : NOOP

  try {
    // 执行queue中的任务
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]
      if (job && job.active !== false) {
        if (__DEV__ && check(job)) {
          continue
        }
        callWithErrorHandling(job, null, ErrorCodes.SCHEDULER)
      }
    }
  } finally {
    // 清空queue并将flushIndex重置为0
    flushIndex = 0
    queue.length = 0
    
    // 执行后置任务队列
    flushPostFlushCbs(seen)
    
    // 将isFlushing置为false，说明此时任务已经执行完
    isFlushing = false
    currentFlushPromise = null
    // 执行剩余job
    // post队列执行过程中可能有job加入，继续调用flushJobs执行剩余job
    if (
      queue.length ||
      pendingPreFlushCbs.length ||
      pendingPostFlushCbs.length
    ) {
      flushJobs(seen)
    }
  }
}
```

### flushPreFlushCbs

`flushPreFlushCbs`用来执行`pendingPreFlushCbs`中的`job`。

```ts
export function flushPreFlushCbs(
  seen?: CountMap,
  parentJob: SchedulerJob | null = null
) {
  // 有job才执行
  if (pendingPreFlushCbs.length) {
    // 赋值父job
    currentPreFlushParentJob = parentJob
    // 去重并将队列赋值给activePreFlushCbs
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
    // 清空pendingPreFlushCbs
    pendingPreFlushCbs.length = 0
    if (__DEV__) {
      seen = seen || new Map()
    }
    // 循环执行job
    for (
      preFlushIndex = 0;
      preFlushIndex < activePreFlushCbs.length;
      preFlushIndex++
    ) {
      if (
        __DEV__ &&
        checkRecursiveUpdates(seen!, activePreFlushCbs[preFlushIndex])
      ) {
        continue
      }
      activePreFlushCbs[preFlushIndex]()
    }
    // 执行完毕后将activePreFlushCbs重置为null、preFlushIndex重置为0、currentPreFlushParentJob重置为null
    activePreFlushCbs = null
    preFlushIndex = 0
    currentPreFlushParentJob = null
    // 递归flushPreFlushCbs，直到pendingPreFlushCbs为空停止
    flushPreFlushCbs(seen, parentJob)
  }
}
```

### flushPostFlushCbs

```ts
export function flushPostFlushCbs(seen?: CountMap) {
  // flush any pre cbs queued during the flush (e.g. pre watchers)
  flushPreFlushCbs()
  // 存在job才执行
  if (pendingPostFlushCbs.length) {
    // 去重
    const deduped = [...new Set(pendingPostFlushCbs)]
    // 清空pendingPostFlushCbs
    pendingPostFlushCbs.length = 0

    // #1947 already has active queue, nested flushPostFlushCbs call
    // 已经存在activePostFlushCbs，嵌套flushPostFlushCbs调用，直接return
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped)
      return
    }

    activePostFlushCbs = deduped
    if (__DEV__) {
      seen = seen || new Map()
    }
    
    // 按job.id升序
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b))

    // 循环执行job
    for (
      postFlushIndex = 0;
      postFlushIndex < activePostFlushCbs.length;
      postFlushIndex++
    ) {
      if (
        __DEV__ &&
        checkRecursiveUpdates(seen!, activePostFlushCbs[postFlushIndex])
      ) {
        continue
      }
      activePostFlushCbs[postFlushIndex]()
    }
    // 重置activePostFlushCbs及、postFlushIndex
    activePostFlushCbs = null
    postFlushIndex = 0
  }
}
```

## nextTick

```ts
export function nextTick<T = void>(
  this: T,
  fn?: (this: T) => void
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```

`nextTick`会在`flushJobs`执行完成后才会执行，组件的更新及`onUpdated`、`onMounted`等某些生命周期钩子会在`nextTick`之前执行。所以在`nextTick.then`中可以获取到最新的`DOM`。

## 哪些操作会交给调度器进行调度？

1. `watchEffect`、`watchPostEffect`，分别会将侦听器的执行加入到前置任务队列与后置任务队列。

```ts
function doWatch() {
  // ...
  const job: SchedulerJob = () => {
    if (!effect.active) {
      return
    }
    if (cb) {
      // watch(source, cb)
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
        // cleanup before running cb again
        if (cleanup) {
          cleanup()
        }
        callWithAsyncErrorHandling(cb, instance, ErrorCodes.WATCH_CALLBACK, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
          onCleanup
        ])
        oldValue = newValue
      }
    } else {
      // watchEffect
      effect.run()
    }
  }
  
  if (flush === 'sync') {
    scheduler = job as any // the scheduler function gets called directly
  } else if (flush === 'post') {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense)
  } else {
    // default: 'pre'
    scheduler = () => queuePreFlushCb(job)
  }

  const effect = new ReactiveEffect(getter, scheduler)
  
  // ...
}
```

2. 组件的更新函数：

```ts
const setupRenderEffect = () => {
  // ...

  const componentUpdateFn = () => {
    //... 
  }

  const effect = (instance.effect = new ReactiveEffect(
    componentUpdateFn,
    () => queueJob(update),
    instance.scope
  ))

  const update: SchedulerJob = (instance.update = () => effect.run())
  update.id = instance.uid
  
  // ...
}
```

3. `onMounted`、`onUpdated`、`onUnmounted`、`Transition`的`enter`钩子等一些钩子函数会被放到后置任务队列

```ts
export const queuePostRenderEffect = __FEATURE_SUSPENSE__
  ? queueEffectWithSuspense
  : queuePostFlushCb

const mountElement = () => {
  // ...

  if (
    (vnodeHook = props && props.onVnodeMounted) ||
    needCallTransitionHooks ||
    dirs
  ) {
    queuePostRenderEffect(() => {
      vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode)
      needCallTransitionHooks && transition!.enter(el)
      dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted')
    }, parentSuspense)
  }
}

const patchElement = () => {
  // ...

  if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
    queuePostRenderEffect(() => {
      vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1)
      dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated')
    }, parentSuspense)
  }
}
```

## 总结

`scheduler`通过三个队列实现，在`vue`只需通过调用`queuePreFlushCb`、`queuePostFlushCb`、`queueJob`方法将`job`添加到对应队列中，不需要手动控制`job`的执行时机，完全将`job`的执行时机交给了`scheduler`进行调度。

三个队列的特点：

|           | `pendingPreFlushCbs` | `queue`                          | `pendingPostFlushCbs`                     |
|-----------|----------------------|----------------------------------|-------------------------------------------|
| 执行时机      | DOM更新前               | `queue`中的`job`就包含组件的更新           | DOM更新后                                    |
| 是否允许插队    | 不允许                  | 允许                               |                   不允许                        |
| `job`执行顺序 | 按入队顺序执行，先进先出         | 按`job.id`升序顺序执行`job`。保证父子组件的更新顺序 | 按`job.id`升序顺序执行`job`|

`scheduler`中通过`Promise.resolve()`将队列中`job`的执行（即`flushJobs`）放入到下一个微任务队列中，而`nextTick.then`中回调的执行又会被放到下一个微任务队列。等到`nextTick.then`中回调的执行，队列中的`job`已经执行完毕，此时`DOM`已经更新完毕，所以在`nextTick.then`中就可以获取到更新后的`DOM`。
