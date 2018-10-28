// interface
function requestFun(url, param, confirm) {
  var confirm = confirm || '';
  if(confirm) {
    var promise = new Promise(function (resolve, reject) {
      wx.showModal({
        title: '提示',
        content: '确定取消点赞吗？',
        success: function (confirm) {
          if (confirm.confirm) {
            wx.request({
              url: url,
              method: "POST",
              data: param,
              success: function (res) {
                resolve(res.data);
              }
            });
          }
        }
      });
    });      
  } else {
    var promise = new Promise(function (resolve, reject) {
      wx.request({
        url: url,
        method: "POST",
        data: param,
        success: function (res) {
          resolve(res.data);
        }
      });
    });
  }
  return promise;
}

/*function like(url, action, post) {
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: "POST",
      data: {
        action: action,
        post: post
      },
      success: function (res) {
        resolve(res.data);
      }
    });
  });
  return promise;
}

function like_cancel(url, action, post) {
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: "POST",
      data: {
        action: action,
        post: post
      },
      success: function (res) {
        resolve(res.data);
      }
    });
  });
  return promise;
}*/

module.exports = {
  requestFun: requestFun
}