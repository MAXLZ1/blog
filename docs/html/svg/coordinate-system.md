# SVG坐标系统

## 视口
通过`width`、`height`指定视口大小。默认使用像素`px`单位，也可以使用`cm`、`mm`、`pt`等其他单位。

```html
<svg width="300" height="300"></svg>
```

## 为视口指定用户坐标
使用`viewBox`指定用户坐标系。语法`viewBox: <min-x> <min-y> <width> <height>`

```html
<svg width="300" height="300" viewBox="0 0 300 300"></svg>
```

一般地，视口和viewBox的宽高比是相同的，当然也可以不同。如果不同的话，可以使用`preserveAspectRatio`属性指定图像对视口的对齐方式。语法：`preserveAspectRatio: <align> [<meetOrSlice>]`
`<align>`属性值表示是否强制统一缩放，`<align>`取值如下：

- `none`：不会进行强制统一缩放，如果需要，会缩放指定元素的图形内容，使元素的边界完全匹配视图矩形。

<table>
  <tr >
    <td rowspan="2">y对齐方式</td>
    <td colspan="3">x对齐方式</td>  
	</tr>
  <tr>
    <td>
      <code>xMin</code>
      <br />
      将 SVG 元素的 viewbox 属性的 X 的最小值与视图的 X 的最小值对齐。
    </td>
    <td>
      <code>xMid</code>
      将 SVG 元素的 viewbox 属性的 X 的中点值与视图的 X 的中点值对齐。
    </td>
    <td>
      <code>xMax</code>
      <br />
      将 SVG 元素的 viewbox 属性的 X 的最小值 + 元素的宽度与视图的 X 的最大值对齐。
    </td>
  </tr>
  <tr>
    <td>
      <code>yMin</code>
      <br/>
      将 SVG 元素的 viewbox 属性的 Y 的最小值与视图的 Y 的最小值对齐。
    </td>
    <td>
      <code>xMinYMin</code>
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 200"
        style="border: 1px dashed #000;"
        preserveAspectRatio="xMinYMin meet"
      >
        <polygon points="50 0, 100 50, 50 100, 0 50" stroke="#000" fill="none"></polygon>
      </svg>
    </td>
    <td>
      <code>xMidYMin</code>
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 200"
        style="border: 1px dashed #000;"
        preserveAspectRatio="xMidYMin meet"
      >
        <polygon points="50 0, 100 50, 50 100, 0 50" stroke="#000" fill="none"></polygon>
      </svg>
    </td>
    <td>
      <code>xMaxYMin</code>
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 200"
        style="border: 1px dashed #000;"
        preserveAspectRatio="xMaxYMin meet"
      >
        <polygon points="50 0, 100 50, 50 100, 0 50" stroke="#000" fill="none"></polygon>
      </svg>
    </td>
  </tr>
  <tr>
    <td>
      <code>yMid</code>
      将 SVG 元素的 viewbox 属性的 Y 的中点值与视图的 Y 的中点值对齐。
    </td>
    <td>
      <code>xMinYMid</code>
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 200"
        style="border: 1px dashed #000;"
        preserveAspectRatio="xMinYMid meet"
      >
        <polygon points="50 0, 100 50, 50 100, 0 50" stroke="#000" fill="none"></polygon>
      </svg>
    </td>
    <td>
      <code>xMidYMid</code>（默认值）
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 200"
        style="border: 1px dashed #000;"
        preserveAspectRatio="xMidYMid meet"
      >
        <polygon points="50 0, 100 50, 50 100, 0 50" stroke="#000" fill="none"></polygon>
      </svg>
    </td>
    <td>
      <code>xMaxYMid</code>
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 200"
        style="border: 1px dashed #000;"
        preserveAspectRatio="xMaxYMid meet"
      >
        <polygon points="50 0, 100 50, 50 100, 0 50" stroke="#000" fill="none"></polygon>
      </svg>
    </td>
  </tr>
  <tr>
    <td>
      <code>yMax</code>
      将 SVG 元素的 viewbox 属性的 Y 的最小值 + 元素的高度与视图的 Y 的最大值对齐。
    </td>
    <td>
      <code>xMinYMax</code>
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 200"
        style="border: 1px dashed #000;"
        preserveAspectRatio="xMinYMax meet"
      >
        <polygon points="50 0, 100 50, 50 100, 0 50" stroke="#000" fill="none"></polygon>
      </svg>
    </td>
    <td>
      <code>xMidYMax</code>
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 200"
        style="border: 1px dashed #000;"
        preserveAspectRatio="xMidYMax meet"
      >
        <polygon points="50 0, 100 50, 50 100, 0 50" stroke="#000" fill="none"></polygon>
      </svg>
    </td>
    <td>
      <code>xMaxYMax</code>
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 200"
        style="border: 1px dashed #000;"
        preserveAspectRatio="xMaxYMax meet"
      >
        <polygon points="50 0, 100 50, 50 100, 0 50" stroke="#000" fill="none"></polygon>
      </svg>
    </td>
  </tr>
</table>

`width=100`、`height=100`、`viewBox=0 0 100 100`是的图形如下。以上图形是`width=100`、`height=100`、`viewBox=0 0 100 200`时的图形。

<div class="demo">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 100 100"
    style="border: 1px dashed #000;"
  >
    <polygon points="50 0, 100 50, 50 100, 0 50" stroke="#000" fill="none"></polygon>
  </svg>
</div>

`<meetOrSlice>`可选择的值有两个：
- `meet`：默认值。如果图形的宽高比和视图窗口不匹配，则某些视图将会超出 viewbox 范围（即 SVG 的 viewbox 视图将会比可视窗口小）。
- `slice`：如果 SVG 的 viewbox 宽高比与可视区域不匹配，则 viewbox 的某些区域将会延伸到视图窗口外部（即 SVG 的 viewbox 将会比可视窗口大）。

## 嵌套坐标系统

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="200"
  height="200"
  viewBox="0 0 200 200"
  style="border: 1px dashed #000;"
>
  <circle cx="50" cy="50" r="25" fill="none" stroke="#000" />
  <svg
    x="100px"
    y="5px"
    width="50px"
    height="190px"
    viewBox="0 0 50 190"
  >
    <circle cx="25" cy="25" r="25" fill="none" stroke="#000" />
  </svg>
</svg>
```

<div class="demo">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="200"
    height="200"
    viewBox="0 0 200 200"
    style="border: 1px dashed #000;"
  >
    <circle cx="50" cy="50" r="25" fill="none" stroke="#000" />
    <svg
      x="100"
      y="5" 
      width="50" 
      height="190" 
      style="border: 1px dashed rgb(4,46,126);"
      viewBox="0 0 50 190"
    >
      <circle cx="25" cy="25" r="25" fill="none" stroke="#000" />
    </svg>
  </svg>
</div>
