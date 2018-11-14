const config = require('../../config/config.js');
const app = getApp()
Page({
  data: {},
  onLoad: function (options) {
    this.getIntegral();
  },

  /**
   * 获取资产积分
   */
  getIntegral: function () {
    var that = this;
    wx.request({
      url: config.myUrl,
      data: {
        action: 'myIntegral',
        openId: app.globalData.openId,
      },
      method: 'post',
      success: function (res) {
        that.setData({
          integral: res.data.integral
        })
      }
    })
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  backMine() {
    wx.navigateBack({
      delta: 3, // 回退前 delta(默认为1) 页面
    })
  }
})
