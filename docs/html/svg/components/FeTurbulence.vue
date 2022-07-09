<template>
  <div class="box">
    <svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter :id="id" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            :baseFrequency="baseFrequency"
            :numOctaves="numOctaves"
            :seed="seed"
            :stitchTiles="stitchTiles"
            :type="type"
          />
        </filter>
      </defs>
      <rect x="0" y="0" width="250" height="250" :style="{ filter: `url(#${id})` }" />
    </svg>
    <div class="form">
      <div class="input" v-if="showBaseFrequency">
        <label>baseFrequency:</label>
        <input type="range" min="0" max="1" step="0.01" v-model="baseFrequency" >
        <span>{{baseFrequency}}</span>
      </div>
      <div class="input" v-if="showNumOctaves">
        <label>numOctaves:</label>
        <input type="range" min="1" max="10" step="1" v-model="numOctaves" >
        <span>{{numOctaves}}</span>
      </div>
      <div class="input" v-if="showSeed">
        <label>seed:</label>
        <input type="range" min="1" max="50" step="1" v-model="seed" >
        <span>{{seed}}</span>
      </div>
      <div class="input" v-if="showStitchTiles">
        <label>stitchTiles:</label>
        <select v-model="stitchTiles">
          <option
            v-for="option in stitchTilesOptions"
            :key="option"
          >{{option}}</option>
        </select>
      </div>
      <div class="input" v-if="showType">
        <label>type:</label>
        <select v-model="type">
          <option
            v-for="option in typeOptions"
            :key="option"
          >{{option}}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FeTurbulence',
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  showBaseFrequency: {
    type: Boolean,
    default: false
  },
  showNumOctaves: {
    type: Boolean,
    default: false
  },
  showSeed: {
    type: Boolean,
    default: false
  },
  showStitchTiles: {
    type: Boolean,
    default: false
  },
  showType: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: 'noise'
  }
})

const stitchTilesOptions = [ 'noStitch', 'stitch' ]
const typeOptions = [ 'turbulence', 'fractalNoise' ]

const baseFrequency = ref(0.01)
const numOctaves = ref(1)
const seed = ref(1)
const type = ref('turbulence')
const stitchTiles = ref('noStitch')
</script>

<style lang="less" scoped>
.box {
  display: flex;
  align-items: center;

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .input {
      margin-left: 10px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
