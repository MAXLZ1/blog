# mapWritableState

::: tip
与`mapState`相似，与`mapState`不同的是，通过`mapWritableState`注入的数据，可以直接对其进行修改。
:::

## 使用

```ts
export default defineComponent({
  name: 'Test',
  computed: {
    ...mapWritableState(useCounterStore, [ 'n' ])
  },
  methods: {
    handleClick() {
      this.n++
    }
  }
})
```

## 源码分析

```ts
export function mapWritableState<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A,
  KeyMapper extends Record<string, keyof S>
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: Array<keyof S> | KeyMapper
): _MapWritableStateReturn<S> | _MapWritableStateObjectReturn<S, KeyMapper> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = {
          get(this: ComponentPublicInstance) {
            return useStore(this.$pinia)[key]
          },
          set(this: ComponentPublicInstance, value) {
            return (useStore(this.$pinia)[key] = value as any)
          },
        }
        return reduced
      }, {} as _MapWritableStateReturn<S>)
    : Object.keys(keysOrMapper).reduce((reduced, key: keyof KeyMapper) => {
        reduced[key] = {
          get(this: ComponentPublicInstance) {
            return useStore(this.$pinia)[keysOrMapper[key]]
          },
          set(this: ComponentPublicInstance, value) {
            return (useStore(this.$pinia)[keysOrMapper[key]] = value as any)
          },
        }
        return reduced
      }, {} as _MapWritableStateObjectReturn<S, KeyMapper>)
}
```

`mapWritableState`实现过程与`mapState`相似，只不过`mapWritableState`返回结果中的`value`是个对象，对象中有`get`、`set`函数，通过设置`set`函数，用户就可以修改对应的`state`。
