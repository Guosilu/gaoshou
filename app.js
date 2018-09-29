//app.js
const config = require('config/config.js');
App({
  redirectTo: function () {
    wx.getSetting({
      success: res => {
        console.log(!res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']) {
          wx.setStorageSync('isLogin', true)
        } else {
          wx.removeStorageSync('isLogin');
          wx.redirectTo({
            url: '../login/login',
          })
        }
      }
    });
  },
  login: function () {
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
  getUserInfo: function () {
    let that = this;
    wx.getUserInfo({
      success: res => {
        that.globalData.userInfo = res.userInfo;
        that.dataLogin(res.userInfo);
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res)
        }
      },
      fail: res => {
        console.log('未授权');
      }
    })
  },
  dataLogin: function (post) {
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
    let that = this;
    this.redirectTo();
    this.login();
  },
  onShow: function () {

  },
  globalData: {
    userInfo: null,
    openId: null
  }
})