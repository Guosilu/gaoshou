const app = getApp();
const config = require('../../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filePath: '',
    isLogin: wx.getStorageSync('isLogin'),
    img: config.img,
    //swiper
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    indicatorColor: "#FFF", //指示点颜色
    indicatorActiveColor: "#22b38a",
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //活动分类
    activityType: ["类别", "人物", "风景", "实物", "书画", "文化", "技艺", "其他"],
    activityTypeIndex: 0,
    //图片上传
    files: [],
    files_url: []
  },
  formSubmit: function (e) {
    let post = e.detail.value;
    if (post.introduce == '' || post.title == '' || post.type == '类别') {
      wx.showToast({
        title: '不可为空',
        icon: "none"
      })
      return;
    }
    let that = this;
    let files = this.data.files;
    // wx.showLoading({
    //   mask: true,
    //   title: '提交中...'
    // });

    if (files.length > 0) {
      that.setData({
        post: post,
      })
      that.fileUpload (0, files);
    } else {
      // this.formSubmitDo(post);
      wx.showToast({
        title: '图片不可为空',
        icon: "none"
      })
      return;
    }
  },

  formSubmitDo: function (post) {
    let that = this;
    post['openId'] = app.globalData.openId;
    //kaishi

    //支付
//     wx.showModal({
//       title: '发布活动支付',
//       content: '确定要支付' + (app.payData.release_money) / 100 + '元吗？',
//       success: function (sm) {
//         if (sm.confirm) {
//           //支付 
//           var randa = new Date().getTime().toString();
//           var randb = Math.round(Math.random() * 10000).toString();
//           var that = this;
//           wx.request({
//             url: config.payApi,
//             dataType: "json",
//             method: "post",
//             data: {
//               action: "unifiedOrder",
//               out_trade_no: randa + randb, //商户订单号
//               body: "赛脉平台活动发布", //商品描述
//               total_fee: app.payData.release_money, //金额 单位:分
//               trade_type: "JSAPI", //交易类型
//               openId: app.globalData.openId
//             },
//             success: function (res) {
//               // console.log(res.data);
//               var data = res.data;
//               //生成签名
//               wx.request({
//                 url: config.payApi,
//                 dataType: "json",
//                 method: "post",
//                 data: {
//                   "action": "getSign",
//                   'package': "prepay_id=" + data.prepay_id
//                 },
//                 success: function (res) {
//                   var signData = res.data;
//                   wx.requestPayment({
//                     'timeStamp': signData.timeStamp,
//                     'nonceStr': signData.nonceStr,
//                     'package': signData.package,
//                     'signType': "MD5",
//                     'paySign': signData.sign,
//                     success: function (res) {
//                       // 添加数据库信息
//                       wx.request({
//                         url: config.activityUrl,
//                         dataType: "json",
//                         method: "post",
//                         data: {
//                           "action": "add_release",
//                           "total_fee": app.payData.release_money,
//                           "user": app.globalData.userInfo.nickName,
//                           "openid": app.globalData.openId,
//                           "type": post.type,
//                         },
//                         success: function (res1) {
//                           console.log(res1.data);
//                           // console.log(res);
//                           //支付成功
//                           //sta
//                           // wx.showLoading({
//                           //   mask: true,
//                           //   title: '提交中...',
//                           // });
//                           wx.request({
//                             url: config.publicationUrl,
//                             method: "POST",
//                             data: {
//                               action: 'add',
//                               post: post,
//                               release_id: res1.data //发布的id
//                             },
//                             success: function (res) {
//                               console.log(res);
//                               if (res.data > 0) {
//                                 wx.showToast({
//                                   title: '提交成功！',
//                                 });
//                                 setTimeout(function () {
//                                   wx.redirectTo({
//                                     url: '../detail/detail?id=' + res.data,
//                                   })
//                                 }, 1500)
//                               } else {
//                                 wx.showToast({
//                                   title: '提交失败！',
//                                   icon: 'none'
//                                 });
//                               }
//                             }
//                           })
//                           // over
//                         }
//                       })
//                     },
//                     fail: function (res) {
//                       wx.showToast({
//                         title: '支付已取消',
//                         icon: 'none'
//                       });
//                     }
//                   })
//                 }
//               })
//             }
//           })
//         } else if (sm.cancel) {
//           console.log('用户点击取消');
//           wx.showToast({
//             title: '您已取消活动发布',
//             icon: 'none'
//           });
//           return false;
//         }
//       }
//     });


// // jieshu
//     return false;
    wx.request({
      url: config.publicationUrl,
      method: 'post',
      data: {
        action: 'add',
        post: post
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.data > 0) {
          wx.showToast({
            title: '提交成功！正在跳转',
            success:function(){
              setTimeout(function(){
                wx.redirectTo({
                  url: '../detail/detail?id=' + res.data,
                })
              },1500)
            }
          });
          that.setData({
            form_reset: '',
            files: [],
            files_url: []
          });
        
        } else {
          wx.showToast({
            title: '提交失败！',
            icon: 'none'
          });
        }
      }
    })
  },

  /**
   * 递归上传文件
   */
  fileUpload: function (i, files) {
    i = i ? i : 0;
    var that = this;
    wx.uploadFile({
      url: config.uploadUrl,
      filePath: files[i],
      name: 'file',
      formData: {
        action: 'upload_file'
      },
      success: function (res) {
        i++;
        if (that.data.filePath == '') {
          that.setData({
            filePath: that.data.filePath.concat(res.data)
          })
        } else {
          that.setData({
            filePath: that.data.filePath.concat(',' + res.data)
          })
        }
        if (i == files.length) {
          let post = that.data.post;
          post['file'] = that.data.filePath;
          that.formSubmitDo(post);
        } else {
          that.fileUpload(i, files);
        }
      },
      fail: function () {
        wx.showToast({
          title: '上传异常!请稍后再试',
          icon: 'none'
        })
        return;
      }
    });
  },

  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    if (e.detail.value < 1) {

    }
    this.setData({
      activityTypeIndex: e.detail.value
    })
  },
  
  // 图片上传
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let addFiles = res.tempFilePaths;
        that.setData({
          files: that.data.files.concat(addFiles)
        });
      }
    })
  },

  //删除图片
  delImg: function (e) {
    let that = this;
    let id = e.target.dataset.id;
    let files = that.data.files;
    let files_new = [];
    for (var i = 0; i < files.length; i++) {
      if (i != id) {
        files_new.push(files[i]);
      }
    }
    that.setData({
      files: files_new
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },



  /**
   * banner
   */
  getBanner: function () {
    var that = this;
    wx.request({
      url: config.activity_orderUrl,
      method: 'POST',
      data: {
        action: 'getBanner'
      },
      success: function (res) {
        var result = res.data;
        for (let a = 0; a < result.length; a++) {
          if (result[a]['file'] && result[a]['mode'] == 'image') {
            result[a]['file'] = result[a]['file'].split(',');
          }
        }
        console.log(result);
        that.setData({
          imgUrls: result,
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBanner();
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

  // uploadFile: function (path, post) {
  //   let that = this;
  //   wx.uploadFile({
  //     url: config.uploadUrl,
  //     filePath: path,
  //     name: 'file',
  //     formData: {
  //       action: 'upload_file'
  //     },
  //     success(res) {
  //       console.log(res);
  //       that.setData({
  //         files_url: that.data.files_url.concat(res.data)
  //       });
  //       let files_url = that.data.files_url
  //       let files = that.data.files
  //       if (files_url.length == files.length) {
  //         for (let i = 0; i < files_url.length; i++) {
  //           let k = i;
  //           if (k == 0) k = '';
  //           post['thumb' + k] = files_url[i];
  //         }
  //         that.formSubmitDo(post);
  //       }
  //     }
  //   })
  // },

})