const config = require('../../config/config.js');
const app = getApp()

Page({
  data: {
    img: config.img,
    motto: 'Hello World',
    userInfo: {},
    integral: 0
  },

  /**
   * 获取用户信息
   */
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

  /**
   * 获取资产积分
   */
  getIntegral: function() {
    var that = this;
    wx.request({
      url: config.myUrl,
      data:{
        action: 'myIntegral',
        openId: app.globalData.openId,
      },
      method: 'post',
      success: function(res) {
        that.setData({
          integral: res.data.integral
        })
      }
    })
  },


  onLoad: function () {
    
  },
  onShow: function () {
    this.getUserInfo();
    this.getIntegral();
  },
})