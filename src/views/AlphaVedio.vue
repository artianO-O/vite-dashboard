<!-- 1376 × 1068 -->
<template>
  <div class="about">
    <video
      ref="video"
      class="video"
      src="../assets/video/battle.mp4"
      autoplay="true"
      controls
      loop
      muted
    ></video>
    <canvas ref="canvas1" width="1376" height="1068" style="width: 15rem"></canvas>
    <canvas class="canvas2" ref="canvas2" width="1376" height="1068"></canvas>
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
    video.addEventListener('canplay', function () {
      this.width = this.videoWidth
      this.height = this.videoHeight
    })
    video.addEventListener(
      'play',
      () => {
        let $this = this
        const w = video.width
        const h = video.height
        console.log(w, h)
        ;(function loop() {
          if (!video.paused && !video.ended) {
            $this.ctx2.drawImage(video, 0, 0)
            let frameData = $this.ctx2.getImageData(0, 0, w, h)
            let data = frameData.data
            for (let i = 0; i < h; i++) {
              for (let j = 0; j < w; j++) {
                if (j < w / 2) {
                  if (
                    data[i * w * 4 + j * 4] < 200 &&
                    data[i * w * 4 + j * 4 + 1] < 200 &&
                    data[i * w * 4 + j * 4 + 2] < 200
                  ) {
                    data[i * w * 4 + (j + w / 2) * 4 + 3] = 0
                  }
                }
              }
            }
            $this.ctx1.putImageData(frameData, -w / 4, 0, w / 2, 0, w / 2, h)
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
  padding-top: 15rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  //   background-color: red;
  //   padding: 2rem;
  .video {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
  .canvas2 {
    opacity: 0;
  }
}
</style>
