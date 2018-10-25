const util = require('../../../config/comment.js');
const config = util.config;
const comment = util.comment;
const app = util.app;


Page({
  data: {
    like_status: null,
    detail: {},
    // 评论
    // contShow: false,
    // sendShow: true,
    types: 'comment',
    inputVal: "",
    comment: "",
  },
  input: function (e) {
    var that = this;
    that.setData({
      value: e.detail.value
    })
  },
  // 评论
  inputTyping: function (e) {
    this.setData({
      sendShow: false,
      contShow: true
    })
  },
  sendBtn: function (e) {
    var that = this;
    that.setData({
      contShow: false,
      sendShow: true,
      inputVal: "",
    })
    var param = {};
    param['content'] = that.data.value;
    param['types'] = that.data.types;
    param['compose_type'] = 'publication';
    param['openId'] = app.globalData.openId;
    param['compose_id'] = that.data.detail.id

    comment.query('add', param).then(
      function (data) {
        console.log(data);
        if (data != '0') {
          wx.showToast({
            title: '添加成功',
          })
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
        //评论完成更新数据
        var param = {};
        param['compose_id'] = that.data.detail.id;
        comment.query('list', param).then(
          function (data) {
            console.log(data);
            that.setData({
              comment: data
            })
          }
        );

      }
    );
  },
  // contReply: function (e) {
  //   this.setData({
  //     contShow: true,
  //     sendShow: false,
  //     inputVal: "回复",
  //     types:'reply'
  //   })
  // },
  // 评论End

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    var that = this;
    let id = '3';
    if (options.id) {
      id = options.id;
    }
    wx.request({
      url: config.publicationUrl,
      method: "POST",
      data: {
        action: 'detail',
        id: id
      },
      success: function (res) {
        if (res.data) {
          that.setData({
            detail: res.data
          })
          that.is_like(res.data.id);
          wx.hideLoading();
        }
      },
      // 最后查询评论
      complete: function () {
        var param = {};
        param['compose_id'] = that.data.detail.id;
        // param['page'] = that.data.deatil.id;
        comment.query('list', param).then(
          function (data) {
            console.log(data);
            that.setData({
              comment: data
            })
          }
        );
      }
    });
    // console.log(comment.getlist(id,'publication'));

  },
  is_like: function (id) {
    let that = this;
    wx.request({
      url: config.publicationUrl,
      method: "POST",
      data: {
        action: 'is_like',
        where: {
          activity_order_id: id,
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
    post['activity_order_id'] = id;
    post['openId'] = app.globalData.openId;
    wx.request({
      url: config.publicationUrl,
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
          where['activity_order_id'] = id;
          where['openId'] = app.globalData.openId;
          wx.request({
            url: config.publicationUrl,
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
    console.log("下拉事件.")
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