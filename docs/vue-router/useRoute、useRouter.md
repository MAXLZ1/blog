# useRoute、useRouter

::: tip
`useRoute`返回当前路由地址。相当于在模板中使用`$route`，必须在`setup`中使用。

`useRouter`返回router实例。相当于在模板中使用`$router`，必须在`setup`中使用。
:::

```ts
export function useRouter(): Router {
  return inject(routerKey)!
}

export function useRoute(): RouteLocationNormalizedLoaded {
  return inject(routeLocationKey)!
}
```

`useRouter`和`useRoute`都是使用`inject`来进行获取对应值。对应值都是在`install`过程中注入的。

```ts {3-4}
install(app) {
  // ...
  app.provide(routerKey, router)
  app.provide(routeLocationKey, reactive(reactiveRoute))
  // ...
}
```
