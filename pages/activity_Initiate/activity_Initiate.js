const config = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:"",
    img:config.img,
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
    activityType: ["活动类别","比赛", "排名", "互助"],
    activityTypeIndex: 0,
    //图片上传
    files: [],
    files_url: [],
    // 日期插件
    bdate: "2016-09-01",
    btime: "12:01",
    edate: "2016-09-01",
    etime: "12:01",
  },
  formSubmit:function(e){
    var that = this;
    wx.getStorage({
      key: 'openId',
      success: function(res) {
        that.setData({
          openId:res.data
        })
      },
      fail:function(){
        wx.showToast({
          title: '请先登录',
          icon:'none'
        });
      }
    })
    var result = e.detail.value;
    if (result.type == '0' || result.rule.trim() == '' || result.title.trim() == ''){
        wx.showToast({
          title: '内容不可为空',
          icon:'none'
        })
    }
    let files = this.data.files;
    wx.uploadFile({
      url: config.uploadUrl,
      filePath: files[0],
      name: 'file',
      formData: {
        action: 'upload_file'
      },
      success:function(res){
        console.log(res);
        wx.request({
          url: config.coreUrl + 'setExhibitApi.php',
          method: "POST",
          data: {
            title: result['title'],
            type: result['type'],
            starttime: result['bdate'] + " " + result['btime'],
            endtime: result['edate'] + " " + result['etime'],
            rule: result['rule'],
            thumb: res.data,
            userid:that.data.openId
          },
          dataType: "JSON",
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            console.log(res)
          },
          fail: function(res){
            console.log(res)
          }
        })
      }
    })
  },
  //删除图片
  delImg:function(e){
    var that = this;
    var id = e.target.dataset.id;
    var url = that.data.files;
    var set = [];
    for (var a = 0; a < url.length;a++){
      if(a!=id){
        set.push(url[a]);
      }
    }
    that.setData({
      files: set
    })
  },
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    if (e.detail.value<1){
      wx.showToast({
        title: '活动类别不可为空',
        icon:'none',
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
    if ((that.data.files).length >= 1) {
      wx.showToast({
        title: "图片已上传",
        icon: 'none',
      })
      return;
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
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