# 裁剪和蒙版

## \<clipPath>
`<clipPath>`可以指定任意形状的路径用于裁剪。使用css的`clip-path`属性应用裁剪图形。

```html
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <image id="image" x="80" height="200" width="200" xlink:href="../../images/cat.jpg" />
    <clipPath id="pathClipPath">
      <path id="path" d="M 584.001 198.674 L 600.799 247.784 L 651.95 248.843 L 611.181 280.253 L 625.996 330.018 L 584.001 300.321 L 542.006 330.018 L 556.821 280.253 L 516.052 248.843 L 567.203 247.784 Z" style="fill: none; stroke: #f00" transform="matrix(-0.789911, 0.613222, -0.613222, -0.789911, 813.605663, -42.768437)"></path>
    </clipPath>
  </defs>
  <use xlink:href="#image" style="clip-path: url(#pathClipPath)" />
  <g>
    <use xlink:href="#image" transform="translate(0, 200)"/>
    <use xlink:href="#path" transform="translate(0, 200)"/>
  </g>
</svg>
```

<div class="demo">
  <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <image id="image" x="80" height="200" width="200" xlink:href="../../images/cat.jpg" />
      <clipPath id="pathClipPath">
        <path id="path" d="M 584.001 198.674 L 600.799 247.784 L 651.95 248.843 L 611.181 280.253 L 625.996 330.018 L 584.001 300.321 L 542.006 330.018 L 556.821 280.253 L 516.052 248.843 L 567.203 247.784 Z" style="fill: none; stroke: #f00" transform="matrix(-0.789911, 0.613222, -0.613222, -0.789911, 813.605663, -42.768437)"></path>
      </clipPath>
    </defs>
    <use xlink:href="#image" style="clip-path: url(#pathClipPath)" />
    <g>
      <use xlink:href="#image" transform="translate(0, 200)"/>
      <use xlink:href="#path" transform="translate(0, 200)"/>
    </g>
  </svg>
</div>

## \<mask>
使用`<mask>`元素创建一个蒙版。使用`mask`属性可应用蒙版。

SVG蒙版会变换对象的透明度。如果蒙版是不透明的，被蒙版覆盖的对象的像素就是不透明的；如果蒙版是半透明的，那么对象就是半透明的，蒙版的透明部分会使被覆盖对象的相应部分不可见。


```html
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <image id="image2" x="80" height="200" width="200" xlink:href="../../images/cat.jpg" />
    <radialGradient id="fade">
      <stop offset="0%" style="stop-color: white; stop-opacity: 1.0;"/>
      <stop offset="85%" style="stop-color: white; stop-opacity: 0.5;"/>
      <stop offset="100%" style="stop-color: white; stop-opacity: 0.0;"/>
    </radialGradient>
    <mask id="fademask" maskContentUnits="objectBoundingBox">
      <rect x="0" y="0" width="1" height="1"
        style="fill: url(#fade);"/>
    </mask>
  </defs>
  <use xlink:href="#image2" style="mask: url(#fademask)" />
</svg>
```

<div class="demo">
  <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <image id="image2" x="80" height="200" width="200" xlink:href="../../images/cat.jpg" />
      <radialGradient id="fade">
        <stop offset="0%" style="stop-color: white; stop-opacity: 1.0;"/>
        <stop offset="85%" style="stop-color: white; stop-opacity: 0.5;"/>
        <stop offset="100%" style="stop-color: white; stop-opacity: 0.0;"/>
      </radialGradient>
      <mask id="fademask" maskContentUnits="objectBoundingBox">
        <rect x="0" y="0" width="1" height="1"
          style="fill: url(#fade);"/>
      </mask>
    </defs>
    <use xlink:href="#image2" style="mask: url(#fademask)" />
  </svg>
</div>
