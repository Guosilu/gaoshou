const config = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:config.img,
    topTab: [
      "文字类",
      "语音类",
      "图片类",
      "视频类",
      "综合类",
    ],
    rankingIde: [
      config.img+"First.png",
      config.img +"Second.png",
      config.img +"Third.png",
    ],
    topTabList: [
      [{
        ranking: 1,
        name: "Jarry",
        logo: config.img +"avatar_1.png",
        reward: "100",
        rewardType: "元"
      }],
      [{
        ranking: 2,
        name: "Marry",
        logo: config.img+"avatar_2.png",
        reward: "100",
        rewardType: "元"
      }],
      [{
        ranking: 3,
        name: "Tom",
        logo: config.img+"avatar_3.png",
        reward: "100",
        rewardType: "元"
      }],
      [{
        ranking: 4,
        name: "Li Ming",
        logo: config.img+"avatar_4.png",
        reward: "100",
        rewardType: "元"
      }],
      [{
        ranking: 5,
        name: "James",
        logo: config.img+"avatar_5.png",
        reward: "100",
        rewardType: "元"
      }]
    ],
    tabActive: 0,
  },
  tabClick: function (e) {
    this.setData({
      tabActive: e.currentTarget.dataset.current
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