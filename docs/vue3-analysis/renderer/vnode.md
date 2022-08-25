# 虚拟DOM

## 什么是虚拟DOM？
虚拟DOM（也可以称为`vnode`）描述了一个真实的DOM结构，它和真实DOM一样都是由很多节点组成的一个树形结构。本质其实就是一个JS对象，如下就是一个`vnode`：

```js
{
  type: 'div',
  props: {
    id: 'container'
  },
  children: [
    {
      type: 'span',
      props: {
        class: 'span1'
      },
      children: 'Hello '
    },
    {
      type: 'span',
      props: {
        class: 'span2'
      },
      children: 'World'
    },
  ]
}
```

上面这个`vnode`描述的真实DOM结构如下：
```html
<div id="container">
  <span class="text1">Hello </span>
  <span class="text2">World</span>
</div>
```

可以发现，虚拟节点的`type`描述了标签的类型，`props`描述了标签的属性，`children`描述了标签的子节点。当然一个`vnode`不仅只有这三个属性。`vue3`中对`vnode`的类型定义如下：

```ts
export interface VNode<
  HostNode = RendererNode,
  HostElement = RendererElement,
  ExtraProps = { [key: string]: any }
> {
  // 标记为一个VNode
  __v_isVNode: true
  // 禁止将VNode处理为响应式对象
  [ReactiveFlags.SKIP]: true
  // 节点类型
  type: VNodeTypes
  // 节点的属性
  props: (VNodeProps & ExtraProps) | null
  // 便与DOM的复用，主要用在diff算法中
  key: string | number | symbol | null
  // 被用来给元素或子组件注册引用信息
  ref: VNodeNormalizedRef | null
  scopeId: string | null
  slotScopeIds: string[] | null
  // 子节点
  children: VNodeNormalizedChildren
  // 组件实例
  component: ComponentInternalInstance | null
  // 指令信息
  dirs: DirectiveBinding[] | null
  transition: TransitionHooks<HostElement> | null

  // DOM
  // vnode对应的DOM
  el: HostNode | null
  anchor: HostNode | null // fragment anchor
  // teleport需要挂载的目标DOM
  target: HostElement | null
  // teleport挂载所需的锚点
  targetAnchor: HostNode | null
   
  // 对于Static vnode所包含的静态节点数量
  staticCount: number
  // suspense组件的边界
  suspense: SuspenseBoundary | null
  // suspense的default slot对应的vnode
  ssContent: VNode | null
  // suspense的fallback slot对应的vnode
  ssFallback: VNode | null

  // 用于优化的标记，主要用于判断节点类型
  shapeFlag: number
  // 用于diff优化的补丁标记
  patchFlag: number
  dynamicProps: string[] | null
  dynamicChildren: VNode[] | null

  // application root node only
  appContext: AppContext | null
  /**
   * @internal attached by v-memo
   */
  memo?: any[]
  /**
   * @internal __COMPAT__ only
   */
  isCompatRoot?: true
  /**
   * @internal custom element interception hook
   */
  ce?: (instance: ComponentInternalInstance) => void
}
```

## 如何创建虚拟DOM
`vue3`对外提供了`h()`方法用于创建虚拟DOM。所在文件路径：`packages/runtime-core/src/h.ts`

```ts
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const l = arguments.length
  if (l === 2) {
    // propsOrChildren是对象且不是数组
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // propsOrChildren是vnode
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      // 有props无子节点
      return createVNode(type, propsOrChildren)
    } else {
      // 有子节点
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    // 如果参数大于3，那么第三个参数及之后的参数都会被作为子节点处理
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
```

在`h`函数会使用`createVNode`函数创建虚拟DOM。

```ts
export const createVNode = (
  __DEV__ ? createVNodeWithArgsTransform : _createVNode
) as typeof _createVNode
```

可以看到`createVNode`在开发环境下会使用`createVNodeWithArgsTransform`，其他环境下会使用`_createVNode`。这里我们只看下`_createVNode`的实现。

<details>
<summary><code>_createVNode</code>完整代码</summary>

