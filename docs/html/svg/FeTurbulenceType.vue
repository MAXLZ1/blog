<template>
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
</template>

<script>
export default {
  name: 'FeTurbulenceType'
}
</script>

<style scoped lang="stylus">

</style>
