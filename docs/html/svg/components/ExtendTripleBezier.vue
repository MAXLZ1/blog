<template>
  <GridSvg :width="500" ref="svg">
    <g>
      <path :d="d1" fill="none" stroke-dasharray="5 2" stroke="#00f"/>
      <path :d="d2" fill="none" stroke-dasharray="5 2" stroke="#00f"/>
      <path :d="d3" fill="none" stroke-dasharray="5 2" stroke="#00f"/>
      <path :d="d4" fill="none" stroke-dasharray="5 2" stroke="#00f"/>
      <circle :cx="cx1" :cy="cy1" r="5" fill="#0f0" style="cursor: move;" @mousedown="handleMouseDown(1)" />
      <circle :cx="cx2" :cy="cy2" r="5" fill="#0f0" style="cursor: move;" @mousedown="handleMouseDown(2)" />
      <circle :cx="cx3" :cy="cy3" r="5" fill="#0f0" style="cursor: move;" @mousedown="handleMouseDown(3)" />
      <circle :cx="cx4" :cy="cy4" r="5" fill="#9f9f9f" />
    </g>
    <path :d="d" fill="none" stroke-width="2" stroke="#f00" />
  </GridSvg>
  <div>
    path: {{d}}
  </div>
</template>

<script lang="ts">
export default {
  name: 'ExtendTripleBezier',
}
</script>

<script lang="ts" setup>
import GridSvg from './GridSvg.vue'
import { computed, ref } from 'vue'

const cx1 = ref(150)
const cy1 = ref(50)
const cx2 = ref(200)
const cy2 = ref(50)
const cx3 = ref(150)
const cy3 = ref(150)
const svg = ref()

const d = computed(() => `M50 100 C${cx1.value} ${cy1.value} ${cx2.value} ${cy2.value} 300 100 S${cx3.value} ${cy3.value} 200 100`)
const d1 = computed(() => `M${cx1.value} ${cy1.value} L50 100`)
const d2 = computed(() => `M${cx2.value} ${cy2.value} L300 100`)
const d3 = computed(() => `M${cx3.value} ${cy3.value} L200 100`)
const cx4 = computed(() => 300 * 2 - cx2.value)
const cy4 = computed(() => 100 * 2 - cy2.value)
const d4 = computed(() => `M${cx4.value} ${cy4.value} L300 100`)

let rect, num
function handleMouseDown(index) {
  num = index
  rect = svg.value.$el.getBoundingClientRect()
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(e) {
  let x = e.clientX - rect.left
  let y = e.clientY - rect.top
  if (x < 0) x = 0
  else if (x > rect.width) x = rect.width
  if (y < 0) y = 0
  else if (y > rect.height) y = rect.height
  if (num === 1) {
    cx1.value = x
    cy1.value = y
  } else if (num === 2) {
    cx2.value = x
    cy2.value = y
  } else if (num === 3) {
    cx3.value = x
    cy3.value = y
  }
}

function handleMouseUp() {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}
</script>

<style lang="less" scoped></style>
