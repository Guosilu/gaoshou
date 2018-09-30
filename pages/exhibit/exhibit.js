const util = require('../../utils/util.js')
const config = require('../../config/config.js');
const app = getApp()
Page({
  data: {
    like_status: null,
    detail: {},
    order_lists: {},
    exhibit_lists: {}
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
    wx.redirectTo({
      url: '../activity_Initiate/activity_Initiate',
    })
  },
  getOrderList: function () {
    let that = this;
    let where = {};
    where['activity_id'] = this.data.detail
    console.log(this.data.detail)
    wx.request({
      url: config.activity_orderUrl,
      method: 'POST',
      data: {
        action: 'lists',
        pagesize: 2,
        where: where
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          order_lists: res.data
        });
      }
    })
  },
  getExhibitList: function () {
    var that = this;
    wx.request({
      url: config.activityUrl,
      method: 'POST',
      data: {
        action: 'lists'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          exhibit_lists: res.data
        });
      }
    })
  },
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
  onShow: function () {
    this.getOrderList();
    this.getExhibitList();
  }
})
