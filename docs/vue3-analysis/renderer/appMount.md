# 应用的挂载

>在`vue`项目的入口文件，我们都需要使用`createApp`创建一个或多个应用实例，并调用应用实例的`mount`方法挂载到指定的DOM元素中。

## 创建实例

使用`createApp`创建一个应用实例。它可以接受两个参数：`rootComponent`（根组件）、`rootProps`（根组件所需的`props`）

```ts
export type CreateAppFunction<HostElement> = (
  rootComponent: Component,
  rootProps?: Data | null
) => App<HostElement>
```

源码位置：`packages/runtime-dom/src/index.ts`

```ts
export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args)

  if (__DEV__) {
    injectNativeTagCheck(app)
    injectCompilerOptionsCheck(app)
  }

  const { mount } = app
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    const container = normalizeContainer(containerOrSelector)
    if (!container) return

    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML
      if (__COMPAT__ && __DEV__) {
        for (let i = 0; i < container.attributes.length; i++) {
          const attr = container.attributes[i]
          if (attr.name !== 'v-cloak' && /^(v-|:|@)/.test(attr.name)) {
            compatUtils.warnDeprecation(
              DeprecationTypes.GLOBAL_MOUNT_CONTAINER,
              null
            )
            break
          }
        }
      }
    }

    container.innerHTML = ''
    const proxy = mount(container, false, container instanceof SVGElement)
    if (container instanceof Element) {
      container.removeAttribute('v-cloak')
      container.setAttribute('data-v-app', '')
    }
    return proxy
  }

  return app
}) as CreateAppFunction<Element>
```

在前面文章中介绍渲染器时，我们知道在`createApp`中，首先会创建渲染器，并调用渲染器的`createApp`方法创建一个实例。接下来我们继续看`createApp`后续的处理。

在开发环境下，会调用`injectNativeTagCheck`、`injectCompilerOptionsCheck`两个方法。
```ts
if (__DEV__) {
  injectNativeTagCheck(app)
  injectCompilerOptionsCheck(app)
}
```

其中`injectNativeTagCheck`方法会修改`app.config.isNativeTag`，一个判断`tag`是否为原生标签，会被用于验证组件的名称。
```ts
function injectNativeTagCheck(app: App) {
  Object.defineProperty(app.config, 'isNativeTag', {
    value: (tag: string) => isHTMLTag(tag) || isSVGTag(tag),
    writable: false
  })
}
```

