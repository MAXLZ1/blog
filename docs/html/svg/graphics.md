<script setup>
import SvgStyle from './components/SvgStyle.vue'
</script>
# 基本图形

## 线段

```html
<line x1="start-x" y1="start-y" x2="end-x" y2="end-y" />
```

## 矩形

```html
<rect x="left-x" y="top-y" width="width" height="height" />
```

## 圆形

```html
<circle cx="center-x" cy="center-y" r="radius" />
```

## 椭圆

```html
<ellipse cx="center-x" cy="center-y" rx="x-radius" ry="y-radius" />
```

## 封闭图形

```html
<polyon points="points-list" />
```

```html
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="20 0, 90 100, 180 120, 0 200" stroke="#000" fill="none" />
</svg>
```

<div class="demo">
  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <polygon points="20,0 90,100 180,120 0,200" stroke="#000" fill="none" />
  </svg>
</div>


`points`中的点的几种分割形式：

- 使用空格分割多个点，逗号分割单个点的横纵坐标：`20,0 90,100 180,120 0,200`
- 使用逗号分割多个点，空格分割单个点的横纵坐标：`20 0, 90 100, 180 120, 0 200`
- 使用空格分割多个点及单个点的横纵坐标：`20 0 90 100 180 120 0 200`
- 使用逗号分割多个点及单个点的横纵坐标：`20,0,90,100,180,120,0,200`

## 折线

```html
<polyline points="20 0, 90 100, 180 120, 0 200" />
```

```html
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <polyline points="20 0, 90 100, 180 120, 0 200" stroke="#000" fill="none" />
</svg>
```

<div class="demo">
  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20 0, 90 100, 180 120, 0 200" stroke="#000" fill="none" />
  </svg>
</div>

## 笔画属性及填充属性

笔画属性都以`stroke-`开头：
| 属性  | 值   | 说明  |
| ----- | ----- | ----- |
|  stroke   |  任何表示颜色的方式：`16进制`、`rgb`、`hsl`等   |   笔画颜色  |
|   stroke-width  |   默认为1  |  笔画宽度   |
|   stroke-opacity  |  数字，0~1，0是完全透明，1是完全不透明   |  笔画透明度   |
|   stroke-linecap  |   `butt`（默认）、`round`、`square`  |   线头尾的形状  |
|   stroke-linejoin  |   `miter`（默认值）、`round`、`bevel`  |  图形的棱角处交叉的效果   |
|   stroke-miterlimit  |   默认为4  |  相交处显示的宽度与线宽的最大比例   |

填充属性都以`fill-`开头：
| 属性  | 值   | 说明  |
|-----|-----|-----|
|   fill  |  任何表示颜色的方式：`16进制`、`rgb`、`hsl`等   |   填充颜色  |
|   fill-opacity  |  0~1   |  填充透明度   |
|   fill-rule  |  `nonzero`（默认值）、`evenodd`   |  确定一个多边形内部区域的算法。   |

对于以上样式，可以在`style`进行设置，也可以直接在标签上设置。

**属性测试**

<div class="demo">
  <SvgStyle />
</div>
