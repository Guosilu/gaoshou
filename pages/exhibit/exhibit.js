const util = require('../../config/comment.js');
const configLike = require('../../config/like.js');
const config = util.config;
const comment = util.comment;
const app = util.app;
Page({
  data: {
    comment: [],
    comNum: 0,
    like_status: null,
    detail: {},
    like_status: null,
    order_lists: {},
    exhibit_lists: {},
    payOpen: false,
    payInput: false,
    compose_type: "exhibit",
    joinClick: false,
    page: 1,
    pagesize: 5,
    publicationPage: 1,
  },

  /**
   * 点击选中的作品
   */
  clickPublication: function(e) {
    var that = this;
    let id = this.data.detail.id;
    var ids = e.currentTarget.dataset.id;

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

          wx.request({
            url: config.activityUrl,
            method: "POST",
            data: {
              action: 'addByPublication',
              id: ids,
              openId: app.globalData.openId,
              mode: 'image',
              activity_id: that.data.detail.id
            },
            success: function (res) {
              console.log(res);
              if (res.data > 0) {
                wx.showToast({
                  title: '添加成功',
                  success: function () {
                    setTimeout(function () {
                      wx.redirectTo({
                        url: '../orderDetail/orderDetail?id=' + res.data
                      })
                    }, 1500)
                  }
                })
              }
            }
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

  //赏金
  money: function(e) {
    console.log(e);
    var that = this;
    that.setData({
      money: e.currentTarget.dataset.money
    })
    that.reward();
  },

  money1: function(e) {
    console.log(e);
    var that = this;
    that.setData({
      money: (e.detail.value) * 100,
    })
  },

  openPay: function() {
    this.setData({
      payOpen: true
    })
  },

  closePay: function() {
    this.setData({
      payOpen: false
    })
  },

  otherAmount: function() {
    this.setData({
      payInput: true,
    })
  },

  fixAmount: function() {
    this.setData({
      payInput: false,
    })
  },

  reward: function(e) {
    var randa = new Date().getTime().toString();
    var randb = Math.round(Math.random() * 10000).toString();
    var that = this;
    wx.request({
      url: config.payApi,
      dataType: "json",
      method: "post",
      data: {
        action: "unifiedOrder",
        out_trade_no: randa + randb, //商户订单号
        body: "赛脉平台赏金", //商品描述
        total_fee: that.data.money, //金额 单位:分
        trade_type: "JSAPI", //交易类型
        openId: app.globalData.openId
      },
      success: function(res) {
        console.log(res.data);
        var data = res.data;

        //生成签名
        wx.request({
          url: config.payApi,
          dataType: "json",
          method: "post",
          data: {
            "action": "getSign",
            'package': "prepay_id=" + data.prepay_id
          },
          success: function(res) {
            var signData = res.data;
            console.log(res.data);
            wx.requestPayment({
              'timeStamp': signData.timeStamp,
              'nonceStr': signData.nonceStr,
              'package': signData.package,
              'signType': "MD5",
              'paySign': signData.sign,
              success: function(res) {
                console.log(res);
                // 添加数据库信息
                wx.request({
                  url: config.payApi,
                  dataType: "json",
                  method: "post",
                  data: {
                    "action": "AddData",
                    "total_fee": that.data.money,
                    "type": 'activity',
                    "id": that.data.detail.id
                  },
                  success: function(res) {
                    wx.showToast({
                      title: '赞赏成功',
                    })
                  }
                })
                that.setData({
                  payOpen: false
                })
              },
              fail: function(res) {
                console.log(res);
              }
            })
          }
        })
      }
    })
  },

  like: function() {
    if (this.data.like_status == 1) {
      wx.showToast({
        icon: 'none',
        title: '您已经投过票了！'
      });
      return false;
    }
    var that = this;
    var param = {
      action: 'like',
      post: {
        id: that.data.detail.id,
        openId: app.globalData.openId
      }
    }
    configLike.requestFun(config.activityUrl, param).then(function(data) {
      console.log(data);
      if (data.success == 1) {
        that.setData({
          like_status: 1,
          'detail.dianzan': data.dianzan
        })
        wx.showToast({
          icon: 'none',
          title: '投票成功！'
        });
      }
    });
  },

  closeJoin: function() {
    this.setData({
      joinClick: false,
    })
  },

  /**
   * 选择新作品查询
   */
  activityBtn: function() {
    this.setData({
      joinClick: true,
    })
    wx.showLoading({
      title: '加载中....',
    })
    this.queryPublication();
  },

  /**
   * 查询新作品
   */
  queryPublication: function() {
    var that = this;
    wx.request({
      url: config.publicationUrl,
      method: "POST",
      data: {
        action: 'lists',
        page: that.data.publicationPage,
        post: {
          openId: app.globalData.openId
        }
      },
      success: function(res) {
        var result = res.data;
        for (let a = 0; a < result.length; a++) {
          if (result[a]['file'] && result[a]['mode'] == 'image') {
            result[a]['file'] = result[a]['file'].split(',')
          }
        }
        console.log(result)
        that.setData({
          publication: result
        })
        wx.hideLoading();
      }
    })
  },

  joinActivity: function() {
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
      success: function(res) {
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

  go_Activity_Initiate: function() {
    wx.redirectTo({
      url: '../activity_Initiate/activity_Initiate',
    })
  },

  //初次加载
  onLoad: function(options) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    var that = this;
    let id = options.id;
    if (Object.keys(options).length == 0) {
      wx.showToast({
        title: '跳转异常!正在返回!',
        icon: "none",
        success: function() {
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      })
      return;
    }
    var dataObj = {
      compose_id: options.id,
      openId: app.globalData.openId,
      compose_type: this.data.compose_type,
      pagesize: 5,
    }
    this.getComment(dataObj, 2);
    this.get_detail(options.id);
    this.getOrderList(id);
    this.getExhibitList(id);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var dataObj = {
      compose_id: this.data.detail.id,
      openId: app.globalData.openId,
      compose_type: this.data.compose_type,
      page: this.data.page,
      pagesize: 5,
    }
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    this.getComment(dataObj); //获取评论
  },

  onShow: function() {},

  //获取详情
  get_detail: function(id) {
    var that = this;
    var param = {
      action: 'detail',
      id: id,
      openId: app.globalData.openId,
    }
    configLike.requestFun(config.activityUrl, param).then(function(data) {
      if (data) {
        // if(data['file'] && data['mode'] == 'image'){
        //   data['file'] = data['file'].split(',');
        // }
        console.log(data)
        that.setData({
          detail: data,
          like_status: data.like_status,
        })
        wx.hideLoading();
      }
    });
  },

  //获取广场
  getOrderList: function(id) {
    let that = this;
    wx.request({
      url: config.activity_orderUrl,
      method: 'POST',
      data: {
        action: 'lists',
        pagesize: 4,
        where: {
          activity_id: id
        }
      },
      success: function(res) {
        var result = res.data;
        for (let a = 0; a < result.length; a++) {
          if (result[a]['file'] && result[a]['mode'] == 'image') {
            result[a]['file'] = result[a]['file'].split(',')
          }
        }
        that.setData({
          order_lists: res.data
        });
        console.log(res);
      }
    })
  },

  //获取活动列表
  getExhibitList: function(id) {
    var that = this;
    wx.request({
      url: config.activityUrl,
      method: 'POST',
      data: {
        action: 'lists',
        where_except: {
          id: id
        }
      },
      success: function(res) {
        that.setData({
          exhibit_lists: res.data
        });
      }
    })
  },

  //投票点赞
  like: function() {
    if (this.data.like_status == 1) {
      wx.showToast({
        icon: 'none',
        title: '您已经投过票了！'
      });
      return false;
    }
    var that = this;
    var param = {
      action: 'like',
      post: {
        id: that.data.detail.id,
        openId: app.globalData.openId
      }
    }
    configLike.requestFun(config.activityUrl, param).then(function(data) {
      console.log(data);
      if (data.success == 1) {
        that.setData({
          like_status: 1,
          'detail.dianzan': data.dianzan
        })
        wx.showToast({
          icon: 'none',
          title: '投票成功！'
        });
      }
    });
  },

  //评论列表(取消)点赞方法
  likeFun: function(option, act) {
    var that = this,
      like_status, confirm, tipTitle;
    console.log(option.target.dataset)
    var id = option.target.dataset.id || 0;
    var index = option.target.dataset.index >= 0 ? option.target.dataset.index : ''
    var dianzan = Number(option.target.dataset.dianzan) >= 0 ? Number(option.target.dataset.dianzan) : '';
    var param = {
      action: 'like_add_minus',
      post: {
        id: id,
        openId: app.globalData.openId,
        act: act
      }
    }
    if (act == 'add') {
      like_status = 1;
      dianzan = dianzan + 1;
      confirm = '';
      tipTitle = '点赞成功！';
    } else if (act == 'minus') {
      like_status = 0;
      dianzan = dianzan - 1;
      confirm = 1;
      tipTitle = '已取消！';
    }
    configLike.requestFun(config.comment, param, confirm).then(function(data) {
      if (data.success == 1) {
        that.setData({
          [`comment[${index}].like_status`]: like_status,
          [`comment[${index}].dianzan`]: dianzan
        })
        wx.showToast({
          icon: 'none',
          title: tipTitle
        });
      }
    });
  },

  //评论列表点赞
  comment_like: function(option) {
    this.likeFun(option, 'add');
  },

  //评论取消点赞
  comment_like_cancel: function(option) {
    this.likeFun(option, 'minus');
  },

  /**
   *  获取评论
   */
  getComment: function(dataObj, act) {
    var that = this;
    var act = act || 1;
    comment.query('list', dataObj).then(function(data) {
      if (data.lists.length > 0) {
        console.log(data.lists);
        let comment = (act == 'sendCom') ? data.lists : that.data.comment.concat(data.lists);
        let page = (act == 'sendCom') ? that.data.page : that.data.page + 1;
        that.setData({
          comment: comment,
          loading: that.data.loading + 1,
          comNum: data.comNum,
          page: page,
        })
        wx.hideLoading();
      } else {
        if (act == 1) {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '到底了~',
          })
        }
      }
    });
  },

  /**
   * 添加评论
   */
  sendBtn: function(e) {
    var that = this;

    var param = {};
    if (!that.data.value || that.data.value == "" || that.data.value.trim() == "") {
      wx.showToast({
        title: '评论不可为空',
        icon: 'none'
      })
      return;
    }
    param['content'] = that.data.value ? that.data.value : " ";
    param['types'] = 'comment';
    param['compose_type'] = that.data.compose_type;
    param['openId'] = app.globalData.openId;
    param['compose_id'] = that.data.detail.id

    comment.query('add', param).then(
      function(data) {
        console.log(data);
        if (data != '0') {
          wx.showToast({
            title: '添加成功',
          })
          that.setData({
            inputVal: "",
          })
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
        //评论完成更新数据

        var dataObj = {
          compose_id: that.data.detail.id,
          openId: app.globalData.openId,
          compose_type: that.data.compose_type,
          page: 1,
          pagesize: (that.data.page - 1) * that.data.pagesize,
        }
        that.getComment(dataObj, 'sendCom');
      }
    );
  },

  /**
   * 评论输入框内容
   */
  input: function(e) {
    var that = this;
    that.setData({
      value: e.detail.value
    })
  },
})