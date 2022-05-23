# back、forward

::: tip
`back`，回退一个历史记录，相当于`go(-1)`。

`forward`，前进一个历史记录，相当于`go(1)`。
:::

`back`、`forward`都是通过`go`实现。关于`go`的实现可参考：[go](https://maxlz1.github.io/blog/vue-router/go.html)

```ts
const router = {
  // ...
  back: () => go(-1),
  forward: () => go(1),
  // ...
}
```