```ts
function _createVNode(
  type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag: number = 0,
  dynamicProps: string[] | null = null,
  isBlockNode = false
): VNode {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    if (__DEV__ && !type) {
      warn(`Invalid vnode type when creating vnode: ${type}.`)
    }
    type = Comment
  }

  // 如果type已经是个vnode，则复制个新的vnode
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true /* mergeRef: true */)
    if (children) {
      normalizeChildren(cloned, children)
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & ShapeFlags.COMPONENT) {
        currentBlock[currentBlock.indexOf(type)] = cloned
      } else {
        currentBlock.push(cloned)
      }
    }
    cloned.patchFlag |= PatchFlags.BAIL
    return cloned
  }

  // class组件的type
  if (isClassComponent(type)) {
    type = type.__vccOpts
  }

  //  2.x的function组件type
  if (__COMPAT__) {
    type = convertLegacyComponent(type, currentRenderingInstance)
  }

  // class、style的规范化
  if (props) {
    props = guardReactiveProps(props)!
    let { class: klass, style } = props
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass)
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style)
      }
      props.style = normalizeStyle(style)
    }
  }

  // 将vnode类型信息编码为位图
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : __FEATURE_SUSPENSE__ && isSuspense(type)
    ? ShapeFlags.SUSPENSE
    : isTeleport(type)
    ? ShapeFlags.TELEPORT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0

  if (__DEV__ && shapeFlag & ShapeFlags.STATEFUL_COMPONENT && isProxy(type)) {
    type = toRaw(type)
    warn(
      `Vue received a Component which was made a reactive object. This can ` +
        `lead to unnecessary performance overhead, and should be avoided by ` +
        `marking the component with \`markRaw\` or using \`shallowRef\` ` +
        `instead of \`ref\`.`,
      `\nComponent that was made reactive: `,
      type
    )
  }

  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  )
}
```
</details>

`_createVNode`可以接受6个参数：
- `type`：`vnode`类型
- `props`：`vnode`的属性
- `children`：子`vnode`
- `patchFlag`：补丁标记，由编译器生成`vnode`时的优化提示，在diff期间会进入对应优化
- `dynamicProps`：动态属性
- `isBlockNode`：是否是个`Block`节点

首先会对`type`进行校验，如果`type`是空的动态组件，进行提示，并将`type`指定为一个`Comment`注释DOM。
```ts
if (!type || type === NULL_DYNAMIC_COMPONENT) {
  if (__DEV__ && !type) {
    warn(`Invalid vnode type when creating vnode: ${type}.`)
  }
  type = Comment
}
```

如果`type`已经是个`vnode`，会从`type`复制出一个新的`vnode`。这种情况主要在`<component :is="vnode"/>`情况下发生
```ts
if (isVNode(type)) {
  const cloned = cloneVNode(type, props, true /* mergeRef: true */)
  if (children) {
    // 修改其children属性及完善shapeFlag属性
    normalizeChildren(cloned, children)
  }
  // 将被拷贝的对象存入currentBlock中
  if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
    if (cloned.shapeFlag & ShapeFlags.COMPONENT) {
      currentBlock[currentBlock.indexOf(type)] = cloned
    } else {
      currentBlock.push(cloned)
    }
  }
  cloned.patchFlag |= PatchFlags.BAIL
  return cloned
}
```

关于`cloneVNode`的实现：
```ts
export function cloneVNode<T, U>(
  vnode: VNode<T, U>,
  extraProps?: (Data & VNodeProps) | null,
  mergeRef = false
): VNode<T, U> {
  const { props, ref, patchFlag, children } = vnode
  // 如果存在extraProps，需要将extraProps和vnode的props进行合并
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props
  const cloned: VNode = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    // 如果过mergedProps中不存在key，则设置为null
    key: mergedProps && normalizeKey(mergedProps),
    //  如果过存在额外的ref
    //      如果过需要合并ref
    //          如果被拷贝节点中的ref是个数组，将调用normalizeRef处理ref，并将结果合并到被拷贝节点中的ref中
    //          否则，创建一个新的数组，存储ref和normalizeRef(extraProps)的结果
    //      否则直接调用normalizeRef(extraProps)处理新的ref
    // 否则ref不变
    ref:
      extraProps && extraProps.ref
        ? mergeRef && ref
          ? isArray(ref)
            ? ref.concat(normalizeRef(extraProps)!)
            : [ref, normalizeRef(extraProps)!]
          : normalizeRef(extraProps)
        : ref,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children:
      __DEV__ && patchFlag === PatchFlags.HOISTED && isArray(children)
        ? (children as VNode[]).map(deepCloneVNode)
        : children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // 如果 vnode 使用额外的 props 克隆，我们不能再假设其现有的补丁标志是可靠的，需要添加 FULL_PROPS 标志
    // 如果存在extraProps，并且vnode.type不是是Fragment片段的情况下：
    //    如果patchFlag为-1，说明是静态节点，它的内容不会发生变化。新的vnode的patchFlag为PatchFlags.FULL_PROPS，表示props中存在动态key
    //    如果patchFlag不为-1，将patchFlag与PatchFlags.FULL_PROPS进行或运算
    // 否则patchFlag保持不变
    patchFlag:
      extraProps && vnode.type !== Fragment
        ? patchFlag === -1 // hoisted node
          ? PatchFlags.FULL_PROPS
          : patchFlag | PatchFlags.FULL_PROPS
        : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  }
  // 用于兼容vue2
  if (__COMPAT__) {
    defineLegacyVNodeProperties(cloned)
  }
  return cloned as any
}
```

在复制节点的过程中主要处理经历以下步骤:
1. 被拷贝节点的`props`与额外的`props`的合并
2. 创建新的`vnode`
   - `key`的处理：取合并后的`props`中的`key`，如果不存在，取`null`
   - `ref`的合并：根据是否需要合并`ref`，决定是否合并`ref`
   - `patchFlag`的处理：如果`vnode`使用额外的`props`克隆，补丁标志不再可靠的，需要添加`FULL_PROPS`标志
   - `ssContent`的处理：使用`cloneVNode`复制被拷贝节点的`ssContent`
   - `ssFallback`的处理：使用`cloneVNode`复制被拷贝节点的`ssFallback`
3. 兼容`vue2`
4. 返回新的`vnode`

在克隆`vnode`时，`props`会使用`mergeProps`进行合并：

```ts
export function mergeProps(...args: (Data & VNodeProps)[]) {
  const ret: Data = {}
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i]
    for (const key in toMerge) {
      if (key === 'class') {
        if (ret.class !== toMerge.class) {
          // 建立一个数组并调用normalizeClass，最终class会是字符串的形式
          ret.class = normalizeClass([ret.class, toMerge.class])
        }
      } else if (key === 'style') {
        // 建立style数组并调用normalizeStyle，最终style是对象形式
        ret.style = normalizeStyle([ret.style, toMerge.style])
      } else if (isOn(key)) { // 以on开头的属性，统一按事件处理
        const existing = ret[key]
        const incoming = toMerge[key]
        // 如果已经存在的key对应事件与incoming不同，并且已经存在的key对应事件中不包含incoming
        if (
          incoming &&
          existing !== incoming &&
          !(isArray(existing) && existing.includes(incoming))
        ) {
          // 如果过存在existing，将existing、incoming合并到一个新的数组中
          ret[key] = existing
            ? [].concat(existing as any, incoming as any)
            : incoming
        }
      } else if (key !== '') { // 其他情况直接对ret[key]进行赋值，靠后合并的值会取代之前的值
        ret[key] = toMerge[key]
      }
    }
  }
  return ret
}
```

关于`normalizeClass`、`normalizeStyle`的实现：
```ts
export function normalizeClass(value: unknown): string {
  let res = ''
  if (isString(value)) {
    res = value
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i])
      if (normalized) {
        res += normalized + ' '
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + ' '
      }
    }
  }
  return res.trim()
}

