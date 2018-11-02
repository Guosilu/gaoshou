const util = require('../../../../config/comment.js');
const config = util.config;
const app = util.app;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.setData({
      question_id: options.id,
    })
  },

  formSubmit: function(value) {
    var that = this;
    var value = value.detail.value;
    console.log(value);
    wx.request({
      url: config.forum,
      dataType: "json",
      method: "post",
      data: {
        types: 'answer',
        "action": "addQuestion",
        "param": {
          answer: value.answer,
          openId: app.globalData.openId,
          question_id: that.data.question_id,
          state: '3'
        }
      },
      success: function (res) {
        if (res.statusCode==200){
          wx.showToast({
            title: '添加成功',
            success: function(){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                })
              },1500)
            }
          })
        }
      }
    })
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