const config = require('../../config/config.js');
const commonFun = require("../../js/commonFun.js");
const app = getApp();
const partt = /\S+/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    inputShowed: false,
    keyword: "",
    downSearchList: false,
    page_wx: 1,
    pagesize_wx: 5,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    var post = {
      keyword: "",
      page_wx: 1,
      openId: app.globalData.openId,
    }
    this.listsFun(post);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      mask: true,
      title: '正在加载...',
    })
    var page_wx = this.data.page_wx + 1;
    this.setData({
      page_wx: page_wx,
    });
    var post = {
      keyword: partt.test(this.data.keyword) ? this.data.keyword : "",
      page_wx: page_wx,
      openId: app.globalData.openId,
    }
    this.listsFun(post);
  },

  //搜索入口
  searchList: function () {
    wx.showLoading({
      title: '正在搜索...',
    })
    this.setData({
      page_wx: 1,
    });
    var post = {
      keyword: partt.test(this.data.keyword) ? this.data.keyword : "",
      page_wx: 1,
      openId: app.globalData.openId,
    }
    this.listsFun(post, 'reget');
  },

  //搜索方法共用 commonFun.js->requestFun(dataObj)
  listsFun: function (post, act) {
    var that = this;
    var act = act || "";
    var dataObj = {
      url: config.myUrl,
      data: {
        action: 'lists',
        post: post
      }
    }
    commonFun.requestFun(dataObj).then(res => {
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          res[i].file = res[i].file.split(",");
        }
        console.log(res);
        var lists = (act == "reget") ? res : that.data.lists.concat(res);
        that.setData({
          lists: lists,
          page_wx: that.data.page_wx,
        });
        wx.hideLoading();
      } else {
        wx.hideLoading();
        that.showToast('搜不到了呢~');
      }
    });
  },

  //检测搜索内容
  deleteItem: function (e) {
    var that = this;
    var dataObj = {
      url: config.myUrl,
      data: {
        action: 'delete',
        post: {
          id: e.target.dataset.id,
          itemType: e.target.dataset.item_type,
          openId: app.globalData.openId,
        }
      }
    }
    wx.showModal({
      title: '提示',
      content: '确定删除 ' + e.target.dataset.title+' 吗？',
      success: function (confirm) {
        if (confirm.confirm) {
          wx.showLoading({
            mask: true,
            title: '正在删除...',
          })
          commonFun.requestFun(dataObj).then((res) => {
            if (res == 1) {
              var post = {
                keyword: partt.test(that.data.keyword) ? that.data.keyword : "",
                page_wx: 1,
                pagesize_wx: that.data.page_wx * that.data.pagesize_wx,
                openId: app.globalData.openId,
              }
              that.listsFun(post, 'reget');
              that.showToast('删除成功!', "success");
            }
          });
        }
      }
    });
  },

  //检测搜索内容
  checkInput: function (e) {
    let value = e.detail.value;
    if (value.length == 15) {
      this.showToast('超过输入限制15字');
    } else {
      this.setData({
        keyword: e.detail.value
      });
    }
  },

  //提示方法
  showToast: function (msg, icon) {
    var icon = icon || "none"
    wx.showToast({
      icon: icon,
      title: msg,
    })
  },

  //显示搜索框
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  //清空搜索内容
  clearInput: function () {
    this.setData({
      keyword: ""
    });
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})