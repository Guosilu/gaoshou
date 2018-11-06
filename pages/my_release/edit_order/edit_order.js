const config = require('../../../config/config.js');
const commonFun = require("../../../js/commonFun.js");
const fileHandleObjFile = require("../../../js/fileHandleObj.js");
const app = getApp();
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    isLogin: wx.getStorageSync('isLogin'),
    img: config.img,
    //广告
    advertPath: [],
    filePath: [],
    itemType: "",
    detail: {},
    submitDisabled: false,
    pageFileLock: false,
    pageDataLock: false,
    pageAdvertLock: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showLoading("正在加载...")
    this.setData({
      itemType: options.itemType,
    })
    this.getDeatil(options.id, options.itemType);
  },

  //获取下载图片临时地址
  getDownloadFile: function (res) {
    var that = this;
    var filePath = res.file.split(",");
    var advertPath = res.advert.split(",");
    var downloadObj = new fileHandleObjFile.dowload(filePath);
    var downloadAdvertObj = new fileHandleObjFile.dowload(advertPath);
    downloadObj.downloadFileList().then((tp) => {
      console.log(tp);
      that.setData({
        filePath: tp,
        pageFileLock: true,
      })
    })
    downloadAdvertObj.downloadFileList().then((tp) => {
      console.log(tp);
      that.setData({
        advertPath: tp,
        pageAdvertLock: true,
      })
    })
  },

  //获取详情
  getDeatil: function (id, itemType) {
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
      that.getDownloadFile(res);
      console.log(res);
      that.setData({
        detail: res,
        pageDataLock: true,
      })
      wx.hideLoading();
    });
  },

  //表单提交
  formSubmit: function (e) {
    this.setData({
      submitDisabled: true,
    })
    var that = this;
    var post = this.setSubmitDate(e.detail.value);
    var paramObjList = this.fileParamConfig();
    //实例化
    var uploadObj = new fileHandleObjFile.upload();
    //表单验证
    if (!this.submitCheck(post)) {
      this.setData({
        submitDisabled: false,
      })
      return false;
    }
    //console.log(paramObjList); return;
    that.showLoading('正在上传文件...', true);
    uploadObj.uploadFileNameList(paramObjList).then(res => {
      console.log(res);
      let filePathArray = [];
      let advertPathStr = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i]['columnName'] == "file") filePathArray.push(res[i].fileUrl);
        if (res[i]['columnName'] == "advert") advertPathStr.push(res[i].fileUrl);
      }
      post['file'] = filePathArray.join();
      post['advert'] = advertPathStr.join();
      if (filePathArray.length > 0) {
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
      } else {
        that.showTip('上传不完整');
        that.setData({
          submitDisabled: false,
        })
      }
    })
  },

  //设置提交内容
  setSubmitDate: function (post) {
    post['id'] = this.data.detail.id;
    post['openId'] = app.globalData.openId;
    return post;
  },

  //上传文件参数配置
  fileParamConfig: function () {
    var paramObjList = [];
    var filePath = this.data.filePath;
    var advertPath = this.data.advertPath;
    var advertOjb = {
      url: config.uploadUrl,
      filePath: advertPath[0],
      columnName: 'advert',
      name: 'file',
      formData: {
        action: 'upload',
      }
    }
    paramObjList.push(advertOjb);
    for (let i = 0; i < filePath.length; i++) {
      var paramObj = {
        url: config.uploadUrl,
        filePath: filePath[i],
        columnName: 'file',
        name: 'file',
        formData: {
          action: 'upload',
        }
      };
      paramObjList.push(paramObj);
    }
    return paramObjList;
  },

  //验证表单
  submitCheck: function (submitVal) {
    if (submitVal.title == '') {
      this.showTip('请填写标题！');
      return false;
    }
    if (this.data.filePath.length < 1 || this.data.filePath.length > 3) {
      this.showTip('上传作品数量不正确！');
      return false;
    }
    /*if (this.data.advertPath.length < 1) {
      this.showTip('请上传广告！');
      return false;
    }*/
    return true;
  },

  //选择上传
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          filePath: that.data.filePath.concat(res.tempFilePaths),
        });
      }
    });
  },


  //选择广告
  chooseAdvertImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          advertPath: that.data.advertPath.concat(res.tempFilePaths)
        });
      }
    })
  },

  //浏览图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.filePath // 需要预览的图片http链接列表
    })
  },

  //浏览广告
  previewAdvertImage: function (e) {
    wx.previewImage({
      current: 1, // 当前显示图片的http链接
      urls: this.data.advertPath // 需要预览的图片http链接列表
    })
  },

  //删除图片
  deleteFile: function (e) {
    var id = e.target.dataset.id;
    var filePath = this.data.filePath;
    var filePathNew = [];
    for (let i = 0; i < filePath.length; i++) {
      if (i != id) {
        filePathNew.push(filePath[i]);
      }
    }
    this.setData({
      filePath: filePathNew
    })
  },

  //删除广告
  deleteAdvert: function (e) {
    this.setData({
      advertPath: []
    })
  },

  //图片错误时默认图片
  imageError: function (e) {
    var fileType = e.currentTarget.dataset.type;
    if (fileType == "file") {
      var index = e.currentTarget.dataset.index;
      var errorImg = 'filePath[' + index + ']';
    } else if (fileType == "advert") {
      var errorImg = 'advertPath[0]';
    }
    this.setData({
      [errorImg]: config.defaultImg,
    })
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