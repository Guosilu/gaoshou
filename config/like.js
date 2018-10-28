const app = getApp();
// interface
function is_like(url, action, where) {
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: "POST",
      data: {
        action: action,
        where: where
      },
      success: function (res) {
        resolve(res.data);
      }
    });
  });
  return promise;
}

function like(url, action, post) {
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

function like_cancel(url, action, where) {
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: "POST",
      data: {
        action: action,
        where: where
      },
      success: function (res) {
        resolve(res.data);
      }
    });
  });
  return promise;
}

module.exports = {
  is_like: is_like,
  like: like,
  like_cancel: like_cancel
}