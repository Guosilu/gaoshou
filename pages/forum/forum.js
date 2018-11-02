const app = getApp()
const config = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    detail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  query: function (){
    var that = this;
    wx.request({
      url: config.forum,
      method: 'POST',
      dataType: 'json',
      data: {
        action: 'questionList',
        page: that.data.page
      },
      success: function (res) {
        var res = res.data;
        for(let a=0;a<res.length;a++){
          res[a]['image'] = res[a]['image'].split(',');
        }
        console.log(res)
        that.setData({
          detail: that.data.detail.concat(res)
        })
        wx.hideLoading();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page+1
    })
    wx.showLoading({
      title: '加载中....',
    })
    this.query();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.query();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})