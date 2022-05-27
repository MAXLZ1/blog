# app.use(router)

> 文件位置：`src/router.ts`

在`vue-router 4.x`中，使用`createRouter`创建一个路由实例，并调用`app.use(router)`使整个应用支持路由。

```ts
import { createRouter, createWebHashHistory } from 'vue-router'
import { createApp } from 'vue'

const Home = { template: '<div>Home</div>' }
const About = { template: '<div>About</div>' }

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp({})
app.use(router)
app.mount('#app')
```

当调用`app.use`时，会调用`router`实例中的`install`的方法，并将`app`作为参数传入。让我们看看`router.install`做了些什么？

```ts
export function createRouter(options: RouterOptions): Router {
  // ...
  const router: Router = {
    // ...
    install(app: App) {
      const router = this
      // 注册RouterLink与RouterView组件
      app.component('RouterLink', RouterLink)
      app.component('RouterView', RouterView)

      // 注册全局属性，$router为当前router实例
      app.config.globalProperties.$router = router
      // 注册$route属性，当前路由信息
      Object.defineProperty(app.config.globalProperties, '$route', {
        enumerable: true,
        get: () => unref(currentRoute),
      })

      // 只在浏览器环境下初始化导航，在服务器上会创建额外的不必要的导航并可能导致问题
      if (
        isBrowser &&
        // 用于初始化客户端，避免路由被应用多个应用
        !started &&
        currentRoute.value === START_LOCATION_NORMALIZED
      ) {
        // 初始化后，started设置为true
        started = true
        // 第一次跳转 跳转到浏览器url中对应的路由
        push(routerHistory.location).catch(err => {
          if (__DEV__) warn('Unexpected error when starting the router:', err)
        })
      }

      // currentRoute转为响应式对象，以方便或许对其进行变化追踪
      const reactiveRoute = {} as {
        [k in keyof RouteLocationNormalizedLoaded]: ComputedRef<
          RouteLocationNormalizedLoaded[k]
          >
      }
      for (const key in START_LOCATION_NORMALIZED) {
        // @ts-expect-error: the key matches
        reactiveRoute[key] = computed(() => currentRoute.value[key])
      }

      // 向vue实例中注入相关provider，在组件中可使用inject进行接收：useRoute与useRouter就是使用inject实现的
      // 注意这里的key都是Symbol类型
      app.provide(routerKey, router)
      app.provide(routeLocationKey, reactive(reactiveRoute))
      app.provide(routerViewLocationKey, currentRoute)

      // 重写vue实例的卸载方法，以便重置一些属性并解除一些监听
      const unmountApp = app.unmount
      // 记录vue实例，installedApps是一个Set集合
      installedApps.add(app)
      app.unmount = function () {
        // 当app被卸载时，从集合中删除
        installedApps.delete(app)
        // 如果没有任何vue实例了，代表router不会被使用了，那么重置一些属性和解绑监听
        if (installedApps.size < 1) {
          // invalidate the current navigation
          pendingLocation = START_LOCATION_NORMALIZED
          removeHistoryListener && removeHistoryListener()
          removeHistoryListener = null
          currentRoute.value = START_LOCATION_NORMALIZED
          started = false
          ready = false
        }
        // 最后执行卸载方法
        unmountApp()
      }

      if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && isBrowser) {
        addDevtools(app, router, matcher)
      }
    },
  }
  
  return router
}
```

可以看到在`install`方法中，首先会注册`RouterLink`、`RouterView`两个组件，然后设置了两个全局的属性`$router`（路由实例）、`$route`（当前的路由信息），紧接着进行第一次跳转。紧接着又向`app`中注入了三个属性：`routerKey`、`routeLocationKey`、`routerViewLocationKey`，分别表示路由实例、深度响应式的当前路由信息对象、浅层响应式的当前路由信息对象，注意这里的`key`值实际是`Symbol`类型，这里列举的`key`只是变量的名称。然后对`app.unmount`vue实例的卸载方法进行了拦截，拦截的主要目的是在路由实例不被使用时，将一些属性重置并解绑一些监听事件。

**总的来说，`install`函数做了以下几件事：**
1. 注册`RouterLink`、`RouterView`组件
2. 设置全局属性`$router`、`$route`
3. 根据地址栏进行首次的路由跳转
4. 向`app`中注入一些路由相关信息，如路由实例、响应式的当前路由信息对象
5. 拦截`app.unmount`方法，在卸载之前重置一些属性、删除一些监听函数
