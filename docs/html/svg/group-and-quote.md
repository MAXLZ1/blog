# 分组和引用对象

## \<g>

`<g>`元素会将其所有子元素作为一个组合，通常组合还会有一个唯一的`id`作为名称。每个组合还可以拥有自己的`<title>`和`<desc>`来供基于文本的XML应用程序识别，或者为视障用户提供更好的可访问性。使用`<use>`可以引用`<g>`元素。

```html
<svg width="200" height="200" viewBox="0 0 200 200"  xmlns="http://www.w3.org/2000/svg" style="border: dotted #000">
  <g id="group" fill="none" stroke="#000">
    <desc>group graphics</desc>
    <circle cx="30" cy="30" r="25" />
    <rect height="50" width="50" x="5" y="5" />
  </g>
  
  <use xlink:href="#group" x="100" y="100" />
</svg>
```

<div class="demo">
  <svg width="200" height="200" viewBox="0 0 200 200"  xmlns="http://www.w3.org/2000/svg" style="border: dotted #000">
    <g id="group" fill="none" stroke="#000">
      <desc>group graphics</desc>
      <circle cx="30" cy="30" r="25" />
      <rect height="50" width="50" x="5" y="5" />
    </g>
    <use xlink:href="#group" x="100" y="100" />
  </svg>
</div>

## \<use>
SVG 使用`<use>`元素，为定义在`<g>`元素内的组合或者任意独立图形元素（比如只想定义一次的复杂多边形形状）提供了类似复制粘贴的能力。

要指定想要重用的组合，给`xlink:href`属性指定`URI`即可，同时还要指定`x`和`y`的位置以表示组合的`(0,  0)`应该移动到的位置。

## \<defs>

一般地，我们会将那些需要重复使用的图形元素放在`<defs>`元素中，`<defs>`中定义的的图形并不会直接显示，可以使用`<use>`进行引用。

```html
<svg width="200" height="200" viewBox="0 0 200 200"  xmlns="http://www.w3.org/2000/svg" style="border: dotted #000">
  <defs>
    <g id="group" fill="none" stroke="#000">
      <desc>group graphics</desc>
      <circle cx="30" cy="30" r="25" />
      <rect height="50" width="50" x="5" y="5" />
    </g>
  </defs>
  
  <use xlink:href="#group" x="100" y="100" />
</svg>
```

<div class="demo">
  <svg width="200" height="200" viewBox="0 0 200 200"  xmlns="http://www.w3.org/2000/svg" style="border: dotted #000">
    <defs>
      <g id="group2" style="fill:none; stroke:#000">
        <desc>group graphics</desc>
        <circle cx="30" cy="30" r="25" />
        <rect height="50" width="50" x="5" y="5" />
      </g>
    </defs>
    <use xlink:href="#group2" x="100" y="100"/>
  </svg>
</div>

## \<symbol>

`<symbol>`与`<g>`类似，都可以组合元素，但`<symbol>`中的图形不会显示，这点与`<def>`类似。`<symbol>`指定`viewBox`和`preserveAspectRatio`属性，通过给`<use>`元素添加`width`和`height`属性就可以让`<symbol>`适配视口大小。

```html
<svg width="200px" height="200px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

  <defs>
    <g id="octagon" style="stroke: black;">
        <desc>Octagon as group</desc>
        <polygon points="36 25, 25 36, 11 36, 0 25, 0 11, 11 0, 25 0, 36 11"/>
    </g>
    
    <symbol id="sym-octagon" style="stroke: black;" preserveAspectRatio="xMidYMid slice" viewBox="0 0 40 40">
        <desc>Octagon as symbol</desc>
        <polygon points="36 25, 25 36, 11 36, 0 25, 0 11, 11 0, 25 0, 36 11"/>
    </symbol>
  </defs>
  
  <g style="fill:none; stroke:gray">
    <rect x="40" y="40" width="30" height="30"/>
    <rect x="80" y="40" width="40" height="60"/>
    <rect x="40" y="110" width="30" height="30"/>
    <rect x="80" y="110" width="40" height="60"/>
  </g>
  
  <use xlink:href="#octagon" x="40" y="40" width="30" height="30" style="fill: #c00;"/>
  <use xlink:href="#octagon" x="80" y="40" width="40" height="60" style="fill: #cc0;"/>
  <use xlink:href="#sym-octagon" x="40" y="110" width="30" height="30" style="fill: #cfc;"/>
  <use xlink:href="#sym-octagon" x="80" y="110" width="40" height="60" style="fill: #699;"/>
</svg>
```

<div class="demo">
  <svg width="200px" height="200px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <g id="octagon" style="stroke: black;">
        <desc>Octagon as group</desc>
        <polygon points="36 25, 25 36, 11 36, 0 25, 0 11, 11 0, 25 0, 36 11"/>
    </g>
    <symbol id="sym-octagon" style="stroke: black;" preserveAspectRatio="xMidYMid slice" viewBox="0 0 40 40">
        <desc>Octagon as symbol</desc>
        <polygon points="36 25, 25 36, 11 36, 0 25, 0 11, 11 0, 25 0, 36 11"/>
    </symbol>
  </defs>
  <g style="fill:none; stroke:gray">
    <rect x="40" y="40" width="30" height="30"/>
    <rect x="80" y="40" width="40" height="60"/>
    <rect x="40" y="110" width="30" height="30"/>
    <rect x="80" y="110" width="40" height="60"/>
  </g>
  <use xlink:href="#octagon" x="40" y="40" width="30" height="30" style="fill: #c00;"/>
  <use xlink:href="#octagon" x="80" y="40" width="40" height="60" style="fill: #cc0;"/>
  <use xlink:href="#sym-octagon" x="40" y="110" width="30" height="30" style="fill: #cfc;"/>
  <use xlink:href="#sym-octagon" x="80" y="110" width="40" height="60" style="fill: #699;"/>
</svg>
</div>

## \<image>

`<image>`元素可以包含一个完整的SVG或图像文件。如果图像文件的尺寸与元素的宽度和高度不匹配，`<image>`元素可以使用`preserveAspectRatio`属性指示浏览器应该怎么处理。其默认值为`xMidYMid  meet`。

```html
<svg width="100" height="100" viewBox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink">
  <image xlink:href="../../images/cat.jpg" x="0" y="0" height="200" width="200"/>
</svg>
```

<div class="demo">
  <svg width="200" height="200" viewBox="0 0 200 200"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink">
  <image xlink:href="../../images/cat.jpg" x="0" y="0" height="200" width="200"/>
</svg>
</div>
