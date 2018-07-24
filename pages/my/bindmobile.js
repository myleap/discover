// bindmobile.js
var app= getApp();
var common=require("../../js/common");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  bindKeyInput:function(e){
      this.setData({
          inputValue: e.detail.value
      });
  },
  sendMobile:function(){
    //   if (app.globalData.sendMobileTime && (new Date().getTime - app.globalData.sendMobileTime)<120000){
    //       wx.showToast({
    //           title: '验证码发送过于频繁'
    //       });
    //       return;
    //   }
      var that = this;
      if(!this.data.inputValue||this.data.inputValue==''){
        wx.showModal({
            title: '提示',
            content: '请输入正确的手机号',
            showCancel:false
        })
        return;
      }
      common.dataAccess("https://www.myleap.cn/myleapAdmin/index.php/v1/mobileVerify/sendRegiest",
          {
              mobile:that.data.inputValue
          },
          function (res) {
              if (res.data.resCode == 200) {
                 wx.showToast({
                     title: '发送验证码成功！',
                 });
                 app.globalData.sendMobileTime = new Date().getTime();
              } else {
                  wx.showToast({
                      title: '验证码发送过于频繁',
                  })
              }
          }
      );
  },
  modifyMobile:function(e){
      var form = e.detail.value;
      var mobile = form.mobile;
      var code = form.code;
      wx.showLoading({
          title: '提交中',
      })
      common.dataAccess("https://www.myleap.cn/myleapAdmin/index.php/v1/mobileVerify/checkVerify",
          {
              mobile: mobile,
              type:2,
              code:code
          },
          function (res) {
              if (res.data.resCode == 200) {
                  common.dataAccess("?g=portal&m=user&a=modifyMobile",
                      {
                          uid: app.globalData.userInfo.id,
                          mobile:mobile
                      },
                      function (res1) {
                          if (res1.data.resCode == 200) {
                            app.globalData.userInfo.mobile = mobile;
                              wx.redirectTo({
                                  url: '../util/success?msg=绑定成功'
                              });

                          } else {
                              wx.showToast({
                                  title: '绑定失败,请稍后再试！',
                              })
                          }
                          wx.hideLoading();
                      }
                  );
              } else {
                  wx.showToast({
                      title: '验证码错误！',
                  })
                  wx.hideLoading();
              }
             
          }
      );
  },
  
})