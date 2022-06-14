# effectScope

:::tip
关于为什么要有`effectScope`可以参考[RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md)
:::

`effectScope`接收一个`boolean`值，如果传`true`代表游离模式，那么创建的`scope`不会被父`scope`收集，通俗来讲，如果是游离模式，那么`scope`之间是不存在父子关系的，每一个`scope`都是独立的。

```ts
export function effectScope(detached?: boolean) {
  return new EffectScope(detached)
}
```

`effectScope`返回一个`EffectScope`实例。

## EffectScope

```ts
export class EffectScope {
  active = true
  effects: ReactiveEffect[] = []
  cleanups: (() => void)[] = []

  parent: EffectScope | undefined
  scopes: EffectScope[] | undefined
  /**
   * track a child scope's index in its parent's scopes array for optimized
   * removal
   */
  private index: number | undefined

  constructor(detached = false) {
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope
      this.index =
        (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1
    }
  }

  run<T>(fn: () => T): T | undefined {
    if (this.active) {
      try {
        activeEffectScope = this
        return fn()
      } finally {
        activeEffectScope = this.parent
      }
    } else if (__DEV__) {
      warn(`cannot run an inactive effect scope.`)
    }
  }

  on() {
    activeEffectScope = this
  }

  off() {
    activeEffectScope = this.parent
  }

  stop(fromParent?: boolean) {
    if (this.active) {
      let i, l
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop()
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]()
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true)
        }
      }
      // nested scope, dereference from parent to avoid memory leaks
      if (this.parent && !fromParent) {
        // optimized O(1) removal
        const last = this.parent.scopes!.pop()
        if (last && last !== this) {
          this.parent.scopes![this.index!] = last
          last.index = this.index!
        }
      }
      this.active = false
    }
  }
}
```

### constructor

`EffectScope`构造器接收一个参数：`detached`，默认值为`false`，代表`EffectScope`是否是游离状态。

```ts
constructor(detached = false) {
  if (!detached && activeEffectScope) {
    this.parent = activeEffectScope
    this.index =
      (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1
  }
}
```

如果`detached`为`false`，并且存在`activeEffectScope`（`activeEffectScope`是个全局变量）的情况，会将`activeEffectScope`赋值给`this.parent`，同时会将当前`EffectScope`实例放入`activeEffectScope.scopes`中，并将`activeEffectScope.scopes`最后一个索引赋值给当前`EffectScope`实例的`index`属性。这样就可以通过`this.index`来获取`EffectScope`实例在父`scope`中的索引位置。

### run

`run`方法可以接收一个函数参数。

```ts
run<T>(fn: () => T): T | undefined {
  if (this.active) {
    try {
      activeEffectScope = this
      return fn()
    } finally {
      activeEffectScope = this.parent
    }
  } else if (__DEV__) {
    warn(`cannot run an inactive effect scope.`)
  }
}
```

`run`方法会首先对`this.active`进行判断，如果`this.active`为`true`，也就是`EffectScope`处于激活状态，那么会将`this`赋给`activeEffectScope`，然后执行`fn`，并返回其执行结果。当`fn`执行完毕后，将`activeEffectScope`改为`this.parent`。

### on

```ts

on() {
  activeEffectScope = this
}
```

`on`方法会将`activeEffectScope`指向当前`EffectScope`实例。

### off

```ts
off() {
  activeEffectScope = this.parent
}
```

`off`方法会将`activeEffectScope`指向当前`EffectScope`实例的父`scope`。

### stop

`stop`函数的作用是清除`scope`内的所有的响应式效果，包括子`scope`。`stop`接收一个`boolean`类型的`fromParent`参数，如果`fromParent`为`true`，`stop`将不会删除在父`scope`中的引用。

```ts
stop(fromParent?: boolean) {
  if (this.active) {
    let i, l
    // 调用ReactiveEffect.prototype.stop，清除scope内所有响应式效果
    for (i = 0, l = this.effects.length; i < l; i++) {
      this.effects[i].stop()
    }
    // 触发scope销毁时的监听函数
    for (i = 0, l = this.cleanups.length; i < l; i++) {
      this.cleanups[i]()
    }
    // 销毁子scope
    if (this.scopes) {
      for (i = 0, l = this.scopes.length; i < l; i++) {
        this.scopes[i].stop(true)
      }
    }
    // 嵌套范围，从父级取消引用以避免内存泄漏
    if (this.parent && !fromParent) {
      // 获取父scope的中最后一个scope
      const last = this.parent.scopes!.pop()
      // last不是当前的scope
      if (last && last !== this) {
        // 将last放在当前scope在parent.scopes中的索引位置
        this.parent.scopes![this.index!] = last
        // last.index改为this.index
        last.index = this.index!
      }
    }
    // 修改scope的激活状态
    this.active = false
  }
}
```

`stop`中的所有操作都要建立在`scope`处于激活状态的基础上。首先遍历`this.effects`执行元素的`stop`方法。

```ts
for (i = 0, l = this.effects.length; i < l; i++) {
  this.effects[i].stop()
}
```

`scope.effects`存储的是在`run`过程中获取到的`ReactiveEffect`实例，这些`ReactiveEffect`实例会通过一个`recordEffectScope`方法被添加到`scope.effects`中。

```ts
export function recordEffectScope(
  effect: ReactiveEffect,
  scope: EffectScope | undefined = activeEffectScope
) {
  if (scope && scope.active) {
    scope.effects.push(effect)
  }
}
```

当遍历完`scope.effects`或，会遍历`scope.cleanups`属性。

```ts
for (i = 0, l = this.cleanups.length; i < l; i++) {
      this.cleanups[i]()
    }
```

`scope.cleanups`中保存的是通过`onScopeDispose`添加的`scope`销毁监听函数。

```ts
export function onScopeDispose(fn: () => void) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn)
  } else if (__DEV__) {
    warn(
      `onScopeDispose() is called when there is no active effect scope` +
        ` to be associated with.`
    )
  }
}
```

如果当前`scope`存在`scopes`属性，意味着当前`scope`存在子`scope`，所以需要将所有子`scope`也进行销毁。

```ts
if (this.scopes) {
  for (i = 0, l = this.scopes.length; i < l; i++) {
    this.scopes[i].stop(true)
  }
}
```

如果当前`scope`存在`parent`的话，需要将`scope`从其`parent`中移除。

```ts
if (this.parent && !fromParent) {
  // 获取父scope的中最后一个scope
  const last = this.parent.scopes!.pop()
  // last不是当前的scope
  if (last && last !== this) {
    // 将last放在当前scope在parent.scopes中的索引位置
    this.parent.scopes![this.index!] = last
    // last.index改为this.index
    last.index = this.index!
  }
}
```

这里的移除过逻辑是，先获取当前`scope`的父`scope`中的所有子`scope`，然后取出最后一个`scope`，这里用`last`代表（注意`last`不一定和当前`scope`相同），如果`last`和当前`scope`不同的话，需要让`last`替换当前`scope`，这样我们就把当前`scope`从其父`scope`中移除了。这里仅仅替换是不够的，因为`last.index`此时还是之前父`scope`的最后一个索引，所以还需要把`last.index`改为当前`scope`在其父`scope.scopes`中的位置。这样就完全移除了`scope`。

最后，需要把`scope`的激活状态改为`false`。

```ts
this.active = false
```


## getCurrentScope

`getCurrentScope`可以获取当前处于活跃状态的`EffectScope`。这里处于活跃状态的`EffectScope`指得是当前执行环境在所处的那个`EffectScope`。

```ts
export function getCurrentScope() {
  return activeEffectScope
}
```
