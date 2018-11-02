const util = require('../../../../config/comment.js');
const config = util.config;
const app = util.app;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //图片上传
    files: [],
    filePath: "",
    post: []
  },

  /**
   * 提交
   */
  formSubmit: function(param){
    var that = this;
    that.setData({
      post: param.detail.value,
    })
    if (that.data.files.length<1){
      wx.showToast({
        title: '图片不可为空',
        icon: 'none'
      })
    }else{
      wx.showLoading({
        mask: true,
        title: '提交中...',
      });
    }
    that.fileUpload(0, that.data.files)
  },
  /**
   * 提交
   */
  formSubmitDo: function () {
    var that = this;
    var post = that.data.post;
    post['state'] = '3';
    post['openId'] = app.globalData.openId;
    wx.request({
      url: config.forum,
      dataType: "json",
      method: "post",
      data: {
        "action": "addQuestion",
        "param": post
      },
      success: function (res) {
        if (res.statusCode==200){
          wx.showToast({
            title: '添加成功',
            success: function() {
              setTimeout(function(){
                wx.redirectTo({
                  url: '../../question/question?id='+res.data,
                })
              },1500)
            }
          })
        }
      }
    })
  },
  /**
   * 图片递归上传方法
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
          post['image'] = that.data.filePath;
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