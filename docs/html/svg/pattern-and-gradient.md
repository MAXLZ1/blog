<script setup>
import Pattern from './components/Pattern.vue';
import LinearGradient from './components/LinearGradient.vue';
import RadialGradient from './components/RadialGradient.vue';
</script>

# 图案和渐变

## \<pattern>
`pattern`元素让预定义图形能够以固定间隔在`x`轴和`y`轴上重复（或平铺）从而覆盖要涂色的区域。

`pattern`属性：
- `patternUnits`：要为`<pattern>`**元素自身**的几何属性使用哪个坐标系。可选值：`userSpaceOnUse`（当应用图案时，几何属性的所有坐标均参考用户坐标系）、`objectBoundingBox`（几何属性的所有坐标都表示元素边界框的百分比或分数）
- `patternContentUnits`：`<pattern>`**元素的内容**必须使用哪个坐标系。可选值：`userSpaceOnUse`（`<pattern>`元素内的所有坐标均指创建图案图块时定义的用户坐标系）、`objectBoundingBox`（所有坐标都是`<pattern>`元素的边界框的分数或百分比值）
- `patternTransform`：`<pattern>`中元素应用变形
- `x`、`y`
- `width`、`height`
- `preserveAspectRatio`

<div class="demo">
  <Pattern />
</div>

**`userSpaceOnUse`与`objectBoundingBox`区别：**

```html
<svg width="420" height="220" viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern
      id="tile2"
      x="0"
      y="0"
      patternUnits="objectBoundingBox"
      patternContentUnits="objectBoundingBox"
      height=".2"
      width=".2"
    >
      <circle cx=".1" cy=".1" r=".1" style="fill: none; stroke: #000; stroke-width: 0.005" />
    </pattern>
    <pattern
      id="tile3"
      x="0"
      y="0"
      patternUnits="userSpaceOnUse"
      patternContentUnits="userSpaceOnUse"
      height="40"
      width="40"
    >
      <circle cx="20" cy="20" r="20" style="fill: none; stroke: #000;" />
    </pattern>
  </defs>
  <g>
    <rect x="0" y="0" width="200" height="200" style="fill: url(#tile2); stroke: #000;"/>
    <text x="0" y="220">objectBoundingBox</text>
  </g>
  <g>
    <rect x="0" y="0" width="200" height="200" style="fill: url(#tile3); stroke: #000;" transform="translate(220)"/>
    <text x="220" y="220">userSpaceOnUse</text>
  </g>
</svg>
```

<div class="demo">
<svg width="420" height="220" viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern
      id="tile2"
      x="0"
      y="0"
      patternUnits="objectBoundingBox"
      patternContentUnits="objectBoundingBox"
      height=".2"
      width=".2"
    >
      <circle cx=".1" cy=".1" r=".1" style="fill: none; stroke: #000; stroke-width: 0.005" />
    </pattern>
    <pattern
      id="tile3"
      x="0"
      y="0"
      patternUnits="userSpaceOnUse"
      patternContentUnits="userSpaceOnUse"
      height="40"
      width="40"
    >
      <circle cx="20" cy="20" r="20" style="fill: none; stroke: #000;" />
    </pattern>
  </defs>
  <g>
    <rect x="0" y="0" width="200" height="200" style="fill: url(#tile2); stroke: #000;"/>
    <text x="0" y="220">objectBoundingBox</text>
  </g>
  <g>
    <rect x="0" y="0" width="200" height="200" style="fill: url(#tile3); stroke: #000;" transform="translate(220)"/>
    <text x="220" y="220">userSpaceOnUse</text>
  </g>
</svg>
</div>


## 渐变

### 线性渐变
使用`<linearGradient>`定义线性渐变，`<stop`定义各阶段的颜色。

`<linearGradient>`属性：
- `gradientUnits`：用于在渐变元素上指定的属性的坐标系。可选值：`userSpaceOnUse`、`objectBoundingBox`
- `gradientTransform`：渐变变形
- `x1`、`y1`：渐变的x轴或y轴起始位置
- `x2`、`y2`：渐变的x轴或y轴结束位置
- `spreadMethod`：确定如何在渐变的定义边缘之外填充形状。可选值：`pad`（起始和结束渐变点会扩展到对象的边缘）、`repeat`（渐变会重复起点到终点的过程，直到填充满整个对象）、`reflect`（渐变会按终点到起点、起点到终点的排列重复，直到填充满整个对象）

```html
<svg width="120" height="120"  viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="MyGradient">
      <stop offset="5%"  stop-color="green"/>
      <stop offset="95%" stop-color="gold"/>
    </linearGradient>
  </defs>

  <rect fill="url(#MyGradient)" x="10" y="10" width="100" height="100"/>
</svg>
```
<div class="demo">
  <LinearGradient />
</div>

### 镜像渐变
使用`<radialGradient>`定义径向渐变。

`<radialGradient>`属性：
- `gradientUnits`：用于在渐变元素上指定的属性的坐标系。可选值：`userSpaceOnUse`、`objectBoundingBox`
- `gradientTransform`：渐变变形
- `cx`、`cy`：渐变的起始中心点
- `r`：渐变的半径
- `fx`、`fy`：此属性用来定义径向渐变的焦点的坐标。如果该属性没有被定义，就假定它与中心点是同一位置。
- `fr`：此属性用来定义径向渐变的焦点的半径。若该属性没有被定义，默认值为0%
- `spreadMethod`：`pad`、`repeat`、`reflect`

<div class="demo">
  <RadialGradient />
</div>
