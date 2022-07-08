<template>
  <GridSvg>
    <defs>
      <marker id="mArrow" markerWidth="5" markerHeight="10" refX="5" refY="5" orient="auto">
        <path d="M 0 0 5 5 0 10 Z" style="fill:#f00"></path>
      </marker>
    </defs>
    <path :d="d2" fill="#0f0"></path>
    <path :d="d3" fill="#0f0"></path>
    <path :d="d" fill="none" stroke="#f00" stroke-width="2" style="marker-end: url(#mArrow)"></path>
    <path d="M150 50 L200 0" stroke="#f00" stroke-width="2"></path>
  </GridSvg>
  <div class="form">
    <div class="form-item">
      <label>x-axis-rotation:</label>
      <input type="range" min="0" max="360" v-model="xAxisRotation" />
    </div>
    <div class="form-item">
      <label>large-arc-flag:</label>
      <select v-model="largeArcFlag">
        <option v-for="option in options" :key="option" :label="option" :value="option" />
      </select>
    </div>
    <div class="form-item">
      <label>sweep-flag:</label>
      <select v-model="sweepFlag">
        <option v-for="option in options" :key="option" :label="option" :value="option" />
      </select>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SvgPathA',
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import GridSvg from './GridSvg.vue'

const options = [0, 1]

const xAxisRotation = ref(0)
const largeArcFlag = ref(options[0])
const sweepFlag = ref(options[0])

const d = computed(() => `M0 200 L50 150 A20 15 ${xAxisRotation.value} ${largeArcFlag.value} ${sweepFlag.value} 150 50`)
const d2 = computed(() => `M50 150 A20 15 ${xAxisRotation.value} 0 1 150 50`)
const d3 = computed(() => `M50 150 A20 15 ${xAxisRotation.value} 0 0 150 50`)
</script>

<style lang="less" scoped></style>
