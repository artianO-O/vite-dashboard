<template>
  <div class="phaser-wrap" id="game-container"></div>
</template>

<script lang="ts" setup>
import Phaser from 'phaser'
import background from '../assets/images/game/op-bg.png'
import food from '../assets/images/game/food1.png'
import star from '../assets/images/game/star.png'
import ground from '../assets/images/game/ground.png'

var config = {
  parent: 'game-container',
  backgroundColor: '#ffffff',
  type: Phaser.AUTO,
  width: 400,
  height: 480,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }
}

let platforms: any
let player: any
let cursors: any
let stars: any
// 记录分数
var score = 0
var scoreText: any

// 初始化加载图片
function preload() {
  this.load.image('background', background)
  this.load.image('food', food)
  this.load.image('star', star)
  this.load.image('ground', ground)
}

function collectStar(player, star) {
  star.disableBody(true, true)
  score += 10
  scoreText.setText('Score: ' + score)
}

function create() {
  // 添加背景图
  this.add.image(200, 240, 'background')

  // 添加静态物体
  platforms = this.physics.add.staticGroup()
  platforms.create(200, 300, 'ground').setScale(1).refreshBody()

  // 添加分数显示
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })

  // 动态添加星星
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 70, y: 0, stepX: 20 }
  })
  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
  })

  // 加入星星与平台静态物体的碰撞事件
  this.physics.add.collider(stars, platforms)

  // 添加游戏玩家
  player = this.physics.add.sprite(0, 300, 'food')
  player.setBounce(0)
  player.setCollideWorldBounds(true)

  // 游戏与星星的碰撞事件添加
  this.physics.add.overlap(player, stars, collectStar, null, this)

  // 键盘监听事件
  cursors = this.input.keyboard.createCursorKeys()
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160)

    // player.anims.play('left', true)
  } else if (cursors.right.isDown) {
    player.setVelocityX(160)

    // player.anims.play('right', true)
  }

  if (cursors.up.isDown) {
    console.log('跳起来')
    player.setVelocityY(-200)
  }
}

onMounted(() => {
  const game = new Phaser.Game(config)
})
</script>

<style lang="scss" scoped>
.phaser-wrap {
}
</style>
