# shallowReadonly

::: tip
创建一个自身`property`为只读的`proxy`，但嵌套对象不是`readonly`
:::

```ts
const state = shallowReadonly({
  foo: 1,
  bar: {
    num: 1
  }
})

state.foo++
console.log(state.foo) // 1

state.bar.num++
console.log(state.bar.num) // 2
```

```ts
export function shallowReadonly<T extends object>(target: T): Readonly<T> {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  )
}
```

`reactive`、`shallowReactive`、`readonly`、`shallowReadonly`都是调用`createReactiveObject`创建`proxy`，四者对应着不同的缓存对象及`proxy handlers`


|                  |                      reactive                       |                       shallowReactive                       |                       readonly                        |                           shallowReadonly                           |
|:----------------:|:---------------------------------------------------:|:-----------------------------------------------------------:|:-----------------------------------------------------:|:-------------------------------------------------------------------:|
|       缓存对象       |                    `reactiveMap`                    |                    `shallowReactiveMap`                     |                     `readonlyMap`                     |                        `shallowReadonlyMap`                         |
| `proxy hanlders` | `mutableHandlers`<br /> `mutableCollectionHandlers` | `shallowReactiveHandlers`<br /> `shallowCollectionHandlers` | `readonlyHandlers`<br /> `readonlyCollectionHandlers` | `shallowReadonlyHandlers`<br /> `shallowReadonlyCollectionHandlers` |
|     shallow      |                        false                        |                            true                             |                         false                         |                                true                                 |
|     readonly     |                        false                        |                            false                            |                         true                          |                                true                                 |


