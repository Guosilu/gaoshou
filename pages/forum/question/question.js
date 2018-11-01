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
    contShow: false,
    sendShow: true,
    inputVal: "",
  },
  inputTyping: function (e) {
    this.setData({
      sendShow: false,
      contShow: true
    })
  },
  sendBtn: function (e) {
    this.setData({
      contShow: false,
      sendShow: true,
      inputVal: "",
    })
  },
  contReply: function (e) {
    this.setData({
      contShow: true,
      sendShow: false,
      inputVal: "回复",
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getQuestion(options.id);
    that.getAnswerList(options.id);
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
        id: id
      },
      success: function (res) {
        var res = res.data;
        console.log(res)
        that.setData({
          answer: res
        })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})