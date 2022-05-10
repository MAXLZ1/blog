# createWebHistory

::: tip
创建一个HTML5历史。
:::

`createWebHistory()`接收一个`base`参数，该参数提供一个基础路径。

在`createWebHistory()`内部首先会进行`base`的标准化：

```ts
base = normalizeBase(base)
```
`normalizeBase`方法对传入的`base`进行标准化处理。首先如果没有传入`base`，检测如果是浏览器环境，就去找有没有[base](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/base)标签，如果有`base`标签，就让其`href`属性作为`base`，如果没有`href`属性，使用`/`作为`base`。如果不是浏览器环境也使用`/`作为`base`。最后需要将`base`以`/`结尾的那个`/`删除，这样就可以使用`base+fullpath`的形式建立一个`href`。

```ts
export function normalizeBase(base?: string): string {
  // 如果没有base
  if (!base) {
    // 浏览器环境下检测是不有base标签
    if (isBrowser) {
      // 如果用base标签使用base标签的href
      const baseEl = document.querySelector('base')
      base = (baseEl && baseEl.getAttribute('href')) || '/'
      // 去除htttp(s)://xxx/，如https://example.com/folder/ --> /folder/
      base = base.replace(/^\w+:\/\/[^\/]+/, '')
    } else {
      base = '/'
    }
  }

  // ensure leading slash when it was removed by the regex above avoid leading
  // slash with hash because the file could be read from the disk like file://
  // and the leading slash would cause problems
  if (base[0] !== '/' && base[0] !== '#') base = '/' + base

  // 删除最后的斜杠，这样可以使用使用base + fullPath的形式建立一个href
  return removeTrailingSlash(base)
}
```

`base`标准化后，会声明一个`historyNavigation`和`historyListeners`变量：

```ts
const historyNavigation = useHistoryStateNavigation(base)
const historyListeners = useHistoryListeners(
  base,
  historyNavigation.state,
  historyNavigation.location,
  historyNavigation.replace
)
```

`useHistoryStateNavigation()`、`useHistoryListeners()`这两个方法是做什么的呢？

先看`useHistoryStateNavigation`，这个函数接收一个`base`参数，返回一个对象。这个对象中有四个属性：

- `location`：一个包含`value`属性的对象，`value`值是`createCurrentLocation()`方法的返回值。那么这个`value`是什么呢？看下`createCurrentLocation`做了什么。


`createCurrentLocation`方法接收两个参数：`base`字符串和一个`window.location`对象
```ts
function createCurrentLocation(
  base: string,
  location: Location
): HistoryLocation {
  const { pathname, search, hash } = location
  // allows hash bases like #, /#, #/, #!, #!/, /#!/, or even /folder#end
  // 从base中获取#的索引
  const hashPos = base.indexOf('#')
  // 如果base中包含#
  if (hashPos > -1) {
    let slicePos = hash.includes(base.slice(hashPos))
      ? base.slice(hashPos).length
      : 1
    // 从location.hash中获取path
    let pathFromHash = hash.slice(slicePos)
    // prepend the starting slash to hash so the url starts with /#
    if (pathFromHash[0] !== '/') pathFromHash = '/' + pathFromHash
    // stripBase(pathname, base)：将pathname去除base部分
    return stripBase(pathFromHash, '')
  }
  // 如果base中不包含#，把pathname中的base部分删除
  const path = stripBase(pathname, base)
  return path + search + hash
}
```

- `state`：一个包含`value`属性的对象，`value`存储的是当前的`history.state`
- `push`：向历史记录中添加一条记录
- `reaplce`：替换当前历史记录

