<template>
  <div class="battle-fly-wrap" id="game-c"></div>
</template>

<script lang="ts" setup>
const asset: any = {}
// 利用es6的import.meta.glob导入图片
async function loadImages() {
  const files: any = await import.meta.glob('../assets/fly/*', { eager: true })
  for (const filePath in files) {
    const imgSrc = files[filePath]
    const fileName = imgSrc.default.split('/').pop().split('.')[0]
    asset[fileName] = imgSrc.default
  }
}
loadImages()

// 场景过渡
/*
 * 这里我们设置一个gameSenceCenter变量存放各个游戏场景
 * 设置一个boot用于加载资源，start为游戏开始场景,
 */
const gameSenceCenter = {}

gameSenceCenter.start = {
  key: 'start',
  create() {
    console.log('执行create了')
    this.add.image(0, 0, 'bg').setOrigin(0)
    this.add.image(this.game.config.width / 2, this.game.config.height - 16, 'copyright')
    const plane = this.add.sprite(this.game.config.width / 2, 100, 'myplane')

    // 创建飞行帧动画
    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('myplane', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    plane.anims.play('fly')

    const startButton = this.add
      .sprite(this.game.config.width / 2, 200, 'startbutton', 1)
      .setInteractive()
    startButton.on('pointerdown', () => {
      startButton.setFrame(0)
    })
    startButton.on('pointerup', () => {
      startButton.setFrame(1)
      console.log('start game')
      this.scene.start('play')
    })
  },
  update() {}
}

gameSenceCenter.boot = {
  key: 'boot',
  async preload() {
    for (const key in asset) {
      // 判断是否是图片,只有图片进行加载
      const isPic = ['png', 'jpg', 'jpeg', 'gif'].includes(asset[key].split('.').pop())
      if (asset.hasOwnProperty(key) && isPic) {
        if (key === 'myplane') {
          this.load.spritesheet(key, asset[key], {
            frameWidth: 40,
            frameHeight: 40
          })
          continue
        }
        if (key === 'startbutton') {
          this.load.spritesheet(key, asset[key], {
            frameWidth: 100,
            frameHeight: 40
          })
          continue
        }
        // 首先还是先把需要的帧图片引入进来
        if (key === 'explode1') {
          this.load.spritesheet(key, asset[key], {
            frameWidth: 20,
            frameHeight: 20
          })
          continue
        }
        if (key === 'explode2') {
          this.load.spritesheet(key, asset[key], {
            frameWidth: 30,
            frameHeight: 30
          })
          continue
        }
        if (key === 'explode3') {
          this.load.spritesheet(key, asset[key], {
            frameWidth: 50,
            frameHeight: 50
          })
          continue
        }
        if (key === 'myexplode') {
          this.load.spritesheet(key, asset[key], {
            frameWidth: 40,
            frameHeight: 40
          })
          continue
        }

        this.load.image(key, asset[key])
      }
    }
    /*
     * 这里我们添加一个文本来显示进度
     * api链接：https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectCreator.html#text__anchor
     */
    const percentText = this.make
      .text({
        x: this.game.config.width / 2,
        y: this.game.config.height / 2 - 5,
        text: '0%',
        style: {
          font: '18px monospace',
          fill: '#ffffff'
        }
      })
      .setOrigin(0.5, 0.5)

    /*
     * 使用this.load.on监听加载进度和完成状态
     * api链接：https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html#on__anchor
     * 使用setText()设置文本显示
     * api链接：https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html#setText__anchor
     */
    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%')
    })

    this.load.on('complete', function () {
      percentText.destroy()
    })
  },
  create() {
    // 在加载完成后调用this.scene.start(场景key)开始下一个场景
    // api链接：https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.ScenePlugin.html#start__anchor)
    this.scene.start('start')
  },
  update() {}
}

