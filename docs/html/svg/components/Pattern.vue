<template>
  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern
        id="tile"
        :x="x"
        :y="y"
        :patternUnits="patternUnits"
        :patternContentUnits="patternContentUnits"
        :patternTransform="patternTransform"
        :height="percentHeight"
        :width="percentWidth"
      >
        <circle cx="20" cy="20" r="20" style="fill: none; stroke: #000" />
      </pattern>
    </defs>
    <rect x="0" y="0" width="200" height="200" style="fill: url(#tile); stroke: #000;"/>
  </svg>

  <div class="form">
    <div class="form-item">
      <label>x: </label>
      <input type="range" min="0" max="20" step="1" v-model="x" />{{ x }}
    </div>
    <div class="form-item">
      <label>y: </label>
      <input type="range" min="0" max="20" step="1" v-model="y" />{{ y }}
    </div>
    <div class="form-item">
      <label>height: </label>
      <input type="range" min="10" max="30" step="1" v-model="height" />{{ height }}%
    </div>
    <div class="form-item">
      <label>width: </label>
      <input type="range" min="10" max="30" step="1" v-model="width" />{{ width }}%
    </div>
    <div class="form-item">
      <label>patternUnits: </label>
      <select v-model="patternUnits">
        <option
          v-for="option in patternUnitsOptions"
          :key="option"
          :label="option"
          :value="option"
        />
      </select>
    </div>
    <div class="form-item">
      <label>patternContentUnits: </label>
      <select v-model="patternContentUnits">
        <option
          v-for="option in patternContentUnitsOptions"
          :key="option"
          :label="option"
          :value="option"
        />
      </select>
    </div>
    <div class="form-item">
      <label>patternTransform: </label>
      <select v-model="patternTransform">
        <option
          v-for="option in patternTransformOptions"
          :key="option"
          :label="option || '无'"
          :value="option"
        />
      </select>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Pattern',
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const patternUnitsOptions = [ 'objectBoundingBox', 'userSpaceOnUse' ]
const patternContentUnitsOptions = [ 'objectBoundingBox', 'userSpaceOnUse' ]
const patternTransformOptions = [ '', 'scale(0.5)' ]

const x = ref(0)
const y = ref(0)
const width = ref(20)
const height = ref(20)
const patternUnits = ref(patternUnitsOptions[1])
const patternContentUnits = ref(patternContentUnitsOptions[1])
const patternTransform = ref(patternTransformOptions[0])

const percentHeight = computed(() => `${height.value}%`)
const percentWidth = computed(() => `${width.value}%`)
</script>

<style lang="less" scoped></style>