`injectCompilerOptionsCheck`方法主要检查编译参数的设置是否设置正确，检查的前提是`isRuntimeOnly()`，只在运行时时期进行检查，即不存在将模板转为渲染函数的函数`compiler`
```ts
function injectCompilerOptionsCheck(app: App) {
  if (isRuntimeOnly()) {
    const isCustomElement = app.config.isCustomElement
    Object.defineProperty(app.config, 'isCustomElement', {
      get() {
        return isCustomElement
      },
      set() {
        warn(
          `The \`isCustomElement\` config option is deprecated. Use ` +
          `\`compilerOptions.isCustomElement\` instead.`
        )
      }
    })

    const compilerOptions = app.config.compilerOptions
    const msg =
      `The \`compilerOptions\` config option is only respected when using ` +
      `a build of Vue.js that includes the runtime compiler (aka "full build"). ` +
      `Since you are using the runtime-only build, \`compilerOptions\` ` +
      `must be passed to \`@vue/compiler-dom\` in the build setup instead.\n` +
      `- For vue-loader: pass it via vue-loader's \`compilerOptions\` loader option.\n` +
      `- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n` +
      `- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom`

    Object.defineProperty(app.config, 'compilerOptions', {
      get() {
        warn(msg)
        return compilerOptions
      },
      set() {
        warn(msg)
      }
    })
  }
}
```

然后对`app`的`mount`方法进行了重写，并返回了`app`。可见我们调用`createApp`的`mount`方法就是此处的`mount`。接下来我们看应用是如何进行挂载的

## 应用的挂载

`mount`函数接收一个参数：`containerOrSelector`（一个容器，它可以选择器、ShadowDom，也可以是个DOM节点）。

```ts
app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
  const container = normalizeContainer(containerOrSelector)
  if (!container) return

  const component = app._component
  if (!isFunction(component) && !component.render && !component.template) {
    component.template = container.innerHTML
    if (__COMPAT__ && __DEV__) {
      for (let i = 0; i < container.attributes.length; i++) {
        const attr = container.attributes[i]
        if (attr.name !== 'v-cloak' && /^(v-|:|@)/.test(attr.name)) {
          compatUtils.warnDeprecation(
            DeprecationTypes.GLOBAL_MOUNT_CONTAINER,
            null
          )
          break
        }
      }
    }
  }

  container.innerHTML = ''
  const proxy = mount(container, false, container instanceof SVGElement)
  if (container instanceof Element) {
    container.removeAttribute('v-cloak')
    container.setAttribute('data-v-app', '')
  }
  return proxy
}
```

因为`containerOrSelector`可能是的类型可能是字符串、`ELement`、`ShadowRoot`，所以调用`normalizeContainer`方法对参数进行标准化处理。

```ts
function normalizeContainer(
  container: Element | ShadowRoot | string
): Element | null {
  if (isString(container)) {
    const res = document.querySelector(container)
    if (__DEV__ && !res) {
      warn(
        `Failed to mount app: mount target selector "${container}" returned null.`
      )
    }
    return res
  }
  if (
    __DEV__ &&
    window.ShadowRoot &&
    container instanceof window.ShadowRoot &&
    container.mode === 'closed'
  ) {
    warn(
      `mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`
    )
  }
  return container as any
}
```

如果没有找到对应的`container`直接`return`。

然后获取`app`的根组件`app._component`。如果根组件不是个`function`，也没有对应的`render`、`tempalte`属性，会将`container.innerHTML`作为根组件的`template`属性。

```ts
const component = app._component
if (!isFunction(component) && !component.render && !component.template) {
  // 将container.innerHTML作为根组件的template属性
  component.template = container.innerHTML
  // 2.x兼容
  if (__COMPAT__ && __DEV__) {
    for (let i = 0; i < container.attributes.length; i++) {
      const attr = container.attributes[i]
      if (attr.name !== 'v-cloak' && /^(v-|:|@)/.test(attr.name)) {
        compatUtils.warnDeprecation(
          DeprecationTypes.GLOBAL_MOUNT_CONTAINER,
          null
        )
        break
      }
    }
  }
}
```

紧接着，将`container`中的内容设置为空，并调用`mount`方法生成一个`proxy`。如果`container`是个`Element`，会移除其`v-cloak`属性，并添加一个值为空的`data-v-app`属性，最后返回`proxy`。
```ts
container.innerHTML = ''
const proxy = mount(container, false, container instanceof SVGElement)
if (container instanceof Element) {
  container.removeAttribute('v-cloak')
  container.setAttribute('data-v-app', '')
}
return proxy
```

`v-clock`主要用于DOM内模板，在模板未编译完成之间，用户可能先看到原始双大括号标签，直到挂载的组件将它们替换为渲染的内容。所以通过添加`v-cloak`配合`[v-cloak] { display: none }`CSS将其暂时隐藏起来，等到实例挂载完成后，再将`v-cloak`移除。

## mount

`mount`方法可以接收三个参数：`rootContainer`（根容器）、`isHydrate`（是否注水）、`isSVG`（根容器是否为SVG）
```ts
mount(
  rootContainer: HostElement,
  isHydrate?: boolean,
  isSVG?: boolean
): any {
  if (!isMounted) {
    if (__DEV__ && (rootContainer as any).__vue_app__) {
      warn(
        `There is already an app instance mounted on the host container.\n` +
        ` If you want to mount another app on the same host container,` +
        ` you need to unmount the previous app by calling \`app.unmount()\` first.`
      )
    }
    const vnode = createVNode(
      rootComponent as ConcreteComponent,
      rootProps
    )
    vnode.appContext = context

    if (__DEV__) {
      context.reload = () => {
        render(cloneVNode(vnode), rootContainer, isSVG)
      }
    }

    if (isHydrate && hydrate) {
      hydrate(vnode as VNode<Node, Element>, rootContainer as any)
    } else {
      render(vnode, rootContainer, isSVG)
    }
    isMounted = true
    app._container = rootContainer
    ;(rootContainer as any).__vue_app__ = app

    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      app._instance = vnode.component
      devtoolsInitApp(app, version)
    }

    return getExposeProxy(vnode.component!) || vnode.component!.proxy
  } else if (__DEV__) {
    warn(
      `App has already been mounted.\n` +
      `If you want to remount the same app, move your app creation logic ` +
      `into a factory function and create fresh app instances for each ` +
      `mount - e.g. \`const createMyApp = () => createApp(App)\``
    )
  }
}
```

在`mount`中首先会判断是否已经挂载，如果没过载过，则进行挂载。

在挂载过程中，会先检查`rootContainer.__vue_app__`属性，如果存在`rootContainer.__vue_app__`，说明`rootContainer`已经挂载一个实例了，此时会进行一个提示。
```ts
if (__DEV__ && (rootContainer as any).__vue_app__) {
  warn(
    `There is already an app instance mounted on the host container.\n` +
    ` If you want to mount another app on the same host container,` +
    ` you need to unmount the previous app by calling \`app.unmount()\` first.`
  )
}
```

紧接着创建根组件的`vnode`，并将上下文对象保存到设置`vnode`的`appContext`。注意这里创建`vnode`时传入的第一个参数是根组件。
```ts
const vnode = createVNode(
  rootComponent as ConcreteComponent,
  rootProps
)
vnode.appContext = context
```

然后渲染`vnode`，如果是同构渲染使用`hydrate`，否在调用`render`进行渲染，渲染完成后，将`isMounted`设置为`true`，表示已经挂载完毕，同时将`rootContainer`保存到`app`实例的`_container`中，并将`app`实例保存在`rootContainer`的`__vue_app__`属性中。
```ts
if (isHydrate && hydrate) {
  hydrate(vnode as VNode<Node, Element>, rootContainer as any)
} else {
  render(vnode, rootContainer, isSVG)
}
isMounted = true
app._container = rootContainer
;(rootContainer as any).__vue_app__ = app
```

最后返回组件所暴露的一些属性或方法。`vnode.component.proxy`是组件实例`this`的代理对象
```ts
return getExposeProxy(vnode.component!) || vnode.component!.proxy
```

`getExposeProxy`方法会返回`instance.exposeProxy`
```ts
export function getExposeProxy(instance: ComponentInternalInstance) {
  if (instance.exposed) {
    return (
      instance.exposeProxy ||
      (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key: string) {
          if (key in target) {
            return target[key]
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance)
          }
        }
      }))
    )
  }
}
```

## render
挂载过程调用了一个`render`方法或`hydrate`进行渲染。此处我们继续看下`render`函数如何将`vnode`渲染为真实DOM的。

在介绍渲染器时，我们知道渲染器中有个`createApp`方法，这个方法会在创建`app`实例时被首先调用。`createApp`方法通过一个`createAppAPI`函数生成，这个函数接收两个参数：`render`、`hydrate`，这里的`render`就是在挂载过程中调用的渲染函数。
```ts
function baseCreateRenderer(
  options: RendererOptions,
  createHydrationFns?: typeof createHydrationFunctions
): any {
  // ...
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  }
}
```

来看下`render`函数的实现：
```ts
const render: RootRenderFunction = (vnode, container, isSVG) => {
  if (vnode == null) {
    if (container._vnode) {
      unmount(container._vnode, null, null, true)
    }
  } else {
    patch(container._vnode || null, vnode, container, null, null, null, isSVG)
  }
  flushPostFlushCbs()
  container._vnode = vnode
}
```

`render`函数接收三个参数：：`vnode`（需要挂载的虚拟DOM）、`container`（需要渲染到的容器）、`isSVG`（被渲染到的容器是否为SVG）

当被传入的`vnode`为`null`时，说明什么都不渲染，这时会检查`container`中是否存在`_vnode`，如果存在调用`unmount`卸载函数。如果传入的`vnode`不为`null`，会调用`patch`函数进行更新，也可以称为打补丁。最后执行`flushPostFlushCbs()`（如果此时有等待中的前置任务和后置任务，需要执行这些任务，如通过`watchEffect`、`watchPostEffect`添加的`effect`），并将`vnode`添加到`container._vnode`中。

由于在挂载过程中，会向`render`传入根组件的`vnode`，所以继续调用`patch`方法。

## patch

`patch`函数可以接收9个参数：
- `n1`：旧的`vnode`
- `n2`：新的`vnode`
- `container`：需要更新的容器
- `anchor`：锚点
- `parentComponent`：父组件
- `parentSuspense`：父Suspence
- `isSVG`：容器是否为SVG
- `slotScopeIds`
- `optimized`：是否开启优化模式

<details>
<summary><code>patch</code>完整代码</summary>

```ts
const patch: PatchFn = (
  n1,
  n2,
  container,
  anchor = null,
  parentComponent = null,
  parentSuspense = null,
  isSVG = false,
  slotScopeIds = null,
  optimized = __DEV__ && isHmrUpdating ? false : !!n2.dynamicChildren
) => {
  if (n1 === n2) {
    return
  }

  // patching & not same type, unmount old tree
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1)
    unmount(n1, parentComponent, parentSuspense, true)
    n1 = null
  }

  if (n2.patchFlag === PatchFlags.BAIL) {
    optimized = false
    n2.dynamicChildren = null
  }

  const { type, ref, shapeFlag } = n2
  switch (type) {
    case Text:
      processText(n1, n2, container, anchor)
      break
    case Comment:
      processCommentNode(n1, n2, container, anchor)
      break
    case Static:
      if (n1 == null) {
        mountStaticNode(n2, container, anchor, isSVG)
      } else if (__DEV__) {
        patchStaticNode(n1, n2, container, isSVG)
      }
      break
    case Fragment:
      processFragment(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
      } else if (shapeFlag & ShapeFlags.TELEPORT) {
        ;(type as typeof TeleportImpl).process(
          n1 as TeleportVNode,
          n2 as TeleportVNode,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized,
          internals
        )
      } else if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
        ;(type as typeof SuspenseImpl).process(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized,
          internals
        )
      } else if (__DEV__) {
        warn('Invalid VNode type:', type, `(${typeof type})`)
      }
  }

  // set ref
  if (ref != null && parentComponent) {
    setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2)
  }
}
```
</details>

首先比较`n1`与`n2`，如果`n1`与`n2`相同，代表着新节点没有发生更新，所以直接`return`。在第一次挂载过程中，由于旧`vnode`是空的，所以会继续进行下面的操作。
```ts
if (n1 === n2) {
  return
}
```

如果旧节点不为空，而且新旧节点的节点类型不同，则需要卸载旧节点。
```ts
if (n1 && !isSameVNodeType(n1, n2)) {
  // 获取锚点
  anchor = getNextHostNode(n1)
  // 卸载旧节点
  unmount(n1, parentComponent, parentSuspense, true)
  // 将旧节点置为空
  n1 = null
}
```

::: info 判断两个节点类型是否一样
比较两个节点的`type`和`key`是否一致。
```ts
export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  if (
    __DEV__ &&
    n2.shapeFlag & ShapeFlags.COMPONENT &&
    hmrDirtyComponents.has(n2.type as ConcreteComponent)
  ) {
    // HMR only: if the component has been hot-updated, force a reload.
    return false
  }
  return n1.type === n2.type && n1.key === n2.key
}
```
:::

如果新节点的`type`为`PatchFlags.BAIL`，意味着`diff`过程退出优化模式，这时会将`optimized`设置为`false`，并将新节点的`dynamicChildren`设置为`null`
```ts
if (n2.patchFlag === PatchFlags.BAIL) {
  optimized = false
  n2.dynamicChildren = null
}
```

接着就是根据新节点的类型进行不同的处理：

```ts
const { type, ref, shapeFlag } = n2
switch (type) {
  case Text:
    processText(n1, n2, container, anchor)
    break
  case Comment:
    processCommentNode(n1, n2, container, anchor)
    break
  case Static:
    if (n1 == null) {
      mountStaticNode(n2, container, anchor, isSVG)
    } else if (__DEV__) {
      patchStaticNode(n1, n2, container, isSVG)
    }
    break
  case Fragment:
    processFragment(
      n1,
      n2,
      container,
      anchor,
      parentComponent,
      parentSuspense,
      isSVG,
      slotScopeIds,
      optimized
    )
    break
  default:
    if (shapeFlag & ShapeFlags.ELEMENT) {
      processElement(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
    } else if (shapeFlag & ShapeFlags.COMPONENT) {
      processComponent(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
    } else if (shapeFlag & ShapeFlags.TELEPORT) {
      ;(type as typeof TeleportImpl).process(
        n1 as TeleportVNode,
        n2 as TeleportVNode,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized,
        internals
      )
    } else if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
      ;(type as typeof SuspenseImpl).process(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized,
        internals
      )
    } else if (__DEV__) {
      warn('Invalid VNode type:', type, `(${typeof type})`)
    }
}
```

在`render`过程中，创建根`vnode`时，其`type`传入的是`rootComponent`，是个对象，并且其`shapeFlag`属性为`ShapeFlags.COMPONENT`，所以第一次`patch`，会执行`processComponent`。

## processComponent

`processComponent`函数接收与`patch`相同的参数
```ts
const processComponent = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  slotScopeIds: string[] | null,
  optimized: boolean
) => {
  n2.slotScopeIds = slotScopeIds
  if (n1 == null) {
    if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
      ;(parentComponent!.ctx as KeepAliveContext).activate(
        n2,
        container,
        anchor,
        isSVG,
        optimized
      )
    } else {
      mountComponent(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        optimized
      )
    }
  } else {
    updateComponent(n1, n2, optimized)
  }
}
```

可以看到当旧节点为空时，如果新节点对应的组件已经被`keep-alive`了，则调用`parentComponent.ctx.activate`方法进行激活组件，否则调用`mountComponent`方法挂载组件；如果旧节点不为空，则会调用`updateComponent`方法更新组件。因为应用挂载时，第一次`patch`过程旧节点是空的，组件也没有被`keep-alive`，所以会继续执行`mountComponent`方法。

## mountComponent

`mountComponent`接收参数和`processComponent`类似，只不过`mountComponent`参数中没有旧节点，只有`initialVNode`待被初始化的节点，即新节点。
```ts
const mountComponent: MountComponentFn = (
  initialVNode,
  container,
  anchor,
  parentComponent,
  parentSuspense,
  isSVG,
  optimized
) => {
  const compatMountInstance =
    __COMPAT__ && initialVNode.isCompatRoot && initialVNode.component
  const instance: ComponentInternalInstance =
    compatMountInstance ||
    (initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    ))

  if (__DEV__ && instance.type.__hmrId) {
    registerHMR(instance)
  }

  if (__DEV__) {
    pushWarningContext(initialVNode)
    startMeasure(instance, `mount`)
  }

  if (isKeepAlive(initialVNode)) {
    ;(instance.ctx as KeepAliveContext).renderer = internals
  }

  // resolve props and slots for setup context
  if (!(__COMPAT__ && compatMountInstance)) {
    if (__DEV__) {
      startMeasure(instance, `init`)
    }
    setupComponent(instance)
    if (__DEV__) {
      endMeasure(instance, `init`)
    }
  }

  // setup() is async. This component relies on async logic to be resolved
  // before proceeding
  if (__FEATURE_SUSPENSE__ && instance.asyncDep) {
    parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect)

    // Give it a placeholder if this is not hydration
    // TODO handle self-defined fallback
    if (!initialVNode.el) {
      const placeholder = (instance.subTree = createVNode(Comment))
      processCommentNode(null, placeholder, container!, anchor)
    }
    return
  }

  setupRenderEffect(
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
  )

  if (__DEV__) {
    popWarningContext()
    endMeasure(instance, `mount`)
  }
}
```

在挂载组件过程中，第一步就是创建组件实例：

```ts
const compatMountInstance =
  __COMPAT__ && initialVNode.isCompatRoot && initialVNode.component
