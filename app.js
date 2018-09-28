//app.js
const config = require('config/config.js');
App({
  getUserInfo: function () {
    wx.getUserInfo({
      success: res => {
        this.globalData.userInfo = res.userInfo
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  },
  onLaunch: function () {
    wx.getSetting({
      success: res => {
        console.log(!res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']) {
          wx.setStorageSync('isLogin', true)
        } else {
          wx.redirectTo({
            url: '../login/login',
          })
        }
      }
    });
    var that = this;
    this.getUserInfo();
    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          wx.request({
            url: config.loginUrl,
            method: 'POST',
            header: {
              'content-type': 'application/json'
              //'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              action: 'openId',
              js_code: res.code
            },
            success: res => {
              that.globalData.openId = res.data;
              console.log(res);
            }
          })
        } else {
          console.log('登录失败！' + login.errMsg)
        }
      }
    })
  },
  onShow: function () {
    let that = this;
    wx.checkSession({
      success: function(e) {
        console.log(e.errMsg);
        if(!e.errMsg) {
          that.getUserInfo();
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    openId: null
  }
})