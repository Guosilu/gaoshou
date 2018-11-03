const commonFun = require("../../js/commonFun.js");
const config = require('../../config/config.js');
//获取应用实例
const app = getApp();
const partt = /\S+/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: {},
    inputShowed: false,
    keyword: '',
    downSearchList: false,
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  clearInput: function () {
    this.setData({
      keyword: ""
    });
  },

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

  searchList: function () {
    let that = this;
    let keyword = this.data.keyword;
    let dataObj = {
      url: config.searchUrl,
      data: {
        action: 'lists',
        keyword: keyword,
      }
    }
    console.log(partt.test(keyword));
    if (partt.test(keyword)) {
      commonFun.requestFun(dataObj).then(res => {
        console.log(res);
        that.setData({
          lists: res
        });
      });
    } else {
      this.showToast('请输入合法内容');
    }
  },

  showToast: function (msg) {
    wx.showToast({
      icon: 'none',
      title: msg,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
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