<template>
  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" >
    <defs>
      <linearGradient id="linearGradient" :y1="x1" :y2="y2" :x1="x1" :x2="x2" :spreadMethod="spreadMethod">
        <stop offset="0" :stop-color="color1"></stop>
        <stop offset="50%" :stop-color="color2"></stop>
        <stop offset="100%" :stop-color="color3"></stop>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="200" height="200" fill="url(#linearGradient)" />
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
    <label>x1:</label>
    <input type="range" min="0" max="1" step="0.1" v-model="x1" />{{x1}}
  </div>
  <div>
    <label>x2:</label>
    <input type="range" min="0" max="1" step="0.1" v-model="x2" />{{x2}}
  </div>
  <div>
    <label>y1:</label>
    <input type="range" min="0" max="1" step="0.1" v-model="y1" />{{y1}}
  </div>
  <div>
    <label>y2:</label>
    <input type="range" min="0" max="1" step="0.1" v-model="y2" />{{y2}}
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
  name: 'LinearGradient',
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'

const spreadMethodOptions = [ 'pad', 'repeat', 'reflect' ]

const color1 = ref('#f00000')
const color2 = ref('#00ff00')
const color3 = ref('#0000ff')

const x1 = ref(0)
const y1 = ref(0)
const x2 = ref(1)
const y2 = ref(0)
const spreadMethod = ref(spreadMethodOptions[0])
</script>

<style lang="less" scoped></style>
