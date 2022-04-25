# shallowReactive

::: tip
创建一个浅层的响应式代理，它只能跟踪自身`property`的响应性，对于嵌套对象不作处理。
:::

```ts
const obj = {
  a: 1,
  foo: {
    bar: 'bar'
  }
}
const shallow = shallowReactive(obj)
console.log(isReactive(shallow)) // true
console.log(isReactive(shallow.foo)) // false
console.log(shallow.__v_raw === obj) // true
console.log(shallow.foo === obj.foo) // true

// ref不会自动解包，因为isRef的判断在shallow判断之后，一旦检测到时shallow，会直接返回结果
const shallow2 = shallowReactive({ a: ref(0) })
console.log(shallow2.a.value) // 0
```

```ts
export function shallowReactive<T extends object>(
  target: T
): ShallowReactive<T> {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  )
}
```

`shallowReactive`与`reactive`类似，只不过在`new Proxy()`时使用的`handler`不一样，使用的缓存对象也不一样。

`shallowReactive`中的`proxy handler`使用的是`shallowReactiveHandlers`和`shallowCollectionHandlers`。
`shallowReactiveHandlers`中在生成`get`、`set`函数时传入的`shallow`为`true`。`shallowCollectionHandlers`在生成
`get`函数时传入的`shallow`为`true`。

```ts
// isReadonly: false; shallow: true;
const shallowGet = /*#__PURE__*/ createGetter(false, true)

// shallow: true
const shallowSet = /*#__PURE__*/ createSetter(true)

export const shallowReactiveHandlers = /*#__PURE__*/ extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
)
```

使用`shallowReactive`声明的代理，一旦访问他的某个属性，如果对应值是个`Object`，是不会将它转为响应式的。

`baseHandler.ts`
```ts
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    // ...

    // 浅层响应式，直接返回res
    if (shallow) {
      return res
    }

    // ...
  }
}
```

`collectionHandlers.ts`
```ts
const toShallow = <T extends unknown>(value: T): T => value

function get(
  target: MapTypes,
  key: unknown,
  isReadonly = false,
  isShallow = false
) {
  // ...
  
  // 如果isShallow，wrap为toShallow，toShallow(value)会返回value
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive
  if (has.call(rawTarget, key)) {
    return wrap(target.get(key))
  } else if (has.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey))
  } else if (target !== rawTarget) {
    // #3602 readonly(reactive(Map))
    // ensure that the nested reactive `Map` can do tracking for itself
    target.get(key)
  }
}
```
