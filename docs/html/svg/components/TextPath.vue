<template>
  <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path id="bezierPath" d="M40 100 Q150 40 200 100 T 380 100"  style="stroke: gray; fill: none;"/>
    </defs>
    <use xlink:href="#bezierPath" />
    <text style="font-size: 24px;">
      <textPath xlink:href="#bezierPath" :startOffset="percentStartOffset">
        江山代有才人出，各领风骚数百年。
      </textPath>
    </text>
  </svg>
  <div>
    <label>startOffset:</label>
    <input type="range" min="0" max="100" step="1" v-model="startOffset" />{{percentStartOffset}}
  </div>
</template>

<script lang="ts">
export default {
  name: 'TextPath',
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const startOffset = ref(0)

const percentStartOffset = computed(() => startOffset.value + '%')
</script>

<style lang="less" scoped></style>
