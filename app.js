const common = require("js/common");
App({
    onLaunch: function () {
        this.getUserInfo(function(){

        });
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    },
    checkLogin: function (callback){
        var that = this;
        if(this.globalData.userInfo){
            callback();
        }else{
            wx.showModal({
                title: '提示',
                content: '您还没有登录，是否现在登录？',
                success: function (res) {
                    if (res.confirm) {
                        that.getUserInfo(callback);
                    } else if (res.cancel) {
                    }
                }
            })
        }
    },
    getUserInfo:function(callback){
        if(this.globalData.userInfo){
            return;
        }
        var that = this;
        wx.showLoading({
            title: '登录中',
        });
        //调用登录接口
        wx.login({
            success: function (res) {
              console.log(JSON.stringify(res));
                if(res.code){
                    //到服务器获取openid
                  common.dataAccess("Group/getUnid", {code:res.code}, function (res1) {
                      
                        if (res1.data.resCode == '200') {
                            const openid = res1.data.object.openid;
                            const unionid = res1.data.object.unionid
                            //获取用户信息
                            wx.getUserInfo({
                                success: function (res2) {
                                    var user = res2.userInfo;
                                    user.openid = openid;
                                    user.unionid = unionid;
                                    //服务器登录获取服务器用户id
                                    common.dataAccess("Group/login",user, function (res3) {
                                        if(res3.data.resCode=='200'){
                                            var userlogin = res3.data.object;
                                            that.globalData.userInfo = userlogin;
                                            callback();
                                        wx.hideLoading();
                                        }
                                    });
                                }
                            });
                        }
                        wx.hideLoading();
                    });
                   
                }
              
            },
            fail:function(){

            }
          });
      },
      globalData:{
        userInfo:null,
        hasLogin:false
      },
      dateformat:function(date,fmt){
        var o = {         
    "M+" : date.getMonth()+1, //月份         
    "d+" : date.getDate(), //日         
    "h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时         
    "H+" : date.getHours(), //小时         
    "m+" : date.getMinutes(), //分         
    "s+" : date.getSeconds(), //秒         
    "q+" : Math.floor((date.getMonth()+3)/3), //季度         
    "S" : date.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "/u65e5",         
    "1" : "/u4e00",         
    "2" : "/u4e8c",         
    "3" : "/u4e09",         
    "4" : "/u56db",         
    "5" : "/u4e94",         
    "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;  
      }

});