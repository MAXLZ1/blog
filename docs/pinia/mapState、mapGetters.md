# mapState、mapGetters

::: tip
使用`mapState`，获取`store.state`及`state.getter`。

`mapGetters`同`mapState`。
:::

## 使用

```ts
export default {
  computed: {
    ...mapState(useCounterStore, {
      n: 'count',
      triple: store => store.n * 3,
      doubleN: 'double'
    })
  },
  created() {
    console.log(this.n)
    console.log(this.doubleN)
  },
}

export default {
  computed: {
    ...mapState(useCounterStore, [ 'count', 'double' ])
  },
  created() {
    console.log(this.count) 
    console.log(this.double) 
  },
}
```

## 源码分析

```ts
export function mapState<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: any
): _MapStateReturn<S, G> | _MapStateObjectReturn<Id, S, G, A> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = function (this: ComponentPublicInstance) {
          return useStore(this.$pinia)[key]
        } as () => any
        return reduced
      }, {} as _MapStateReturn<S, G>)
    : Object.keys(keysOrMapper).reduce((reduced, key: string) => {
        reduced[key] = function (this: ComponentPublicInstance) {
          const store = useStore(this.$pinia)
          const storeKey = keysOrMapper[key]
          return typeof storeKey === 'function'
            ? (storeKey as (store: Store<Id, S, G, A>) => any).call(this, store)
            : store[storeKey]
        }
        return reduced
      }, {} as _MapStateObjectReturn<Id, S, G, A>)
}

export const mapGetters = mapState
```

`mapState`可以接受两个参数：`useStore`（一个`useStore`函数）、`keysOrMapper`（一个`key`列表，或`map`对象）。

`mapState`会返回一个对象，这个对象的`key`值是通过`keysOrMapper`获得的。如果传入`keysOrMapper`是数组，返回对象的`key`就是`keysOrMapper`中的元素，`key`对应的值是个获取`store[key]`的函数。 如果`keysOrMapper`是个对象，返回对象的`key`是`keysOrMapper`中的`key`，`key`对应的值根据`keysOrMapper[key]`的类型有所区别，如果`keysOrMapper[key]`是`function`，返回结果中对应`key`的值是一个返回`keysOrMapper[key].call(this, store)`的函数，否则`key`对应的是个返回`store[keysOrMapper[key]]`的函数。

`mapGetters`同`mapState`。
