# ref

接受一个内部值，返回一个响应式的、可更改的`ref`对象，此对象只有一个指向其内部值的property`.value`

## 使用

```ts
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

## 源码解析

```ts
export function ref(value?: unknown) {
  return createRef(value, false)
}
```

`ref`返回`createRef`函数的返回值。

`createRef`接收两个参数：`rawValue`待转换的值、`shallow`浅层响应式。
```ts
function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}
```

如果`rawValue`本就是`ref`类型的会立即返回`rawValue`，否则返回一个`RefImpl`实例。

### RefImpl

```ts
class RefImpl<T> {
  private _value: T
  private _rawValue: T
  
  // 当前ref的依赖
  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this.__v_isShallow ? newVal : toReactive(newVal)
      triggerRefValue(this, newVal)
    }
  }
}
```

`RefImpl`的构造器接收两个值：`value`、`__v_isShallow`是否浅层响应式。

```ts
constructor(value: T, public readonly __v_isShallow: boolean) {
  // 获取原始值，如果是浅层响应式，原始值就是value；如果不是浅层响应式，原始值是value的原始值
  this._rawValue = __v_isShallow ? value : toRaw(value)
  // 响应式数据，如果是浅层响应式，是value；否则转为reactive（只有Object类型才会转为reactive）
  this._value = __v_isShallow ? value : toReactive(value)
}
```

当获取`new RefImpl()`的`value`属性时，会调用`trackRefValue`进行依赖收集，并返回`this._value`。
```ts
export function trackRefValue(ref: RefBase<any>) {
  if (shouldTrack && activeEffect) {
    ref = toRaw(ref)
    if (__DEV__) {
      trackEffects(ref.dep || (ref.dep = createDep()), {
        target: ref,
        type: TrackOpTypes.GET,
        key: 'value'
      })
    } else {
      // 收集依赖到ref.dep中
      trackEffects(ref.dep || (ref.dep = createDep()))
    }
  }
}
```

与`reactive`不同，`ref`的依赖会被保存在`ref.dep`中。

当修改`new RefImpl()`的`value`属性时，会调用`triggerRefValue`触发依赖。
```ts
set value(newVal) {
  newVal = this.__v_isShallow ? newVal : toRaw(newVal)
  // 当newVal与旧原始值不同时，触发依赖
  if (hasChanged(newVal, this._rawValue)) {
    // 更新原始值及响应式数据
    this._rawValue = newVal
    this._value = this.__v_isShallow ? newVal : toReactive(newVal)
    triggerRefValue(this, newVal)
  }
}
```

## shallowRef
`shallowRef`的实现同样通过`createRef`函数，不过参数`shallow`为`true`。
```ts
export function shallowRef(value?: unknown) {
  return createRef(value, true)
}
```

```ts
const state = shallowRef({ count: 1 })

effect(() => {
  console.log(state.value.count)
})

// 不会触发副作用
state.value.count = 2

// 可以触发副作用
state.value = {
  count: 3
}
```

**为什么`state.value.count = 2`不触发副作用？**
`state`初始化时，`state._value`就是`{ count: 1 }`，一个普通对象，当使用`state.value.count = 2`设置值时，会先触发`get`函数返回`state._value`，然后再修改`state._value`，因为`state._value`是普通对象，所以不会有副作用触发。

而当使用`state.value = { count: 3 }`方式进行修改时，会命中`set`函数，因为新的值与旧的原始值内存地址不同，所以会触发副作用。

## triggerRef
强制触发`ref`的副作用函数。

```ts
export function triggerRef(ref: Ref) {
  triggerRefValue(ref, __DEV__ ? ref.value : void 0)
}
```

实现原理很简单，就是主动调用一下`triggerRefValue`函数。

由于深度响应式的`ref`会自动进行依赖的触发，所以`triggerRef`主要应用于`shallowRef`的内部值进行深度变更后，主动调用`triggerRef`以触发依赖。例如前面的例子：

```ts
const state = shallowRef({ count: 1 })

effect(() => {
  console.log(state.value.count)
})

// 不会触发副作用
state.value.count = 2

// 主动触发副作用
triggerRef(state)

// 可以自动触发副作用
state.value = {
  count: 3
}
```

## customRef
创建一个自定义的`ref`，显式声明对其依赖追踪和更新触发的控制方式。

如创建一个防抖`ref`，即只在最近一次`set`调用后的一段固定间隔后再调用：
```ts
import { customRef } from 'vue'

export function useDebouncedRef(value, delay = 200) {
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

来看`customRef`的实现：
```ts
export function customRef<T>(factory: CustomRefFactory<T>): Ref<T> {
  return new CustomRefImpl(factory) as any
}
```

`customRef`返回一个`CustomRefImpl`实例。

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
```

`CustomRefImpl`的实现与`RefImpl`的实现差不多，都有个`value`的`get`、`set`函数，只不过`get`、`set`在内部会调用用户自己定义的`get`与`set`函数。当进行初始化时，会将收集依赖的函数与触发依赖的函数作为参数传递给`factory`，这样用户就可以自己控制依赖收集与触发的时机。


## 总结

`ref`的通过`class`实现，通过`class`的取值函数和存值函数进行依赖的收集与触发。

对于深度响应式的`ref`，会在向`value`属性赋值过程中，将新的值转为`reactive`，以达到深度响应式的效果。

