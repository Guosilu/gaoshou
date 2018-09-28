
const config = require('../../config/config.js');
Page({
  data: {
    detail:{

    }
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
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    var that = this;
    let id = options.id;
    wx.request({
      url: config.activityUrl,
      method: "POST",
      data: {
        action: 'detail',
        id: id
      },
      success: function (res) {
        if (res.data) {
          console.log(res.data);
          that.setData({
            detail: res.data
          })
          wx.hideLoading();
        }
      }
    });
  },
  go_Activity_Initiate:function(res){
    console.log(res);
    wx.switchTab({
      url: '../activity_Initiate/activity_Initiate',
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