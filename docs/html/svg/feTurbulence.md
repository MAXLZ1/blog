<script setup>
import FeTurbulence from './FeTurbulence.vue';
import FeTurbulenceStitchTiles from './FeTurbulenceStitchTiles.vue';
import FeTurbulenceType from './FeTurbulenceType.vue';
</script>

# feTurbulence

`feTurbulence`滤镜利用柏林噪声（[Perlin Noise](https://zh.wikipedia.org/wiki/Perlin%E5%99%AA%E5%A3%B0)）函数创建了一个图像。它可以实现了人造纹理比如说云纹、大理石纹的合成。

`feTurbulence`有5个专有属性：
- `baseFrequency`
- `numOctaves`
- `seed`
- `stitchTiles`
- `type`

## baseFrequency
`baseFrequency`表示噪声函数的基本频率参数，默认值为0。`baseFrequency`频率越高，噪声越密集。

<div class="demo">
  <FeTurbulence id="noise3" :showBaseFrequency="true" />
</div>

## numOctaves
`numOctaves`噪声函数的倍频，为正整数，默认值是1。倍频越大，噪声越自然，但这并不代表`numOctaves`越大越好，当`numOctaves`大于3时，效果就不太明显了

<div class="demo">
  <FeTurbulence id="noise4" :showNumOctaves="true" />
</div>

## seed
`seed`属性代表了`feTurbulence`中生成的伪随机数的开始数字。该属性会改变噪声的形状和位置。

<div class="demo">
  <FeTurbulence id="noise5" :showSeed="true" />
</div>

## stitchTiles
`stitchTiles`属性定义边界处的行为表现。

属性值：
- `noStitch`：默认值。不处理边界处的噪声。当多个噪声拼接在一起时，会有明显的边界。
- `stitch`：处理边界处的噪声。当多个噪声拼接在一起时，边界处会更加自然。如下面这个例子。

<div class="demo">
  <FeTurbulenceStitchTiles />
</div>

```html
<svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg">
  <filter id="noise1" x="0" y="0" width="100%" height="100%">
    <feTurbulence baseFrequency="0.025" stitchTiles="noStitch" />
  </filter>
  <filter id="noise2" x="0" y="0" width="100%" height="100%">
    <feTurbulence baseFrequency="0.025" stitchTiles="stitch" />
  </filter>

  <rect x="0" y="0" width="100" height="100" style="filter: url(#noise1);" />
  <rect x="0" y="0" width="100" height="100" style="filter: url(#noise1); transform: translate(100px, 0);" />
  <rect x="0" y="0" width="100" height="100" style="filter: url(#noise1); transform: translate(0, 100px);" />
  <rect x="0" y="0" width="100" height="100" style="filter: url(#noise1); transform: translate(100px, 100px);" />
  <text x="5" y ="15">stitch</text>
  
  <rect x="0" y="0" width="100" height="100" style="filter: url(#noise2); transform: translate(220px, 0);" />
  <rect x="0" y="0" width="100" height="100" style="filter: url(#noise2); transform: translate(320px, 0);" />
  <rect x="0" y="0" width="100" height="100" style="filter: url(#noise2); transform: translate(220px, 100px);" />
  <rect x="0" y="0" width="100" height="100" style="filter: url(#noise2); transform: translate(320px, 100px);" />
  <text x="225" y ="15">noStitch</text>
</svg>
```

## type
`<feTurbulence>`中的`type`决定应以噪声函数还是湍流函数执行过滤。

- `fractalNoise`：噪声函数
- `turbulence`：默认值，湍流函数

<div class="demo">
  <FeTurbulenceType />
</div>

```html
<svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg">
  <filter id="noise6" x="0" y="0" width="100%" height="100%">
    <feTurbulence baseFrequency="0.025" type="turbulence" />
  </filter>
  <filter id="noise7" x="0" y="0" width="100%" height="100%">
    <feTurbulence baseFrequency="0.025" type="fractalNoise" />
  </filter>

  <rect x="0" y="0" width="200" height="200" style="filter: url(#noise6);" />
  <text x="5" y ="15">turbulence</text>

  <rect x="0" y="0" width="200" height="200" style="filter: url(#noise7); transform: translate(220px, 0);" />
  <text x="225" y ="15">fractalNoise</text>
</svg>
```

**综合示例**

<div class="demo">
  <FeTurbulence
    id="noise8"
    :showBaseFrequency="true" 
    :showSeed="true" 
    :showType="true" 
    :showNumOctaves="true"
    :showStitchTiles="true"
  />
</div>


