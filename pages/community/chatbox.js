// comment.js
var common = require("../../js/common.js");
var app = getApp();
function getCurrentDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 10,
    hideHeader: true,
    hideFooter: true,
    doingup: false,
    doingdown: false,
    touchflag: false,
    loading: false,
    showmore: true,
    chatList: [],
    files: [],
    // 发送还是更多图标
    unknowimg: "../../images/plus.png",
    userInfo: {},
    mixArray: [],
    animation: {},
    animation_2: {},
    tap: "tapOff",
    height: 0,
    msg: '',
    more: 'ion-ios-plus-outline',
    unknowimg: "../../images/plus.png",
    moreBox: false,
    emotionBox: false,
    emotions: [],
    voicing: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    let emotions = []
    for (let i = 1; i < 28; i++) {
      let j = i;
      if (j < 10)
        j = '00' + i
      else
        j = '0' + i
      emotions.push({
        src: '../../images/face-icons-flat/smiley_' + j + '.png',
        id: i,
        name: 'smiley_' + j
      })
    }
    this.setData({
      emotions: emotions,
      userInfo: app.globalData.userInfo
    })
    var groupid = options.groupid;
    this.setData({
      groupid: groupid,
      joinDate: getCurrentDate(),
      jointamp: new Date().getTime()
    });
    this.queryGroup(groupid);
    this.queryHis(groupid, this.data.joinDate);
  },
  /**
  * 页面初次渲染完成
  */
  onReady() {
    this.animation = wx.createAnimation();
    this.animation_2 = wx.createAnimation()
  },

  tapscroll(e) {
    console.log("111111111111111111111111111" + JSON.stringify(e))
    this.setData({
      emotionBox: false,
      moreBox: false
    })

    this.animation_2.height(this.data.height - 50).step();
    this.setData({ animation_2: this.animation_2.export() })
    this.setData({
      tap: "tapOff"
    })
  },
  emotionBtn() {
    this.setData({
      moreBox: false,
      emotionBox: (this.data.tap == 'tapOff') ? true : false
    })

    if (this.data.tap == "tapOff") {
      this.animation_2.height(this.data.height - 200).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
        tap: "tapOn"
      })
    } else {
      this.animation_2.height(this.data.height - 50).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
        tap: "tapOff"
      })
    }
  },
  // 显示为发送按钮
  elseBtn: function () {
    var that = this;
    if (that.data.more == 'ion-ios-send') {
      // postmsg
      that.sendMsg(1, that.data.chatList[that.data.chatList.length - 1].sentTime)
      that.setData({
        msg: '',
        more: 'ion-ios-plus-outline',
        unknowimg: '../../images/plus.png'
      })
      that.animation_2.height(that.data.height - 50).step();
      that.setData({ animation_2: that.animation_2.export() })
      that.setData({
        emotionBox: false,
        tap: "tapOff"
      })
      return
    }
    that.setData({
      emotionBox: false,
      moreBox: (that.data.tap == 'tapOff') ? true : false
    })
    if (that.data.tap == "tapOff") {
      that.animation_2.height(that.data.height - 200).step();
      that.setData({ animation_2: that.animation_2.export() })
      that.setData({
        tap: "tapOn"
      })
    } else {
      that.animation_2.height(that.data.height - 50).step();
      that.setData({ animation_2: that.animation_2.export() })
      that.setData({
        tap: "tapOff"
      })
    }
  },
  chooseImg() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var file = res.tempFilePaths[0]
        // common.uploadFile(tempFilePaths[0], function (res, err) {
        //   console.log(JSON.stringify(res));
        // }); 
        wx.showLoading({
          title: '正在上传图片',
        })
        common.uploadFile(file, function (res) {
          var s = JSON.parse(res.data.replace(/[\\]/g, ''))
          console.log("888888888888888" + JSON.stringify(s))
          if (s.resCode == "200") {
            wx.hideLoading()
            // 图片上传成功后，提交消息
            console.log(s)
            that.sendMsg(2, that.data.chatList[that.data.chatList.length - 1].sentTime, s.objects[0].filepath)
          }
        })
      }
    })
  },
  previewImage: function (e) {
    console.log("previewImage" + JSON.stringify(e.currentTarget))
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  chooseEmotion(e) {
    console.log('emotion:' + e.target.dataset.name)
    // this.data.mixArray.push("");
    this.setData({
      msg: this.data.msg + '[' + e.target.dataset.name + ']',
      more: 'ion-ios-send',
      unknowimg: '../../images/send.png'
    })
  },
  toggleIon(e) {
    this.setData({
      msg: e.detail.value,
      more: (e.detail.value) ? 'ion-ios-send' : 'ion-ios-plus-outline',
      unknowimg: (e.detail.value) ? '../../images/send.png' : '../../images/plus.png'
    })
  },

  formatItem: function (item, isHis) {
    var listItem = {};
    if (item.from_user_id === app.globalData.userInfo.id) {
      listItem.self = true;
    } else {
      listItem.self = false;
    }
    if (item.object_name == "2") {
      if (isHis) {
        var temp = this.data.files
        temp.unshift(item.path)
        this.setData({
          files: temp
        })
      } else {
        this.setData({
          files: this.data.files.concat(item.path)
        })
      }
      // unshift

    }
    listItem.msgType = item.object_name;
    listItem.nickname = item.user_nicename;
    // 文本消息时content为内容，图片消息时content为缩略图
    // replace(/\[(.*)\]/g, "../../images/face-icons-flat/$1.png"),/\[smiley_(.+?)\]/g,/\[|]/g
    var reg = new RegExp('\\[smiley_(.+?)\\]', "g");

    if (item.content) {
      // console.log("66666666666666666666" + item.content.split(/\[smiley_(.+?)\]/g));
      // console.log("77777777777777777777777" + item.content.replace(/\[smiley_(.+?)\]/g, "../../images/face-icons-flat/$1.png"));
    }
    listItem.content = item.content;
    // listItem.mixList = JSON.parse(item.content);
    listItem.avatar = item.avatar ? item.avatar : "../../images/users.png";
    listItem.imageUri = item.path;
    listItem.sentTime = item.createtime;
    listItem.id = "item" + item.id;
    return listItem;
  },
  queryGroup: function (groupid) {
    var that = this;
    var params = {
      group_id: groupid
    }
    common.dataAccess("Group/groupInfo", params, function (res) {
      if (res.data.resCode == '200') {
        wx.setNavigationBarTitle({
          title: res.data.objects[0].title
        })
      }
    });
  },
  touchstart: function (e) {
    this.setData({ touchflag: true })
  },
  upper: function (e) {
    if (this.data.touchflag && !this.data.doingup && !this.data.loading && this.data.showmore) {
      this.setData({
        hideHeader: false,
        upview: "松开加载",
        doingup: true
      })
    }
  },
  lower: function (e) {
    if (this.data.touchflag && !this.data.doingdown) {
      this.setData({
        hideFooter: false,
        downview: "松开加载",
        doingdown: true
      })
    }
  },
  touchend: function (e) {
    var that = this
    if (that.data.doingup) {
      wx.showNavigationBarLoading() //在标题栏中显示加载
      that.setData({
        upview: "加载中...",
        doingup: false
      })
      that.queryHis(that.data.groupid, that.data.joinDate)
    } else if (that.data.doingdown) {
      wx.showNavigationBarLoading() //在标题栏中显示加载
      that.setData({
        downview: "加载中...",
        doingdown: false
      })
      that.newInfo(that.data.groupid, that.data.chatList[that.data.chatList.length - 1].sentTime)
    }
    that.setData({
      touchflag: false
    })
  },
  sendMsg: function (objectname, lastTime, filepath) {
    var that = this
    var params = {
      uid: that.data.userInfo.id,
      content: that.data.msg,
      group_id: that.data.groupid,
      object_name: objectname,
      time: lastTime,
      path: filepath
    }
    console.log("params" + JSON.stringify(params))
    common.dataAccess("Group/sendMessage", params, function (res) {
      console.log("999999999999999" + JSON.stringify(res))
      if (res.data.objects && res.data.objects.length > 0) {
        var reslist = that.data.chatList;
        for (var i = 0; i < res.data.objects.length; i++) {
          reslist.push(that.formatItem(res.data.objects[i], false));
        }
        that.setData({
          chatList: reslist
        })
      }
    })
  },
  // 查询历史
  queryHis: function (groupid, joinDate) {
    var that = this;
    if (!that.data.loading) {
      that.setData({
        loading: true
      });
      wx.showLoading({
        title: '加载中',
      });
      var params = {
        limit: that.data.pageSize,
        page: that.data.pageNo,
        group_id: groupid,
        time: joinDate
      }
      common.dataAccess("Group/downRefresh", params, function (res) {
        if (res.data.resCode == '200' || res.data.isSuccess) {
          if (res.data.objects && res.data.objects.length > 0) {
            var reslist = that.data.chatList;
            for (var i = 0; i < res.data.objects.length; i++) {
              reslist.unshift(that.formatItem(res.data.objects[i], true));
            }
            that.setData({
              chatList: reslist
            })
            if (res.data.objects.length < that.data.pageSize) {
              that.setData({
                showmore: false
              });
            }
          } else {
            that.setData({
              showmore: false
            });
          }
        }
        // setTimeout(function () {}, 300)
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        that.setData({
          loading: false,
          hideHeader: true,
          pageNo: that.data.pageNo + 1
        })
      })
    }
  },
  // 查询最新
  newInfo: function (groupid, lastTime) {
    var that = this;
    if (!that.data.loading) {
      that.setData({
        loading: true
      });
      wx.showLoading({
        title: '加载中',
      });
      var params = {
        limit: that.data.pageSize,
        page: 1,
        group_id: groupid,
        time: lastTime,
      }
      common.dataAccess("Group/upRefresh", params, function (res) {
        if (res.data.resCode == '200') {
          if (res.data.objects && res.data.objects.length > 0) {
            var reslist = that.data.chatList;
            for (var i = 0; i < res.data.objects.length; i++) {
              reslist.push(that.formatItem(res.data.objects[i]), false);
            }
            that.setData({
              chatList: reslist
            })
          }
        }
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        that.setData({
          loading: false,
          hideFooter: true
        })
      })
    }
  },
  getlocat() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            name: '时代一号',
            desc: '现在的位置'
          }],
          covers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: '/images/green_tri.png',
            rotate: 10
          }]
        })
      }
    })

  },
  getvoice: function () {
    if (this.data.voicing) {
      wx.stopRecord()
      this.setData({
        voicing: false
      })
      console.log("stop")
      return
    }
    this.setData({
      voicing: true
    })
    console.log("开始录音")
    wx.startRecord({
      success: function (res) {
        console.log("录音成功")
        var tempFilePath = res.tempFilePath
        console.log('voice:' + tempFilePath)
      },
      complete: function (res) {
        console.log("complete" + JSON.stringify(res))
      },
      fail: function (res) {
        //录音失败
        console.log("fail" + res)
      }
    })
  },
  stopvoice: function () {
    wx.stopRecord()
    console.log("stop")
  }
})
