# shallowRef

::: tip
创建一个跟踪自身`.value`变化的`ref`，但不会使其值也变成响应式的。
:::

```ts
const original = { a: 1 }
const foo = shallowRef(original)

console.log(foo.value === original)
```

```ts
export function shallowRef(value?: unknown) {
  return createRef(value, true)
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}
```

与`ref`类型，与`ref`不同的是在构造`RefImpl`实例中时，传入的`shallow`为`true`，而`ref`是`false`。
