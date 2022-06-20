# mapActions

::: tip
使用`mapAction`，获取`store.actions`。
:::

## 使用

```ts
export default {
  created() {
    this.add()
  },
  methods: {
    ...mapActions(useCounterStore, {
      add: 'increment',
    })
  }
}

export default {
  created() {
    this.add()
  },
  methods: {
    ...mapActions(useCounterStore, [ 'add' ])
  }
}
```

## 源码

```ts
export function mapActions<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A,
  KeyMapper extends Record<string, keyof A>
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: Array<keyof A> | KeyMapper
): _MapActionsReturn<A> | _MapActionsObjectReturn<A, KeyMapper> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = function (
          this: ComponentPublicInstance,
          ...args: any[]
        ) {
          return useStore(this.$pinia)[key](...args)
        }
        return reduced
      }, {} as _MapActionsReturn<A>)
    : Object.keys(keysOrMapper).reduce((reduced, key: keyof KeyMapper) => {
        reduced[key] = function (
          this: ComponentPublicInstance,
          ...args: any[]
        ) {
          return useStore(this.$pinia)[keysOrMapper[key]](...args)
        }
        return reduced
      }, {} as _MapActionsObjectReturn<A, KeyMapper>)
}
```

`mapActions`可以接受两个参数：`useStore`（一个`useStore`函数）、`keysOrMapper`（一个`key`列表，或`map`对象）。

`mapActions`返回一个对象。对象中的键通过`keysOrMapper`获得，如果`keysOrMapper`是个数组，那么`key`是数组中的元素，对应的值是函数，这个函数返回对应`store[key]()`的返回值。如果`keysOrMapper`是个对象，那么对象中键就是`keysOrMapper`中的键，对应的值是个函数，这个函数返回`store[keysOrMapper[key]]()`的返回值。
