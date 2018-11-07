const config = require('../../../config/config.js');
const commonFun = require("../../../js/commonFun.js"); 
const fileHandleObjFile = require("../../../js/fileHandleObj.js");
const app = getApp();
Page({

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
    itemType: "",
    detail: {},
    submitDisabled: false,
    pageDataLock: false,
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
      var filePath = res.file ? res.file.split(",") : [];
      res.file = res.file ? res.file.split(",") : [];
      console.log(res);
      that.setData({
        detail: res,
        filePath: filePath,
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
    //表单验证
    if (!this.submitCheck(post)) {
      this.setData({
        submitDisabled: false,
      })
      return false;
    }
    var uploadObj = new fileHandleObjFile.upload(this.fileParamConfig());  //实例化
    //console.log(uploadObj.fileScreen()); return;
    that.showLoading('正在上传文件...', true);
    uploadObj.uploadFileNameList().then(res => {
      let filePathArray = [];
      for (let i = 0; i < res.length; i++) {
        filePathArray.push(res[i].fileUrl);
      }
      post['file'] = filePathArray.join();
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
    var fileObjList = [];
    var filePath = this.data.filePath;
    console.log(filePath);
    console.log(this.data.detail.file);
    for (let i = 0; i < filePath.length; i++) {
      fileObjList.push({
        filePath: filePath[i],
        columnName: 'file',
      });
    }
    return fileObjList;
  },

  //验证表单
  submitCheck: function (submitVal) {
    if (submitVal.type < 1) {
      this.showTip('请选择分类');
      return false;
    }
    if (submitVal.title == '') {
      this.showTip('请填写标题');
      return false;
    }
    if (this.data.filePath.length < 1) {
      this.showTip('至少传一个图');
      return false;
    }
    return true;
  },

  // 图片上传
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          'detail.file': that.data.detail.file.concat(res.tempFilePaths),
          filePath: that.data.filePath.concat(res.tempFilePaths),
        });
        console.log(res);
        console.log(that.data.filePath);
      }
    });
  },

  /**
   * 浏览图片
   */
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.detail.file // 需要预览的图片http链接列表
    })
  },

  /**
   * 删除图片
   */
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
      'detail.file': filePathNew,
      filePath: filePathNew,
    })
    console.log(filePathNew);
  },

  //图片错误时默认图片
  imageError: function (e) {
    var index = e.currentTarget.dataset.index;
    var errorImg = 'detail.file[' + index + ']';
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

  //类型选择
  bindAccountChange: function(e) {
    console.log(e);
    this.setData({
      'detail.type': e.detail.value,
    })
  },

  cateClick: function (e) {
    let clk = this;
    clk.setData({
      'detail.mode': e.currentTarget.dataset.current,
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