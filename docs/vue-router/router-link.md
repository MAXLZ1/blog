# \<router-link\>

:::tip
使用`router-link`来创建链接，可以使`vue-router`可以在不重新加载页面的情况下更改URL，处理URL的生成及编码。

源码位置：`src/RouterLink.ts`
:::

```ts
// /*#__PURE__*/ 用于tree-shaking，如果未使用不打包
export const RouterLinkImpl = /*#__PURE__*/ defineComponent({
  name: 'RouterLink',
  props: {
    // 目标路由的链接
    to: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      required: true,
    },
    // 决定是否调用router.push()还是router.replace()
    replace: Boolean,
    // 链接被激活时，用于渲染a标签的class
    activeClass: String,
    // inactiveClass: String,
    // 链接精准激活时，用于渲染a标签的class
    exactActiveClass: String,
    // 是否不应该将内容包裹在<a/>标签中
    custom: Boolean,
    // 传递给aria-current属性的值。https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current
    ariaCurrentValue: {
      type: String as PropType<RouterLinkProps['ariaCurrentValue']>,
      default: 'page',
    },
  },
  useLink,

  setup(props, { slots }) {
    // 使用useLink创建router-link所需的一些属性
    const link = reactive(useLink(props))
    // createRouter时传入的options
    const { options } = inject(routerKey)!

    // class对象
    const elClass = computed(() => ({
      [getLinkClass(
        props.activeClass,
        options.linkActiveClass,
        'router-link-active'
      )]: link.isActive, // 被激活时的class
      [getLinkClass(
        props.exactActiveClass,
        options.linkExactActiveClass,
        'router-link-exact-active'
      )]: link.isExactActive, // 被精准激活的class
    }))

    return () => {
      // 默认插槽
      const children = slots.default && slots.default(link)
      // 如果设置了props.custom，直接显示chldren，反之需要使用a标签包裹
      return props.custom
        ? children
        : h(
            'a',
            {
              'aria-current': link.isExactActive
                ? props.ariaCurrentValue
                : null,
              href: link.href,
              onClick: link.navigate,
              class: elClass.value,
            },
            children
          )
    }
  },
})

export const RouterLink = RouterLinkImpl as unknown as {
  new (): {
    $props: AllowedComponentProps &
      ComponentCustomProps &
      VNodeProps &
      RouterLinkProps

    $slots: {
      default: (arg: UnwrapRef<ReturnType<typeof useLink>>) => VNode[]
    }
  }
  useLink: typeof useLink
}
```

可以看出`router-link`中的逻辑很大一部分是靠`useLink`进行实现的。关于`useLink`可参考：[useLink](https://maxlz1.github.io/blog/vue-router/useLink.html)
