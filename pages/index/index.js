const commonFun = require("../../js/commonFun.js");
const config = require('../../config/config.js');
//获取应用实例
const app = getApp();
const partt = /\S+/;

Page({
  data: {
    showList: {},
    stopLoading: 0,
    // 网站信息
    siteName: "高手网",
    img:config.img,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputShowed: false,
    keyword: '',
    downSearchList: false,
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
    worksList: [],
    square: []
  },
  //显示搜索框
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  //情况搜索内容
  hideInput: function() {
    this.setData({
      keyword: "",
      inputShowed: false
    });
  },
  //清空搜索内容
  clearInput: function() {
    this.setData({
      keyword: ""
    });
  }, 
  //失去焦点
  inputBlur: function() {
    this.setData({
      inputShowed: false,
      downSearchList: false,
    });
  },
  //搜索方法共用 commonFun.js->requestFun(dataObj)
  inputTyping: function(e) {
    let that = this;
    let dataObj = {
      url: config.searchUrl,
      data: {
        action: 'lists',
        keyword: e.detail.value, 
        column_short: 1,
        pagesize_wx: 10
      }
    }
    if (partt.test(e.detail.value)) {
      this.setData({
        keyword: e.detail.value,
        downSearchList: true,
      });
      commonFun.requestFun(dataObj).then(res => {
        that.setData({
          showList: res
        });
      });
    } else {
      this.setData({
        keyword: e.detail.value,
        showList: {},
        downSearchList: false,
      });
    }
  },
  //搜索 跳转详情
  navigatorSearch: function () {
    if (partt.test(this.data.keyword)) {
      wx.navigateTo({
        url: '../search/search?keyword=' + this.data.keyword
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入合法内容',
      })
    }
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  getActivityList: function () {
    var that = this;
    //获取活动
    var where = {};
    where['mode'] = 'image'
    wx.request({
      url: config.activityUrl,
      method: 'POST',
      data: {
        action: 'lists',
        where: where
      },
      success: function (res) {
        console.log(res);
        that.setData({
          taglist: res.data,
        });
      }
    })
    //获取最红冠军
    wx.request({
      url: config.activity_orderUrl,
      method: 'POST',
      data: {
        action: 'champion'
      },
      success: function (res) {
        var result = res.data;
        for (let a = 0; a < result.length; a++){
          if (result[a]['file'] && result[a]['mode'] == 'image'){
            result[a]['file'] = result[a]['file'].split(',')
          }
        }
        that.setData({
          square: result,
        });
      }
    })
    //获取作品
    wx.request({
      url: config.publicationUrl,
      method: 'POST',
      data: {
        action: 'lists'
      },
      success: function (res) {
        let result = res.data;
        for(let a=0;a<result.length;a++){
          result[a]['file'] = result[a]['file'].split(',')
        }
        that.setData({
          worksList: res.data,
        });
      },
      complete: function () {
        that.refreshStop();
      }
    })
    
  },
  refreshStop: function() {
    wx.hideLoading();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  onLoad: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    app.redirectTo();
    that.getActivityList();
    that.getBanner();
  },
  /**
   * 首页banner图
   * setData : imgUrls
   */
  getBanner: function () {
    var that = this;
    wx.request({
      url: config.activity_orderUrl,
      method: 'POST',
      data: {
        action: 'getBanner'
      },
      success: function (res) {
        var result = res.data;
        for(let a = 0; a<result.length; a++){
          if (result[a]['file'] && result[a]['mode'] == 'image'){
            result[a]['file'] = result[a]['file'].split(',');
          }
        }
        that.setData({
          imgUrls: result,
        });
      }
    })
  },
  onShow: function() {
    
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在加载....',
      icon: "loading"
    })
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getActivityList();
  },
})