```ts
function useHistoryStateNavigation(base: string) {
  const { history, location } = window

  const currentLocation: ValueContainer<HistoryLocation> = {
    value: createCurrentLocation(base, location),
  }
  const historyState: ValueContainer<StateEntry> = { value: history.state }
  
  // 如果historyState.value是空的.构建当前历史条目，一个全新的导航
  if (!historyState.value) {
    // 改变location，构建一条新的历史记录
    changeLocation(
      currentLocation.value,
      {
        back: null,
        current: currentLocation.value,
        forward: null,
        // 替换当前路由历史记录中的最后一条记录
        position: history.length - 1,
        replaced: true,
        scroll: null,
      },
      // 使用replace
      true
    )
  }

  // 修改历史记录
  function changeLocation(
    to: HistoryLocation,
    state: StateEntry,
    replace: boolean
  ): void {
    // #在base中的索引位置
    const hashIndex = base.indexOf('#')
    
    // 确定url
    // 如果base中有#：两种情况：一、存在location.host和base标签，url就是base；二、不符合一的情况，url就是base.slice(hashIndex)) + to
    // 如果base中没有#：url = createBaseLocation() + base + to  createBaseLocation() = location.protocol + '//' + location.host
    const url =
      hashIndex > -1
        ? (location.host && document.querySelector('base')
            ? base
            : base.slice(hashIndex)) + to
        : createBaseLocation() + base + to
    try {
      // 修改历史记录
      history[replace ? 'replaceState' : 'pushState'](state, '', url)
      // historyState更新为最新的历史记录
      historyState.value = state
    } catch (err) {
      if (__DEV__) {
        warn('Error with push/replace State', err)
      } else {
        console.error(err)
      }
      location[replace ? 'replace' : 'assign'](url)
    }
  }

  function replace(to: HistoryLocation, data?: HistoryState) {
    // 要替换的state
    const state: StateEntry = assign(
      {},
      history.state,
      buildState(
        historyState.value.back,
        to,
        historyState.value.forward,
        true
      ),
      data,
      { position: historyState.value.position }
    )

    changeLocation(to, state, true)
    currentLocation.value = to
  }

  function push(to: HistoryLocation, data?: HistoryState) {
    const currentState = assign(
      {},
      historyState.value,
      history.state as Partial<StateEntry> | null,
      {
        forward: to,
        scroll: computeScrollPosition(),
      }
    )

    if (__DEV__ && !history.state) {
      warn(
        `history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:\n\n` +
          `history.replaceState(history.state, '', url)\n\n` +
          `You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`
      )
    }

    changeLocation(currentState.current, currentState, true)

    const state: StateEntry = assign(
      {},
      buildState(currentLocation.value, to, null),
      { position: currentState.position + 1 },
      data
    )

    changeLocation(to, state, false)
    currentLocation.value = to
  }

  return {
    location: currentLocation,
    state: historyState,
    push,
    replace,
  }
}
```

`useHistoryListeners`方法同样返回一个对象，该对象中包含三个属性：

- `pauseListeners`：一个暂停监听函数。
- `listen`：接收一个回调函数，该回调函数会被加入`listeners`数组中，并向`teardowns`数组中添加一个卸载函数
- `destroy`：销毁函数，清空`listeners`与`teardowns`，移除一些监听函数

```ts
function useHistoryListeners(
  base: string,
  historyState: ValueContainer<StateEntry>,
  currentLocation: ValueContainer<HistoryLocation>,
  replace: RouterHistory['replace']
) {
  let listeners: NavigationCallback[] = []
  let teardowns: Array<() => void> = []
  // TODO: should it be a stack? a Dict. Check if the popstate listener
  // can trigger twice
  let pauseState: HistoryLocation | null = null

  const popStateHandler: PopStateListener = ({
    state,
  }: {
    state: StateEntry | null
  }) => {
    const to = createCurrentLocation(base, location)
    const from: HistoryLocation = currentLocation.value
    const fromState: StateEntry = historyState.value
    let delta = 0

    if (state) {
      currentLocation.value = to
      historyState.value = state

      // ignore the popstate and reset the pauseState
      if (pauseState && pauseState === from) {
        pauseState = null
        return
      }
      delta = fromState ? state.position - fromState.position : 0
    } else {
      replace(to)
    }

    listeners.forEach(listener => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta
          ? delta > 0
            ? NavigationDirection.forward
            : NavigationDirection.back
          : NavigationDirection.unknown,
      })
    })
  }
  
  function pauseListeners() {
    pauseState = currentLocation.value
  }

  function listen(callback: NavigationCallback) {
    // setup the listener and prepare teardown callbacks
    listeners.push(callback)

    // 卸载函数
    const teardown = () => {
      const index = listeners.indexOf(callback)
      if (index > -1) listeners.splice(index, 1)
    }
    
    teardowns.push(teardown)
    return teardown
  }

  function beforeUnloadListener() {
    const { history } = window
    if (!history.state) return
    history.replaceState(
      assign({}, history.state, { scroll: computeScrollPosition() }),
      ''
    )
  }

  // 移除监听函数
  function destroy() {
    for (const teardown of teardowns) teardown()
    teardowns = []
    window.removeEventListener('popstate', popStateHandler)
    window.removeEventListener('beforeunload', beforeUnloadListener)
  }

  // 注册监听函数
  window.addEventListener('popstate', popStateHandler)
  window.addEventListener('beforeunload', beforeUnloadListener)

  return {
    pauseListeners,
    listen,
    destroy,
  }
}
```

创建完`historyNavigation`、`historyListeners`之后，紧跟着声明一个`go`函数。该函数接收两个变量：`delta`历史记录前进或后退的步数，`triggerListeners`是否触发监听

```ts
function go(delta: number, triggerListeners = true) {
  if (!triggerListeners) historyListeners.pauseListeners()
  history.go(delta)
}
```

之后创建一个`routerHistory`对象，并将其返回。

```ts
const routerHistory: RouterHistory = assign(
  {
    location: '',
    base,
    go,
    createHref: createHref.bind(null, base),
  },

  historyNavigation,
  historyListeners
)

Object.defineProperty(routerHistory, 'location', {
  enumerable: true,
  get: () => historyNavigation.location.value,
})

Object.defineProperty(routerHistory, 'state', {
  enumerable: true,
  get: () => historyNavigation.state.value,
})

return routerHistory
```
