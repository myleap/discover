var common = require("../js/common.js");
var app = getApp();
Page({
  data: {
    tabs: [{
      title: "解读",
      url: "../images/analysis.png",
      urlselect: "../images/analysissel.png"
    }, {
      title: "研报",
      url: "../images/research.png",
      urlselect: "../images/researchsel.png"
    }, {
      title: "资讯",
      url: "../images/news.png",
      urlselect: "../images/newssel.png"
    }, {
      title: "视频",
      url: "../images/video.png",
      urlselect: "../images/videosel.png"
    }],
    activeIndex: 0,
    activeSortIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    analysis: [],
    research: [],
    news: [],
    videos: [],
    evaluatescrolltop: 0,
    showmore: true,
    sort: "lastupdatetime"
  },
  sortTabClick: function (e) {
    var id = e.currentTarget.id;
    this.setData({ activeSortIndex: id, currentPage: 1 });
    if (id == 0) {
      this.setData({
        sort: "lastupdatetime"
      });
      this.queryList("analysis", 3);
    } else if (id == 1) {
      this.setData({
        sort: "category2"
      });
      this.queryList("analysis", 3);
    } else if (id == 2) {
      this.setData({
        sort: "category3"
      });
      this.queryList("analysis", 3);
    } else if (id == 3) {
      this.setData({
        sort: "category6"
      });
      this.queryList("analysis", 3);
    }

  },
  onLoad: function () {
    var res = wx.getSystemInfoSync();
    var ht = (res.screenWidth) * 9 / 16;
    this.setData({
      ht: ht,
      barwidth: res.screenWidth / 4 - 30,
      scrollheight: app.globalData.tabbarWinHeight - 48 - 90
    });

    this.setData({
      currentPage: 1
    });
    this.queryList("analysis", 3);
  },
  onShow: function () {
    var firstIndex = app.globalData.firstIndex;
    if (firstIndex) {
      this.setData({
        activeIndex: firstIndex
      });
      if (firstIndex == 0) {
        this.setData({
          currentPage: 1,
          showmore: true
        });
        this.queryAnlysis();
      }
      if (firstIndex == 1) {
        this.setData({
          currentPage: 1,
          showmore: true
        });
        this.queryResearch();
      }
      if (firstIndex == 2) {
        this.setData({
          currentPage: 1,
          showmore: true
        });
        this.queryResearch();
      }

    }
    app.globalData.firstIndex = false;
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  toCom: function (e) {
    var index = e.currentTarget.id;
    var id = this.data.companys[index].id;
    app.checkLogin(function () {
      wx.navigateTo({
        url: '../pages/company/detail?id=' + id,
      });
    });
  },
  scrolltobottom: function (e) {
    console.log(e);
  },
  changeEvent: function (e) {
    this.setData({
      activeIndex: e.detail.current
    });
    if (e.detail.current == 0) {
      this.setData({
        currentPage: 1,
        showmore: true
      });
      this.queryList("analysis", 3);
    }
    if (e.detail.current == 1) {
      this.setData({
        currentPage: 1,
        showmore: true
      });
      this.queryList("research", 2);
    }
    if (e.detail.current == 2) {
      this.setData({
        currentPage: 1,
        showmore: true
      });
      this.queryList("news", 4);
    }
    if (e.detail.current == 3) {
      this.setData({
        currentPage: 1,
        showmore: true
      });
      this.queryList("videos", 1);
    }

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
  openFile: function (e) {
    common.openFile(e.currentTarget.id);
    // app.checkLogin(function () {
    //   if (app.globalData.userInfo.user_status == 3) {
    //     wx.showLoading({
    //       title: '下载中',
    //     })
    //     common.openFile(e.currentTarget.id);
    //   } else {
    //     wx.showModal({
    //       title: '提示',
    //       content: '您还没有进行实名认证，或者您的实名认证还未通过!',
    //       showCancel: false
    //     });
    //   }
    // });
  },
  // 查询研报
  queryList: function (listName, type) {
    var that = this;
    this.setData({
      loading: true
    });
    wx.showLoading({
      title: '加载中',
    });
    var data = {
      uid: app.globalData.userInfo ? app.globalData.userInfo.id : "",
      type: type,
      page: that.data.currentPage,
      limit: 5
    };
    common.dataAccess("Information/getList", data, function (res) {
      if (res.data.resCode == '200') {
        if (res.data.objects && res.data.objects.length > 0) {
          if (that.data.currentPage == 1) {
            that.setData({
              [listName]: res.data.objects
            });
          } else {
            that.setData({
              [listName]: that.data[listName].concat(res.data.objects)
            });
            console.log("******************************" + that.data.news.length);
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
  }
});