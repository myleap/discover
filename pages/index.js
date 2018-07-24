// index.js
var common=require("../js/common");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '金麦粒价值发现',
      path: '/pages/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var res = wx.getSystemInfoSync();
      this.setData({
          winWidth:res.windowWidth,
          winHeight:res.windowHeight
      });
      app.globalData.tabbarWinHeight = res.windowHeight;
  }
})