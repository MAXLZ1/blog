<script setup>
import GridSvg from './components/GridSvg.vue';
import SvgPathA from './components/SvgPathA.vue';
import SecondaryBezier from './components/SecondaryBezier.vue';
import ExtendSecondaryBezier from './components/ExtendSecondaryBezier.vue';
import TripleBezier from './components/TripleBezier.vue';
import ExtendTripleBezier from './components/ExtendTripleBezier.vue';
</script>

# 路径

语法：`<path d="data" />`

`data`中使用的是`命令 + 参数`的序列，如`M10 10`。

一般地，命令为大写表示绝对坐标，小写代表相对当前画笔的坐标。

## 直线命令

| 命令  | 参数      | 说明                      |
|-----|---------|-------------------------|
| M/m | `M x y` | 将画笔移动到某个位置，移动过程中不绘制图形   |
| L/l | `L x y` | 在当前位置和新的位置之间画一条线段       |
| Z/z | `Z`     | 从当前位置绘制一条回到当前路径起点的线段    |
| V/v | `V y`   | 绘制一条到(current_x, y)的垂直线 |
| H/h | `H x`   | 绘制一条到(x, current_y)的水平线 |

```html
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 20 L40 170 H150 V20 Z" fill="none" stroke="#f00" stroke-width="3"/>
</svg>
```

<div class="demo">
  <GridSvg>
    <path d="M20 20 L40 170 H150 V20 Z" fill="none" stroke="#f00" stroke-width="3"/>
  </GridSvg>
</div>

## 曲线命令

### 圆弧

圆弧命令以字母`A`或者`a`开始。后面紧跟7个参数：`A rx ry x-axis-rotation large-arc-flag sweep-flag x y`

- `rx`：所在椭圆的x半径
- `ry`：所在椭圆的y半径
- `x-axis-rotation`：椭圆的x轴旋转角度
- `large-arc-flag`：如果需要圆弧的角度小于180度，其为0；如果需要圆弧的角度大于或等于180度，则为 1
- `sweep-flag`：表示弧线的方向，0 表示从起点到终点沿逆时针画弧，1 表示从起点到终点沿顺时针画弧
- `x`、`y`：弧形的终点

<div class="demo">
  <SvgPathA />
</div>

其中绿色背景为根据圆弧生成的椭圆。

### 贝塞尔曲线

#### 二次贝塞尔曲线
二次贝塞尔曲线使用`Q/q x y, x1 y1`创建。其中`(x, y)`为控制点，`(x1, y1)`为终点。

<div class="demo">
  <SecondaryBezier />
</div>

#### 多个二次贝塞尔曲线
使用`T`可添加多个终点。对于`Q/q x y, x1 y1 T/t x2 y2`来说，第一段曲线控制点为`(x, y)`，终点为`(x1, y1)`。第二段曲线控制点会自动计算，方法是"使新的控制点与上一条命令中的控制点相对于当前点中心对称"，即`(2 * x1 - x, 2 * y1 - y)`，第二段终点为`(x2, y2)`。

<div class="demo">
  <ExtendSecondaryBezier />
</div>

#### 三次贝塞尔曲线
三次贝塞尔曲线有两个控制点。命令：`C/c x1 y1, x2 y2, x y`。其中`(x, y)`是终点，`(x1, y1)`、`(x2, y2)`为控制点。

<div class="demo">
  <TripleBezier />
</div>

#### 多个三次贝塞尔曲线
使用`S`可以添加一段三次贝塞尔曲线。例如：`C/c x1 y1, x2 y2, xA yA S/s x3 y3, xB yB`。其中`(x1, y1)`、`(x2, y2)`是第一段曲线的的控制点，`(xA, yA)`是第一段曲线的终点；`(x3, y3)`是第二段曲线的控制点，`(xB, yB)`是第二段曲线的终点。

为什么第二段曲线只有一个控制点？

其实第二段曲线的另个一个控制点是自动计算的，它的计算方式和多个二次贝塞尔曲线类似，这个控制点与`(x2, y2)`是关于`(xA, yA)`中心对称的，这个控制点的计算方式：`(2 * xA - x2, 2 * yA - y2)`。

<div class="demo">
  <ExtendTripleBezier />
</div>

## \<marker>
`<marker>`元素定义了用于在给定 `<path>`、`<line>`、`<polyline>` 或 `<polygon>` 元素上绘制箭头或多标记的图形。

```html
<svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="mCircle" markerHeight="6" markerWidth="6" refX="3" refY="3">
      <circle cx="3" cy="3" r="3"  style="fill: #f00;"></circle>
    </marker>
    <marker id="mArrow" markerHeight="4" markerWidth="6" refX="3" refY="3">
      <path d="M3 0 6 4 0 4"></path>
    </marker>
  </defs>
  <polyline
    points="30,160 58,100 86,120 114,60 142,80 170,30"
    stroke="#000"
    stroke-width="2"
    fill="none"
    style="marker-start: url(#mCircle); marker-mid: url(#mCircle); marker-end: url(#mArrow)"
  />
</svg>
```
<div class="demo">
  <GridSvg>
    <defs>
      <marker id="mCircle" markerHeight="6" markerWidth="6" refX="3" refY="3">
        <circle cx="3" cy="3" r="3"  style="fill: #f00;"></circle>
      </marker>
      <marker id="mArrow" markerHeight="4" markerWidth="6" refX="3" refY="3">
        <path d="M3 0 6 4 0 4"></path>
      </marker>
    </defs>
    <polyline
      points="30,160 58,100 86,120 114,60 142,80 170,30"
      stroke="#000"
      stroke-width="2"
      fill="none"
      style="marker-start: url(#mCircle); marker-mid: url(#mCircle); marker-end: url(#mArrow);"
    />
  </GridSvg>
</div>

`<marker>`专有属性：
- `refX`、`refY`：指定哪个坐标（标记的坐标系统中）与路径的开始坐标对齐
- `markerHeight`、`markerWidth`：根据`viewBox`和`preserveAspectRatio`属性渲染`<marker>`时要适合的视口高度或宽度
- `orient`：标记放置在形状上的位置时如何旋转。可选值`auto`、`auto-start-reverse`、`<angle>`(旋转角度)

使用`marker-start`、`marker-mid`、`marker-end`分别在路径的其实位置、中间转折点、末尾处引用`<merker>`，`marker`属性可统一设置三处的图像。
