const util = require('../../../../config/comment.js');
const configLike = require('../../../../config/like.js');
const config = util.config;
const comment = util.comment;
const app = util.app;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: 0,
    contShow: false,
    sendShow: true,
    inputVal: "",
    comment: {},
    reply: [],
    page: 1,
    pagesize: 5,
  },

  /**
   * 生命周期函数--初次加载
   */
  onLoad: function (options) {
    var that = this;
    //刷新
    let param = {
      id: options.id,
      openId: app.globalData.openId,
    }
    this.get_detail(param);
    this.is_like(options.id);
  },

  /**
   * 页面上拉触底事件的处理函数
   */

  onReachBottom: function () {
    //刷新
    let param = {
      id: that.data.comment.id,
      openId: app.globalData.openId,
      page: that.data.page,
      pagesize: 5,
    }
    var dataObj = {
      compose_id: this.data.detail.id,
      openId: app.globalData.openId,
      compose_type: this.data.compose_type,
      page: this.data.page,
      pagesize: 5,
    }
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    this.get_detail(param);
  },
  //详情列表

  get_detail: function (param, act) {
    var act = act || "";
    var that = this;
    var param = {
      action: 'show',
      param: param
    }
    configLike.requestFun(config.comment, param).then(function (data) {
      console.log(data);
      if (data) {
        let reply = (act == 'sentCom') ? data.reply : that.data.reply.concat(data.reply);
        let page = (act == 'sentCom') ? that.data.page : that.data.page + 1;
        that.setData({
          comment: data.comment,
          reply: reply,
          page: page,
        })
        wx.hideLoading();
      }
    });
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
    param['comment_id'] = that.data.comment.id;  //评论id
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
        let param = {
          id: that.data.comment.id,
          openId: app.globalData.openId,
          page: 1,
          pagesize: (that.data.page - 1) * that.data.pagesize,
        }
        that.get_detail(param, 'sentCom');
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

  comment_like: function (option) {
    this.likeFun(option, 'add'); 
  },

  comment_like_cancel: function (option) {
    this.likeFun(option, 'minus'); 
  },

  likeFun: function (option, act) {
    var that = this, like_status, confirm, tipTitle;
    console.log(option.target.dataset)
    var alter_table = option.target.dataset.alter_table || '';
    var id = option.target.dataset.id || 0;
    var index = option.target.dataset.index >= 0 ? option.target.dataset.index : ''
    var dianzan = Number(option.target.dataset.dianzan) >= 0 ? Number(option.target.dataset.dianzan) : '';
    var param = {
      action: 'like_add_minus',
      post: {
        id: id,
        alter_table: alter_table,
        openId: app.globalData.openId,
        act: act
      }
    }
    if (act == 'add') {
      like_status = 1;
      dianzan = dianzan + 1;
      confirm = '';
      tipTitle = '点赞成功！';
    } else if (act == 'minus') {
      like_status = 0;
      dianzan = dianzan - 1;
      confirm = 1;
      tipTitle = '已取消！';
    }
    configLike.requestFun(config.comment, param, confirm).then(function (data) {
      if (data.success == 1) {
        if (alter_table) {
          that.setData({
            [`reply[${index}].like_status`]: like_status,
            [`reply[${index}].dianzan`]: dianzan
          })
        } else {
          that.setData({
            'comment.like_status': like_status,
            'comment.dianzan': dianzan
          })
        }
        wx.showToast({
          icon: 'none',
          title: tipTitle
        });
      }
    });
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})