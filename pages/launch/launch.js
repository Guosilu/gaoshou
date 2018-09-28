
const config = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    rule:"",
    starttime:"",
    endtime:"",
    detail:{}
  },
  joinActivity: function() {
    let id = this.data.detail.id;
    wx.navigateTo({
      url: '../participate/participate?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let itemid = options.itemid;
    wx.request({
      url: config.coreUrl + 'getLaunch.php',
      method: "POST",
      data: {
        id: itemid
      },
      dataType: "JSON",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        let result = JSON.parse(res.data);
        console.log(result);
        that.setData({
          title: result['title'],
          rule: result['rule'],
          starttime: result['starttime'],
          endtime: result['endtime'],
          detail: result
        })
        console.log(result)
      },
      fail: function (res) {
        console.log(res)
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