// 新增play场景
gameSenceCenter.play = {
  key: 'play',
  create() {
    // 添加背景,tileSprite,背景精灵
    this.bg = this.add
      .tileSprite(0, 0, this.game.config.width, this.game.config.height, 'bg')
      .setOrigin(0)
    // 引入飞机精灵

    const plane = (this.plane = this.add
      .sprite(this.game.config.width / 2, this.game.config.height - 100, 'myplane')
      .setInteractive({ draggable: false }))

    // 创建飞行帧动画
    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('myplane', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
    // 飞机调用飞行动画
    plane.anims.play('fly')

    this.scoreText = this.add.text(0, 0, 'Score: 0', { color: '#ff0000', fontSize: '16px' })
    this.score = 0

    this.tweens.add({
      targets: plane,
      y: this.game.config.height - plane.height,
      duration: 1000,
      onComplete: () => {
        this.plane.on('drag', function (pointer, dragX, dragY) {
          this.x = dragX
          this.y = dragY
        })
        this.physics.add.existing(this.plane)
        this.plane.body.setCollideWorldBounds(true)
      }
    })

    // 创建子弹组
    // 首先我们创建一个生成子弹的class
    const BulletClass = new Phaser.Class({
      Extends: Phaser.GameObjects.Sprite,
      initialize: function Bullet(scene) {
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'mybullet')
      },
      fire: function () {
        this.setActive(true)
        this.setVisible(true)
      },
      update: function () {
        if (this.y < -50) {
          // 这两个方法是用来处理当前sprite的激活状态和显示隐藏状态的
          // api: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html#setActive__anchor
          this.setActive(false)
          this.setVisible(false)
        }
      }
    })
    // api链接： https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#group__anchor
    this.bullets = this.add.group({
      classType: BulletClass,
      runChildUpdate: true
    })
    // this.bullets.createMultiple({
    //   classType: BulletClass,
    //   key: 'mybullet',
    //   quantity: 5,
    //   active: false,
    //   visible: false
    // })

    // 敌机的生成
    // 我们有大中小三种飞机，创建一个factory用来返回不同的class
    function EnemyFactory(key, gameHeight) {
      return new Phaser.Class({
        Extends: Phaser.GameObjects.Sprite,
        initialize: function Bullet(scene) {
          Phaser.GameObjects.Sprite.call(this, scene, 0, 0, key)
        },
        update: function () {
          if (this.y > gameHeight) {
            this.hide()
          }
        },
        show: function () {
          this.setActive(true)
          this.setVisible(true)
        },
        hide: function () {
          this.setActive(false)
          this.setVisible(false)
        }
      })
    }

    // 创建敌机组
    ;['enemy1', 'enemy2', 'enemy3'].forEach((item) => {
      const EnemyClass = EnemyFactory(item, this.game.config.height)
      this[item] = this.add.group({
        classType: EnemyClass,
        runChildUpdate: true
      })
      const key = item.replace('enemy', '')
      // 创建敌机爆炸帧动画 敌方飞机爆炸不循环 速度快点
      this.anims.create({
        key: `enemyBoom${key}`,
        frames: this.anims.generateFrameNumbers(`explode${key}`, {
          start: 0,
          end: 2
        }),
        frameRate: 5,
        repeat: 0
      })
    })

    // 设置敌机生成默认时间为0
    this.enemyBeforeTime = 0
    // 设置我的子弹默认时间为0
    this.myBulletBeforeTime = 0
    // 最大敌机的数量
    this.maxEnemyCount = 10
    // 当前敌机的数量
    this.enemyCount = 0

    // 添加隐藏的护栏阻挡飞机
    const rect1 = this.add
      .rectangle(0, (this.game.config.height / 4) * 3, this.game.config.width, 1)
      .setOrigin(0, 0)
    // 将无形矩形转换为物理对象
    this.physics.add.existing(rect1, true)
    // 转换为物理对象并设置物理属性
    this.physics.world.enable(rect1, Phaser.Physics.Arcade.DYNAMIC_BODY)
    rect1.body.immovable = true // 设置为不可移动
    rect1.body.allowGravity = false // 不受重力影响
    ;['enemy1', 'enemy2', 'enemy3'].forEach((item) => {
      this.physics.add.overlap(rect1, this[item], (rect, enemy) => {
        enemy.body.setVelocity(0, 0)
        // console.log('你撞上隐形陷阱啦')
      })
    })

    // 这里设置一下敌机组和飞机的碰撞检测
    ;['enemy1', 'enemy2', 'enemy3'].forEach((item) => {
      this.physics.add.overlap(
        this.bullets,
        this[item],
        (bullet, enemy) => {
          bullet.destroy()
          // 检测碰撞后先减生命，发现不够了再让敌机消失，调用爆炸帧动画
          enemy.life = enemy.life - 1
          enemy.destroy()
          const key = item.replace('enemy', '')

          // 我们在敌机消失的位置上新增加一个精灵，用来展示帧动画
          const enemyFrame = this.add.sprite(enemy.x, enemy.y, `explode${key}`)
          enemyFrame.anims.play(`enemyBoom${key}`)

          // 这里遇到一个新的api，用来监听动画执行结束
          // api: https://photonstorm.github.io/phaser3-docs/Phaser.Animations.Events.html#event:SPRITE_ANIMATION_COMPLETE
          // once 表示只执行一次
          // api: https://photonstorm.github.io/phaser3-docs/Phaser.Events.EventEmitter.html#once
          enemyFrame.once('animationcomplete', function () {
            enemyFrame.destroy()
          })

          // 撞击之后加分
          this.score = +key + this.score
          this.scoreText.setText(`Score: ${this.score}`, this.score)
        },
        null,
        this
      )
    })

    // 指定范围点击发射子弹
    // 创建一个图形对象
    const rect = this.add
      .rectangle(0, 0, this.game.config.width / 2, this.game.config.height)
      .setOrigin(0, 0)
    // 监听点击事件
    rect.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.game.config.width, this.game.config.height),
      Phaser.Geom.Rectangle.Contains
    )
    rect.on('pointerup', (pointer) => {
      // 点击事件处理逻辑
      const bullet = this.bullets.getFirstDead(true)
      if (bullet) {
        bullet.fire()
        bullet.setPosition(this.plane.x, this.plane.y - this.plane.height / 2)
        this.physics.add.existing(bullet)
        bullet.body.setVelocity(0, -300)
      }
    })

    // this.bg.on('pointerup', () => {
    //   console.log('start game')
    //   const bullet = this.bullets.getFirstDead(true)
    //   if (bullet) {
    //     bullet.fire()
    //     bullet.setPosition(this.plane.x, this.plane.y - this.plane.height / 2)
    //     this.physics.add.existing(bullet)
    //     bullet.body.setVelocity(0, -300)
    //   }
    // })

    // this.enemySmall = this.add.sprite(30, 30, 'enemy1')
    // this.physics.add.existing(this.enemySmall)
    // 这里我们记录一个初始的时间，用来存每个子弹的生成时间
    // this.beforeTime = 0

    // overlap碰撞检测方法
    // api链接： https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Factory.html#overlap__anchor
    // this.physics.add.overlap(
    //   this.bullets,
    //   this.enemySmall,
    //   function (bullet, enemy) {
    //     bullet.destroy()
    //     enemy.destroy()
    //   },
    //   null,
    //   this
    // )
  },
  update() {
    const time = new Date().getTime()
    // if (time - this.myBulletBeforeTime > 500) {
    //   // const bullet = this.add.sprite(this.plane.x, this.plane.y - this.plane.height / 2, 'mybullet')
    //   // this.myBulletBeforeTime = time

    //   // // 给子弹添加物理引擎
    //   // // api链接： https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Factory.html#existing__anchor
    //   // this.physics.add.existing(bullet)

    //   // // 在将精灵添加到物理引擎后，它就被赋予一个body对象
    //   // // setVelocity设置子弹的移动速度
    //   // // api链接： https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Body.html#setVelocity__anchor
    //   // bullet.body.setVelocity(0, -300)
    //   // this.bullets.add(bullet)
    //   const bullet = this.bullets.getFirstDead(true)
    //   if (bullet) {
    //     bullet.fire()
    //     bullet.setPosition(this.plane.x, this.plane.y - this.plane.height / 2)
    //     this.physics.add.existing(bullet)
    //     bullet.body.setVelocity(0, -300)
    //     this.myBulletBeforeTime = time
    //   }
    // }

    // 引入敌机
    if (time - this.enemyBeforeTime > 300 && this.enemyCount < this.maxEnemyCount) {
      // Phaser提供的Math对象，Between表示两者之间的整数
      // api: https://photonstorm.github.io/phaser3-docs/Phaser.Math.html
      const enemyIndex = Phaser.Math.Between(1, 3)
      const enemy = this[`enemy${enemyIndex}`].getFirstDead(true)
      if (enemy) {
        enemy.show()
        enemy.setOrigin(0.5, 0.5)
        enemy.setPosition(
          Phaser.Math.Between(0 + enemy.width, this.game.config.width - enemy.width),
          0
        )
        this.physics.add.existing(enemy)
        enemy.body.setVelocity(0, 50)
        this.enemyCount++
        this.enemyBeforeTime = time
      }
    }

    console.log(this.bullets.children.size)
    // 设置垂直滚动
    // api链接： https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.TileSprite.html
    this.bg.tilePositionY -= 1
  }
}

const config = {
  parent: 'game-c',
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  width: 240,
  height: 400,
  scene: [gameSenceCenter.boot, gameSenceCenter.start, gameSenceCenter.play],
  canvasStyle: 'width:100%;height:100%',
  physics: {
    default: 'arcade'
  }
}

onMounted(() => {
  const game = new Phaser.Game(config)
})
</script>

<style lang="scss" scoped>
.battle-fly-wrap {
  width: 100vw;
}
</style>
