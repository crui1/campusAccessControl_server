<template>
  <div class="faceCheck">
    <!--展示摄像头视频流-->
    <video class="video" ref="video" autoplay muted></video>
    <!-- canvas截取图片 -->
    <canvas class="canvas" ref="canvas" width="640"></canvas>
    <img src="" ref="img" />
  </div>
</template>

<script>
import * as faceApi from 'face-api.js'
export default {
  name: 'face-api',
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      // 载入模型
      await faceApi.nets.tinyFaceDetector.loadFromUri('/models')
      await faceApi.nets.faceLandmark68Net.loadFromUri('./models')
      // await faceApi.nets.faceRecognitionNet.loadFromUri('./models')
      // await faceApi.nets.faceExpressionNet.loadFromUri('./models')
      // 调取摄像头信息
      this.getUserMedia({ audio: false, video: true }, this.success, this.error)
    },
    // 开启摄像头
    getUserMedia(constrains, success, error) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        //最新标准API
        navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //webkit内核浏览器
        navigator.webkitGetUserMedia(constrains).then(success).catch(error);
      } else if (navigator.mozGetUserMedia) {
        //Firefox浏览器
        navigator.mozGetUserMedia(constrains).then(success).catch(error);
      } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constrains).then(success).catch(error);
      }
    },

    //开启摄像头 成功的回调函数
    success(stream) {
      //兼容webkit核心浏览器
      // var CompatibleURL = window.URL || window.webkitURL;
      //将视频流转化为video的源
      // video.src = CompatibleURL.createObjectURL(stream);
      try {
        this.$refs.video.src = window.URL.createObjectURL(stream);

      } catch (e) {
        this.$refs.video.srcObject = stream;

      }
      // 开始检测人脸
      setTimeout(() => this, this.getFace(), 1000)
    },

    //开启摄像头 异常的回调函数
    error(error) {
      alert('访问用户媒体设备失败!!!')
      console.log("访问用户媒体设备失败：", error.name, error.message);
    },
    // 检测人脸
    getFace() {
      const videoEl = this.$refs.video
      const canvasEl = this.$refs.canvas
      const content = this.$refs.canvas.getContext('2d')

      // 播放视频就触发函数
      videoEl.addEventListener('play', () => {
        console.log('播放视频');
        // 画布大小与视频大小相同
        const canvasSize = faceApi.matchDimensions(canvasEl, videoEl, true)
        // 定时器
        let f = false
        const timer = setInterval(async () => {
          console.log('检测中')
          // 人脸检测结果
          const detectionsFace = await faceApi.detectAllFaces(videoEl, new faceApi.TinyFaceDetectorOptions())
          if (f) return
          // 每次画之前清除之前的画布
          content.clearRect(0, 0, canvasSize.width, canvasSize.height)
          this.setTip(content, '未检测到人脸...')
          if (detectionsFace.length > 0) {
            f = true
            // 每次画之前清除之前的画布,清除定时器，停止视频播放
            content.clearRect(0, 0, canvasSize.width, canvasSize.height)
            clearInterval(timer)
            this.switchVideo()

            // const resizedDetections = faceApi.resizeResults(detectionsFace, canvasSize)
            // 截取图像，然后把图像发到服务器
            content.drawImage(videoEl, 0, 0, canvasSize.width, canvasSize.height);
            let img = canvasEl.toDataURL('image/png')
            this.setTip(content, '检测到人脸，识别中...', 'orange')

            // 关闭摄像头
            // videoEl.srcObject.getTracks()[0].stop()

            // 进行异步请求，并通过回调继续播放视频
            setTimeout(() => {
              this.switchVideo()
            }, 5000)

            // 画方框轮廓
            // faceApi.draw.drawDetections(canvasEl, resizedDetections)
            // // 画特征
            // faceApi.draw.drawFaceLandmarks(canvasEl, resizedDetections)
            // faceApi.draw.drawFaceExpressions(canvasEl, resizedDetections)
            console.log('检测到人脸,暂停播放和检测，开始发送到后台识别');
          }
        }, 100)
      }
      )
    },
    // 暂停/播放
    switchVideo() {
      if (this.$refs.video.paused) {
        this.$refs.video.play()
      } else {
        this.$refs.video.pause()
      }
    },
    // 设置提示信息
    setTip(content, text = "测试文本...", color = "red") {
      content.font = "18pt serif";
      content.fillStyle = color;
      content.textAlign = "center";
      content.fillText(text, 320, 50);
    }
  }
}
</script>

<style lang="less" scoped>
.faceCheck {
  position: relative;
  width: fit-content;
  margin: 50px auto;
  box-shadow: 0 0 10px rgba(27, 27, 27, 0.915);

  .canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>