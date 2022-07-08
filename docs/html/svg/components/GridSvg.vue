<template>
  <svg :width="width" :height="height" :viewBox="viewBox || `${origin} ${width} ${height}`" xmlns="http://www.w3.org/2000/svg">
    <!-- X axis -->
    <line
      v-for="index in columns"
      :x1="(index - 1) * split"
      :y1="0"
      :x2="(index - 1) * split"
      :y2="height"
      :style="lineStyle"
    />
    <!-- Y axis -->
    <line
      v-for="index in rows"
      :x1="0"
      :y1="(index - 1) * split"
      :x2="width"
      :y2="(index - 1) * split"
      :style="lineStyle"
    />
    <slot />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'GridSvg',
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    default: 200.
  },
  height: {
    type: Number,
    default: 200.
  },
  split: {
    type: Number,
    default: 10.
  },
  origin: {
    type: String,
    default: '0 0'
  },
  viewBox: {
    type: String,
  }
})

const lineStyle = {
  stroke: '#b0b0b0'
}

const columns = computed(() => props.width / props.split + 1)
const rows = computed(() => props.height / props.split + 1)
</script>

<style lang="less" scoped></style>
