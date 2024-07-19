<template>
  <div class="candy-wrap">
    <div
      class="game-board"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @touchstart="mousedown"
      @touchend="mouseup"
      :style="{
        width: toRem(board.getBoxSize()),
        height: toRem(board.getBoxSize())
      }"
    >
      <img
        v-for="candy in candyList"
        class="candy"
        @transitionend="transitionend"
        :data-id="candy.id"
        :data-position="`${candy.row}_${candy.col}`"
        :src="candyImages[candy.color]"
        :key="candy.id"
        :style="{
          width: toRem(candy.width),
          height: toRem(candy.height),
          top: toRem(candy.y + candy.r),
          left: toRem(candy.x + candy.r)
        }"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
import { Board } from '../components/Game.js'
import blue from '../assets/images/graphics/blue-candy.png'
import red from '../assets/images/graphics/red-candy.png'
import green from '../assets/images/graphics/green-candy.png'
import yellow from '../assets/images/graphics/yellow-candy.png'
import purple from '../assets/images/graphics/purple-candy.png'
import orange from '../assets/images/graphics/orange-candy.png'

const candyImages = {
  blue,
  red,
  green,
  yellow,
  purple,
  orange
}

const board = new Board()
const rBoard = reactive(board)
rBoard.prepareNewGame()

const candyList = computed(() => {
  return rBoard.getAllCandies()
})

const map = computed(() => {
  return game.square.map((candy) => {
    return candy.id
  })
})

const toRem = (num) => {
  return num / 100 + 'rem'
}

const mousedown = (e) => {
  const curCandy = e.target
  console.log(curCandy)
  const poi = e.type == 'touchstart' ? e.changedTouches[0] : e
  const [row, col] = curCandy.dataset.position.split('_')

  rBoard.fromCandy = rBoard.getCandyAt(row, col)
  // console.log(rBoard.square)
  // console.log(rBoard.fromCandy, '可能这里错了？', rBoard.fromCandy.toString())
  rBoard.mouse_poi = { x: poi.clientX, y: poi.clientY }
}

const mouseup = (e) => {
  const { x, y } = rBoard.mouse_poi
  const poi = e.type == 'touchend' ? e.changedTouches[0] : e
  const offsetX = poi.clientX - x // 大于0向右，小于0向左
  const offsetY = poi.clientY - y // 大于0向下，小于0向上
  const direction =
    Math.abs(offsetX) > Math.abs(offsetY)
      ? offsetX > 0
        ? 'right'
        : 'left'
      : offsetY > 0
      ? 'down'
      : 'up'

  const swap = rBoard.getCandiesToCrushGivenMove(rBoard.fromCandy, direction)
  console.log(rBoard.fromCandy, direction, swap)
  // 位置交换dom操作实现
  if (swap?.length) {
    // 只有位置不变其他都变
    rBoard.swap = swap
    rBoard.swapCandies(swap)
  }
}

const transitionend = () => {
  if (rBoard.swap?.length > 0) {
    // 仅数据交换
    rBoard.swapData()
  }
  rBoard.flag = false
}
</script>

<style lang="scss" scoped>
body {
  overflow: hidden;
}
.candy-wrap {
  .game-board {
    border: 0.02rem solid #ccc;
    position: relative;
    .candy {
      position: absolute;
      transition: all 0.3s linear;
    }
  }
}
</style>
