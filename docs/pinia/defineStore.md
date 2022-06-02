# defineStore

::: tip
通过`defineStore`定义一个`store`。

源码位置：`packages/pinia/src/store.ts`
:::

`defineStore`函数可以接收三个参数：`idOrOptions`、`setup`、`setOptions`，后两个参数为可选参数。下面是三个`defineStore`的函数类型定义。

```ts
export function defineStore<
  Id extends string,
  S extends StateTree = {},
  G extends _GettersTree<S> = {},
  A /* extends ActionsTree */ = {}
>(
  id: Id,
  options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>
): StoreDefinition<Id, S, G, A>

export function defineStore<
  Id extends string,
  S extends StateTree = {},
  G extends _GettersTree<S> = {},
  A /* extends ActionsTree */ = {}
  >(options: DefineStoreOptions<Id, S, G, A>): StoreDefinition<Id, S, G, A>

export function defineStore<Id extends string, SS>(
  id: Id,
  storeSetup: () => SS,
  options?: DefineSetupStoreOptions<
    Id,
    _ExtractStateFromSetupStore<SS>,
    _ExtractGettersFromSetupStore<SS>,
    _ExtractActionsFromSetupStore<SS>
    >
): StoreDefinition<
  Id,
  _ExtractStateFromSetupStore<SS>,
  _ExtractGettersFromSetupStore<SS>,
  _ExtractActionsFromSetupStore<SS>
  >
```

接下来看`defineStore`的实现。

```ts
export function defineStore(
  idOrOptions: any,
  setup?: any,
  setupOptions?: any
): StoreDefinition {
  let id: string
  let options:
    | DefineStoreOptions<
    string,
    StateTree,
    _GettersTree<StateTree>,
    _ActionsTree
    >
    | DefineSetupStoreOptions<
    string,
    StateTree,
    _GettersTree<StateTree>,
    _ActionsTree
    >

  const isSetupStore = typeof setup === 'function'
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    // 如果setup是函数，那么options是setupOptions，否在为setup
    options = isSetupStore ? setupOptions : setup
  } else {
    options = idOrOptions
    id = idOrOptions.id
  }

  function useSttore(pinia, hot) { //... }
  
  useStore.$id = id
  
  return useStore
}
```

首先在`defineStore`中声明了三个变量：`id`、`options`、`isSetupStore`，其中`id`为定义的`store`的唯一`id`，`options`为定义`store`时的`options`，`isSetupStore`代表传入的`setup`是不是个函数。

然后根据传入的`idOrOptions`的类型，为`id`、`otions`赋值。紧接着声明了一个`useStore`函数，并将`id`赋给它，然后将其`return`。截止到此，我们知道`defineStore`会返回一个函数，那么这个函数具体是做什么的呢？我们继续看`useStore`的实现。

## `useStore`

