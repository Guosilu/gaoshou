const app = getApp()
const config = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:config.img,
    list: [],
    page: 1,
    types: "",
  },

  show:function(option){
    let that = this;
    let id = option.currentTarget.dataset.ids
    if(that.data.types=='all'){
      wx.navigateTo({
        url: '../exhibit/exhibit?id=' + id,
      })
    }else{
      wx.navigateTo({
        url: '../publication/detail/detail?id=' + id,
      })
    }
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    that.setData({
      types: options.type,
    })
    that.beforQuery(that.data.types);
  },
  //查询之前
  beforQuery: function (types) {
    var that = this;
    if (types == "all") {
      that.query("all", config.activityUrl)
    } else if (types == "zuopin"){
      that.query("lists", config.publicationUrl)
    }
  },
  /**
   * 查询
   */
  query: function (action, url) {
    var that = this;
    let where = {}
    if (action != 'all') {
      where['openId'] = app.globalData.openId;
    }
    console.log(url);
    wx.request({
      url: url,
      method: "POST",
      dataType: "JSON",
      data: {
        page: that.data.page,
        action: action,
        where: where
      },
      success: function (res) {
        let data = JSON.parse(res.data);
        console.log(data)
        if (res.data!='[]'){
          console.log(res);
          that.setData({
            list: that.data.list.concat(data)
          })
        }else{
          wx.showToast({
            title: '暂未更多信息',
            icon:"none"
          })
        }
        
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showToast({
      title: '正在加载更多....',
      icon: "loading"
    })
    var that = this;
    let page = that.data.page;
    that.setData({
      page: page + 1
    })
    that.beforQuery(that.data.types);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})