export function normalizeStyle(
  value: unknown
): NormalizedStyle | string | undefined {
  if (isArray(value)) {
    const res: NormalizedStyle = {}
    for (let i = 0; i < value.length; i++) {
      const item = value[i]
      const normalized = isString(item)
        ? parseStringStyle(item)
        : (normalizeStyle(item) as NormalizedStyle)
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key]
        }
      }
    }
    return res
  } else if (isString(value)) {
    return value
  } else if (isObject(value)) {
    return value
  }
}

const listDelimiterRE = /;(?![^(]*\))/g
const propertyDelimiterRE = /:(.+)/

export function parseStringStyle(cssText: string): NormalizedStyle {
  const ret: NormalizedStyle = {}
  cssText.split(listDelimiterRE).forEach(item => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE)
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim())
    }
  })
  return ret
}
```

回到`_createVNode`中，当复制出一个新的`vnode`后，调用了一个`normalizeChildren`方法，该方法的作用是对新复制的`vnode`，修改其`children`属性及完善`shapeFlag`属性
```ts
export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  const { shapeFlag } = vnode
  // 如果children为null或undefined，children取null
  if (children == null) {
    children = null
  } else if (isArray(children)) {
    // 如果过children数数组，type改为ShapeFlags.ARRAY_CHILDREN
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') { // 如果children是对象
    // 如果过vndoe是element或teleport
    if (shapeFlag & (ShapeFlags.ELEMENT | ShapeFlags.TELEPORT)) {
      // 取默认插槽
      const slot = (children as any).default
      if (slot) {
        // _c marker is added by withCtx() indicating this is a compiled slot
        slot._c && (slot._d = false)
        normalizeChildren(vnode, slot())
        slot._c && (slot._d = true)
      }
      return
    } else {
      type = ShapeFlags.SLOTS_CHILDREN
      const slotFlag = (children as RawSlots)._
      if (!slotFlag && !(InternalObjectKey in children!)) {
        // if slots are not normalized, attach context instance
        // (compiled / normalized slots already have context)
        ;(children as RawSlots)._ctx = currentRenderingInstance
      } else if (slotFlag === SlotFlags.FORWARDED && currentRenderingInstance) {
        // a child component receives forwarded slots from the parent.
        // its slot type is determined by its parent's slot type.
        if (
          (currentRenderingInstance.slots as RawSlots)._ === SlotFlags.STABLE
        ) {
          ;(children as RawSlots)._ = SlotFlags.STABLE
        } else {
          ;(children as RawSlots)._ = SlotFlags.DYNAMIC
          vnode.patchFlag |= PatchFlags.DYNAMIC_SLOTS
        }
      }
    }
  } else if (isFunction(children)) { // 如果过children是function
    children = { default: children, _ctx: currentRenderingInstance }
    type = ShapeFlags.SLOTS_CHILDREN
  } else {
    children = String(children)
    // force teleport children to array so it can be moved around
    if (shapeFlag & ShapeFlags.TELEPORT) {
      type = ShapeFlags.ARRAY_CHILDREN
      children = [createTextVNode(children as string)]
    } else {
      type = ShapeFlags.TEXT_CHILDREN
    }
  }
  vnode.children = children as VNodeNormalizedChildren
  vnode.shapeFlag |= type
}
```

然后判断如果`isBlockTreeEnabled>0`(允许`Block`被收集)，且`isBlockNode`为`false`，且`currentBlock`不为空，则会将`cloned`存入`currentBlock`中

如果`type`不是`vnode`，在方法最后会调用一个`createBaseVNode`创建`vnode`

```ts
function createBaseVNode(
  type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag = 0,
  dynamicProps: string[] | null = null,
  shapeFlag = type === Fragment ? 0 : ShapeFlags.ELEMENT,
  isBlockNode = false,
  needFullChildrenNormalization = false
) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  } as VNode

  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children)
    // normalize suspense children
    if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
      ;(type as typeof SuspenseImpl).normalize(vnode)
    }
  } else if (children) {
    // compiled element vnode - if children is passed, only possible types are
    // string or Array.
    vnode.shapeFlag |= isString(children)
      ? ShapeFlags.TEXT_CHILDREN
      : ShapeFlags.ARRAY_CHILDREN
  }

  // validate key
  if (__DEV__ && vnode.key !== vnode.key) {
    warn(`VNode created with invalid key (NaN). VNode type:`, vnode.type)
  }

  // 收集vnode到block树中
  if (
    isBlockTreeEnabled > 0 &&
    // 避免block自己收集自己
    !isBlockNode &&
    // 存在父block
    currentBlock &&
    // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & ShapeFlags.COMPONENT) &&
    // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== PatchFlags.HYDRATE_EVENTS
  ) {
    currentBlock.push(vnode)
  }

  if (__COMPAT__) {
    convertLegacyVModelProps(vnode)
    defineLegacyVNodeProperties(vnode)
  }

  return vnode
}
```
