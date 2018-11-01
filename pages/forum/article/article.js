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
    compose_type: "forum",
    loading: 0
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
    console.log(options);
    var that = this;
    that.setData({
      itemid : options.id,
    })
    //获取回答
    that.getAnswer(options.id);
    //获取评论
    that.getComment(options.id, that.data.compose_type);
  },
  /**
   * 获取回答评论
   */
  getComment: function (id, compose_type){
    var that = this;
    var param = {
      compose_id: id,
      openId: app.globalData.openId,
      compose_type: compose_type
    }
    comment.query('list', param).then(function (data) {
      if (data) {
        console.log(data);
        that.setData({
          comment: data,
          loading: that.data.loading + 1
        })
        if (that.data.loading == 3) wx.hideLoading();
      }
    }); 
  },
  /**
   * 获取回答详情
   */
  getAnswer: function (id){
    var that = this;
    wx.request({
      url: config.forum,
      method: 'POST',
      dataType: 'json',
      data: {
        id: id,
        action: 'getAnswer'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          answer: res.data
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