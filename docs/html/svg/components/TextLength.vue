<template>
  <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="20" :textLength="textLength" :lengthAdjust="lengthAdjust">Hello world!</text>
  </svg>
  <div>
    <label>textLength:</label>
    <input type="range" min="60" max="140" v-model="textLength" />{{textLength}}
  </div>
  <div>
    <label>lengthAdjust:</label>
    <select v-model="lengthAdjust">
      <option v-for="option in options" :key="option" :label="option" :value="option" />
    </select>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TextLength',
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'

const options = [ 'spacing', 'spacingAndGlyphs' ]

const textLength = ref(80)
const lengthAdjust = ref(options[0])
</script>

<style lang="less" scoped></style>
