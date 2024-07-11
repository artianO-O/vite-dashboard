<template>
  <div class="canvas-wrap">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { Canvas, Rect } from 'fabric' // browser
const init = () => {
  // const canvas = document.getElementById('canvas') as HTMLCanvasElement
  // const ctx = canvas.getContext('2d') as any
  // ctx.beginPath()
  // ctx.moveTo(75, 65)
  // ctx.stroke()

  const canvas = new Canvas('canvas')
  const rect = new Rect({
    top: 100,
    left: 100,
    width: 60,
    height: 70,
    fill: 'red'
  })
  canvas.add(rect)
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.canvas-wrap {
  #canvas {
    width: 100%;
    height: 500px;
    border: 1px dashed #aaa;
  }
}
</style>
