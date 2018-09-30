const config = require('../../config/config.js');
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  login: function (e) {
    let that = this;
    let post = {};
    if (e.detail.userInfo) {
      let userInfo = e.detail.userInfo
      wx.showLoading({
        mark: true,
        title: '登陆中...',
      });
      app.globalData.userInfo = userInfo;
      console.log(app.globalData.openId);
      if (app.globalData.openId) {
        post = userInfo;
        post['openId'] = app.globalData.openId;
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
            wx.switchTab({
              url: '../index/index'
            })
          }
        })
      }
    } else {
      wx.showToast({
        title: '您拒绝了授权登录!',
        icon: 'none'
      })
    }
  },
  onLoad: function () {

  }
})