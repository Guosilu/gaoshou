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
    indicatorDots: true,
    indicatorColor: "#FFF", //指示点颜色
    indicatorActiveColor: "#22b38a",
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //选择活动类型
    cateName: [
      { mode: "image", name: "图片" },
      { mode: "voice", name: "语音" },
      { mode: "video", name: "视频" },
      { mode: "article", name: "文章" },
    ],
    cateActive: '',
    //活动分类
    activityType: ["类别", "比赛", "排名", "互助"],
    // 日期插件
    curttenDate: "",
    curttenTime: "",
    form_reset: '',
    //图片上传
    videoThumb: [],
    filePath: [],
    itemType: '',
    detail: {},
    pageDataLock: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showLoading("正在加载...")
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
    commonFun.requestFun(dataObj).then((res) => {
      var filePath = res.file ? res.file.split(",") : [];
      res.starttime = res.starttime ? res.starttime.split(" ") : [];
      res.endtime = res.endtime ? res.endtime.split(" ") : [];
      console.log(res);
      that.setData({
        detail: res,
        filePath: filePath,
        pageDataLock: true,
      })
      wx.hideLoading();
    });
  },

  /**
   * 提交
   */
  //表单提交
  formSubmit: function (e) {
    var that = this;
    var post = this.setSubmitDate(e.detail.value);
    this.setData({
      submitDisabled: true,
    })
    //表单验证
    if (!this.submitCheck(post)) {
      this.setData({
        submitDisabled: false,
      })
      return false;
    }
    var uploadObj = new fileHandleObjFile.upload(this.fileParamConfig());  //实例化
    //console.log(fileObjList); return;
    that.showLoading('正在上传文件...', true);
    uploadObj.uploadFileNameList().then(res => {
      console.log(res);
      let filePathArray = [];
      let advertPathStr = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i]['columnName'] == "file") filePathArray.push(res[i].fileUrl);
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

  //上传文件参数配置
  fileParamConfig: function () {
    var fileObjList = [];
    var filePath = this.data.filePath;
    if (filePath.length > 0) {
      fileObjList.push({
        filePath: filePath[0],
        columnName: 'file',
      });
    }
    return fileObjList;
  },

  //设置提交内容
  setSubmitDate: function(post) {
    post['starttime'] = commonFun.getTimeStep(post['sDate'] + " " + post['sTime']);
    post['endtime'] = commonFun.getTimeStep(post['eDate'] + " " + post['eTime']);
    post['id'] = this.data.detail.id;
    post['openId'] = app.globalData.openId;
    return post;
  },

  //验证表单
  submitCheck: function (submitVal) {
    if (submitVal.type < 1) {
      this.showTip('请选择分类！');
      return false;
    }
    if (submitVal.title == '') {
      this.showTip('请填写标题！');
      return false;
    }
    if (this.data.filePath.length < 1) {
      this.showTip('至少传一个图！');
      return false;
    }
    console.log(submitVal);
    if (submitVal.starttime >= submitVal.endtime) {
      this.showTip('结束时间必须大于开始时间！');
      return false;
    }
    return true;
  },

  //图片选择
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          filePath: that.data.filePath.concat(res.tempFilePaths),
        });
      }
    });
  },

  //选择视频
  chooseVideo: function () {
    var that = this;
    wx.chooseVideo({
      maxDuration: 1000,
      success: function (res) {
        console.log(res);
        that.setData({
          filePath: that.data.filePath.concat(res.tempFilePath),
          videoThumb: that.data.videoThumb.concat(res.thumbTempFilePath),
        })
      }
    })
  },

  /**
   * 浏览图片
   */
  previewImage: function (e) {
    wx.previewImage({
      current: 1, // 当前显示图片的http链接
      urls: this.data.filePath // 需要预览的图片http链接列表
    })
  },

  /**
   * 删除图片
   */
  deleteFile: function() {
    this.setData({
      filePath: [],
    })
  },

  //图片错误时默认图片
  imageError: function () {
    var errorImg = 'filePath[0]';
    this.setData({
      [errorImg]: config.defaultImg,
    })
  },

  //改变时间
  bindDateChange: function(e) {
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

  bindeDateChange: function(e) {
    let edit = 'detail.endtime[0]';
    this.setData({
      [edit]: e.detail.value
    })
    console.log(this.data.detail.endtime);
  },

  bindeTimeChange: function(e) {
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

  //类型选择
  bindAccountChange: function (e) {
    console.log(e);
    this.setData({
      'detail.type': e.detail.value,
    })
  },

  //未知
  cateClick: function (e) {
    let clk = this;
    clk.setData({
      'detail.mode': e.currentTarget.dataset.current,
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