
const config = require('../../config/config.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: config.img,
    list :[],
    page: 1,
  },
  addVideo: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera','album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        wx.navigateTo({
          url: '/pages/square/add/index?url=' + tempFilePaths
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.query('list', config.squareUrl);
  },
  /**
   * 查询
   */
  query: function (action, url) {
    // console.log(action);return
    var that = this;
    wx.request({
      url: url,
      method: "POST",
      dataType: "JSON",
      data: {
        action: action,
        page: that.data.page
      },
      success: function (res) {
        let data = JSON.parse(res.data);
        for(let a=0;a<data.length;a++){
          data[a].image = data[a].image.split(',')
        }
        console.log(data);

        if (res.data != '[]') {
          that.setData({
            list: that.data.list.concat(data)
          })
        } else {
          // wx.showToast({
          //   title: '暂无更多信息',
          //   icon: "none"
          // })
        }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showToast({
      title: '正在加载更多....',
      icon: "loading"
    })
    var that = this;
    let page = that.data.page;
    that.setData({
      page: page + 1
    })
    that.query('list', config.squareUrl);
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