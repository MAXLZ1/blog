# createWebHashHistory

::: tip
创建一个hash历史记录。

文件位置：`src/history/hash.ts`
:::

`createWebHashHistory`实现很简单：

```ts
export function createWebHashHistory(base?: string): RouterHistory {
  // 对于使用文件协议打开的页面location.host是空字符串，这时的base为''
  // 也就是说在使用文件协议打开页面时，设置了base是不生效的，因为base始终是''
  base = location.host ? base || location.pathname + location.search : ''
  // allow the user to provide a `#` in the middle: `/base/#/app`
  if (!base.includes('#')) base += '#'

  if (__DEV__ && !base.endsWith('#/') && !base.endsWith('#')) {
    warn(
      `A hash base must end with a "#":\n"${base}" should be "${base.replace(
        /#.*$/,
        '#'
      )}".`
    )
  }
  return createWebHistory(base)
}
```

`createWebHashHistory`在内部判断`base`是否含有`#`，如果没有的话在尾部追加一个`#`。最后返回`createWebHistory(base)`。

关于最终生成的`base`这里给几个示例（以`https://example.com/folder`为例）：

- `createWebHashHistory()`：最终`base`为`/floder#`
- `createWebHashHistory('/folder/')`：最终`base`为`/floder/#`
- `createWebHashHistory('/folder/#/app/')`：最终`base`为`/folder/#/app/`
- `createWebHashHistory('/other-folder/')`：最终`base`为`/other-folder/#`

对于文件协议`file:///usr/etc/folder/index.html`

- `createWebHashHistory('/iAmIgnored')`：最终`base`为`#`
