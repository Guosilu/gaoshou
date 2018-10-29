const app = getApp();
const config = require('../../config/config.js');
Page({
  data: {
    like_status: null,
    detail: {},
  },
  is_like: function (id) {
    let that = this;
    wx.request({
      url: config.activity_orderUrl,
      method: "POST",
      data: {
        action: 'is_like',
        where: {
          activity_order_id: id,
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
    post['activity_order_id'] = id;
    post['openId'] = app.globalData.openId;
    wx.request({
      url: config.activity_orderUrl,
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
          where['activity_order_id'] = id;
          where['openId'] = app.globalData.openId;
          wx.request({
            url: config.activity_orderUrl,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    var that = this;
    let id = options.id;
    wx.request({
      url: config.activity_orderUrl,
      method: "POST",
      data: {
        action: 'detail',
        id: id
      },
      success: function (res) {
        if (res.data) {
          console.log(res.data);
          that.setData({
            detail: res.data
          })
          that.is_like(res.data.id);
          wx.hideLoading();
        }
      }
    });
  },

  //赏金
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
              }
            })
          }
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