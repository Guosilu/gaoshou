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
      that.query("lists", config.activityUrl)
    } else if (options.type == "WeJob"){
      that.query("WeJob", config.activity_orderUrl)
    }else{
      that.query("WeJob")
    }    
  },
  /**
   * 查询
   */
  query:function(action,url){
    var that = this;
    let where = {}
    where['openId'] = app.globalData.openId;
    wx.request({
      url: url,
      method: "POST",
      dataType: "JSON",
      data: {
        action: action,
        where: where
      },
      success: function (res) {
        
        let data = JSON.parse(res.data);
        console.log(data);
        that.setData({
          list: data
        })
      },
      fail: function () {
        wx.showToast({
          title: '查询失败',
          icon: "none"
        })
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