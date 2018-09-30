const app = getApp()
const config = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options)
    if (options.type =="WeLaunch"){
      that.WeLaunch();
    } else if (options.type == "WeJob"){
      that.WeJob();
    }else{

    }
    
  },
  /**
   * 我参与的活动
   */
  WeJob:function(){
    var that = this;
    let where = {}
    where['openId'] = app.globalData.openId;
    wx.request({
      url: config.activity_orderUrl,
      method: "POST",
      dataType: "JSON",
      data: {
        action: "lists",
        where: where
      },
      success: function (res) {
        let data = JSON.parse(res.data);
        console.clear();
        console.log(data);
        that.setData({
          list: data
        })
      },
      fail: function () {
        wx.showToast({
          title: '查询失败',
          icon:"none"
        })
      }
    })
  },
  /**
   * 我发起的活动
   */
  WeLaunch:function(){
    var that = this;
    let where = {}
    where['openId'] = app.globalData.openId;
    wx.request({
      url: config.activityUrl,
      method: "POST",
      dataType: "JSON",
      data: {
        action: "lists",
        where: where
      },
      success: function (res) {
        let data = JSON.parse(res.data);
        that.setData({
          list: data
        })
      },
      fail: function () {

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