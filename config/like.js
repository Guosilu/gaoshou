const app = getApp();
const config = require('config.js');
is_like = function (id) {
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
}
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
      let data = res.data;
      if (data.success == 1) {
        that.setData({
          like_status: 1,
          'detail.dianzan': data.dianzan
        })
        wx.showToast({
          icon: 'none',
          title: '点赞成功！'
        });
      }
    }
  });
}
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
            let data = res.data;
            if (data.success == 1) {
              that.setData({
                like_status: 0,
                'detail.dianzan': data.dianzan
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
}


// interface
module.exports = {
  comment: comment
}