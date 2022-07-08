<template>
  <GridSvg :width="500" ref="svg">
    <path :d="helperD" stroke="#00f" stroke-dasharray="5 2"></path>
    <path :d="d" fill="none" stroke="#f00" stroke-width="2"></path>
    <circle :cx="cx" :cy="cy" r="5" @mousedown="handleMouseDown" fill="#0f0" style="cursor: move"></circle>
  </GridSvg>
  <div>
    path: {{d}}
  </div>
</template>

<script lang="ts">
export default {
  name: 'SecondaryBezier',
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import GridSvg from './GridSvg.vue'

const cx = ref(250)
const cy = ref(10)
const svg = ref()

const d = computed(() => `M100 20 Q${cx.value} ${cy.value} 450 180`)
const helperD = computed(() =>
  `M${cx.value} ${cy.value} L100 20 M${cx.value} ${cy.value} L450 180 M${(cx.value + 100) / 2} ${(cy.value + 20) / 2} L${(cx.value + 450) / 2} ${(cy.value + 180) / 2}`
)

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
