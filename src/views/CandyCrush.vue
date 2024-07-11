<template>
  <div class="candy-wrap">
    <div class="game-board">
      <img
        v-for="candy in game.square"
        class="candy"
        :data-position="`${candy.row}_${candy.col}`"
        :src="candyImages[candy.color]"
        :style="{
          width: toRem(candy.width),
          height: toRem(candy.height),
          top: toRem(candy.x + candy.r),
          left: toRem(candy.y + candy.r)
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

const game = reactive({ square: [] })
const board = new Board()
board.prepareNewGame()
game.square = board.getAllCandies()
console.log(board.square)

const toRem = (num) => {
  return num / 100 + 'rem'
}
</script>

<style lang="scss" scoped>
body {
  overflow: hidden;
}
.candy-wrap {
  .game-board {
    width: 6rem;
    height: 6rem;
    border: 0.02rem solid #ccc;
    position: relative;
    .candy {
      position: absolute;
    }
  }
}
</style>
