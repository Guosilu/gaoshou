const util = require('../../../config/comment.js');
const configLike = require('../../../config/like.js');
const config = util.config;
const comment = util.comment;
const app = util.app;


Page({
  data: {
    like_status: null,
    detail: {},
    loading: 0,
    // 评论
    // contShow: false,
    // sendShow: true,
    inputVal: "",
    comment:[],
    comNum:0,
    payOpen: false,
    payInput: false,
    compose_type: "publication",
    page: 1,
    pagesize: 5,
  },



  // -----------------赏金开始----------------
  money: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      money: e.currentTarget.dataset.money
    })
    that.reward();
  },
  money1: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      money: (e.detail.value) * 100,
    })
  },
  openPay: function () {
    this.setData({
      payOpen: true
    })
  },
  closePay: function () {
    this.setData({
      payOpen: false
    })
  },
  otherAmount: function () {
    this.setData({
      payInput: true,
    })
  },
  fixAmount: function () {
    this.setData({
      payInput: false,
    })
  },
  reward: function (e) {
    var randa = new Date().getTime().toString();
    var randb = Math.round(Math.random() * 10000).toString();
    var that = this;
    wx.request({
      url: config.payApi,
      dataType: "json",
      method: "post",
      data: {
        action: "unifiedOrder",
        out_trade_no: randa + randb, //商户订单号
        body: "赛脉平台赏金", //商品描述
        total_fee: that.data.money, //金额 单位:分
        trade_type: "JSAPI", //交易类型
        openId: app.globalData.openId
      },
      success: function (res) {
        console.log(res.data);
        var data = res.data;

        //生成签名
        wx.request({
          url: config.payApi,
          dataType: "json",
          method: "post",
          data: {
            "action": "getSign",
            'package': "prepay_id=" + data.prepay_id
          },
          success: function (res) {
            var signData = res.data;
            console.log(res.data);
            // 调用支付
            wx.requestPayment({
              'timeStamp': signData.timeStamp,
              'nonceStr': signData.nonceStr,
              'package': signData.package,
              'signType': "MD5",
              'paySign': signData.sign,
              success: function (res) {
                console.log(res);
                that.setData({
                  payOpen: false
                })
              },
              fail: function (res) {
                console.log(res);
              },
              complete: function (res){
                console.log(res);
              }
            })
          }
        })
      }
    })

  },
  // -----------------赏金结束----------------

  /**
  * 生命周期函数--监听页面加载
  **/
  onLoad: function (options) {
    var that = this;
    var dataObj = {
      compose_id: options.id,
      openId: app.globalData.openId,
      compose_type: this.data.compose_type
    }
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    that.get_detail(options.id);
    that.getComment(dataObj, 2);  //获取评论
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var dataObj = {
      compose_id: this.data.detail.id,
      openId: app.globalData.openId,
      compose_type: this.data.compose_type,
      page: this.data.page,
    }
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    this.getComment(dataObj);  //获取评论
  },

  //获取详情页
  get_detail: function (id) {
    var that = this;
    var param = {
      action: 'detail',
      id: id,
      openId: app.globalData.openId,
    }
    configLike.requestFun(config.publicationUrl, param).then(function (data) {
      if (data) {
        console.log(data)
        that.setData({
          detail: data,
          like_status: data.like_status,
        })
        wx.hideLoading();
      }
    });
  },

  //详情页点赞
  like: function () {
    if (this.data.like_status == 1) {
      wx.showToast({
        icon: 'none',
        title: '您已经投过票了！'
      });
      return false;
    }
    var that = this;
    var param = {
      action: 'like',
      post: {
        id: that.data.detail.id,
        openId: app.globalData.openId
      }
    }
    configLike.requestFun(config.publicationUrl, param).then(function (data) {
      console.log(data);
      if (data.success == 1) {
        that.setData({
          like_status: 1,
          'detail.dianzan': data.dianzan
        })
        wx.showToast({
          icon: 'none',
          title: '投票成功！'
        });
      }
    });
  },

  // 评论
  inputTyping: function (e) {
    this.setData({
      sendShow: false,
      contShow: true
    })
  },

  /**
   * 评论输入框内容
   */
  input: function (e) {
    var that = this;
    that.setData({
      value: e.detail.value
    })
  },

  /**
  *  获取评论
  */
  getComment: function (dataObj, act) {
    var that = this;
    var act = act || 1;
    comment.query('list', dataObj).then(function (data) {
      if (data.lists.length > 0) {
        console.log(data.lists);
        let comment = (act == 'sendCom') ? data.lists : that.data.comment.concat(data.lists);
        let page = (act == 'sendCom') ? that.data.page : that.data.page + 1;
        that.setData({
          comment: comment,
          loading: that.data.loading + 1,
          comNum: data.comNum,
          page: page,
        })
        wx.hideLoading();
      } else {
        if (act == 1) {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '到底了~',
          })
        }
      }
    }); 
  },

  //评论列表(取消)点赞方法
  likeFun: function (option, act) {
    var that = this, like_status, confirm, tipTitle;
    console.log(option.target.dataset)
    var id = option.target.dataset.id || 0;
    var index = option.target.dataset.index >= 0 ? option.target.dataset.index : ''
    var dianzan = Number(option.target.dataset.dianzan) >= 0 ? Number(option.target.dataset.dianzan) : '';
    var param = {
      action: 'like_add_minus',
      post: {
        id: id,
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
        that.setData({
          [`comment[${index}].like_status`]: like_status,
          [`comment[${index}].dianzan`]: dianzan
        })
        wx.showToast({
          icon: 'none',
          title: tipTitle
        });
      }
    });
  },

  //评论列表点赞
  comment_like: function (option) {
    this.likeFun(option, 'add');
  },

  //评论取消点赞
  comment_like_cancel: function (option) {
    this.likeFun(option, 'minus');
  },

  /**
   * 添加评论
   */
  sendBtn: function (e) {
    var that = this;
    that.setData({
      contShow: false,
      sendShow: true,
      inputVal: "",
    })
    var param = {};
    param['content'] = that.data.value;
    param['types'] = 'comment';
    param['compose_type'] = that.data.compose_type;
    param['openId'] = app.globalData.openId;
    param['compose_id'] = that.data.detail.id

    comment.query('add', param).then(
      function (data) {
        console.log(data);
        if (data != '0') {
          wx.showToast({
            title: '添加成功',
          })
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
        //评论完成更新数据
        var dataObj = {
          compose_id: that.data.detail.id,
          openId: app.globalData.openId,
          compose_type: that.data.compose_type,
          page: 1,
          pagesize: (that.data.page - 1) * that.data.pagesize,
        }
        that.getComment(dataObj, 'sendCom');
      }
    );
  },

  //生命周期函数--监听页面初次渲染完
  onReady: function () {

  },

  //生命周期函数--监听页面显示
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
    console.log("下拉事件.")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})