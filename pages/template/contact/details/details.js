const util = require('../../../../config/comment.js');
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
    detail:"",
  },
  //用户输入
  input:function(e){
    this.setData({
      inputVal: e.detail.value
    })
  },
  inputTyping: function (e) {
    this.setData({
      sendShow: false,
      contShow: true
    })
  },
  //发送
  sendBtn: function (e) {
    var that = this;
    that.setData({
      contShow: false,
      sendShow: true,
    })
    var param = {};
    param['content'] = that.data.inputVal;
    param['openId'] = app.globalData.openId;
    param['comment_id'] = that.data.detail.comment.id;  //评论id
    if(that.data.reply_id){
      param['reply_id'] = that.data.reply_id;
    }
    param['types'] = 'reply';
    //param['reply_type'] = ""

    comment.query('add', param).then(
      function (data) {
        wx.showToast({
          title: '评论成功',
          icon:"none"
        })
        //刷新
        var param = {};
        param['id'] = that.data.detail.comment.id;
        comment.query('show', param).then(
          function (data) {
            console.log(data);
            that.setData({
              detail: data,
              inputVal:""
            })
          }
        ); 


        // that.setData({
        //   detail: data
        // })
      }
    ); 


  },
  contReply: function (e) {
    console.log(e);
    this.setData({
      contShow: true,
      sendShow: false,
      reply_id: e.currentTarget.dataset.uid
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    var id = "1";
    if(options.id){
      id=options.id;
    }
    var param = {};
    param['id'] = id;
    comment.query('show', param).then(
      function (data) {
        console.log(data);
        that.setData({
          detail:data
        })
      }
    ); 




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