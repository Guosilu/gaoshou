const app = getApp();
const config = require('../../config/config.js');
Page({
  data: {
    like_status: null,
    detail:{}
  },
  is_like: function (id) {
    let that = this;
    wx.request({
      url: config.activityUrl,
      method: "POST",
      data: {
        action: 'is_like',
        where: {
          activity_id: id,
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
    let id = that.data.detail.id;
    post['activity_id'] = id;
    post['openId'] = app.globalData.openId;
    wx.request({
      url: config.activityUrl,
      method: "POST",
      data: {
        action: 'like',
        id: id,
        post: post
      },
      success: function (res) {
        if (res.data == 1) {
          that.setData({
            like_status: 1
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
          let id = that.data.detail.id;
          where['activity_id'] = id;
          where['openId'] = app.globalData.openId;
          wx.request({
            url: config.activityUrl,
            method: "POST",
            data: {
              action: 'like_cancel',
              id: id,
              where: where
            },
            success: function (res) {
              if (res.data == 1) {
                that.setData({
                  like_status: 0
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
  joinActivity: function () {
    let id = this.data.detail.id;
    wx.request({
      url: config.activityUrl,
      method: "POST",
      data: {
        action: 'is_join',
        post: {
          id: id,
          openId: app.globalData.openId
        }
      },
      success: function (res) {
        if (res.data == 1) {
          wx.navigateTo({
            url: '../participate/participate?id=' + id
          })
        } else if (res.data == 2) {
          wx.showToast({
            icon: 'none',
            title: '您不能参加自己发布的活动！'
          });
        } else if (res.data == 3) {
          wx.showToast({
            icon: 'none',
            title: '您已经参加！'
          });
        } else if (res.data == 4) {
          wx.showToast({
            icon: 'none',
            title: '活动已经开始！'
          });
        }
      }
    });
    
  },
  go_Activity_Initiate: function (res) {
    console.log(res);
    wx.switchTab({
      url: '../activity_Initiate/activity_Initiate',
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
          that.is_like(res.data.id);
          wx.hideLoading();
        }
      }
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