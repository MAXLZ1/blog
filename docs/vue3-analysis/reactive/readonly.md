# readonly

::: tip
接收一个对象（响应式或纯对象）或`ref`并返回原始对象的只读代理。任何被访问的嵌套 property 也是只读的。
:::

```ts
const original = reactive({ count: 0 })

const copy = readonly(original)
original.count++

console.log(original.count) // 1 

// 进入readonlyHandlers-set，发出警告
copy.count++
console.log(copy.count) // 1
```

```ts
export function readonly<T extends object>(
  target: T
): DeepReadonly<UnwrapNestedRefs<T>> {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  )
}
```

`readonly`同样使用`createReactiveObject`创建一个代理对象，流程与`reactive`相同。与`reactive`不同的是`createReactiveObject`中传入的`isReadonly`为`true`，`new proxy`时的`handler`也不同。

`baseHandlers.ts`
```ts
export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set(target, key) {
    if (__DEV__) {
      console.warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  },
  deleteProperty(target, key) {
    if (__DEV__) {
      console.warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  }
}
```

从`readonlyHandlers`中可以看到，`set`和`deleteProperty`中是没有额外操作的，这也就意味着`readonly(target)`的属性是只读的，不允许修改和删除

`collectionHandlers.ts`
```ts
function createReadonlyMethod(type: TriggerOpTypes): Function {
  return function (this: CollectionTypes, ...args: unknown[]) {
    if (__DEV__) {
      const key = args[0] ? `on key "${args[0]}" ` : ``
      console.warn(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      )
    }
    return type === TriggerOpTypes.DELETE ? false : this
  }
}

function createInstrumentations() {
  // ...
  
  const readonlyInstrumentations: Record<string, Function> = {
    get(this: MapTypes, key: unknown) {
      return get(this, key, true)
    },
    get size() {
      return size(this as unknown as IterableCollections, true)
    },
    has(this: MapTypes, key: unknown) {
      return has.call(this, key, true)
    },
    add: createReadonlyMethod(TriggerOpTypes.ADD),
    set: createReadonlyMethod(TriggerOpTypes.SET),
    delete: createReadonlyMethod(TriggerOpTypes.DELETE),
    clear: createReadonlyMethod(TriggerOpTypes.CLEAR),
    forEach: createForEach(true, false)
  }
  
  // ...
}

export const readonlyCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: /*#__PURE__*/ createInstrumentationGetter(true, false)
}
```

`readonlyCollectionHandlers`拦截所有可能修改集合的方法，包括`add`、`set`、`delete`、`clear`，使这些方法不能够修改集合。

使用`readonly`声明的响应式数据，因为所有属性都不会修改，所以在`get`、`size`等一些查询的方法中是不会进行依赖的收集。

```ts
function get(
  target: MapTypes,
  key: unknown,
  isReadonly = false,
  isShallow = false
) {
  // ...
  
  // 非只读时进行依赖收集
  !isReadonly && track(rawTarget, TrackOpTypes.GET, rawKey)
  
  //...
}

function size(target: IterableCollections, isReadonly = false) {
  target = (target as any)[ReactiveFlags.RAW]
  
  // 非只读时进行依赖收集
  !isReadonly && track(toRaw(target), TrackOpTypes.ITERATE, ITERATE_KEY)
  return Reflect.get(target, 'size', target)
}
```
