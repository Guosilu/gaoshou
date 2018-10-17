
const config = require('../../config/config.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    // 网站信息
    siteName: "高手网",
    img:config.img,

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputShowed: false,
    inputVal: "",
    //swiper
    imgUrls: [
      config.img +'banner.png',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    indicatorColor: "#FFF", //指示点颜色
    indicatorActiveColor: "#22b38a",
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //作品
    worksList: []
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getActivityList: function () {
    var that = this;
    //获取活动
    wx.request({
      url: config.activityUrl,
      method: 'POST',
      data: {
        action: 'lists'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          taglist: res.data
        });
      }
    })
    //获取作品
    wx.request({
      url: config.activityUrl,
      method: 'POST',
      data: {
        action: 'lists'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          worksList: res.data
        });
      }
    })
  },
  onLoad: function() {
    app.redirectTo();
  },
  onShow: function() {
    this.getActivityList();
  }
})