# computed

::: tip
计算属性。接受一个`getter`函数，并根据`getter`函数的返回值返回一个不可变的响应式`ref`对象。或者，接受一个具有`get`和`set`函数的对象，用来创建可写的`ref`对象。

文件位置：packages/reactivity/src/computed.ts
:::

## 使用示例

只读的计算属性：

```ts
const count = ref(1)
const doubleCount = computed(() => count.value * 2)

console.log(doubleCount.value) // 2

count.value = 2
console.log(doubleCount.value) // 3
```

可写的计算属性：

```ts
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  }
})

console.log(plusOne.value) // 2

plusOne.value = 1
console.log(count.value) // 0
```

进行调试：

```ts
const count = ref(1)
const doubleCount = computed(() => count.value * 2, {
  onTrack(e) {
    console.log('track')
    console.log(e)
  },
  onTrigger(e) {
    console.log('trigger')
    console.log(e)
  }
})

// 触发track监听
console.log(doubleCount.value)

// 触发trigger监听
count.value++
```

## 源码

```ts
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions,
  isSSR = false
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR)

  if (__DEV__ && debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack
    cRef.effect.onTrigger = debugOptions.onTrigger
  }

  return cRef as any
}
```

`computed`接收两个参数，第二参数是依赖收集和触发依赖的钩子函数，只在开发环境中起作用，这里就不做解释了。主要看第一个参数，观察其类型，发现可以传两种参数：一种是一个`getter`函数，一种是个包含`get`、`set`的对象。

首先从`getterOrOptions`中确定`getter`、`setter`（如果`getterOrOptions`是个`function`，说明`computed`是不可写的，所以会将`setter`设置为一个空函数），确定好之后，创建一个`ComputedRefImpl`实例，并将其返回。

### ComputedRefImpl
```ts
export class ComputedRefImpl<T> {
  public dep?: Dep = undefined
  // 缓存的值
  private _value!: T
  // 在构造器中创建的ReactiveEffect实例
  public readonly effect: ReactiveEffect<T>

  // 标记为一个ref类型
  public readonly __v_isRef = true
  // 只读标识
  public readonly [ReactiveFlags.IS_READONLY]: boolean

  // 是否为脏数据，如果是脏数据需要重新计算
  public _dirty = true
  // 是否可缓存，取决于SSR
  public _cacheable: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean,
    isSSR: boolean
  ) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
    this.effect.computed = this
    this.effect.active = this._cacheable = !isSSR
    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    // computed可能被其他proxy包裹，如readonly(computed(() => foo.bar))，所以要获取this的原始对象
    const self = toRaw(this)
    // 收集依赖
    trackRefValue(self)
    // 如果是脏数据或者是SSR，需要重新计算
    if (self._dirty || !self._cacheable) {
      // _dirty取false，防止依赖不变重复计算
      self._dirty = false
      // 计算
      self._value = self.effect.run()!
    }
    return self._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}
```

#### 构造器

`ComputedRefImpl`构造器接收四个参数：`getter`、`setter`、`isReadonly`（是否只读）、`isSSR`（是否为`SSR`）。

```ts
constructor(
  getter: ComputedGetter<T>,
  private readonly _setter: ComputedSetter<T>,
  isReadonly: boolean,
  isSSR: boolean
) {
  this.effect = new ReactiveEffect(getter, () => {
    if (!this._dirty) {
      this._dirty = true
      triggerRefValue(this)
    }
  })
  // this.effect.computed指向this
  this.effect.computed = this
  // this.effect.active与this._cacheable在SSR中为false
  this.effect.active = this._cacheable = !isSSR
  this[ReactiveFlags.IS_READONLY] = isReadonly
}
```

在构造器中声明了一个`ReactiveEffect`，并将`getter`和一个调度函数作为参数传入，在调度器中如果`_dirty`为`false`，会将`_dirty`设置为`true`，并执行`triggerRefValue`函数。

`triggerRefValue`可以接受两个值：`ref`、`newVal`。
```ts
export function triggerRefValue(ref: RefBase<any>, newVal?: any) {
  ref = toRaw(ref)
  if (ref.dep) {
    if (__DEV__) {
      triggerEffects(ref.dep, {
        target: ref,
        type: TriggerOpTypes.SET,
        key: 'value',
        newValue: newVal
      })
    } else {
      triggerEffects(ref.dep)
    }
  }
}
```
`triggerRefValue`中首先获取`ref`的原始对象，如果`ref`的原始对象中有`dep`属性，则触发`dep`中的依赖。


在初始化`effect`之后，会将这个`effect`赋给`ComputedRefImpl`实例的`effect`属性，并将`effect.computed`指向`ComputedRefImpl`实例

