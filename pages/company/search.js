var common = require("../../js/common.js");
var app = getApp();
Page({
  data: {
    inputShowed: true,
    inputVal: "",
    companys: []
  },
  onLoad: function (options) {
    if (options.type == 'news') {
      this.setData({
        type: "news"
      });
      wx.setNavigationBarTitle({
        title: "资讯查询"
      })
    } else {
      this.setData({
        type: "group"
      });
      wx.setNavigationBarTitle({
        title:"群组查询"
      })
    }
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  openUrl: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.id,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showModal({
              title: '已复制链接到剪贴板',
              content: '打开浏览器粘贴打开链接',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      }
    })
  },
  inputTyping: function (e) {
    var that = this;
    var type = 0;
    if (this.data.type == "news") {
      common.dataAccess("Information/selectInformation", { keyword: e.detail.value}, function (res) {
        if (res.data.resCode == '200') {
          console.log("555555555555555555555555" + JSON.stringify(res.data));
          that.setData({
            companys: res.data.objects
          });
        }
      });
    } else {
      common.dataAccess("Group/selectGroup", { keyword: e.detail.value}, function (res) {
        if (res.data.resCode == '200') {
          console.log("555555555555555555555555" + JSON.stringify(res.data));
          that.setData({
            companys: res.data.objects
          });
        }
      });
    }

    this.setData({
      inputVal: e.detail.value
    });
  }
});