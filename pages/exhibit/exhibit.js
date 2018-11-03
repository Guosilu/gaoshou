const util = require('../../config/comment.js');
const configLike = require('../../config/like.js');
const config = util.config;
const comment = util.comment;
const app = util.app;
Page({
  data: {
    like_status: null,
    detail: {},
    order_lists: {},
    exhibit_lists: {},
    payOpen: false,
    payInput: false,
    compose_type: "exhibit",
  },

  //赏金
  money:function(e){
    console.log(e);
    var that = this;
    that.setData({
      money: e.currentTarget.dataset.money
    })
    that.reward();
  },

  money1: function (e) {
    console.log(e);
    var that  = this;
    that.setData({
      money: (e.detail.value)*100,
    })
  },

  openPay: function() {
    this.setData({
      payOpen: true
    })
  },

  closePay: function() {
    this.setData({
      payOpen: false
    })
  },

  otherAmount: function() {
    this.setData({
      payInput: true,
    })
  },

  fixAmount: function() {
    this.setData({
      payInput: false,
    })
  },

  reward: function(e) {
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
      success: function(res) {
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
          success: function(res) {
            var signData = res.data;
            console.log(res.data);
            wx.requestPayment({
              'timeStamp': signData.timeStamp,
              'nonceStr': signData.nonceStr,
              'package': signData.package,
              'signType': "MD5",
              'paySign': signData.sign,
              success: function(res) {
                console.log(res);
                // 添加数据库信息
                wx.request({
                  url: config.payApi,
                  dataType: "json",
                  method: "post",
                  data: {
                    "action": "AddData",
                    "total_fee": that.data.money,
                    "type": 'activity',
                    "id": that.data.detail.id
                  },
                  success: function (res) {
                    wx.showToast({
                      title: '赞赏成功',
                    })
                  }
                })
                that.setData({
                  payOpen: false
                })
              },
              fail: function(res) {
                console.log(res);
              }
            })
          }
        })
      }
    })
  },

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
    configLike.requestFun(config.activityUrl, param).then(function (data) {
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

  joinActivity: function() {
    let id = this.data.detail.id;
    wx.request({
      url: config.activityUrl,
      method: "POST",
      data: {
        action: 'is_join',
        post: {
          id: id,
          openId: app.globalData.openId
        }
      },
      success: function(res) {
        if (res.data == 1) {
          wx.navigateTo({
            url: '../participate/participate?id=' + id
          })
        } else if (res.data == 2) {
          wx.showToast({
            icon: 'none',
            title: '您不能参加自己发布的活动！'
          });
        } else if (res.data == 3) {
          wx.showToast({
            icon: 'none',
            title: '您已经参加！'
          });
        } else if (res.data == 4) {
          wx.showToast({
            icon: 'none',
            title: '活动已经开始！'
          });
        }
      }
    });

  },

  go_Activity_Initiate: function() {
    wx.redirectTo({
      url: '../activity_Initiate/activity_Initiate',
    })
  },

  getOrderList: function(id) {
    let that = this;
    wx.request({
      url: config.activity_orderUrl,
      method: 'POST',
      data: {
        action: 'lists',
        pagesize: 4,
        where: {
          activity_id: id
        }
      },
      success: function(res) {
        that.setData({
          order_lists: res.data
        });
      }
    })
  },

  getExhibitList: function(id) {
    var that = this;
    wx.request({
      url: config.activityUrl,
      method: 'POST',
      data: {
        action: 'lists',
        where_except: {
          id: id
        }
      },
      success: function(res) {
        that.setData({
          exhibit_lists: res.data
        });
      }
    })
  },

  get_detail: function (id) {
    var that = this;
    var param = {
      action: 'detail',
      id: id,
      openId: app.globalData.openId,
    }
    configLike.requestFun(config.activityUrl, param).then(function (data) {
      if (data) {
        console.log(data)
        that.setData({
          detail: data,
          like_status: data.like_status,
        })
        wx.hideLoading();
        that.getComment(that.data.detail.id, that.data.compose_type);
      }
    });
  },

  onLoad: function(options) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    var that = this;
    let id = options.id;
    if (Object.keys(options).length == 0) {
      wx.showToast({
        title: '跳转异常!正在返回!',
        icon: "none",
        success: function() {
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      })
      return;
    }
    this.get_detail(options.id);
    this.getOrderList(id);
    this.getExhibitList(id);
  },

  onShow: function() {
    var that = this;
    //获取评论
    if (that.data.detail.id) {
      that.getOrderList(that.data.detail.id);
      that.getExhibitList(that.data.detail.id);
      that.getComment(that.data.detail.id, that.data.compose_type);
    }
  },  
  /**
   * 获取回答评论
   */
  getComment: function (id, compose_type) {
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

    var param = {};
    param['content'] = that.data.value ? that.data.value: " ";
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
          that.setData({
            inputVal: "",
          })
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
        //评论完成更新数据

        that.getComment(that.data.detail.id, that.data.compose_type);
      }
    );
  },

})