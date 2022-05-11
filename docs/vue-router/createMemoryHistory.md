# createMemoryHistory

::: tip
创建一个基于内存的历史记录。

文件位置： `src/history/memory.ts`
:::

基于内存的历史记录内部通过维护一个队列`queue`和一个`position`，来保证历史记录存储的正确性。

`createMemoryHistory`和`createWebHistory`、`createWebHashHistory`一样接收一个`base`参数，不同的是`createMemoryHistory`中`base`会默认设置空字符串。

下面分析`createMemoryHistory`：

首先声明一个`listeners`数组来存储所有的监听函数、声明一个`queue`队列存储历史记录、声明一个初始值为`0`的变量`position`来记录当前所处的历史记录在`queue`中的索引。

```ts
// 用户存储监听函数的数组
let listeners: NavigationCallback[] = []
// 使用一个队列维护历史记录
let queue: HistoryLocation[] = [START]
// 当前历史记录在队列中的位置
let position: number = 0
```

然后对`base`进行序列化。

```ts
// base序列化
base = normalizeBase(base)
```

紧接着声明了一个设置历史记录的函数和一个触发监听的函数：

```ts
// 设置历史记录
function setLocation(location: HistoryLocation) {
  position++
  if (position === queue.length) {
    // we are at the end, we can simply append a new entry
    // 队列长度等于position时，直接push
    queue.push(location)
  } else {
    // 当历史记录在队列中的非末尾位置时，删除position及之后的记录，然后再push
    // 如果某一刻处在非结尾的历史记录时，这时要进行push或reqlace操作，此时position之后的记录就会失效
    queue.splice(position)
    queue.push(location)
  }
}

// 触发监听
function triggerListeners(
  to: HistoryLocation,
  from: HistoryLocation,
  { direction, delta }: Pick<NavigationInformation, 'direction' | 'delta'>
): void {
  const info: NavigationInformation = {
    direction,
    delta,
    type: NavigationType.pop,
  }
  for (const callback of listeners) {
    callback(to, from, info)
  }
}
```

然后和`createWebHistory`一样声明一个`routerHistory`，并拦截`routerHistory.location`,使其返回当前的历史记录。

```ts
const routerHistory: RouterHistory = {
  // rewritten by Object.defineProperty
  location: START,
  // TODO: should be kept in queue
  state: {},
  base,
  createHref: createHref.bind(null, base),

  // 替换历史记录
  replace(to) {
    // remove current entry and decrement position
    queue.splice(position--, 1)
    setLocation(to)
  },

  // 添加一条记录
  push(to, data?: HistoryState) {
    setLocation(to)
  },

  // 添加一个监听函数，返回一个卸载监听的函数
  listen(callback) {
    listeners.push(callback)
    return () => {
      const index = listeners.indexOf(callback)
      if (index > -1) listeners.splice(index, 1)
    }
  },
  
  // 销毁历史记录
  destroy() {
    listeners = []
    queue = [START]
    position = 0
  },

  go(delta, shouldTrigger = true) {
    // 从哪条记录跳转
    const from = this.location
    // go的方向。delta < 0 为 back，相反为 forward
    const direction: NavigationDirection =
      // we are considering delta === 0 going forward, but in abstract mode
      // using 0 for the delta doesn't make sense like it does in html5 where
      // it reloads the page
      delta < 0 ? NavigationDirection.back : NavigationDirection.forward
    // go之后所处的position：Math.min(position + delta, queue.length - 1)保证了position<=queue.length - 1, 如果position + delta超出了数组最大索引，就取最大索引
    // Math.max(0, Math.min(position + delta, queue.length - 1))进一步保证了position>=0，如果position + delta < 0, 则取0
    position = Math.max(0, Math.min(position + delta, queue.length - 1))
    // 根据shouldTrigger决定是否触发监听函数
    if (shouldTrigger) {
      triggerListeners(this.location, from, {
        direction,
        delta,
      })
    }
  },
}

// 设置location总是获取当前记录
Object.defineProperty(routerHistory, 'location', {
  enumerable: true,
  get: () => queue[position],
})
```

最后返回`routerHistory`。

```ts
return routerHistory
```
