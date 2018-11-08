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
    //活动分类
    activityType: ["类别", "比赛", "排名", "互助"],
    //日期
    curttenDate: "",
    curttenTime: "",
    //文件
    filePath: [],//封面图片
    voicePath: [],//语音
    videoPath: [],//视频
    advertPath: [],//广告
    itemType: '',//项目类别
    detail: {},//详情
    pageDataLock: false,//页面加载锁
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
      console.log(res);
      var filePath = res.file ? res.file.split(",") : [];
      var voicePath = res.voice ? res.voice.split(",") : [];
      var videoPath = res.video ? res.video.split(",") : [];
      var advertPath = res.advert ? res.advert.split(",") : [];
      res.starttime = res.starttime ? res.starttime.split(" ") : [];
      res.endtime = res.endtime ? res.endtime.split(" ") : [];
      console.log(res);
      that.setData({
        detail: res,
        filePath: filePath,
        voicePath: voicePath,
        videoPath: videoPath,
        advertPath: advertPath,
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
    var pages = getCurrentPages(); // 获取页面栈
    var prevPage = pages[pages.length - 2]; // 上一个页面
    var post = this.setSubmitDate(e.detail.value);//设置提交数据
    var uploadObj = new fileHandleObjFile.upload(this.fileParamConfig());  //实例化upload
    var filePathArray = [];
    var voicePathArray = [];
    var videoPathArray = [];
    var advertPathArray = [];
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
    that.showLoading('正在上传文件...', true);
    uploadObj.uploadFileNameList().then(res => {
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        if (res[i]['columnName'] == "file") filePathArray.push(res[i].fileUrl);
        if (res[i]['columnName'] == "voice") voicePathArray.push(res[i].fileUrl);
        if (res[i]['columnName'] == "video") videoPathArray.push(res[i].fileUrl);
        if (res[i]['columnName'] == "advert") advertPathArray.push(res[i].fileUrl);
      }
      post['file'] = filePathArray.join();
      post['voice'] = voicePathArray.join();
      post['video'] = videoPathArray.join();
      post['advert'] = advertPathArray.join();
      console.log(post);
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
            that.showLoading('提交完成...', true);
            prevPage.returnReload();
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
    var voicePath = this.data.voicePath;
    var videoPath = this.data.videoPath;
    var advertPath = this.data.advertPath;
    var mode = this.data.detail.mode;
    if (filePath.length > 0) {
      fileObjList.push({
        filePath: filePath[0],
        columnName: 'file',
      });
    }
    if (mode == "voice" && voicePath.length > 0) {
      fileObjList.push({
        filePath: voicePath[0],
        columnName: 'voice',
      });
    }
    if (mode == "video" && videoPath.length > 0) {
      fileObjList.push({
        filePath: videoPath[0],
        columnName: 'video',
      });
    }
    if (advertPath.length > 0) {
      fileObjList.push({
        filePath: advertPath[0],
        columnName: 'advert',
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
    var filePath = [];
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          filePath: filePath.concat(res.tempFilePaths),
        });
      }
    });
  },

  //选择视频
  chooseVideo: function () {
    var that = this;
    var filePath = [];
    var videoPath = [];
    wx.chooseVideo({
      maxDuration: 1000,
      success: function (res) {
        console.log(res);
        that.setData({
          filePath: [],
          videoPath: [],
          filePath: filePath.concat(res.thumbTempFilePath),
          videoPath: videoPath.concat(res.tempFilePath),
        })
      }
    })
  },

  //选择广告
  chooseAdvertImage: function (e) {
    var that = this;
    var advertPath = [];
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          advertPath: advertPath.concat(res.tempFilePaths),
        });
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

  //浏览广告
  previewAdvertImage: function (e) {
    wx.previewImage({
      current: 1, // 当前显示图片的http链接
      urls: this.data.advertPath // 需要预览的图片http链接列表
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

  //删除广告
  deleteVideo: function (e) {
    this.setData({
      filePath: [],
      videoPath: [],
    })
  },

  //删除广告
  deleteAdvert: function (e) {
    this.setData({
      advertPath: [],
    })
  },

  //图片错误时默认图片
  imageError: function (e) {
    var errorImg = "";
    var fileType = e.currentTarget.dataset.type;
    if (fileType == "file")  errorImg = 'filePath[0]';
    if (fileType == "advert") errorImg = 'advertPath[0]';
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