const config = require('../../config/config.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    img: config.img,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  login: function (e) {
    let that = this;
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '登陆中...',
      });
      app.login();
      app.globalData.userInfo = e.detail.userInfo
      if (wx.getStorageSync('openId')) {
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        wx.hideLoading();
      } else {
        console.log('else');
        app.openIdReadyCallback = res => {
          console.log(res);
          //console.log(res);
          if (res) {
            that.setData({
              userInfo: e.detail.userInfo,
              hasUserInfo: true
            })
            wx.hideLoading();
          }
        }
      }
    } else {
      wx.showToast({
        title: '您拒绝了授权登录!',
        icon: 'none'
      })
    }
  },
  logout: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '您确定退出吗?',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('openId')
          wx.removeStorageSync('isLogin')
          that.setData({
            userInfo: {},
            hasUserInfo: false
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getUserInfo: function () {
    let that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onLoad: function () {
    if (wx.getStorageSync('openId')) {
      this.getUserInfo();
    }
  }
})