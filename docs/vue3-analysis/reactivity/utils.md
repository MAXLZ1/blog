# 响应式API：工具函数

## isRef

```ts
export function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true)
}
```

通过对象中是否存在`__v_isRef`属性并且`__v_isRef`对应值为`true`来判断是否为`ref`。

## unref

```ts
export function unref<T>(ref: T | Ref<T>): T {
  return isRef(ref) ? (ref.value as any) : ref
}
```

如果是`ref`则返回`ref.value`，否则直接返回`ref`

## toRef

```ts
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue?: T[K]
): ToRef<T[K]> {
  const val = object[key]
  return isRef(val)
    ? val
    : (new ObjectRefImpl(object, key, defaultValue) as any)
}
```

`toRef`接收三个参数：`object`待转换的对象、`key`待转换的`key`、`defaultValue`默认值。

如果`object[key]`是`ref`，则直接返回`object[key]`。否则返回一个`ObjectRefImpl`实例。

```ts
class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(
    private readonly _object: T,
    private readonly _key: K,
    private readonly _defaultValue?: T[K]
  ) {}

  get value() {
    const val = this._object[this._key]
    return val === undefined ? (this._defaultValue as T[K]) : val
  }

  set value(newVal) {
    this._object[this._key] = newVal
  }
}
```

在`ObjectRefImpl`构造器中会分别将`object`、`key`、`defaultValue`保存至自己的私有属性中，当获取`ObjectRefImpl`实例的`value`属性时，会从`this._object`中获取数据，由于`this._object`和原来的`object`内存地址是一致的，所以这和直接使用`object`获取`key`获取数据没有区别，只不过经过`toRef`转换之后，可以和`ref`那样，通过`value`属性进行取值、设值。

## toRefs

```ts
export function toRefs<T extends object>(object: T): ToRefs<T> {
  if (__DEV__ && !isProxy(object)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`)
  }
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
}
```

`toRefs`中会声明一个新的对象或数组，然后遍历`object`的`key`值，并调用`toRef`，将结果存入新的对象或数组中，最后返回这个新的对象或数组。

## isReactive

```ts
export function isReactive(value: unknown): boolean {
  if (isReadonly(value)) {
    return isReactive((value as Target)[ReactiveFlags.RAW])
  }
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}
```

如果`value`是只读的，那么就对`value`的`ReactiveFlags.RAW`属性继续调用`isReactive`；否则根据`value`的`ReactiveFlags.IS_REACTIVE`属性判断是否为`reactive`。

## isReadonly

```ts
export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}
```

通过`value`的`ReactiveFlags.IS_READONLY`属性判断是否只读。

## isProxy

`isProxy`是用来判断`value`是否为`reactive`或`readonly`，并不是用来判断`value`是`proxy`类型的

```ts
export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}
```

## toRaw

获取传入对象的原始对象。
```ts
export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}
```

`observed`的`ReactiveFlags.RAW`属性可以返回对象的原始对象，但这个原始对象有可能也是可以响应式对象（如`readonly(reactive(obj))`），所以递归调用`toRaw`，以获取真正的原始对象。

## markRaw

将对象标记为永远不能转为`reactive`对象。
```ts
export function markRaw<T extends object>(
  value: T
): T & { [RawSymbol]?: true } {
  def(value, ReactiveFlags.SKIP, true)
  return value
}
```

通过`Object.defineProperty`将`value`的`ReactiveFlags.SKIP`（不会被遍历）属性标记为`true`。当尝试创建`reactive`时，会检查该值。



