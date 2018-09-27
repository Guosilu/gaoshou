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
  },
  formSubmit: function(e) {
    let post = e.detail.value;
    let that = this;
    let files = this.data.files;
    
    for (let i = 0; i < files.length; i++) {
      let k = i; 
      if (k == 0) k = '';
      post['thumb' + k] = files[i];
    }
    console.log(post);
    wx.request({
      url: config.publicationUrl,
      method: 'POST',
      data: {
        action: 'add',
        post: post
      },
      success: function (res) {
        if (res.data == 1) {
          
        }
      }
    })
  },
  uploadFile: function(path) {
    wx.showLoading({
      title: '上传中...'
    });
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
          files: that.data.files.concat(res.data)
        });
        wx.hideLoading();
      }
    })
  },
  deleteFile: function (path) {
    wx.request({
      url: config.uploadUrl,
      method: 'POST',
      header: {
        // 'content-type': 'application/json'
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        action: 'delete_file',
        delete_path: path
      },
      success: function (res) {
        if (res.data == 1) {
          console.log('删除成功');
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
  // 图片上传
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let addFiles = res.tempFilePaths;
        that.setData({
          //files: that.data.files.concat(addFiles)
        });
        for (let i = 0; i < addFiles.length; i++) {
          console.log(addFiles[i]);
          that.uploadFile(addFiles[i]);
        }
      }
    })
  },
  //删除图片
  delImg: function (e) {
    wx.showLoading({
      title: '正在删除...'
    });
    let that = this;
    let id = e.target.dataset.id;
    let files = that.data.files;
    let files_new = [];
    for (var i = 0; i < files.length; i++) {
      if (i != id) {
        files_new.push(files[i]);
      }else {
        console.log(that.deleteFile(files[i]));
        wx.hideLoading();
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
      isLogin: wx.getStorageSync('isLogin'),
      files: []
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let files = this.data.files;
    console.log(files.length);
    if(files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        this.deleteFile(files[i]);
      }
    }
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