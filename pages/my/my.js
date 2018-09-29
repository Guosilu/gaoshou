const config = require('../../config/config.js');
const app = getApp()

Page({
  data: {
    img: config.img,
    motto: 'Hello World',
    userInfo: {}
  },
  getUserInfo: function () {
    let that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.hideLoading();
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.hideLoading();
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.hideLoading();
        }
      })
    }
  },
  onLoad: function () {
    
  },
  onShow: function () {
    this.getUserInfo();
  },
})