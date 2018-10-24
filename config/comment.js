const app = getApp();
const config = require('config.js');

var comment = {
  /**
   * param.types : comment or reply
   */
  query: function (action, param){
    return new Promise(function (reslove, reject) {
      wx.request({
        url: config.comment,
        dataType: 'json',
        data: {
          action: action,
          param: param
        },
        method: "post",
        success: function (res) {
          reslove(res.data)
        }
      })
    });
  }
}


// interface
module.exports = {
  comment: comment,
  config:config,
  app:app
}