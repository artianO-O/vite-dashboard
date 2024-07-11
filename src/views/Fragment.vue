<!-- 碎块化展示图片动画 -->
<template>
  <div class="fragment-wrap">
    <div class="box" id="box"></div>
  </div>
</template>

<script lang="ts" setup>
document.addEventListener('DOMContentLoaded', () => {
  const box: any = document.getElementById('box')
  console.log(box.getBoundingClientRect())
  const { width, height } = box.getBoundingClientRect()
  // 定义多少个小块，由多少行和列决定
  const row = 14
  const col = 10
  // 计算小块的宽高
  const smallBoxWidth = width / col
  const smallBoxHeight = height / row
  /** @name 创建小块 **/
  function createSmallBox() {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        const smallBox = document.createElement('div')
        smallBox.classList.add('small-box')
        smallBox.style.width = smallBoxWidth + 'px'
        smallBox.style.height = smallBoxHeight + 'px'
        // smallBox.style.border = '1px solid red'

        const offsetX = j * smallBoxWidth * -1
        const offsetY = i * smallBoxHeight * -1
        smallBox.style.backgroundPosition = `${offsetX}px ${offsetY}px`
        smallBox.style.backgroundSize = `${width}px ${height}px`

        // 给不同小块添加动画延迟
        const delay = j * 100 // 延迟时间为毫秒(ms)，注意不要太小了
        smallBox.style.animationDelay = `${delay}ms`

        smallBox.style.willChange = 'transform'
        // 在动画执行后，需要重置will-change
        const timer = setTimeout(() => {
          smallBox.style.willChange = 'initial'
          clearTimeout(timer)
        }, 2000)
        // 插入小块
        box.appendChild(smallBox)
      }
    }
  }
  createSmallBox()
})
// onMounted(() => {
// })
</script>

<style lang="scss">
// @keyframes smallBoxAnimate {
//   0% {
//     opacity: 0;
//   }
//   40% {
//     opacity: 0;
//   }
//   70% {
//     opacity: 1;
//   }
//   100% {
//     opacity: 1;
//   }
// }

body {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  width: 100vw;
  height: calc(1024 / 1280 * 100vw);
  display: flex;
  /* 小块自动换行排列 */
  flex-wrap: wrap;
  justify-content: center;
}
.small-box {
  //   opacity: 0;
  background-image: url(../assets/images/girl.png);
  box-sizing: border-box;
  background-repeat: no-repeat;
  animation: smallBoxAnimate 2000ms linear forwards;

  --rotateX: rotateX(0);
  --rotateY: rotateY(0);
  transform: var(--rotateX) var(--rotateY) scale(0.8);
}

@keyframes smallBoxAnimate {
  0% {
    opacity: 0;
    transform: var(--rotateX) var(--rotateY) scale(0.8);
  }
  40% {
    opacity: 0;
    transform: var(--rotateX) var(--rotateY) scale(0.8);
  }
  70% {
    opacity: 1;
    transform: rotateX(0) rotateY(0) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: rotateX(0) rotateY(0) scale(1);
  }
}
</style>
