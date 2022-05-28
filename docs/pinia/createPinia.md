# createPinia

::: tip
通过`createPinia`创建一个`pinia`实例，供应用程序使用。

源码位置：`packages/pinia/src/createPinia.ts`
:::

`createPinia`不接受任何参数，它会返回一个`pinia`实例。

在`createPinia`中首先会创建一个`effect`作用域对象（如果你不了解`effectScope`，可参考：[RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md)），使用`ref`创建一个响应式对象。紧接着声明了两个数组`_p`、`toBeInstalled`，其中`_p`用来存储扩展`store`的所有插件，`toBeInstalled`用来存储那些未`install`之前使用`pinia.use()`添加的的`plugin`。

```ts
// 创建effect作用域
const scope = effectScope(true)
// 创建响应式对象
const state = scope.run<Ref<Record<string, StateTree>>>(() =>
  ref<Record<string, StateTree>>({})
)!

// 存储扩展store的plugin
let _p: Pinia['_p'] = []
// install之前，使用pinia.use()添加的plugin
let toBeInstalled: PiniaPlugin[] = []
```

然后声明一个`pinia`对象（这个`pinia`会使用`markRaw`进行包装，使其不会转为`proxy`），将其`return`。

```ts
const pinia: Pinia = markRaw({
  install(app: App) {
    // ...
  },

  use(plugin) {
    // ...
  },

  // 扩展store的plugins
  _p,
  // app实例
  _a: null,
  // effecet作用域对象
  _e: scope,
  // 在这个pinia中注册的stores
  _s: new Map<string, StoreGeneric>(),
  state,
})

if (__DEV__ && IS_CLIENT && !__TEST__) {
  pinia.use(devtoolsPlugin)
}

return pinia
```

这里重点看下`install`和`use`方法。

## `install`
当使用`app.use(pinia)`时，触发`pinia.install`函数。在`install`中首先执行了`setActivePinia(pinia)`，它会将`pinia`赋给一个`activePinia`的全局变量。

然后会判断是不是`Vue2`环境。如果不是`Vue2`，将`app`实例赋给`pinia._a`，然后将`pinia`注入到`app`实例，并将`pinia`设置为全局属性`$pinia`。如果此时`toBeInstalled`中有`plugins`（在`install`之前添加的`plugins`），那么会把这些`plugins`添加到`pinia._p`中，添加完之后，置空`toBeInstalled`。

```ts
install(app: App) {
  setActivePinia(pinia)
  if (!isVue2) {
    pinia._a = app
    app.provide(piniaSymbol, pinia)
    app.config.globalProperties.$pinia = pinia
    if (__DEV__ && IS_CLIENT) {
      registerPiniaDevtools(app, pinia)
    }
    toBeInstalled.forEach((plugin) => _p.push(plugin))
    toBeInstalled = []
  }
}
```

## `use`

使用`use`方法可添加一个`plugin`以扩展每个`store`。它接收一个`plugin`参数，返回当前`pinia`。

如果`this._a`是空的，并且不是`Vue2`环境，会将`plugin`中暂存到`toBeInstalled`中，等待`install`时进行安装。否则，直接添加到`this._p`中。

```ts
use(plugin) {
  if (!this._a && !isVue2) {
    toBeInstalled.push(plugin)
  } else {
    _p.push(plugin)
  }
  return this
}
```

你可能有疑问，在`install`、`use`中都判断了`Vue2`的情况，难道`pinia`没有处理`Vue2`的情况吗？其实并不是，`pinia`提供了`PiniaVuePlugin`专门用来处理`Vue2`的情况。

如果是`Vue2`需要使用如下方式：

```ts
Vue.use(PiniaVuePlugin)

const pinia = createPinia()

new Vue({
  el: '#app',
  pinia,
})
```

## `PiniaVuePlugin`

我们来看下`PiniaVuePlugin`的实现方式。

```ts
export const PiniaVuePlugin: Plugin = function (_Vue) {
  // Equivalent of
  // app.config.globalProperties.$pinia = pinia
  _Vue.mixin({
    beforeCreate() {
      const options = this.$options
      if (options.pinia) {
        const pinia = options.pinia as Pinia
        if (!(this as any)._provided) {
          const provideCache = {}
          Object.defineProperty(this, '_provided', {
            get: () => provideCache,
            set: (v) => Object.assign(provideCache, v),
          })
        }
        ;(this as any)._provided[piniaSymbol as any] = pinia

        if (!this.$pinia) {
          this.$pinia = pinia
        }

        pinia._a = this as any
        if (IS_CLIENT) {
          setActivePinia(pinia)
          if (__DEV__) {
            registerPiniaDevtools(pinia._a, pinia)
          }
        }
      } else if (!this.$pinia && options.parent && options.parent.$pinia) {
        this.$pinia = options.parent.$pinia
      }
    },
    destroyed() {
      delete this._pStores
    },
  })
}
```

`PiniaVuePlugin`通过向全局混入一个对象来支持`pinia`。这个对象有两个生命周期函数：`beforeCreate`、`destory`。

在`beforeCreate`中设置`this.$pinia`，以使`vue`实例可以通过`this.$pinia`的方式来获取`pinia`
