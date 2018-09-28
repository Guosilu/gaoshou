const config = require('../../config/config.js');
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
    activityType: ["作品类别", "人物", "风景", "实物", "书画", "文化", "技艺", "其他"],
    activityTypeIndex: 0,
    //图片上传
    files: [],
    files_url: [],
    form_reset: '',
    activity_id: ''
  },
  formSubmit: function (e) {
    wx.showLoading({
      title: '提交中...',
    });
    let post = e.detail.value;
    let that = this;
    let files = this.data.files;
    if (files.length>0) {
      for (let i = 0; i < files.length; i++) {
        this.uploadFile(files[i], post);
      }
    } else {
      this.formSubmitDo(post);
    }
  },
  formSubmitDo: function (post) {
    let that = this;
    post['activity_id'] = this.data.activity_id;
    post['openId'] = wx.getStorageSync('openId');
    wx.request({
      url: config.activity_orderUrl,
      method: 'POST',
      data: {
        action: 'add',
        post: post
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.data > 0) {
          wx.showToast({
            title: '提交成功！',
          });
          that.setData({
            form_reset: '',
            files: [],
            files_url: []
          });
        }else{
          wx.showToast({
            title: '提交失败！',
            icon: 'none'
          });
        }
      }
    })
  },
  uploadFile: function (path, post) {
    let that = this;
    wx.uploadFile({
      url: config.uploadUrl,
      filePath: path,
      name: 'file',
      formData: {
        action: 'upload_file'
      },
      success(res) {
        console.log(res);
        that.setData({
          files_url: that.data.files_url.concat(res.data)
        });
        let files_url = that.data.files_url
        let files = that.data.files
        if (files_url.length == files.length) {
          for (let i = 0; i < files_url.length; i++) {
            let k = i;
            if (k == 0) k = '';
            post['thumb' + k] = files_url[i];
          }
          that.formSubmitDo(post);
        }
      }
    })
  },
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    if (e.detail.value < 1) {

    }
    this.setData({
      activityTypeIndex: e.detail.value
    })
  },
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    if (e.detail.value < 1) {
 
    }
    this.setData({
      activityTypeIndex: e.detail.value
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
  // 图片上传
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.setData({
      activity_id: 1
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