# useLink

::: tip
通过`useLink`可获取`router-link`跳转时的行为与信息，但并不会发生跳转行为。
:::

```ts
export function useLink(props: UseLinkOptions) {
  // router实例
  const router = inject(routerKey)!
  // 当前路由地址
  const currentRoute = inject(routeLocationKey)!

  // 目标路由相关信息
  const route = computed(() => router.resolve(unref(props.to)))

  // 被激活记录的索引
  const activeRecordIndex = computed<number>(() => {
    const { matched } = route.value
    const { length } = matched
    // 目标路由所匹配到的完整路由
    const routeMatched: RouteRecord | undefined = matched[length - 1]
    const currentMatched = currentRoute.matched
    // 如果没有匹配到的目标路由或当前路由也没有匹配到的路由返回-1
    if (!routeMatched || !currentMatched.length) return -1
    // 在当前路由所匹配到的路由中寻找目标路由
    const index = currentMatched.findIndex(
      isSameRouteRecord.bind(null, routeMatched)
    )
    if (index > -1) return index
    // 目标路由匹配到的路由的父路由的path（如果父路由是由别名产生，取源路由的path）
    const parentRecordPath = getOriginalPath(
      matched[length - 2] as RouteRecord | undefined
    )
    return (
      length > 1 &&
        // 如果目标路由的父路由与
        getOriginalPath(routeMatched) === parentRecordPath &&
        // 避免将孩子与父路由比较
        currentMatched[currentMatched.length - 1].path !== parentRecordPath
        ? currentMatched.findIndex(
            isSameRouteRecord.bind(null, matched[length - 2])
          )
        : index
    )
  })

  // 当前router-link是否处于激活状态，activeRecordIndex大于-1并且，当前路由的params与目标路由的params相同
  const isActive = computed<boolean>(
    () =>
      activeRecordIndex.value > -1 &&
      includesParams(currentRoute.params, route.value.params)
  )
  // 是否完全匹配，目标路由必须和当前路由所匹配到的路由最后一个相同
  const isExactActive = computed<boolean>(
    () =>
      activeRecordIndex.value > -1 &&
      activeRecordIndex.value === currentRoute.matched.length - 1 &&
      isSameRouteLocationParams(currentRoute.params, route.value.params)
  )

  // 利用push或replace进行路由跳转
  function navigate(
    e: MouseEvent = {} as MouseEvent
  ): Promise<void | NavigationFailure> {
    // 对于一些特殊情况，不能进行跳转
    if (guardEvent(e)) {
      return router[unref(props.replace) ? 'replace' : 'push'](
        unref(props.to)
      ).catch(noop)
    }
    return Promise.resolve()
  }

  // devtools only
  if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && isBrowser) {
    // ...
  }

  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate,
  }
}
```

在进行路由跳转时，一些特殊情况下是不能跳转的，这些情况包括：

1. 按住了window`⊞`（MAC的`commond`）键、`alt`键、`ctrl`键、`shift`键中的任一键
2. 调用过`e.preventDefault()`
3. 右键
4. `target='_blank'`

```ts
function guardEvent(e: MouseEvent) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
  // don't redirect when preventDefault called
  if (e.defaultPrevented) return
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) return
  // don't redirect if `target="_blank"`
  // @ts-expect-error getAttribute does exist
  if (e.currentTarget && e.currentTarget.getAttribute) {
    // @ts-expect-error getAttribute exists
    const target = e.currentTarget.getAttribute('target')
    if (/\b_blank\b/i.test(target)) return
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) e.preventDefault()

  return true
}
```
