<template>
  <div>
    <svg width="400" height="400" viewBox="-5 -5 110 110" xmlns="http://www.w3.org/2000/svg">
      <polygon :style="style" points="50,0 21,90 98,35 2,35 79,90" />
    </svg>
    <div class="form">
      <div class="form-item">
        <label>stroke:</label>
        <input type="color" v-model="stroke" />
      </div>
      <div class="form-item">
        <label>stroke-width:</label>
        <input type="number" min="0" v-model="strokeWidth" />
      </div>
      <div class="form-item">
        <label>stroke-opacity:</label>
        <input type="range" min="0" max="1" step="0.1" v-model="strokeOpacity" />
      </div>
      <div class="form-item">
        <label>stroke-linecap:</label>
        <select v-model="strokeLinecap">
          <option v-for="option in linecaps" :key="option" :label="option" :value="option" />
        </select>
      </div>
      <div class="form-item">
        <label>stroke-linejoin:</label>
        <select v-model="strokeLinejoin">
          <option v-for="option in linejoins" :key="option" :label="option" :value="option" />
        </select>
      </div>
      <div class="form-item">
        <label>stroke-miterlimit:</label>
        <input type="number" min="0" v-model="strokemiterlimit" />
      </div>
      <div class="form-item">
        <label>fill:</label>
        <input type="color" v-model="fill" />
      </div>
      <div class="form-item">
        <label>fill-opacity:</label>
        <input type="range" min="0" max="1" step="0.1" v-model="fillOpacity" />
      </div>
      <div class="form-item">
        <label>fill-rule:</label>
        <select v-model="fillRule">
          <option v-for="option in fillRules" :key="option" :label="option" :value="option" />
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SvgStyle',
}
</script>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const fillRules = [ 'nonzero', 'evenodd' ]
const linecaps = [ 'butt', 'round', 'square' ]
const linejoins = [ 'miter', 'round', 'bevel' ]

const stroke = ref('#e5b12d')
const strokeWidth = ref(2)
const strokeOpacity = ref(1)
const strokeLinecap = ref(linecaps[0])
const strokeLinejoin = ref(linejoins[0])
const strokemiterlimit = ref(4)
const fill = ref('#08b940')
const fillOpacity = ref(1)
const fillRule = ref(fillRules[0])

const style = computed(() => ({
  stroke: stroke.value,
  strokeWidth: strokeWidth.value,
  strokeOpacity: strokeOpacity.value,
  strokeLinecap: strokeLinecap.value,
  strokeLinejoin: strokeLinejoin.value,
  strokemiterlimit: strokemiterlimit.value,
  fill: fill.value,
  fillOpacity: fillOpacity.value,
  fillRule: fillRule.value
}))
</script>

<style lang="less" scoped></style>
