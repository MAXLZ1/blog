# toRaw

::: tip
`toRaw`返回`reactive`或`readonly`代理的原始对象。修改原始对象不会触发依赖。
:::

```ts
const foo = { bar: 1 }
const reactiveFoo = reactive(foo)

let dummy
effect(() => {
  dummy = reactiveFoo.bar
})

console.log(dummy) // 1
toRaw(reactiveFoo).bar = 2
console.log(dummy) // 1
```

```ts
export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}
```

`roRaw`中，首先从`observed`获取`__v_raw`（`ReactiveFlags.RAW`）对应的值，如果有值，将该值继续`toRaw`，直到不能取到`__v_raw`对应的值，返回`observed`。

__为什么通过检测`__v_raw`属性，来获取原始对象？__

在`proxy`的`get`拦截函数中，检测到`key`是`__v_raw`时，会返回`target`，也就是代理的原始对象。`__v_raw`属性不会显示出现在`proxy`的原型上，如果打印`proxy`，你会发现对象上没有`__v_raw`这个属性。通过`proxy`的`get`拦截操作，可以隐藏一些不必暴露的属性。如：`ReactiveFlags.IS_REACTIVE`、`ReactiveFlags.IS_READONLY`等。

```ts
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) {
      return shallow
    } else if (
      key === ReactiveFlags.RAW &&
      receiver ===
        (isReadonly
          ? shallow
            ? shallowReadonlyMap
            : readonlyMap
          : shallow
          ? shallowReactiveMap
          : reactiveMap
        ).get(target)
    ) {
      return target
    }

    // ...
  }
}
```
