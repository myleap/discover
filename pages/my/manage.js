const common = require("../../js/common");
var app = getApp();
// certification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '认证管理'
    })
    this.queryList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  pass: function (e) {
    var that= this
    console.log(e)
    var index = e.target.dataset.index
    console.log(index)
    common.dataAccess("Group/add_join", { uid: app.globalData.userInfo.id, group_id: e.target.dataset.groupid, group_name: e.target.dataset.groupname }, function (res) {
      console.log(res)
      if (res) {
        var temp = that.data.userList
        temp.splice(index,1)
        that.setData({
          userList: temp
        })
      }
    })
  },
  queryList: function () {
    var that = this
    app.globalData.userInfo
    common.dataAccess("Group/selectJoin", { uid: 2 }, function (res) {
      console.log(res)
      if (res) {
        that.setData({
          userList: res.data.objects
        })
      }
    })
  }
})