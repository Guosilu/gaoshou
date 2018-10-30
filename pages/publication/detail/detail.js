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
    comment:"",
    payOpen: false,
    payInput: false,
    compose_type: "publication"
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








  is_like: function (id) {
    var that = this;
    var param = {
      action: 'is_like',
      post: {
        id: id,
        openId: app.globalData.openId
      }
    }
    configLike.requestFun(config.publicationUrl, param).then(function (data){
      that.setData({
        like_status: data,
        loading: that.data.loading+1
      })
      if (that.data.loading == 3) wx.hideLoading();
    });
  },

  like: function () {
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
      } else if (data.success == 2) {
        wx.showToast({
          icon: 'none',
          title: '您已经投过票了！'
        });
      }
    });
  },

  like_cancel: function () {
    var that = this;
    var param = {
      action: 'like_cancel',
      post: {
        id: that.data.detail.id,
        openId: app.globalData.openId
      }
    }
    configLike.requestFun(config.publicationUrl, param, 1).then(function (data) {
      if (data.success == 1) {
        that.setData({
          like_status: 0,
          'detail.dianzan': data.dianzan
        })
        wx.showToast({
          icon: 'none',
          title: '已取消！'
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
      function(data){
        console.log(data);
        if(data!='0'){
          wx.showToast({
            title: '添加成功',
          })
        }else{
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
        //评论完成更新数据
        var param = {
          compose_id: that.data.detail.id,
          openId: app.globalData.openId,
          compose_type:that.data.compose_type
        }
        comment.query('list', param).then(
          function (data) {
            console.log(data);
            that.setData({
              comment: data
            })
          }
        );  
        
      }
    );    
  },

  /**
   * 生命周期函数--监听页面加载
   */


  get_detail: function (id) {
    var that = this;
    var param = {
      action: 'detail',
      id: id
    }
    configLike.requestFun(config.publicationUrl, param).then(function (data) {
      if (data) {
        that.setData({
          detail: data,
          loading: that.data.loading + 1
        })
        if (that.data.loading == 3) wx.hideLoading();
      }
    });
  },
/**
 *  获取评论
 */
  get_compose_list: function (id, compose_type) {
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
  comment_like: function (option) {
    this.likeFun(option, 'add');
  },
  comment_like_cancel: function (option) {
    this.likeFun(option, 'minus');
  },
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    that.get_detail(options.id);
    that.get_compose_list(options.id, that.data.compose_type);  //获取评论
    that.is_like(options.id); //点赞
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
    console.log("下拉事件.")
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