# \<router-view\>

::: tip
用来包裹路由组件。

源码位置：`src/RouterView.ts`
:::

```ts
export const RouterViewImpl = /*#__PURE__*/ defineComponent({
  name: 'RouterView',
  inheritAttrs: false,
  props: {
    // 如果设置了name，渲染对应路由配置下中components下的相应组件
    name: {
      type: String as PropType<string>,
      default: 'default',
    },
    route: Object as PropType<RouteLocationNormalizedLoaded>,
  },

  // 为@vue/compat提供更好的兼容性
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },

  setup(props, { attrs, slots }) {
    // 如果<router-view>的父节点是<keep-alive>或<transition>进行提示
    __DEV__ && warnDeprecatedUsage()

    // 当前路由
    const injectedRoute = inject(routerViewLocationKey)!
    // 要展示的路由，优先取props.route
    const routeToDisplay = computed(() => props.route || injectedRoute.value)
    // router-view的深度，从0开始
    const depth = inject(viewDepthKey, 0)
    // 要展示的路由匹配到的路由
    const matchedRouteRef = computed<RouteLocationMatched | undefined>(
      () => routeToDisplay.value.matched[depth]
    )

    provide(viewDepthKey, depth + 1)
    provide(matchedRouteKey, matchedRouteRef)
    provide(routerViewLocationKey, routeToDisplay)

    const viewRef = ref<ComponentPublicInstance>()
    
    watch(
      () => [viewRef.value, matchedRouteRef.value, props.name] as const,
      ([instance, to, name], [oldInstance, from, oldName]) => {
        if (to) {
          // 当导航到一个新的路由，更新组件实例
          to.instances[name] = instance
          // 组件实例被应用于不同路由
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards
            }
          }
        }

        // 触发beforeRouteEnter next回调
        if (
          instance &&
          to &&
          (!from || !isSameRouteRecord(to, from) || !oldInstance)
        ) {
          ;(to.enterCallbacks[name] || []).forEach(callback =>
            callback(instance)
          )
        }
      },
      { flush: 'post' }
    )

    return () => {
      const route = routeToDisplay.value
      const matchedRoute = matchedRouteRef.value
      // 需要显示的组件
      const ViewComponent = matchedRoute && matchedRoute.components[props.name]
      const currentName = props.name

      // 如果找不到对应组件，使用默认的插槽
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route })
      }

      // 路由中的定义的props
      const routePropsOption = matchedRoute!.props[props.name]
      // 如果routePropsOption为空，取null
      // 如果routePropsOption为true，取route.params
      // 如果routePropsOption是函数，取函数返回值
      // 其他情况取routePropsOption
      const routeProps = routePropsOption
        ? routePropsOption === true
          ? route.params
          : typeof routePropsOption === 'function'
          ? routePropsOption(route)
          : routePropsOption
        : null

      // 当组件实例被卸载时，删除组件实例以防止泄露
      const onVnodeUnmounted: VNodeProps['onVnodeUnmounted'] = vnode => {
        if (vnode.component!.isUnmounted) {
          matchedRoute!.instances[currentName] = null
        }
      }

      // 生成组件
      const component = h(
        ViewComponent,
        assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef,
        })
      )

      if (
        (__DEV__ || __FEATURE_PROD_DEVTOOLS__) &&
        isBrowser &&
        component.ref
      ) {
        // ...
      }

      return (
        // 有默认插槽则使用默认默认插槽，否则直接使用component
        normalizeSlot(slots.default, { Component: component, route }) ||
        component
      )
    }
  },
})
```

为了更好理解`router-view`的渲染过程，我们看下面的例子：

先规定我们的路由表如下：

```ts
const router = createRouter({
  // ...
  // Home和Parent都是两个简单组件
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Home,
    },
    {
      name: 'Parent',
      path: '/parent',
      component: Parent,
    },
  ]
})
```

假设我们的地址是`http://localhost:3000`。现在我们访问`http://localhost:3000`，你肯定能够想到`router-view`中显示的肯定是`Home`组件。那么它是怎样渲染出来的呢？

首先我们要知道`vue-router`在进行`install`时，会进行第一次的路由跳转并立马向`app`注入一个默认的`currentRoute`（`START_LOCATION_NORMALIZED`），此时`router-view`会根据这个`currentRoute`进行第一次渲染。因为这个默认的`currentRoute`中的`matched`是空的，所以第一次渲染的结果是空的。等到第一次路由跳转完毕后，会执行一个`finalizeNavigation`方法，在这个方法中更新`currentRoute`，这时在`currentRoute`中就可以找到需要渲染的组件`Home`，`router-view`完成第二次渲染。第二次完成渲染后，紧接着触发`router-view`中的`watch`，将最新的组件实例赋给`to.instance[name]`，并循环执行`to.enterCallbacks[name]`（通过在钩子中使用`next()`添加的函数，具体参考[push](https://maxlz1.github.io/blog/vue-router/push.html)），过程结束。

然后我们从`http://localhost:3000`跳转至`http://localhost:3000/parent`，假设使用`push`进行跳转，同样在跳转 在跳转完成后会执行`finalizeNavigation`，更新`currentRoute`，这时`router-view`监听到`currentRoute`的变化，找到需要渲染的组件，将其显示。在渲染前先执行旧组件卸载钩子，将路由对应的`instance`重置为`null`。渲染完成后，接着触发`watch`，将最新的组件实例赋给`to.instance[name]`，并循环执行`to.enterCallbacks[name]`，过程结束。


**总结**

`router-view`根据`currentRoute`及`depth`找到匹配到的路由，然后根据`props.name`、`slots.default`来确定需要展示的组件。
