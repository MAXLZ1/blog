<template>
  <GridSvg :width="500" ref="svg">
    <g>
      <path :d="helperD1" stroke="#00f" stroke-dasharray="5 2"></path>
      <path :d="helperD2" stroke="#00f" stroke-dasharray="5 2"></path>
      <circle :cx="cx" :cy="cy" r="5" @mousedown="handleMouseDown" fill="#0f0" style="cursor: move"></circle>
      <circle :cx="cx2" :cy="cy2" r="5" fill="#9f9f9f"></circle>
    </g>
    <path :d="d" fill="none" stroke="#f00" stroke-width="2"></path>
  </GridSvg>
  <div>
    path: {{d}}
  </div>
</template>

<script lang="ts">
export default {
  name: 'ExtendSecondaryBezier',
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import GridSvg from './GridSvg.vue'

const cx = ref(200)
const cy = ref(10)
const svg = ref()

const d = computed(() => `M100 100 Q${cx.value} ${cy.value} 250 100 T 400 100`)
const helperD1 = computed(() =>
  `M${cx.value} ${cy.value} L100 100 M${cx.value} ${cy.value} L250 100 M${(cx.value + 100) / 2} ${(cy.value + 100) / 2} L${(cx.value + 250) / 2} ${(cy.value + 100) / 2}`
)
const helperD2 = computed(() =>
  `M${cx2.value} ${cy2.value} L250 100 M${cx2.value} ${cy2.value} L400 100 M${(cx2.value + 250) / 2} ${(cy2.value + 100) / 2} L${(cx2.value + 400) / 2} ${(cy2.value + 100) / 2}`
)

const cx2 = computed(() => 2 * 250 - cx.value)
const cy2 = computed(() => 2 * 100 - cy.value)

let rect
function handleMouseDown() {
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
  cx.value = x
  cy.value = y
}

function handleMouseUp() {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}
</script>

<style lang="less" scoped></style>
