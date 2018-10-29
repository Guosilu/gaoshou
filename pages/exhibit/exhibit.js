const util = require('../../utils/util.js')
const config = require('../../config/config.js');
const app = getApp()
Page({
  data: {
    like_status: null,
    detail: {},
    order_lists: {},
    exhibit_lists: {}
  }, 
  
   //赏金
  reward: function (e) {
    var randa = new Date().getTime().toString();
    var randb = Math.round(Math.random() * 10000).toString();

    wx.request({
      url: config.payApi,
      dataType: "json",
      method: "post",
      data: {
        action: "unifiedOrder",
        out_trade_no: randa + randb,//商户订单号
        body: "Guosilu 测试", //商品描述
        total_fee: 1, //金额 单位:分
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
          success: function (res){
            var signData = res.data;
            console.log(res.data);
            wx.requestPayment(
              {
                'timeStamp': signData.timeStamp,
                'nonceStr': signData.nonceStr,
                'package': signData.package,
                'signType': "MD5",
                'paySign': signData.sign,
                success: function (res) {
                  console.log(res);
                },
                fail: function (res) {
                  console.log(res);
                }
              }) 
          }
        })




      }
    })





  },
  is_like: function (id) {
    let that = this;
    wx.request({
      url: config.activityUrl,
      method: "POST",
      data: {
        action: 'is_like',
        where: {
          activity_id: id,
          openId: app.globalData.openId
        }
      },
      success: function (res) {
        let like_status;
        if (res.data == 1) {
          like_status = 1;
        } else {
          like_status = 0;
        }
        that.setData({
          like_status: like_status
        })
      }
    });
  },
  like: function () {
    let that = this;
    let post = {};
    let id = that.data.detail.id;
    post['activity_id'] = id;
    post['openId'] = app.globalData.openId;
    wx.request({
      url: config.activityUrl,
      method: "POST",
      data: {
        action: 'like',
        id: id,
        post: post
      },
      success: function (res) {
        let data = res.data;
        if (data.success == 1) {
          that.setData({
            like_status: 1,
            'detail.dianzan': data.dianzan
          })
          wx.showToast({
            icon: 'none',
            title: '点赞成功！'
          });
        }
      }
    });
  },
  like_cancel: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消点赞吗？',
      success: function (res) {
        if (res.confirm) {
          let where = {};
          let id = that.data.detail.id;
          where['activity_id'] = id;
          where['openId'] = app.globalData.openId;
          wx.request({
            url: config.activityUrl,
            method: "POST",
            data: {
              action: 'like_cancel',
              id: id,
              where: where
            },
            success: function (res) {
              let data = res.data;
              if (data.success == 1) {
                that.setData({
                  like_status: 0,
                  'detail.dianzan': data.dianzan
                })
                wx.showToast({
                  icon: 'none',
                  title: '已取消点赞！'
                });
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  joinActivity: function () {
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
      success: function (res) {
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
  go_Activity_Initiate: function () {
    wx.redirectTo({
      url: '../activity_Initiate/activity_Initiate',
    })
  },
  getOrderList: function (id) {
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
      success: function (res) {
        that.setData({
          order_lists: res.data
        });
      }
    })
  },
  getExhibitList: function (id) {
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
      success: function (res) {
        that.setData({
          exhibit_lists: res.data
        });
      }
    })
  },
  onLoad: function (options) {
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
        success: function () {
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      })
      return;
    }
    wx.request({
      url: config.activityUrl,
      method: "POST",
      data: {
        action: 'detail',
        id: id
      },
      success: function (res) {
        if (res.data) {
          that.setData({
            detail: res.data
          })
          that.is_like(res.data.id);
          wx.hideLoading();
        }
      }
    });
    this.getOrderList(id);
    this.getExhibitList(id);
  },
  onShow: function () {
    if (this.data.detail.id) {
      this.getOrderList(this.data.detail.id);
      this.getExhibitList(this.data.detail.id);
    }
  }
})