```ts
function useStore(pinia?: Pinia | null, hot?: StoreGeneric): StoreGeneric {
  // 获取当前实例
  const currentInstance = getCurrentInstance()
  // 测试环境下，忽略提供的参数，因为总是能使用getActivePinia()获取pinia实例
  // 非测试环境下，如果未传入pinia，则会从组件中使用inject获取pinia
  pinia =
    (__TEST__ && activePinia && activePinia._testing ? null : pinia) ||
    (currentInstance && inject(piniaSymbol))
  // 设置激活的pinia
  if (pinia) setActivePinia(pinia)

  // 如果没有activePinia，那么可能没有install pinia，开发环境下进行提示
  if (__DEV__ && !activePinia) {
    throw new Error(
      `[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?\n` +
        `\tconst pinia = createPinia()\n` +
        `\tapp.use(pinia)\n` +
        `This will fail in production.`
    )
  }

  // 设置pinia为激活的pinia
  pinia = activePinia!

  // 从pina._s中查找id否注册过，如果没有被注册，创建一个store并注册在pinia._s中
  if (!pinia._s.has(id)) {
    if (isSetupStore) {
      createSetupStore(id, setup, options, pinia)
    } else {
      createOptionsStore(id, options as any, pinia)
    }

    if (__DEV__) {
      useStore._pinia = pinia
    }
  }

  // 从pinia._s中获取id对应的store
  const store: StoreGeneric = pinia._s.get(id)!

  if (__DEV__ && hot) {
    const hotId = '__hot:' + id
    const newStore = isSetupStore
      ? createSetupStore(hotId, setup, options, pinia, true)
      : createOptionsStore(hotId, assign({}, options) as any, pinia, true)

    hot._hotUpdate(newStore)

    // cleanup the state properties and the store from the cache
    delete pinia.state.value[hotId]
    pinia._s.delete(hotId)
  }

  if (
    __DEV__ &&
    IS_CLIENT &&
    currentInstance &&
    currentInstance.proxy &&
    !hot
  ) {
    const vm = currentInstance.proxy
    const cache = '_pStores' in vm ? vm._pStores! : (vm._pStores = {})
    cache[id] = store
  }

  // 返回store
  return store as any
}
```

`useStore`接收两个可选参数：`pinia`、`hot`。`pinia`是个`Pinia`的实例，而`hot`只在开发环境下有用，它与模块的热更新有关。

在`useStore`中会首先获取当前组件实例，如果存在组件实例，使用`inject(piniaSymbol)`获取`pinia`（在`install`中会进行`provide`），并将其设置为`activePinia`，然后在`activePinia._s`中查找是否有被注册为`id`的`store`，如果没有则创建`store`，将其注册到`activePinia._s`中。最后返回`activePinia._s`中`id`对应的`store`。

现在我们知道`useStore`函数，最终会返回一个`store`。那么这个`store`是什么呢？它是如何创建的呢？在`useStore`中根据不同情况中有两中方式来创建`store`，分别是：`createSetupStore`、`createOptionsStore`。这两个方式的使用条件是：如果`defineStore`第二个参数是个`function`调用`createSetupStore`，相反调用`createOptionsStore`。

## `createSetupStore`

`createSetupStore`可接收参数如下：

| 参数             | 说明                           |      |
| ------------------ | -------------------------------- | ------ |
| `$id`            | 定义`store`的`id`              |      |
| `setup`          | 一个可以返回`state`的函数      |      |
| `options`        | `defineStore`的`options`       |      |
| `pinia`          | `Pinia`实例                    |      |
| `hot`            | 是否启用热更新                 | 可选 |
| `isOptionsStore` | 是否使用`options`声明的`store` | 可选 |

`createSetupStore`代码有500多行，如果从头开始看的话，不容易理解。我们可以根据`createSetupStore`的用途，从其核心开始看。因为`createSetupStore`是需要创建`store`，并将`store`注册到`pinia._s`中，所以`createSetupStore`中可能需要创建`store`，我们找到创建`store`的地方。

```ts
const partialStore = {
  _p: pinia,
  // _s: scope,
  $id,
  $onAction: addSubscription.bind(null, actionSubscriptions),
  $patch,
  $reset,
  $subscribe(callback, options = {}) {
    const removeSubscription = addSubscription(
      subscriptions,
      callback,
      options.detached,
      () => stopWatcher()
    )
    const stopWatcher = scope.run(() =>
      watch(
        () => pinia.state.value[$id] as UnwrapRef<S>,
        (state) => {
          if (options.flush === 'sync' ? isSyncListening : isListening) {
            callback(
              {
                storeId: $id,
                type: MutationType.direct,
                events: debuggerEvents as DebuggerEvent,
              },
              state
            )
          }
        },
        assign({}, $subscribeOptions, options)
      )
    )!

    return removeSubscription
  },
  $dispose,
} as _StoreWithState<Id, S, G, A>

if (isVue2) {
  partialStore._r = false
}

const store: Store<Id, S, G, A> = reactive(
  assign(
    __DEV__ && IS_CLIENT
      ? // devtools custom properties
        {
          _customProperties: markRaw(new Set<string>()),
          _hmrPayload,
        }
      : {},
    partialStore
  )
) as unknown as Store<Id, S, G, A>

pinia._s.set($id, store)
```

可以看到`store`是用`reactive`包装的一个响应式对象，`reactive`所包装的对象是由`partialStore`通过`Object.assign`进行复制的。`partialStore`中定义了很多方法，这些方法都是暴露给用户操作`store`的一些接口，如`$onAction`可设置`actions`的回调、`$patch`可更新`store`中的`state`、`$dispose`可销毁`store`。

在调用完`pinia._s.set($id, store)`之后，会执行`setup`，获取所有的数据。

```ts
const setupStore = pinia._e.run(() => {
  scope = effectScope()
  return scope.run(() => setup())
})!
```

然后遍历`setupStore`的属性：如果`prop`（`key`对应的值）为`ref`（不为`computed`）或`reactive`，则将`key`及`prop`同步到`pina.state.value[$id]`中；如果`prop`为`function`，则会使用`wrapAction`包装`prop`，并将包装后的方法赋值给`setupStore[key]`，以覆盖之前的值，同时将包装后的方法存入`optionsForPlugin.actions`中。

```ts
for (const key in setupStore) {
  const prop = setupStore[key]

  // 如果prop是ref（但不是computed）或reactive
  if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
    if (__DEV__ && hot) {
      set(hotState.value, key, toRef(setupStore as any, key))
    } else if (!isOptionsStore) {
      if (initialState && shouldHydrate(prop)) {
        if (isRef(prop)) {
          prop.value = initialState[key]
        } else {
          mergeReactiveObjects(prop, initialState[key])
        }
      }

      // 将对应属性同步至pinia.state中
      if (isVue2) {
        set(pinia.state.value[$id], key, prop)
      } else {
        pinia.state.value[$id][key] = prop
      }
    }

    if (__DEV__) {
      _hmrPayload.state.push(key)
    }
  } else if (typeof prop === 'function') { // 如果prop是function
    // 使用wrapAction包装prop，在wrapAction会处理afeterCallback、errorCallback
    const actionValue = __DEV__ && hot ? prop : wrapAction(key, prop)

    // 将actionsValue添加到setupStore中，覆盖原来的function
    if (isVue2) {
      set(setupStore, key, actionValue)
    } else {
      setupStore[key] = actionValue
    }

    if (__DEV__) {
      _hmrPayload.actions[key] = prop
    }

    // 将function类型的prop存入optionsForPlugin.actions中
    optionsForPlugin.actions[key] = prop
  } else if (__DEV__) {
    if (isComputed(prop)) {
      _hmrPayload.getters[key] = isOptionsStore
        ? // @ts-expect-error
        options.getters[key]
        : prop
      if (IS_CLIENT) {
        const getters: string[] =
          setupStore._getters || (setupStore._getters = markRaw([]))
        getters.push(key)
      }
    }
  }
}
```

接下来我们看下`wrapAction`是如何进行包装`function`类型上的`prop`。

`wrapAction`首先返回一个函数，在这个函数中，首先触发`actionSubscriptions`中的函数，然后执行`action`函数，如果执行过程中出错，会执行`onErrorCallbackList`中的`errorCallback`，如果没有出错的话，执行`afterCallbackList`中的`afterCallback`，最后将`action`的返回结果`return`。

```ts
function wrapAction(name: string, action: _Method) {
  return function (this: any) {
    setActivePinia(pinia)
    const args = Array.from(arguments)

    const afterCallbackList: Array<(resolvedReturn: any) => any> = []
    const onErrorCallbackList: Array<(error: unknown) => unknown> = []
    function after(callback: _ArrayType<typeof afterCallbackList>) {
      afterCallbackList.push(callback)
    }
    function onError(callback: _ArrayType<typeof onErrorCallbackList>) {
      onErrorCallbackList.push(callback)
    }

    triggerSubscriptions(actionSubscriptions, {
      args,
      name,
      store,
      after,
      onError,
    })

    let ret: any
    try {
      ret = action.apply(this && this.$id === $id ? this : store, args)
    } catch (error) {
      triggerSubscriptions(onErrorCallbackList, error)
      throw error
    }

    // 如果结果是promise，在promise中触发afterCallbackList及onErrorCallbackList
    if (ret instanceof Promise) {
      return ret
        .then((value) => {
          triggerSubscriptions(afterCallbackList, value)
          return value
        })
        .catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error)
          return Promise.reject(error)
        })
    }

    triggerSubscriptions(afterCallbackList, ret)
    return ret
  }
}
```

`wrapAction`中的`actionSubscriptions`是个什么呢？

其实`actionSubscriptions`中的`callback`就是是通过`store.$onAction`添加的回调函数；在执行`actionSubscriptions`中的`callback`过程中，会将对应`callback`添加到`afterCallbackList`或`onErrorCallbackList`中。例如：

```ts
store.$onAction(({ after, onError, name, store }) => {
  after((value) => {
    console.log(value)
  })
  
  onError((error) => {
    console.log(error)
  })
})
```

遍历完`setupStore`之后，会将`setupStore`合并至`store`和`store`的原始对对象中，以方便使用`storeToRefs()`检索响应式对象。

```ts
if (isVue2) {
  Object.keys(setupStore).forEach((key) => {
    set(
      store,
      key,
      setupStore[key]
    )
  })
} else {
  assign(store, setupStore)
  assign(toRaw(store), setupStore)
}
```

紧接着拦截`store.$state`的`get`、`set`方法：当调用`store.$state`时，能够从`pinia.state.value`找到对应的`state`；当使用`store.$state = xxx`去修改值时，则调用`$patch`方法修改值。

```ts
Object.defineProperty(store, '$state', {
  get: () => (__DEV__ && hot ? hotState.value : pinia.state.value[$id]),
  set: (state) => {
    /* istanbul ignore if */
    if (__DEV__ && hot) {
      throw new Error('cannot set hotState')
    }
    $patch(($state) => {
      assign($state, state)
    })
  },
})
```

截止到此，`store`就准备完毕。如果在`Vue2`环境下，会将`store._r`设置为true。

```ts
if (isVue2) {
  store._r = true
}
```

接下来就需要调用使用`use`方法注册的`plugins`：

```ts
pinia._p.forEach((extender) => {
  if (__DEV__ && IS_CLIENT) {
    const extensions = scope.run(() =>
      extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin,
      })
    )!
    Object.keys(extensions || {}).forEach((key) =>
      store._customProperties.add(key)
    )
    assign(store, extensions)
  } else {
    // 将plugin的结果合并到store中
    assign(
      store,
      scope.run(() =>
        extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin,
        })
      )!
    )
  }
})
```

最后返回`store`。

```ts
if (
  initialState &&
  isOptionsStore &&
  (options as DefineStoreOptions<Id, S, G, A>).hydrate
) {
  ;(options as DefineStoreOptions<Id, S, G, A>).hydrate!(
    store.$state,
    initialState
  )
}

isListening = true
isSyncListening = true
return store
```

接下来看下`store`中的几个方法：

### `$onAction`

在每个`action`中添加回调函数。回调接收一个对象参数：该对象包含`name`（`action`的`key`值）、`store`（当前`store`）、`after`（添加`action`执行完之后的回调）、`onError`（添加`action`执行过程中的错误回调）、`args`（`action`的参数）属性。

示例：

```ts
// 统计add action的调用次数
let count = 0, successCount = 0, failCount = 0
store.$onAction(({ name, after, onError }) => {
  if (name === 'add') {
    count++
    after((resolveValue) => {
      successCount++
      console.log(resolveValue)
    })
  
    onError((error) => {
      failCount++
      console.log(error)
    })
  }
})
```

`$onAction`内部通过发布订阅模式实现。在`pinia`中有个专门的订阅模块`subscriptions.ts`，其中包含两个主要方法：`addSubscription`（添加订阅）、`triggerSubscriptions`（触发订阅）。

`addSubscription`可接收四个参数：`subscriptions`（订阅列表）、`callback`（添加的订阅函数）、`detached`（游离的订阅，如果为`false`在组件卸载后，自动移除订阅；如果为`true`，不会自动移除订阅）、`onCleanup`（订阅被移除时的回调）

`triggerSubscriptions`接收两个参数：`subscriptions`（订阅列表）、`args`（`action`的参数列表）

```ts
export function addSubscription<T extends _Method>(
  subscriptions: T[],
  callback: T,
  detached?: boolean,
  onCleanup: () => void = noop
) {
  subscriptions.push(callback)

  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback)
    if (idx > -1) {
      subscriptions.splice(idx, 1)
      onCleanup()
    }
  }

  if (!detached && getCurrentInstance()) {
    onUnmounted(removeSubscription)
  }

  return removeSubscription
}

export function triggerSubscriptions<T extends _Method>(
  subscriptions: T[],
  ...args: Parameters<T>
) {
  subscriptions.slice().forEach((callback) => {
    callback(...args)
  })
}
```

`$onAction`通过`addSubscription.bind(null, actionSubscriptions)`实现。

**如何触发订阅？**

首先在`store`的初始化过程中，会将`action`使用`wrapAction`函数进行包装，`wrapAction`返回一个函数，在这个函数中会先触发`actionSubscriptions`，这个触发过程中会将`afterCallback`、`onErrorCallback`添加到对应列表。然后调用`action`，如果调用过程中出错，则触发`onErrorCallbackList`，否则触发`afterCallbackList`。如果`action`的结果是`Promise`的话，则在`then`中触发`onErrorCallbackList`，在`catch`中触发`onErrorCallbackList`。然后会将包装后的`action`覆盖原始`action`，这样每次调用`action`时就是调用的包装后的`action`。

### `$patch`

使用`$patch`可以更新`state`的值，可进行批量更新。`$patch`接收一个`partialStateOrMutator`参数，它可以是个对象也可以是个方法。

示例：

```ts
store.$patch((state) => {
  state.name = 'xxx'
  state.age = 14
})
// or
store.$patch({
  name: 'xxx',
  age: 14
})
```

`$patch`源码：

```ts
function $patch(
  partialStateOrMutator:
    | _DeepPartial<UnwrapRef<S>>
    | ((state: UnwrapRef<S>) => void)
): void {
  // 合并的相关信息
  let subscriptionMutation: SubscriptionCallbackMutation<S>
  // 是否触发状态修改后的回调，isListening代表异步触发，isSyncListening代表同步触发
  isListening = isSyncListening = false
  if (__DEV__) {
    debuggerEvents = []
  }
  // 如果partialStateOrMutator是个function，执行方法，传入当前的store
  if (typeof partialStateOrMutator === 'function') {
    partialStateOrMutator(pinia.state.value[$id] as UnwrapRef<S>)
    subscriptionMutation = {
      type: MutationType.patchFunction,
      storeId: $id,
      events: debuggerEvents as DebuggerEvent[],
    }
  } else { // 如果不是function，则调用mergeReactiveObjects合并state
    mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator)
    subscriptionMutation = {
      type: MutationType.patchObject,
      payload: partialStateOrMutator,
      storeId: $id,
      events: debuggerEvents as DebuggerEvent[],
    }
  }
  const myListenerId = (activeListener = Symbol())
  nextTick().then(() => {
    if (activeListener === myListenerId) {
      isListening = true
    }
  })
  isSyncListening = true
  // 因为在修改pinia.state.value[$id]的过程中关闭了监听，所以需要手动触发订阅列表
  triggerSubscriptions(
    subscriptions,
    subscriptionMutation,
    pinia.state.value[$id] as UnwrapRef<S>
  )
}
```

### `$reset`

通过构建一个新的`state object`将`state`重置为初始状态。只在`options`配置下生效。如果是`setup`配置，开发环境下报错。

```ts
store.$reset = function $reset() {
  // 重新执行state，获取一个新的state
  const newState = state ? state() : {}
  // 通过$patch，使用assign将newState合并到$state中
  this.$patch(($state) => {
    assign($state, newState)
  })
}
```

### `$subscribe`

设置`state`改变后的回调，返回一个移除回调的函数。可接受两个参数：`callback`（添加的回调函数）、`options:{detached, flush, ...watchOptions}`（`detached`同`addSubscription`中的`detached`；`flush`代表是否同步触发回调，可取值：`sync`）。

示例：
```ts
store.$subribe((mutation: {storeId, type, events}, state) => {
  console.log(storeId)
  console.log(type)
  console.log(state)
}, { detached: true, flush: 'sync' })
```

`$subscribe`源码：

```ts
function $subscribe(callback, options = {}) {
  // 将callback添加到subscriptions中，以便使用$patch更新状态时，触发回调
  // 当使用removeSubscription移除callback时，停止对pinia.state.value[$id]监听
  const removeSubscription = addSubscription(
    subscriptions,
    callback,
    options.detached,
    () => stopWatcher()
  )
  const stopWatcher = scope.run(() =>
    // 监听pinia.state.value[$id]，以触发callback，当使用$patch更新state时，不会触发下面的callback
    watch(
      () => pinia.state.value[$id] as UnwrapRef<S>,
      (state) => {
        if (options.flush === 'sync' ? isSyncListening : isListening) {
          callback(
            {
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents as DebuggerEvent,
            },
            state
          )
        }
      },
      assign({}, $subscribeOptions, options)
    )
  )!

  return removeSubscription
}
```

在`callback`中的第一个参数中有个`type`属性，表示是通过什么方式更新的`state`，它有三个值：

1. `MutationType.direct`：通过`state.name='xxx'`/`store.$state.name='xxx'`等方式修改
2. `MutationType.patchObject`：通过`store.$patch({ name: 'xxx' })`方式修改
3. `MutationType.patchFunction`：通过`store.$patch((state) => state.name='xxx')`方式修改

### `$dispose`

销毁`store`。

```ts
function $dispose() {
  // 停止监听
  scope.stop()
  // 清空subscriptions及actionSubscriptions
  subscriptions = []
  actionSubscriptions = []
  // 从pinia._s中删除store
  pinia._s.delete($id)
}
```

## `createOptionsStore`

`createOptionsStore`可接收参数如下：

| 参数             | 说明                           |      |
| ----------------- | -------------------------------- | ------ |
| `id`            | 定义`store`的`id`              |      |
| `options`       | `defineStore`的`options`       |      |
| `pinia`         | `Pinia`实例                    |      |
| `hot`           | 是否启用热更新                 | 可选 |


```ts
function createOptionsStore<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree
>(
  id: Id,
  options: DefineStoreOptions<Id, S, G, A>,
  pinia: Pinia,
  hot?: boolean
): Store<Id, S, G, A> {
  const { state, actions, getters } = options

  const initialState: StateTree | undefined = pinia.state.value[id]

  let store: Store<Id, S, G, A>

  function setup() {
    // 如果pinia.state.value[id]不存在，进行初始化
    if (!initialState && (!__DEV__ || !hot)) {
      if (isVue2) {
        set(pinia.state.value, id, state ? state() : {})
      } else {
        pinia.state.value[id] = state ? state() : {}
      }
    }

    // 将pinia.state.value[id]各属性值转为响应式对象
    const localState =
      __DEV__ && hot
        ? // use ref() to unwrap refs inside state TODO: check if this is still necessary
          toRefs(ref(state ? state() : {}).value)
        : toRefs(pinia.state.value[id])

    // 处理getters，并将处理后的getters和actions合并到localState中
    return assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = markRaw(
          computed(() => {
            setActivePinia(pinia)
            const store = pinia._s.get(id)!
            
            if (isVue2 && !store._r) return

            return getters![name].call(store, store)
          })
        )
        return computedGetters
      }, {} as Record<string, ComputedRef>)
    )
  }

  // 利用createSetupStore创建store
  store = createSetupStore(id, setup, options, pinia, hot, true)

  // 重写store.$reset
  store.$reset = function $reset() {
    const newState = state ? state() : {}
    this.$patch(($state) => {
      assign($state, newState)
    })
  }

  return store as any
}
```

在`createOptionsStore`中会根据传入参数构造一个`setup`函数，然后通过`createSetupStore`创建一个`store`，并重写`store.$reset`方法，最后返回`store`。

这个`setup`函数中会将`state()`的返回值赋值给`pinia.state.value[id]`，然后将`pinia.state.value[id]`进行`toRefs`，得到`localState`，最后将处理后的`getters`和`actions`都合并到`localState`中，将其返回。对于`getters`的处理：将每个`getter`函数都转成一个计算属性。

