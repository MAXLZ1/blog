# hasRoute

::: tip
根据名称查找是否有对应的路由
:::

`hasRoute`接收一个`name`字符串，返回一个`boolen`值。通过`matcher.getRecordMatcher`来获取对应的`routeRecordMatcher`，在`matcher.getRecordMatcher`会在`matcherMap`中取寻找对应的`routeRecordMatcher`，如果没有找到说明路由不存在

```ts
function hasRoute(name: RouteRecordName): boolean {
  return !!matcher.getRecordMatcher(name)
}
```

`matcher.getRecordMatcher`的实现可参考：[matcher.getRecordMatcher](https://maxlz1.github.io/blog/vue-router/routerMatcher.html#getrecordmatcher)
