
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
    // 活动列表
    eventsList: [{
        url: "",
        image: config.img+"list_img.png",
        title: "活动1",
        comment: 0,
        like: 0,
        look: 0,
      },
      {
        url: "",
        image: config.img+"list_img.png",
        title: "活动1",
        comment: 0,
        like: 0,
        look: 0,
      },
      {
        url: "",
        image: config.img+"list_img.png",
        title: "活动1",
        comment: 0,
        like: 0,
        look: 0,
      },
      {
        url: "",
        image: config.img+"list_img.png",
        title: "活动1",
        comment: 0,
        like: 0,
        look: 0,
      },
    ],
    worksList: [{
      url: "",
      image: config.img+"list_img.png",
      title: "活动1",
      comment: 0,
      like: 0,
      look: 0,
    },
    {
      url: "",
      image: config.img+"list_img.png",
      title: "活动1",
      comment: 0,
      like: 0,
      look: 0,
    },
    {
      url: "",
      image: config.img+"list_img.png",
      title: "活动1",
      comment: 0,
      like: 0,
      look: 0,
    },
    {
      url: "",
      image: config.img+"list_img.png",
      title: "活动1",
      comment: 0,
      like: 0,
      look: 0,
    },
    ]
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
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    var that = this;
    wx.request({
      url: 'http://aa.zdcom.net.cn/gaoshou/api/getlistApi.php',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wxlist: "1"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          taglist: res.data
        });

      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})