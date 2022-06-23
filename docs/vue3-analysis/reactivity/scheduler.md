# scheduler

::: tip
在前文分析`watch`的过程中，我们知道在`effect`的调度器中会将`job`推入不同的任务队列，以在不同时机执行`job`函数。本文将深入分析`job`的执行时机。
:::

在`watch`中，会根据`flush`对`scheduler`进行不同处理。如果`flush`是`sync`，代表同步，那么`scheduler`就是`job`，在依赖触发时，会直接执行`job`；如果`scheduler`是`post`，在依赖触发时，会调用一个`queuePostRenderEffect`函数；而默认情况，在依赖触发时，会根据当前有无组件实例，进行不同操作。
```ts
if (flush === 'sync') {
    scheduler = job as any
  } else if (flush === 'post') {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense)
  } else {
    scheduler = () => {
      if (!instance || instance.isMounted) {
        queuePreFlushCb(job)
      } else {
        job()
      }
    }
  }
```

## queuePostRenderEffect

```ts
export const queuePostRenderEffect = __FEATURE_SUSPENSE__
  ? queueEffectWithSuspense
  : queuePostFlushCb
```

如果开启了`__FEATURE_SUSPENSE__`了，`queuePostRenderEffect`是`queueEffectWithSuspense`，否则是`queuePostFlushCb`。这里为了方便理解，我们只看`queuePostFlushCb`。

## queuePostFlushCb
```ts
export function queuePostFlushCb(cb: SchedulerJobs) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex)
}
```

`queuePostFlushCb`接收一个`SchedulerJobs`类型`cb`参数，对于`SchedulerJobs`的定义：
```ts
export interface SchedulerJob extends Function {
  // 一个标识
  id?: number
  // 是否为激活状态
  active?: boolean
  computed?: boolean
  allowRecurse?: boolean
  ownerInstance?: ComponentInternalInstance
}

export type SchedulerJobs = SchedulerJob | SchedulerJob[]
```

在`queuePostFlushCb`内部调用了一个`queueCb`方法，并传入了四个变量，其中第一个是`queuePostFlushCb`的参数，而后三个是全局变量
```ts
const pendingPostFlushCbs: SchedulerJob[] = []
let activePostFlushCbs: SchedulerJob[] | null = null
let postFlushIndex = 0
```

接着看`queueCb`

## queueCb
```ts
function queueCb(
  cb: SchedulerJobs,
  activeQueue: SchedulerJob[] | null,
  pendingQueue: SchedulerJob[],
  index: number
) {
  if (!isArray(cb)) {
    if (
      !activeQueue ||
      !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)
    ) {
      pendingQueue.push(cb)
    }
  } else {
    pendingQueue.push(...cb)
  }
  queueFlush()
}
```

`queueCb`函数接收四个参数：`cb`、`activeQueue`（激活的队列）、`pendingQueue`（等待中的队列）、`index`（一个索引）,

如果`cb`是数组，会将`cb`解构放入`pendingQueue`中；否则判断是否传入`activeQueue`或`activeQueue`中是否已经存在`cb`（如果`cb.allowRecurse`为`true`，从`index+1`处开始寻找，否则从`index`处开始寻找）。最后执行一个`queueFlush`函数。

## queueFlush

```ts
// 当前是否有正在执行的任务
let isFlushing = false
// 当前是否有正在等待执行的任务
let isFlushPending = false

function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    // 正在执行的promise
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}
```

`queueFlush`中的逻辑比较简单。如果没有正在执行的任务并且也没有正在等待中的任务，则将`isFlushPending`置为`true`，同时将`flushJobs`放入一个微任务队列。


## flushJobs
```ts
function flushJobs(seen?: CountMap) {
  // 将isFlushPending置为false，因为已经进入执行任务中的状态
  isFlushPending = false
  // 正在执行任务
  isFlushing = true
  if (__DEV__) {
    seen = seen || new Map()
  }

  // 执行pendingPreFlushCbs中的任务
  flushPreFlushCbs(seen)

  // 将queue按job.id升序
  queue.sort((a, b) => getId(a) - getId(b))

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
    // 重置flushIndex
    flushIndex = 0
    // 清空queue
    queue.length = 0

    // 执行pendingPostFlushCbs中的任务
    flushPostFlushCbs(seen)

    // 当前没有正在执行的任务
    isFlushing = false
    currentFlushPromise = null
    // 执行剩余任务
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

在`flushJobs`中会依次执行`pendingPreFlushCbs`、`queue`、`pendingPostFlushCbs`中的任务。

再来看`queuePreFlushCb`。

## queuePreFlushCb
```ts
const pendingPreFlushCbs: SchedulerJob[] = []
let activePreFlushCbs: SchedulerJob[] | null = null
let preFlushIndex = 0

export function queuePreFlushCb(cb: SchedulerJob) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex)
}
```

`queuePreFlushCb`方法会将`cb`放入一个`pendingPreFlushCbs`数组。

通过前文我们知道最终`pendingPreFlushCbs`、`queue`、`pendingPostFlushCbs`会按顺序依次执行，`pendingPreFlushCbs`中保存的是`flush===pre`时的`job`，`pendingPostFlushCbs`中保存的是`flush===post`时的`job`。那么`queue`中是什么呢？`queue`中保存的组件的更新函数。

```ts
const effect = (instance.effect = new ReactiveEffect(
  componentUpdateFn,
  () => queueJob(instance.update),
  instance.scope
))
```

## queueJob
```ts
export function queueJob(job: SchedulerJob) {
  // queue.length为0或queue中不存在job，并且job不等于currentPreFlushParentJob
  if (
    (!queue.length ||
      !queue.includes(
        job,
        isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
      )) &&
    job !== currentPreFlushParentJob
  ) {
    if (job.id == null) {
      queue.push(job)
    } else {
      // 替换重复id的job
      queue.splice(findInsertionIndex(job.id), 0, job)
    }
    queueFlush()
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
  // 将fn加入到一个微任务队列，它会在p执行完之后执行
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```

在每次向`pendingPreFlushCbs`、`queue`、`pendingPostFlushCbs`中放入任务时，都会执行`queueFlush()`方法，`queueFlush`方法会更新`currentFlushPromise`为最新的`promise`。所以使用`nextTick`传入的函数会在`flushJobs`之后执行。
