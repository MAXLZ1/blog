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

紧接着创建根组件的`vnode`，并将上下文对象保存找到设置`vnode`的`appContext`
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

## 总结
创建`app`实例的过程：
1. 创建一个渲染器，并调用渲染器的`createApp`创建实例
2. 重写`app.mount`方法
3. 返回`app`实例

应用的挂载过程中的主要步骤：
1. 标准化`container`
2. 清空`container`的的内容
3. 调用`mount`方法挂载实例
   - 创建根组件的`vnode`
   - 调用`render`或`hydrate`方法进行渲染
   - 将app实例保存至`rootContainer.__vue_app__`中
   - 返回根组件所暴露的属性或方法
4. 移除`container`中的`v-cloak`属性，并添加`data-v-app`属性
5. 返回根组件所暴露的属性或方法
