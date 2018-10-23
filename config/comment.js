const app = getApp();
const config = require('config.js');

var comment = {
  /**
   * param.types : comment or reply
   */
  add: function (action, param){
    wx.request({
      url: config.comment,
      dataType: 'json',
      data: {
        action: action,
        param: param
      },
      method: "post",
      success: function (res) {
        console.log(res.data);
        comment.callback(res.data)
        // return res.data;
      }
    })
  },
  callback: function(res){

    return res;
  }
}


// interface
module.exports = {
  comment: comment,
  config:config,
  app:app
}