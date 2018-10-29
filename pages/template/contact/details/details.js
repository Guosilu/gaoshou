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
    like_status: null,
    loading: 0,
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
        var param = {
          id: that.data.detail.comment.id,
          openId: app.globalData.openId
        };
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
  is_like: function (id) {
    var that = this;
    var param = {
      action: 'is_like',
      post: {
        id: id,
        openId: app.globalData.openId
      }
    }
    configLike.requestFun(config.comment, param).then(function (data) {
      that.setData({
        like_status: data,
        loading: that.data.loading + 1
      })
      if (that.data.loading == 3) wx.hideLoading();
    });
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
            [`detail.reply[${index}].like_status`]: like_status,
            [`detail.reply[${index}].dianzan`]: dianzan
          })
        } else {
          that.setData({
            like_status: like_status,
            'detail.comment.dianzan': dianzan
          })
        }
        wx.showToast({
          icon: 'none',
          title: tipTitle
        });
      }
    });
  },

  comment_like: function (option) {
    this.likeFun(option, 'add'); 
  },
  comment_like_cancel: function (option) {
    this.likeFun(option, 'minus'); 
  },
  get_detail: function (id) {
    var that = this;
    var param = {
      action: 'show',
      param:{
        id: id,
        openId: app.globalData.openId
      }
    }
    configLike.requestFun(config.comment, param).then(function (data) {
      if (data) {
        that.setData({
          detail: data,
          loading: that.data.loading + 1
        })
        if (that.data.loading == 3) wx.hideLoading();
      }
    });
  },
  onLoad: function (options) {
    var that =this;
    this.get_detail(options.id);
    this.is_like(options.id);



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