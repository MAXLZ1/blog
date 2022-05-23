# isReady

::: tip
当路由器完成初始化导航时，返回一个`Promise`。这意味着它已经解析了所有与初始路由相关的异步输入钩子和异步组件。如果初始导航已经发生了，那么 promise 就会立即解析。
:::

`isReady`不接受任何参数。如果路由器已经完成了初始化导航，那么会立即解析`Promise`，相反如果还没有完成初始化导航，那么会将`resolve`和`reject`放入一个数组中，并添加到一个列表中，等待初始化导航完成进行触发。

```ts
let readyHandlers = useCallbacks<OnReadyCallback>()

function isReady(): Promise<void> {
  // ready为true并且当前路由不是初始路由，导航已经初始化完毕，立即解析promise
  if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
    return Promise.resolve()
  // 相反，会将resolve、reject存入一个列表
  return new Promise((resolve, reject) => {
    readyHandlers.add([resolve, reject])
  })
}
```

在之前解析的[push过程](https://maxlz1.github.io/blog/vue-router/push.html)中，无论过程中是否有错误信息，都会执行一个`markAsReady`函数。在`markAsReady`中会将`isReady`处理函数进行触发，触发完毕后，会将列表清空。
```ts
function markAsReady<E = any>(err?: E): E | void {
  if (!ready) {
    // 如果存在err，说明还未准备好，如果不存在err，那么说明初始化导航已经完成，ready变为true，之后就不会再进入这个分支
    ready = !err
    // 设置popstate监听函数
    setupListeners()
    // 触发ready处理函数，有错误执行reject(err)，没有执行resolve()
    readyHandlers
      .list()
      .forEach(([resolve, reject]) => (err ? reject(err) : resolve()))
    // 执行完，清空列表
    readyHandlers.reset()
  }
  return err
}
```
