# mapStores

::: tip
使用`mapStore`获取完整的`store`。
:::

## 使用

```ts
import { mapStores } from 'pinia'

const useUserStore = defineStore('user', {
  // ...
})
const useCartStore = defineStore('cart', {
  // ...
})

export default {
  computed: {
    ...mapStores(useCartStore, useUserStore)
  },

  methods: {
    async buyStuff() {
      if (this.userStore.isAuthenticated()) {
        await this.cartStore.buy()
      }
    },
  },
}
```

## 源码分析

```ts
export function mapStores<Stores extends any[]>(
  ...stores: [...Stores]
): _Spread<Stores> {
  // 如果接收的是个数组参数，进行提示
  if (__DEV__ && Array.isArray(stores[0])) {
    console.warn(
      `[🍍]: Directly pass all stores to "mapStores()" without putting them in an array:\n` +
        `Replace\n` +
        `\tmapStores([useAuthStore, useCartStore])\n` +
        `with\n` +
        `\tmapStores(useAuthStore, useCartStore)\n` +
        `This will fail in production if not fixed.`
    )
    // 开发环境下stores取第一个值
    stores = stores[0]
  }

  // 返回一个对象
  return stores.reduce((reduced, useStore) => {
    // reduced的key值：useStore.$id + mapStoreSuffix(默认Store，可使用setMapStoreSuffix进行修改)
    reduced[useStore.$id + mapStoreSuffix] = function (
      this: ComponentPublicInstance
    ) {
      // 使用useStore获取store，在组件中可通过this.$pinia获取pinia
      return useStore(this.$pinia)
    }
    return reduced
  }, {} as _Spread<Stores>)
}
```

`mapStores`可接收多个`useStore`函数。

`mapStores`会对参数进行校验，如果传入的第一个参数为数组，那么在开发环境下会进行提示，并将数组中的第一个值赋给`stores`，以保证开发环境下能够运行。然后返回一个对象，该对象通过`stores.reduce`生成，对象的`key`值是由`useStore.$id + mapStoreSuffix`组成，对应的`value`是个函数，在函数中会调用`useStore(this.$pinia)`，返回其结果。
