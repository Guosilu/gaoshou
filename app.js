//app.js
const config = require('config/config.js');
App({
  onLaunch: function () {
    // 获取用户信息ghp 
    if (wx.getStorageSync('isLogin')) {
      this.login();
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  login: function () {
    // 登录
    let that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          wx.getUserInfo({
            success: function (msg) {
              //发起网络请求
              wx.request({
                url: config.loginUrl,
                method: 'POST',
                header: {
                  // 'content-type': 'application/json'
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  js_code: res.code,
                  encryptedData: msg.encryptedData,
                  iv: msg.iv
                },
                success: function (data) {
                  //console.log(data);
                  if (data.data.openId) {
                    wx.setStorageSync('openId', data.data.openId);
                    wx.setStorageSync('isLogin', true);
                    if (that.openIdReadyCallback) {
                      that.openIdReadyCallback(data.data.openId)
                    }
                  }
                },
                fail: function (res) {
                  console.log(res)
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + login.errMsg)
        }
      }
    })
  },
  onShow: function() {
    if (wx.getStorageSync('isLogin')) {
      this.login();
    }
  },
  globalData: {
    userInfo: null
  }
})