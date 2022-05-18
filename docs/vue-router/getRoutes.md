# getRoutes

::: tip
获取标准化后的路由列表
:::

```ts
function getRoutes() {
  // 遍历matchers，routeMatcher.record中存储着路由的标准化版本
  return matcher.getRoutes().map(routeMatcher => routeMatcher.record)
}
```

在添加路由的过程中，会对路由进行标准化，并生成对应的的`matcher`，将其添加至`matchers`中，最后将路由标准化的版本作为`record`属性添加到`matcher`中。
