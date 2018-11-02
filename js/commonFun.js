function collectFun(url, param, confirm) {
  var confirm = confirm || '';
  if (confirm) {
    return new Promise(function (resolve, reject) {
      wx.showModal({
        title: '提示',
        content: '确定取消关注吗？',
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
}

function requestFun(dataObj) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: dataObj.url,
      method: 'POST',
      dataType: 'json',
      data: dataObj.data,
      success: function (res) {
        resolve(res.data)
      }
    })
  });
}

function promiseFun (dataObj) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: dataObj.url,
      method: 'POST',
      dataType: 'json',
      data: dataObj.data,
      success: function (res) {
        let resol = {
          name: dataObj.name,
          data: res.data,
        };
        resolve(resol)
      }
    })
  });
}

function getList(dataObjList) {
  return new Promise(function (resolve, reject) {
    let promiseArr = [];
    for (let i = 0; i < dataObjList.length; i++) {
      let promise = promiseFun(dataObjList[i]);
      promiseArr.push(promise)
    }
    Promise.all(promiseArr).then(function (res) {
      let allList = {};
      for (let i = 0; i < res.length; i++) {
        allList[res[i].name] = res[i].data
      }
      resolve(allList);
    });
  });
}

module.exports = {
  requestFun: requestFun,
  getList: getList,
}