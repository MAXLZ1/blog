<template>
  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" >
    <defs>
      <radialGradient id="radialGradient" :cx="cx" :cy="cy" :r="r" :fx="fx" :fy="fy" :fr="fr" :spreadMethod="spreadMethod">
        <stop offset="0" :stop-color="color1"></stop>
        <stop offset="50%" :stop-color="color2"></stop>
        <stop offset="100%" :stop-color="color3"></stop>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="200" height="200" fill="url(#radialGradient)" />
  </svg>
  <div>
    <label>color1(0):</label>
    <input type="color" v-model="color1" />
  </div>
  <div>
    <label>color2(50%):</label>
    <input type="color" v-model="color2" />
  </div>
  <div>
    <label>color3(100%):</label>
    <input type="color" v-model="color3" />
  </div>
  <div>
    <label>cx:</label>
    <input type="range" min="0" max="1" step="0.1" v-model="cx" />{{cx}}
  </div>
  <div>
    <label>cy:</label>
    <input type="range" min="0" max="1" step="0.1" v-model="cy" />{{cy}}
  </div>
  <div>
    <label>r:</label>
    <input type="range" min="0" max="2" step="0.1" v-model="r" />{{r}}
  </div>
  <div>
    <label>fy:</label>
    <input type="range" min="0" max="1" step="0.1" v-model="fx" />{{fx}}
  </div>
  <div>
    <label>fy:</label>
    <input type="range" min="0" max="1" step="0.1" v-model="fy" />{{fy}}
  </div>
  <div>
    <label>fr:</label>
    <input type="range" min="0" max="1" step="0.1" v-model="fr" />{{fr}}
  </div>
  <div>
    <label>spreadMethod:</label>
    <select v-model="spreadMethod">
      <option v-for="option in spreadMethodOptions" :key="option" :label="option" :value="option" />
    </select>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RadialGradient',
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'

const spreadMethodOptions = [ 'pad', 'repeat', 'reflect' ]

const color1 = ref('#f00000')
const color2 = ref('#00ff00')
const color3 = ref('#0000ff')
const cx = ref(0.5)
const cy = ref(0.5)
const fx = ref(0.5)
const fy = ref(0.5)
const r = ref(0.7)
const fr = ref(0)
const spreadMethod = ref(spreadMethodOptions[0])
</script>

<style lang="less" scoped></style>