#### value取值函数

```ts
get value() {
  // computed可能被其他proxy包裹，如readonly(computed(() => foo.bar))，所以要获取this的原始对象
  const self = toRaw(this)
  // 收集依赖
  trackRefValue(self)
  // 如果是脏数据，需要重新计算
  if (self._dirty || !self._cacheable) {
    // _dirty取false，防止依赖不变重复计算
    self._dirty = false
    // 计算
    self._value = self.effect.run()!
  }
  return self._value
}
```

当读取`ComputedRefImpl`实例的`value`属性时，由于计算属性可能被其他proxy包裹，所以需要使用`toRaw`获取其原始对象。

```ts
const self = toRaw(this)
```

然后调用`trackRefValue`进行依赖的收集。

```ts
export function trackRefValue(ref: RefBase<any>) {
  // 如果允许收集并且存在activeEffect进行依赖收集
  if (shouldTrack && activeEffect) {
    ref = toRaw(ref)
    if (__DEV__) {
      trackEffects(ref.dep || (ref.dep = createDep()), {
        target: ref,
        type: TrackOpTypes.GET,
        key: 'value'
      })
    } else {
      trackEffects(ref.dep || (ref.dep = createDep()))
    }
  }
}
```

接着根据`_dirty`与`_cacheable`属性来决定是否需要修改`self._value`，其中`_dirty`表示是否为脏数据，`_cacheable`表示是否可以缓存（取决于是否为服务端渲染，如果为服务端渲染则不可以缓存）。如果是脏数据或不可以被缓存，那么会将`_dirty`设置为`false`，并调用`self.effect.run()`，修改`self._value`。

```ts
if (self._dirty || !self._cacheable) {
  self._dirty = false
  self._value = self.effect.run()!
}
```

最后返回`self._value`

```ts
return self._value
```

#### value存值函数

```ts
set value(newValue: T) {
  this._setter(newValue)
}
```

当修改`ComputedRefImpl`实例的`value`属性时，会调用实例的`_setter`函数。

到此，你会发现`computed`是懒惰的，只有使用到`computed`的返回结果，才能触发相关计算。



为了加深对`computed`的理解，接下来以一个例子分析`computed`的缓存及计算过程：

```ts
const value = reactive({ foo: 1 })
const cValue = computed(() => value.foo)
console.log(cValue.value) // 1

value.foo = 2
console.log(cValue.value) // 2
```

当打印`cValue.value`时，会命中`ComputedRefImpl`对应的`get`方法，在`get`中，执行`trackRefValue`收集对应依赖（由于此时没有处于活跃状态的`effect`，即`activeEffect`，所以并不会进行依赖的收集），默认`_dirty`为`true`，将`_dirty`设置为`false`，并执行`effect.run`，计算数据，计算完成后将数据缓存至`selft._vlaue`中，方便下次的利用。在调用`effect.run`过程中，会将在`ComputedRefImpl`构造器中创建的`ReactiveEffect`实例收集到`targetMap[toRaw(value)].foo`中。

当修改`value.foo = 2`，触发`targetMap[toRaw(value)].foo`中的依赖，由于在初始化`ReactiveEffect`时，设置了一个调度器，所以在触发依赖过程中会执行这个调度器。这个调度器中会判断如果`_dirty===false`，则将`_dirty`设置为`true`，并手动调用`triggerRefValue`触发依赖，在调用`triggerRefValue`的过程中，因为`cValue.dep=undefined`，所以没有依赖要触发。

当第二次打印`cValue.value`时，由于`_dirty`为`true`，所以会执行`cValue.effect.run`，并将结果赋值给`cValue._value`，最后返回`cValue._value`，打印结果`2`


## 总结

`computed`本质也是个`ref`（`ComputedRefImpl`），它是懒惰的，如果不使用计算属性，那么是不会进行计算的，只有使用它，才会调用计算属性中的`effect.run`方法进行计算，同时将结果缓存到`_value`中。

`computed`如何重新计算？

首先在第一次获取计算属性的值的过程中会进行依赖的收集，假设计算属性的计算与响应式对象的a、b两个属性有关，那么会将`computed`中生成的`ReactiveEffect`实例收集到`targetMap[obj].a`、`targetMap[obj].b`中，一旦`a`或`b`属性变化了，会触发依赖，而在依赖的触发过程中会执行调度函数，在调度函数中会会将脏数据的标识`_dirty`设置为`true`，并触发计算属性的依赖。那么在下一次使用到计算属性的话，由于`_dirty`为`true`，便会调用计算属性中的`effect.run`方法重新计算值。




