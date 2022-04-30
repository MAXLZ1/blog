# computed

::: tip
计算属性。接受一个`getter`函数，并根据`getter`函数的返回值返回一个不可变的响应式`ref`对象。或者，接受一个具有`get`和`set`函数的对象，用来创建可写的 ref 对象。

文件位置：packages/reactivity/src/computed.ts
:::

`computed`流程图：
![computed流程图]()

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

`computed`中，首先从`options`中确定`getter`、`setter`，确定好之后，创建一个`ComputedRefImpl`实例，并将其返回。

```ts
export class ComputedRefImpl<T> {
  public dep?: Dep = undefined

  private _value!: T
  public readonly effect: ReactiveEffect<T>

  // 标记为一个ref类型
  public readonly __v_isRef = true
  // 只读标识
  public readonly [ReactiveFlags.IS_READONLY]: boolean

  // 是否为脏数据，如果是脏数据需要重新计算
  public _dirty = true
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
    // computed可能被其他proxy包裹，如readonly(computed(() => foo.bar))
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

  set value(newValue: T) {
    this._setter(newValue)
  }
}
```

`ComputedRefImpl`构造器接收四个参数：`getter`、`setter`、`isReadonly`（是否只读）、`isSSR`（是否为`SSR`）。

在构造器内部创建一个`ReactiveEffect`实例，并将`getter`与一个调度函数传递给`ReactiveEffect`构造器，并将创建好的实例赋给当前实例的`effect`属性，然后将`this.effect.computed`指向当前对象。分析至此，我们发现此时并没有计算任何的数据，说明`computed`是懒惰的，只有使用到`computed`的返回结果，才能触发相关计算。接下来以下面一个例子继续向下分析。

```ts
const value = reactive<{ foo: number }>({ foo: 1 })
const cValue = computed(() => value.foo)
console.log(cValue.value) // 1
value.foo = 2
console.log(cValue.value) // 2
```

经过上面分析，我们知道`cValue`是个`ComputedRefImpl`实例。当打印`cValue.value`时，会命中`ComputedRefImpl`对应的`get`方法，在`get`中，收集对应依赖，再进行数据的计算，在计算之前会先判断是不是脏数据，只有是脏数据的时候才会进行数据的重新计算（`self.effect.run()`），并将计算完成后将数据缓存至`selft._vlaue`中，方便下次的利用。第一次通过`self.effect.run()`得到的结果为`1`。接下来修改`value`的`foo`属性，进入到`value`的`set`拦截器中，触发相关依赖，此时`foo`只有一个依赖，那就是在创建`ComputedRedImpl`过程中创建的`ReactiveEffect`，此时触发依赖就是触发这个`ReactiveEffect`，结合[依赖触发](https://maxlz1.github.io/blog/vue3-analysis/effect/%E8%A7%A6%E5%8F%91%E4%BE%9D%E8%B5%96.html)的流程，我们知道这时会执行创建`ReactiveEffect`时传入的`scheduler`。

在`scheduler`中把`_dirty`置为`true`，将数据标记为脏数据，以便下次读取时重新计算。再次打印`cValue.value`，命中`ComputedRefImpl`对应的`get`方法，因为在前一步赋值过程中，`_dirty`被标记为了`true`，所以这次会重新计算。打印`2`。


**`_dirty`什么时候变为`true`？**

当修改`computed`所依赖的响应式数据时，触发其对应的依赖，在触发依赖的过程中，会对新的值与旧值进行比较，如果新旧值不同，触发`effect.scheduler()`，在`scheduler`中会将`_dirty`置为`true`。

**总结**

`computed`本质也是个`ref`（`ComputedRefImpl`），会缓存计算的值，内部通过`_dirty`决定是否重新计算更新缓存的值。


