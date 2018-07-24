var common = require("../js/common.js");
var app = getApp();
Page({
  data: {
    sliderOffset: 0,
    sliderLeft: 0,
    currentPage: 1,
    grouplist: []
  },
  onLoad: function () {
    var res = wx.getSystemInfoSync();
    var ht = (res.screenWidth) * 9 / 16;
    this.setData({
      ht: ht,
      barwidth: res.screenWidth / 2 - 30,
      scrollheight: app.globalData.tabbarWinHeight - 46
    });
    this.queryCommunity();
  },
  tabGroup: function (e) {
    app.checkLogin(function () {
      var params = {
        uid: app.globalData.userInfo.id,
        group_id: e.currentTarget.dataset.groupid
      }
      common.dataAccess("Group/selectRight", params, function (res) {
        if (res) {
          switch (res.data.objects) {
            case 0:
              wx.showModal({
                content: '已提交入群申请，请等待审核通过!',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              });
              break
            case 1:
              wx.navigateTo({
                url: './community/chatbox?groupid=' + e.currentTarget.dataset.groupid
              })
              break
            case 10:
              wx.showModal({
                title: '提示',
                content: '非群成员，申请成为群成员？',
                confirmText: "确定",
                cancelText: "取消",
                success: function (res) {
                  console.log(res);
                  if (res.confirm) {
                    common.dataAccess("Group/selectRight", params, function (res) {

                    })
                  } else {
                    console.log('用户点击辅助操作')
                  }
                }
              });
              break
            case 11:
              break
            case 12:
              wx.showModal({
                content: '请先实名认证！',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              });
              break
            case 13:
              wx.showModal({
                content: '请等待管理员通过实名认证审核!',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
              break

          }
        }
        console.log(res)
      })

    });
  },
  queryCommunity: function () {
    var that = this;
    this.setData({
      loading: true
    });
    wx.showLoading({
      title: '加载中',
    });
    var data = {
      // uid: app.globalData.userInfo ? app.globalData.userInfo.id : "",
      uid: "",
      page: that.data.currentPage,
      limit: 5
    };
    console.log(JSON.stringify(data));
    common.dataAccess("Group/getList", data, function (res) {
      if (res.data.resCode == '200') {
        if (res.data.objects && res.data.objects.length > 0) {
          if (that.data.currentPage == 1) {
            that.setData({
              grouplist: res.data.objects
            });
          } else {
            that.setData({
              grouplist: that.data.list.concat(res.data.objects)
            });
          }
        } else {
          that.setData({
            showmore: false
          });
        }
      }
      wx.hideLoading();
      that.setData({ loading: false });
    });
  },
  loadMore: function (event) {
    if (this.data.loading || !this.data.showmore) {
      return;
    }
    this.setData({
      currentPage: this.data.currentPage + 1
    });
    console.log("=========================" + JSON.stringify(event.currentTarget));
    this.queryList(event.currentTarget.dataset.listname, event.currentTarget.dataset.type);
  },
  detailvideo: function (e) {
    var groupid = e.currentTarget.id;
    console.log("22222222222222222222222" + JSON.stringify(viditem));
  }
});