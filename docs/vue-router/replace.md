# replace

::: tip
通过替换历史记录，导航至一个新的URL。
:::

`replace`与`push`作用几乎相同，如果`push`时指定`replace: true`，那么和直接使用`replace`一致。

```ts
function replace(to: RouteLocationRaw | RouteLocationNormalized) {
  return push(assign(locationAsObject(to), { replace: true }))
}
```
