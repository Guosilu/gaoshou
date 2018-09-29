//app.js
const config = require('config/config.js');
App({
  getUserInfo: function () {
    let that = this;
    wx.getUserInfo({
      success: res => {
        that.globalData.userInfo = res.userInfo;
        that.reLogin(res.userInfo);
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res)
        }
      }
    })
  },
  reLogin: function (post) {
    let that = this;
    post['openId'] = this.globalData.openId;
    wx.request({
      url: config.loginUrl,
      method: 'POST',
      header: {
        'content-type': 'application/json'
        //'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        action: 'userInfo',
        post: post
      },
      success: res => {
        console.log(res.data);
        wx.setStorageSync('isLogin', true);
      }
    });
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
              that.getUserInfo();
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
          console.log('checkSession0');
          that.getUserInfo();
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
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    openId: null
  }
})