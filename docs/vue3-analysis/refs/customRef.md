# customRef

::: tip
自定义`ref`，可对依赖跟踪和更新触发进行显示控制。接收一个工厂函数，该工厂函数接收`track`、`trigger`两个函数，分表进行依赖跟踪及更新触发操作，返回一个带有`get`、`set`的对象
:::

用于防抖函数：
```ts
function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
```

[vueuse：refAutoReset](https://github.com/vueuse/vueuse/blob/main/packages/shared/refAutoReset/index.ts)的实现：
```ts
export function refAutoReset<T>(defaultValue: T, afterMs: MaybeRef<number> = 10000): Ref<T> {
  return customRef<T>((track, trigger) => {
    let value: T = defaultValue
    let timer: any

    const resetAfter = () =>
      setTimeout(() => {
        value = defaultValue
        trigger()
      }, unref(afterMs))

    tryOnScopeDispose(() => {
      clearTimeout(timer)
    })

    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = newValue
        trigger()

        clearTimeout(timer)
        timer = resetAfter()
      },
    }
  })
}
```

`customRef`函数返回了一个`CustomRefImpl`实例，该实例接收一个工厂函数。在创建`CustomRefImpl`实例过程中会执行函数并向工厂函数注入两个函数，分别是依赖收集、触发依赖的函数，将返回结果的`get`、`set`暂存起来，以便在`CustomRefImpl`的`get`、`set`方法中使用。
```ts
class CustomRefImpl<T> {
  public dep?: Dep = undefined

  private readonly _get: ReturnType<CustomRefFactory<T>>['get']
  private readonly _set: ReturnType<CustomRefFactory<T>>['set']

  public readonly __v_isRef = true

  constructor(factory: CustomRefFactory<T>) {
    const { get, set } = factory(
      () => trackRefValue(this),
      () => triggerRefValue(this)
    )
    this._get = get
    this._set = set
  }

  get value() {
    return this._get()
  }

  set value(newVal) {
    this._set(newVal)
  }
}

export function customRef<T>(factory: CustomRefFactory<T>): Ref<T> {
  return new CustomRefImpl(factory) as any
}
```
