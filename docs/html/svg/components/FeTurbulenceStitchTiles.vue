<template>
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
</template>

<script lang="ts">
export default {
  name: 'FeTurbulenceStitchTiles',
}
</script>

<script lang="ts" setup></script>

<style lang="less" scoped></style>
