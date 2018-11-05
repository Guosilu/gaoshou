const config = require('../../config/config.js');
const app = getApp();
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    isLogin: wx.getStorageSync('isLogin'),
    img: config.img,
    //swiper
    imgUrls: [],
    indicatorDots: true,
    indicatorColor: "#FFF", //指示点颜色
    indicatorActiveColor: "#22b38a",
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //选择活动类型
    cateName: ["图片", "语音", "视频", "文章"],
    cateActive: 0,
    //活动分类
    activityType: ["类别", "比赛", "排名", "互助"],
    activityTypeIndex: 0,
    // 日期插件
    bdate: "2018-09-01",
    btime: "12:01",
    edate: "2018-09-01",
    etime: "12:01",
    form_reset: '',
    //图片上传
    file: '',
    //音频
    vofile: '',
    //视频  chooseVoice
    vifile: '',
  },

  /**
   * 选择视频
   */
  chooseVideo: function() {
    var that = this;
    wx.chooseVideo({
      maxDuration: 1000,
      success: function(res) {
        console.log(res);
        that.setData({
          vifile: res
        })
      }
    })
  },

  /**
   * 删除视频
   */
  delVideo: function() {
    var that = this;
    that.setData({
      vifile: []
    })
  },

  /**
   * banner
   */
  getBanner: function() {
    var that = this;
    wx.request({
      url: config.activity_orderUrl,
      method: 'POST',
      data: {
        action: 'getBanner'
      },
      success: function(res) {
        console.log(res.data);
        that.setData({
          imgUrls: res.data,
        });
      }
    })
  },

  cateClick: function(e) {
    let clk = this;
    clk.setData({
      cateActive: e.currentTarget.dataset.current,
    })
  },

  /**
   * 重置form
   */
  form_reset: function() {
    this.setData({
      activityTypeIndex: 0,
      bdate: "2016-09-01",
      btime: "12:01",
      edate: "2016-09-01",
      etime: "12:01",
      form_reset: '',
      file: ''
    });
  },

  /**
   * 提交
   */
  formSubmit: function(e) {
    let post = e.detail.value;
    post['starttime'] = post.bdate + ' ' + post.btime;
    post['endtime'] = post.edate + ' ' + post.etime;
    post['nickName'] = app.globalData.userInfo.nickName;
    if (post.type == '0' || post.rule.trim() == '' || post.title.trim() == '') {
      wx.showToast({
        title: '填写不完整！',
        icon: 'none'
      })
      return false;
    }
    let file = this.data.file;
    if (file == '') {
      wx.showToast({
        title: '请上传活动封面！',
        icon: 'none'
      });
      return false;
    } else {
      console.log(file);
      this.fileUpload(file, post);
    }
  },

  /**
   * 图片上传
   */
  fileUpload: function(path, post) {
    let that = this;
    wx.uploadFile({
      url: config.uploadUrl,
      filePath: path,
      name: 'file',
      formData: {
        action: 'upload_file'
      },
      success: function(res) {
        console.log(res.data);
        post['file'] = res.data;
        that.formSubmitDo(post);
      }
    });
  },

  /**
   * 提交DO
   */
  formSubmitDo: function(post) {
    let that = this;
    console.log(post.type);
    post['openId'] = app.globalData.openId;
    //支付
    wx.showModal({
      title: '发布活动支付',
      content: '确定要支付10元吗？',
      success: function(sm) {
        if (sm.confirm) {
          //支付 
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
              body: "赛脉平台活动发布", //商品描述
              total_fee: app.payData.release_money, //金额 单位:分
              trade_type: "JSAPI", //交易类型
              openId: app.globalData.openId
            },
            success: function(res) {
              // console.log(res.data);
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
                  wx.requestPayment({
                    'timeStamp': signData.timeStamp,
                    'nonceStr': signData.nonceStr,
                    'package': signData.package,
                    'signType': "MD5",
                    'paySign': signData.sign,
                    success: function(res) {
                      // 添加数据库信息
                      wx.request({
                        url: config.activityUrl,
                        dataType: "json",
                        method: "post",
                        data: {
                          "action": "add_release",
                          "total_fee": app.payData.release_money,
                          "user": app.globalData.userInfo.nickName,
                          "openid": app.globalData.openId,
                          "type": post.type,
                        },
                        success: function(res1) {
                          console.log(res);
                          // console.log(res);
                          //支付成功
                          //sta
                          wx.showLoading({
                            mask: true,
                            title: '提交中...',
                          });
                          wx.request({
                            url: config.activityUrl,
                            method: "POST",
                            data: {
                              action: 'add',
                              post: post,
                              release_id : res1.data //发布的id
                            },
                            success: function(res) {
                              if (res.data > 0) {
                                wx.showToast({
                                  title: '提交成功！',
                                });
                                // that.form_reset();
                                wx.redirectTo({
                                  url: '../exhibit/exhibit?id=' + res.data,
                                })
                              } else {
                                wx.showToast({
                                  title: '提交失败！',
                                  icon: 'none'
                                });
                              }
                            }
                          })
                          // over
                        }
                      })
                    },
                    fail: function(res) {
                      //添加成功
                      // wx.request({
                      //   url: config.activityUrl,
                      //   dataType: "json",
                      //   method: "post",
                      //   data: {
                      //     "action": "add_release",
                      //     "total_fee": app.payData.release_money,
                      //     "user": app.globalData.userInfo.nickName,
                      //     "openid": app.globalData.openId,
                      //     "type": post.type,
                      //   },
                      //   success: function(res) {
                      //     console.log(res);

                      //   }
                      // })
                      //end
                      wx.showToast({
                        title: '支付已取消',
                        icon: 'none'
                      });
                    }
                  })
                }
              })
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消');
          wx.showToast({
            title: '您已取消活动发布',
            icon: 'none'
          });
          return false;
        }
      }
    });

  },

  /**
   * 删除图片
   */
  delImg: function(e) {
    this.setData({
      file: ''
    })
  },

  /**
   * 活动类别
   */
  bindAccountChange: function(e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    if (e.detail.value < 1) {
      wx.showToast({
        title: '活动类别不可为空',
        icon: 'none',
      })
      return;
    }
    this.setData({
      activityTypeIndex: e.detail.value
    })
  },

  // 图片上传
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          file: res.tempFilePaths[0],
        });
      }
    });


  },

  /**
   * 浏览图片
   */
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.file // 需要预览的图片http链接列表
    })
  },

  // 改变时间
  bindDateChange: function(e) {
    this.setData({
      bdate: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      btime: e.detail.value
    })
  },
  bindeDateChange: function(e) {
    this.setData({
      edate: e.detail.value
    })
  },
  bindeTimeChange: function(e) {
    this.setData({
      etime: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app);
    this.getBanner();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      isLogin: wx.getStorageSync('isLogin')
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (wx.getStorageSync('isLogin')) {
      this.form_reset();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})