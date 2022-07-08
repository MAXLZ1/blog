<script setup>
import GridSvg from './components/GridSvg.vue'
</script>

# 坐标系统的变换

## translate
移动图形。`translate(<x> [<y>])`变换函数通过`x`向量和`y`向量移动元素，`new-x = old-x + <x>, new-y = old-y + <y>`

```html
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <rect id="square" x="0" y="0" width="50" height="50"/>
  </defs>
  <use xlink:href="#square" x="10" y="10" fill="#f00" />
  <use xlink:href="#square" x="10" y="10" fill="#fa0" transform="translate(50, 50)" />
  <use xlink:href="#square" x="110" y="110" fill="#ad1" />
</svg>
```

<div class="demo">
  <GridSvg>
    <defs>
      <rect id="square" x="0" y="0" width="50" height="50"/>
    </defs>
    <use xlink:href="#square" x="10" y="10" fill="#f00" />
    <use xlink:href="#square" x="10" y="10" fill="#fa0" transform="translate(50, 50)" />
    <use xlink:href="#square" x="110" y="110" fill="#ad1" />
  </GridSvg>
</div>


## scale
`scale(<x> [<y>])`变换函数通过`x`和`y`指定一个等比例放大缩小操作。如果`y`没有被提供，那么假定为等同于`x`.

```html
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <circle id="circle" cx="100" cy="100" r="40" />
  </defs>
  <use xlink:href="#circle" x="0" y="0" fill="#f00" />
  <use xlink:href="#circle" x="0" y="0" fill="#fa0" transform="scale(0.5, 0.5)" />
  <use xlink:href="#circle" x="50" y="50" fill="#ad1" />
</svg>
```

<div class="demo">
  <GridSvg>
    <defs>
      <circle id="circle" cx="100" cy="100" r="40" stroke-width="5" stroke="#000" />
    </defs>
    <use xlink:href="#circle" x="0" y="0" fill="#f00" />
    <use xlink:href="#circle" x="0" y="0" fill="#fa0" transform="scale(0.5)" />
    <use xlink:href="#circle" x="50" y="50" fill="#ad1" />
  </GridSvg>
</div>

## rotate
`rotate(<a> [<x> <y>])`变换方法通过一个给定角度对一个指定的点进行旋转变换。如果`x`和`y`没有提供，那么默认为当前元素坐标系原点。否则，就以`(x,y)`为原点进行旋转。

```html
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <rect id="square2" x="0" y="0" width="50" height="50"/>
  </defs>
  <use xlink:href="#square2" x="100" y="100" fill="#f00" />
  <use xlink:href="#square2" x="100" y="100" fill="#fa0" transform="rotate(45, 100, 100)" />
  <use xlink:href="#square2" x="100" y="100" fill="#ad1" transform="rotate(10)" />
</svg>
```
<div class="demo">
  <GridSvg>
    <defs>
      <rect id="square2" x="0" y="0" width="50" height="50"/>
    </defs>
    <use xlink:href="#square2" x="100" y="100" fill="#f00" />
    <use xlink:href="#square2" x="100" y="100" fill="#fa0" transform="rotate(45, 100, 100)" />
    <use xlink:href="#square2" x="100" y="100" fill="#ad1" transform="rotate(10)" />
  </GridSvg>
</div>

## skewX/skewY
`skewX(<a>)`变换函数指定了沿`x`轴倾斜`a°`的倾斜变换。

`skewY(<a>)`变换函数指定了沿`y`轴倾斜`a°`的倾斜变换。

```html
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <rect id="square3" x="0" y="0" width="100" height="100"/>
  </defs>
  <use xlink:href="#square3" x="0" y="0" fill="#f00" />
  <use xlink:href="#square3" x="0" y="0" fill="#fa0" transform="skewX(20)" />
</svg>
```

<div class="demo">
  <GridSvg>
    <defs>
      <rect id="square3" x="0" y="0" width="100" height="100"/>
    </defs>
    <use xlink:href="#square3" x="0" y="0" fill="#f00" />
    <use xlink:href="#square3" x="0" y="0" fill="#fa0" transform="skewX(20)" />
  </GridSvg>
</div>

```html
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <rect id="square3" x="0" y="0" width="100" height="100"/>
  </defs>
  <use xlink:href="#square3" x="0" y="0" fill="#f00" />
  <use xlink:href="#square3" x="0" y="0" fill="#fa0" transform="skewY(20)" />
</svg>
```

<div class="demo">
  <GridSvg>
    <defs>
      <rect id="square4" x="0" y="0" width="100" height="100"/>
    </defs>
    <use xlink:href="#square4" x="0" y="0" fill="#f00" />
    <use xlink:href="#square4" x="0" y="0" fill="#fa0" transform="skewY(20)" />
  </GridSvg>
</div>

## matrix

`matrix`矩阵变换。`matrix(<a> <b> <c> <d> <e> <f>)` 函数以六个值的变换矩阵形式指定一个`transform`。坐标转换公式如下：

$$
\left[
\begin{matrix}
newX \\
newY \\
1
\end{matrix}
\right]
=
\left[
\begin{matrix}
a & c & e \\
b & d & f \\
0 & 0 & 1
\end{matrix}
\right]
*
\left[
\begin{matrix}
oldX \\
oldY \\
1
\end{matrix}
\right]
=
\left[
\begin{matrix}
a * oldX + c * oldY + e \\
b * oldX + d * oldY + f \\
1
\end{matrix}
\right]
$$

```html
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <rect id="rect" x="0" y="0" width="30" height="20" />
  </defs>
  <use xlink:href="#rect" x="10" y="10" fill="#f00" />
  <use xlink:href="#rect" x="10" y="10" fill="#0f0" transform="matrix(3 1 -1 3 30 40)" />
</svg>
```

<div class="demo">
  <GridSvg>
    <defs>
      <rect id="rect" x="0" y="0" width="30" height="20" />
    </defs>
    <use xlink:href="#rect" x="10" y="10" fill="#f00" />
    <use xlink:href="#rect" x="10" y="10" fill="#0f0" transform="matrix(3 1 -1 3 30 40)" />
  </GridSvg>
</div>
