//app.js
const config = require('config/config.js');
App({
  redirectTo: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.setStorageSync('isLogin', true)
        } else {
          wx.removeStorageSync('isLogin');
          wx.redirectTo({
            url: '../login/login',
          })
        }
      }
    });
  },
  login: function () {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: config.loginUrl,
            method: 'POST',
            header: {
              'content-type': 'application/json'
              //'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              action: 'openId',
              js_code: res.code
            },
            success: res => {
              that.globalData.openId = res.data;
              that.getUserInfo();
            }
          })
        } else {
          wx.showToast({
            title: '登录失败！' + login.errMsg,
            icon:"none"
          })
        }
      }
    })
  },
  getUserInfo: function () {
    let that = this;
    wx.getUserInfo({
      success: res => {
        that.globalData.userInfo = res.userInfo;
        that.dataLogin(res.userInfo);
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res)
        }
      },
      fail: res => {
        wx.showToast({
          title: '未授权',
          icon:"none"
        })
      }
    })
  },
  dataLogin: function (post) {
    let that = this;
    post['openId'] = this.globalData.openId;
    wx.request({
      url: config.loginUrl,
      method: 'POST',
      header: {
        'content-type': 'application/json'
        //'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        action: 'userInfo',
        post: post
      },
      success: res => {
        wx.setStorageSync('isLogin', true);
      }
    });
  },
  onLaunch: function () {
    let that = this;
    //this.redirectTo();
    this.login();
  },
  onShow: function () {

  },
  globalData: {
    userInfo: null,
    openId: null,
  },
  //支付 
  pay: function (e) {
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
          body: "赛脉平台活动发布", //商品描述
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

                  // 添加数据库信息
                  wx.request({
                    url: config.payApi,
                    dataType: "json",
                    method: "post",
                    data: {
                      "action": "AddData",
                      "total_fee": that.data.money,
                      "type": 'activity_order',
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
                fail: function (res) {
                  console.log(res);
                }
              })
            }
          })
        }
      })
  }
  //结束

})