const instance: ComponentInternalInstance =
  compatMountInstance ||
  (initialVNode.component = createComponentInstance(
    initialVNode,
    parentComponent,
    parentSuspense
  ))
```

创建完组件实例后，会针对`KeepAlive`的`vnode`进行一些特殊化处理，即为`instance.ctx`添加一个`renderer`。这里忽略一些仅在开发环境下生效的代码。

```ts
if (isKeepAlive(initialVNode)) {
  ;(instance.ctx as KeepAliveContext).renderer = internals
}
```

然后设置组件实例`props`与`slots`。
```ts
if (!(__COMPAT__ && compatMountInstance)) {
  if (__DEV__) {
    startMeasure(instance, `init`)
  }
  setupComponent(instance)
  if (__DEV__) {
    endMeasure(instance, `init`)
  }
}
```

`setupComponent`接收两个参数：组件实例和是否为SSR
```ts
export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false
) {
  isInSSRComponentSetup = isSSR

  const { props, children } = instance.vnode
  // 是否为有状态组件
  const isStateful = isStatefulComponent(instance)
  // 初始化props
  initProps(instance, props, isStateful, isSSR)
  // 初始化插槽
  initSlots(instance, children)

  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined
  isInSSRComponentSetup = false
  return setupResult
}
```

`props`的初始化通过`initProps`函数完成。`initProps`接收四个参数：组件实例、传递给组件的`props`、是否为有状态组件、是否为SSR。
```ts
export function initProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  isStateful: number,
  isSSR = false
) {
  const props: Data = {}
  const attrs: Data = {}
  def(attrs, InternalObjectKey, 1)

  instance.propsDefaults = Object.create(null)
  
  setFullProps(instance, rawProps, props, attrs)

  // ensure all declared prop keys are present
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = undefined
    }
  }

  // validation
  if (__DEV__) {
    validateProps(rawProps || {}, props, instance)
  }

  if (isStateful) {
    // stateful
    instance.props = isSSR ? props : shallowReactive(props)
  } else {
    if (!instance.type.props) {
      // functional w/ optional props, props === attrs
      instance.props = attrs
    } else {
      // functional w/ declared props
      instance.props = props
    }
  }
  instance.attrs = attrs
}
```

```ts
function setFullProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  props: Data,
  attrs: Data
) {
  const [options, needCastKeys] = instance.propsOptions
  let hasAttrsChanged = false
  let rawCastValues: Data | undefined
  if (rawProps) {
    for (let key in rawProps) {
      // 先放入key、ref、空字符串等一些保留字跳过处理
      if (isReservedProp(key)) {
        continue
      }

      // 处理兼容模式
      if (__COMPAT__) {
        if (key.startsWith('onHook:')) {
          softAssertCompatEnabled(
            DeprecationTypes.INSTANCE_EVENT_HOOKS,
            instance,
            key.slice(2).toLowerCase()
          )
        }
        // 忽略inline-template
        if (key === 'inline-template') {
          continue
        }
      }

      const value = rawProps[key]
      
      let camelKey
      // 将key进行驼峰处理，因为prop option在规范化期间也被转换为驼峰格式了
      if (options && hasOwn(options, (camelKey = camelize(key)))) {
        // 如果key不需要被转换直接对props赋值，否则对rawCastValues赋值
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value
        } else {
          ;(rawCastValues || (rawCastValues = {}))[camelKey] = value
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {  // 将未声明的props被放入单独的attrs对象中
        if (__COMPAT__) {
          if (isOn(key) && key.endsWith('Native')) {
            key = key.slice(0, -6) // remove Native postfix
          } else if (shouldSkipAttr(key, instance)) {
            continue
          }
        }
        // 将value存入attrs中
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value
          hasAttrsChanged = true
        }
      }
    }
  }
  
  // 需要转换key
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props)
    const castValues = rawCastValues || EMPTY_OBJ
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i]
      props[key] = resolvePropValue(
        options!,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      )
    }
  }

  return hasAttrsChanged
}
```

```ts
function resolvePropValue(
  options: NormalizedProps,
  props: Data,
  key: string,
  value: unknown,
  instance: ComponentInternalInstance,
  isAbsent: boolean
) {
  const opt = options[key]
  if (opt != null) {
    const hasDefault = hasOwn(opt, 'default')
    // 存在默认值，未传入对应的属性
    if (hasDefault && value === undefined) {
      const defaultValue = opt.default
      // 如果type不是Function 并且默认值是用方法定义的
      if (opt.type !== Function && isFunction(defaultValue)) {
        const { propsDefaults } = instance
        // 如果在propsDefaults中存在对应的默认值，则使用该值，否则需要调用defaultValue函数获取
        if (key in propsDefaults) {
          value = propsDefaults[key]
        } else {
          // 设置当前组件实例
          setCurrentInstance(instance)
          // 调用defaultValue函数获取默认值，并将默认值缓存到instance.propsDefaults中
          value = propsDefaults[key] = defaultValue.call(
            __COMPAT__ &&
              isCompatEnabled(DeprecationTypes.PROPS_DEFAULT_THIS, instance)
              ? createPropsDefaultThis(instance, props, key)
              : null,
            props
          )
          // 取消当前实例
          unsetCurrentInstance()
        }
      } else {
        value = defaultValue
      }
    }
    // Boolean转换
    if (opt[BooleanFlags.shouldCast]) {
      // 不存在默认值并且未传入key prop，则默认值为false
      if (isAbsent && !hasDefault) {
        value = false
      } else if ( // 如果类型定义中不存在String类型或Boolean类型比String类型靠前，并且value为空字符串或value为-连接的值（如as-as）
        opt[BooleanFlags.shouldCastTrue] &&
        (value === '' || value === hyphenate(key))
      ) {
        value = true
      }
    }
  }
  return value
}
```
