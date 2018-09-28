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
    activityType: ["活动类别", "比赛", "排名", "互助"],
    activityTypeIndex: 0,
    // 日期插件
    bdate: "2016-09-01",
    btime: "12:01",
    edate: "2016-09-01",
    etime: "12:01",

    form_reset: '',
    //图片上传
    file: ''
  },
  form_reset: function () {
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
  formSubmit: function (e) {
    wx.showLoading({
      title: '提交中...',
    });
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
  fileUpload: function (path, post) {
    let that = this;
    wx.uploadFile({
      url: config.uploadUrl,
      filePath: path,
      name: 'file',
      formData: {
        action: 'upload_file'
      },
      success: function (res) {
        console.log(res.data);
        post['thumb'] = res.data;
        that.formSubmitDo(post);
      }
    })
  },
  formSubmitDo: function (post) {
    let that = this;
    post['openId'] = wx.getStorageSync('openId');
    wx.request({
      url: config.activityUrl,
      method: "POST",
      data: {
        action: 'add',
        post: post
      },
      success: function (res) {
        if (res.data > 0) {
          wx.showToast({
            title: '提交成功！',
          });
          //that.form_reset();
        } else {
          wx.showToast({
            title: '提交失败！',
            icon: 'none'
          });
        }
      }
    })
  },
  //删除图片
  delImg: function (e) {
    this.setData({
      file: ''
    })
  },
  bindAccountChange: function (e) {
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
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          file: res.tempFilePaths[0],
        });
      }
    });


  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.file // 需要预览的图片http链接列表
    })
  },
  // 改变时间
  bindDateChange: function (e) {
    this.setData({
      bdate: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      btime: e.detail.value
    })
  },
  bindeDateChange: function (e) {
    console.log(e);
    this.setData({
      edate: e.detail.value
    })
  },
  bindeTimeChange: function (e) {
    this.setData({
      etime: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (wx.getStorageSync('isLogin')) {
      this.form_reset();
    }
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