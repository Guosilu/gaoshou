const config = require('../../../config/config.js');
const commonFun = require("../../../js/commonFun.js");
const uploadObjFile = new require("../../../js/uploadObj.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: wx.getStorageSync('isLogin'),
    img: config.img,
    indicatorDots: true,
    indicatorColor: "#FFF", //指示点颜色
    indicatorActiveColor: "#22b38a",
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //活动分类
    activityType: ["类别", "人物", "风景", "实物", "书画", "文化", "技艺", "其他"],
    //图片上传
    filePath: [],
    itemType: '',
    detail: {},
    submitDisabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dataTime = commonFun.getDateTime();
    this.setData({
      itemType: options.itemType,
      curttenDate: dataTime[0],
      curttenTime: dataTime[1],
    })
    console.log(options);
    this.getDeatil(options.id, options.itemType);
  },

  //获取详情
  getDeatil: function (id, itemType) {
    console.log(id);
    var that = this;
    var dataObj = {
      url: config.myUrl,
      data: {
        action: 'detail',
        post: {
          id: id,
          itemType: itemType,
          openId: app.globalData.openId,
        }
      }
    }
    console.log(dataObj);
    commonFun.requestFun(dataObj).then((res) => {
      var filePath = res.file.split(",");
      commonFun.downloadFile(filePath[0]).then((downloadPath) => {
        console.log(downloadPath);
        that.setData({
          filePath: that.data.filePath.concat(downloadPath),
        })
      })
      console.log(res);
      that.setData({
        detail: res,
      })
      wx.hideLoading();
    });
  },

  cateClick: function (e) {
    let clk = this;
    clk.setData({
      'detail.mode': e.currentTarget.dataset.current,
    })
  },

  /**
   * 提交
   */
  //表单提交
  formSubmit: function (e) {
    this.setData({
      //submitDisabled: true,
    })
    var that = this;
    var post = this.setSubmitDate(e.detail.value);
    var paramObj = this.fileParamConfig();

    //实例化
    var uploadObj = new uploadObjFile.upload();

    //表单验证
    /*if (!this.submitCheck(post)) {
      this.setData({
        submitDisabled: false,
      })
      return false;
    }*/
    //console.log(paramObj); return;
    that.showLoading('正在上传文件...', true);
    uploadObj.fileUpload(paramObj).then(res => {
      console.log(res);
      post['file'] = res['fileUrl'];
      if (res['fileUrl']) {
        var dataObj = {
          url: config.myUrl,
          data: {
            action: 'edit',
            itemType: that.data.itemType,
            post: post,
          }
        }
        that.showLoading('正在提交数据...', true)
        commonFun.requestFun(dataObj).then(res => {
          if (res > 0) {
            that.showLoading('提交完成...', true)
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        });
      }
    })
  },

  setSubmitDate: function (post) {
    post['starttime'] = commonFun.getTimeStep(post['sDate'] + " " + post['sTime']);
    post['endtime'] = commonFun.getTimeStep(post['eDate'] + " " + post['eTime']);
    post['id'] = this.data.detail.id;
    post['openId'] = app.globalData.openId;
    return post;
  },

  //上传文件参数配置
  fileParamConfig: function () {
    var paramObj = {
      url: config.uploadUrl,
      filePath: this.data.filePath[0],
      columnName: 'file',
      name: 'file',
      formData: {
        action: 'upload',
      }
    };
    return paramObj;
  },

  //验证表单
  submitCheck: function (submitVal) {
    if (submitVal.catid < 1) {
      this.showTip('请选择分类');
      return false;
    }
    if (submitVal.title == '') {
      this.showTip('请填写标题');
      return false;
    }
    if (this.data.imagePath == '') {
      this.showTip('至少传一个图');
      return false;
    }
    if (this.data.videoPath == '') {
      this.showTip('请录制或选择一个小视频');
      return false;
    }
    if (parseFloat(this.data.videoSize) > 100) {
      this.showTip('很抱歉，视频最大允许20M，当前为' + this.data.videoSize + 'M');
      return false;
    }
    return true;
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
          filePath: [res.tempFilePaths[0]],
        });
      }
    });
  },

  /**
   * 浏览图片
   */
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.file // 需要预览的图片http链接列表
    })
  },

  /**
   * 删除图片
   */
  deleteFile: function (e) {
    this.setData({
      filePath: [],
    })
  },

  // 改变时间
  bindDateChange: function (e) {
    let edit = 'detail.starttime[0]';
    this.setData({
      [edit]: e.detail.value
    })
    console.log(this.data.detail.starttime);
  },

  bindTimeChange: function (e) {
    let edit = 'detail.starttime[1]';
    this.setData({
      [edit]: e.detail.value
    })
    console.log(this.data.detail.starttime);
  },

  bindeDateChange: function (e) {
    let edit = 'detail.endtime[0]';
    this.setData({
      [edit]: e.detail.value
    })
    console.log(this.data.detail.endtime);
  },

  bindeTimeChange: function (e) {
    let edit = 'detail.endtime[1]';
    this.setData({
      [edit]: e.detail.value
    })
    console.log(this.data.detail.endtime);
  },

  //提示方法
  showTip: function (msg, icon) {
    var icon = icon || "none";
    wx.showToast({
      icon: icon,
      title: msg,
    })
  },

  //加载方法
  showLoading: function (msg, mask) {
    var mask = mask || false;
    wx.showLoading({
      mask: mask,
      title: msg,
    })
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