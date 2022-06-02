# storeToRefs

::: tip
`storeToRefs`与`toRefs`类似，不过`storeToRefs`会忽略方法及非响应式对象。
:::

```ts
export function storeToRefs<SS extends StoreGeneric>(
  store: SS
): ToRefs<
  StoreState<SS> & StoreGetters<SS> & PiniaCustomStateProperties<StoreState<SS>>
> {
  // See https://github.com/vuejs/pinia/issues/852
  // It's easier to just use toRefs() even if it includes more stuff
  if (isVue2) {
    // 如果是vue2直接返回toRefs(store)，尽管其中包含很多methods
    return toRefs(store)
  } else { // 非vue2环境，会过滤store中的非ref或reactive对象
    // store的原始对象
    store = toRaw(store)

    const refs = {} as ToRefs<
      StoreState<SS> &
        StoreGetters<SS> &
        PiniaCustomStateProperties<StoreState<SS>>
    >
    for (const key in store) {
      const value = store[key]
      if (isRef(value) || isReactive(value)) {
        // 使用toRef获取一个新的ref
        refs[key] =
          // ---
          toRef(store, key)
      }
    }

    return refs
  }
}
```
