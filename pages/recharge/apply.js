const util = require('../../utils/util.js')
const config = require('../../config/config.js');
const configLike = require('../../config/like.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,//默认选中第一个
    numArray: [10, 20, 30, 40, 50, 60, 70, 80, 90],
    money : 1000,
  },

  pay: function (){
    console.log(app.globalData.openId);
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
        body: "赛脉平台充值", //商品描述
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
                    "action": "AddUserData",
                    "total_fee": that.data.money/100,
                    "type": 'user',
                    "id": app.globalData.openId
                  },
                  success: function (res) {
                    console.log(res);
                    wx.showToast({
                      title: '充值成功',
                    })
                  }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  activethis: function (event) {//点击选中事件
    var thisindex = event.currentTarget.dataset.thisindex;//当前index
    var money = event.currentTarget.dataset.money;//当前index
    this.setData({
      activeIndex: thisindex,
      money: money*100
    })
  }

})