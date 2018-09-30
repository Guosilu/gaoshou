const app = getApp()
const config = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    recordList: [
    {
      url: "",
      image: "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
      title: "活动1活动1活动1活动1活动1活动1",
      author: "张三",
      comment: 0,
      like: 0,
      look: 0,
    },
    {
      url: "",
      image: "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
      title: "活动2活动2活动2活动2活动2",
      author: "李四",
      comment: 0,
      like: 0,
      look: 0,
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    let where = {}
    where['openId'] = app.globalData.openId;
    wx.request({
      url: config.activityUrl,
      method:"POST",
      dataType:"JSON",
      data:{
        action:"lists",
        where: where
      },
      success:function(res){
        console.clear();
        let data = JSON.parse(res.data);
        console.log(data);
        that.setData({
          list: data
        })
      },
      fail:function(){

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})