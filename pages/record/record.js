const app = getApp()
const config = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    types:"",
    judge:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      types:options.type,
    })
    that.beforQuery(that.data.types);  
  },
  //查询之前
  beforQuery: function (types){
    var that = this;
    if (types == "WeLaunch") {
      that.query("lists", config.activityUrl)
    } else if (types == "WeJob") {
      that.query("WeJob", config.activity_orderUrl)
    } else if (types == "all") {
      that.query("all", config.activityUrl)
    } else if (types == "MyPublication") {
      that.query("lists", config.publicationUrl)
      that.setData({
        judge: "MyPublication",
      })
    }else {
      that.setData({
        judge: "WhoLaunch",
      })
      that.query("WhoLaunch", config.activity_orderUrl)
    }
  },
  /**
   * 查询
   */
  query:function(action,url){
    var that = this;
    let where = {}
    if(action!='all'){
      where['openId'] = app.globalData.openId;
    }
    console.log(url);
    wx.request({
      url: url,
      method: "POST",
      dataType: "JSON",
      data: {
        page:that.data.page,
        action: action,
        where: where
      },
      success: function (res) {
        let data = JSON.parse(res.data);
        for(let a = 0; a<data.length; a++){
          if (data[a]['image']) {
            data[a]['image'] = data[a]['image'].split(',')
          }
        }
        
        console.log(data);
        that.setData({
          list: that.data.list.concat(data)
        })
      },
      fail: function () {
        wx.showToast({
          title: '查询失败',
          icon: "none"
        })
      }
    })
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在加载....',
      icon: "loading"
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("触底事件")
    var that = this;
    let page = that.data.page;
    that.setData({
      page:page+1
    })
    that.beforQuery(that.data.types); 
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})