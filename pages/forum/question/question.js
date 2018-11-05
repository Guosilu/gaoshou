const util = require('../../../config/comment.js');
const configLike = require('../../../config/like.js');
const config = util.config;
const comment = util.comment;
const app = util.app;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    answer: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      options: options
    })
  },
  /**
   * 获取问题
   */
  getQuestion: function (id){
    var that = this;
    wx.request({
      url: config.forum,
      method: 'POST',
      dataType: 'json',
      data: {
        action: 'question',
        id: id
      },
      success: function (res) {
        var res = res.data;
        res['image'] = res['image'].split(',')
        that.setData({
          question: res
        })
        console.log(res)

      }
    })
  },

  /**
   * 获取回答列表
   */
  getAnswerList: function (id) {
    var that = this;
    wx.request({
      url: config.forum,
      method: 'POST',
      dataType: 'json',
      data: {
        action: 'getAnswerList',
        id: id,
        page: that.data.page
      },
      success: function (res) {
        var res = res.data;
        console.log(res)
        that.setData({
          answer: that.data.answer.concat(res)
        })
        wx.hideLoading();
      }
    })
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
    var that = this;
    that.getQuestion(that.data.options.id);
    that.getAnswerList(that.data.options.id);
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    wx.showLoading({
      title: '加载中....',
    })
    this.getAnswerList(this.data.options.id);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})