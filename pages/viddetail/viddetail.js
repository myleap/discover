function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  onLoad: function (options) {
    this.setData({
      vidurl: options.vidurl
    })
  },
  inputValue: '',
  data: {
    danmuList: [
      {
        text: '金麦粒价值发现',
        color: '#ff0000',
        time: 1
      },
      {
        text: '金麦粒价值发现',
        color: '#8899ff',
        time: 2
      },
      {
        text: '金麦粒价值发现',
        color: '#ff00ff',
        time: 3
      }]
  },
  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
  bindFormSubmit: function (e) {
    this.inputValue = e.detail.value.text;
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  }
})