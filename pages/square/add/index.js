const config = require('../../../config/config.js');
const app = getApp();
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    isLogin: wx.getStorageSync('isLogin'),
    img: config.img,
    //图片上传
    files: [],
    //广告
    advert: "",
    filePath:''
  },
  form_reset: function() {
    this.setData({
      files: ''
    });
  },
  formSubmit: function(e) {
    var that = this;
    let post = e.detail.value;
    if (post.title==''){
      wx.showToast({
        title: '名称不可为空',
        icon: 'none'
      })
      return;
    }
    let files = that.data.files;
    if (files.length == 0) {
      wx.showToast({
        title: '请上传图片！',
        icon: 'none'
      });
      return false;
    } else {
      wx.showLoading({
        mask: true,
        title: '提交中...',
      });
      for(let a=0;a<files.length;a++){
        that.fileUpload(files[a], post);
      }
      console.log(that.data.filePath)
      post['img'] = that.data.filePath

      that.formSubmitDo(post);
    }
  },
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
        if (that.data.filePath==''){
          that.setData({
            filePath: that.data.filePath.concat(res.data)
          })
        }else{
          that.setData({
            filePath: that.data.filePath.concat(','+res.data)
          })
        }  
      
        // return;
        // post['thumb'] = res.data;

        // that.formSubmitDo(post);
      }
    });
  },
  formSubmitDo: function(post) {
    let that = this;
    post['openId'] = app.globalData.openId;
    wx.request({
      url: config.squareUrl,
      method: "POST",
      data: {
        action: 'add',
        post: post
      },
      success: function(res) {
        if (res.data > 0) {
          wx.showToast({
            title: '提交成功！',
          });
          that.form_reset();
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
  delImg: function(e) {
    var num = e.currentTarget.dataset.num;
    var files = this.data.files;
    var NewFilesArr = [];
    for(let a = 0;a<files.length;a++){
      if(a!=num){
        NewFilesArr.push(files[a]);
      }  
    }
    this.setData({
      files: NewFilesArr
    })
  },
  // 图片上传
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.url) {
      this.setData({
        files: [options.url]
      })
    }
    console.log(options)
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