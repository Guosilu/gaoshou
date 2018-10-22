const config = require('../../../config/config.js');
const app = getApp();
Page({

  /** 
   * 页面的初始数据1
   */
  data: {
    like_status : null,
    isLogin: wx.getStorageSync('isLogin'),
    img: config.img,
    image:[],
    data:[],
    options:'',
  },
  is_like: function (id) {
    let that = this;
    wx.request({
      url: config.squareUrl,
      method: "POST",
      data: {
        action: 'is_like',
        where: {
          square_id: id,
          openId: app.globalData.openId
        }
      },
      success: function (res) {
        let like_status;
        if (res.data == 1) {
          like_status = 1;
        } else {
          like_status = 0;
        }
        that.setData({
          like_status: like_status
        })
      }
    });
  },
  like: function () {
    let that = this;
    let post = {};
    let id = that.data.data.id;
    post['square_id'] = id;
    post['openId'] = app.globalData.openId;
    wx.request({
      url: config.squareUrl,
      method: "POST",
      data: {
        action: 'like',
        id: id,
        post: post
      },
      success: function (res) {
        let data = res.data;
        if (data.success == 1) {
          that.setData({
            like_status: 1,
            'data.like': data.like
          })
          wx.showToast({
            icon: 'none',
            title: '点赞成功！'
          });
        }
      }
    });
  },
  like_cancel: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消点赞吗？',
      success: function (res) {
        if (res.confirm) {
          let where = {};
          let id = that.data.data.id;
          where['square_id'] = id;
          where['openId'] = app.globalData.openId;
          wx.request({
            url: config.squareUrl,
            method: "POST",
            data: {
              action: 'like_cancel',
              id: id,
              where: where
            },
            success: function (res) {
              let data = res.data;
              if (data.success == 1) {
                that.setData({
                  like_status: 0,
                  'data.like': data.like
                })
                wx.showToast({
                  icon: 'none',
                  title: '已取消点赞！'
                });
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id= options.id;
    that.setData({
      options: options
    })
    that.query(id);
    this.is_like(id);
  },

  /**
   * 查询
   */
  query : function(id){
    var that = this;
    wx.request({
      url: config.squareUrl,
      method: "POST",
      data: {
        action: 'detail',
        id: id
      },
      success: function (res) {
        console.log(res);
        that.setData({
          image: res.data.image.split(','),
          data: res.data
        })
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
    this.setData({
      isLogin: wx.getStorageSync('isLogin')
    })
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