<template>
  <div class="about">
    <video
      ref="video"
      src="../assets/video/battle.mp4"
      autoplay="true"
      width="420"
      height="300"
      controls
      loop
      muted
    ></video>
    <hr />
    <canvas ref="canvas1" width="1500" height="1064" style="width: 420px; height: 300px"></canvas>
    <canvas ref="canvas2" width="1500" height="1064" style="width: 420px; height: 300px"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      canvas1: null,
      ctx1: null,
      canvas2: null,
      ctx2: null
    }
  },
  mounted() {
    const c = this.$refs.canvas1
    this.ctx1 = c.getContext('2d', { willReadFrequently: true })
    const c2 = this.$refs.canvas2
    this.ctx2 = c2.getContext('2d', { willReadFrequently: true })
    const video = this.$refs.video
    video.addEventListener(
      'play',
      () => {
        let $this = this
        ;(function loop() {
          if (!video.paused && !video.ended) {
            $this.ctx2.drawImage(video, 0, 0)
            let frameData = $this.ctx2.getImageData(0, 0, 1500, 1064)
            let data = frameData.data
            for (let i = 0; i < 1064; i++) {
              for (let j = 0; j < 1500; j++) {
                if (j < 750) {
                  if (
                    data[i * 1500 * 4 + j * 4] === 0 &&
                    data[i * 1500 * 4 + j * 4 + 1] === 0 &&
                    data[i * 1500 * 4 + j * 4 + 2] === 0
                  ) {
                    data[i * 1500 * 4 + (j + 750) * 4 + 3] = 0
                  }
                }
              }
            }
            $this.ctx1.putImageData(frameData, -750, 0, 750, 0, 750, 1064)
            setTimeout(loop, 1000 / 24)
          }
        })()
      },
      0
    )
  }
}
</script>

<style lang="scss" scoped>
.about {
  //   padding: 2rem;
}
</style>
