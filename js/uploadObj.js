
//实例化upload对象
function upload(ele) {
  /**
   * ele: 页面元素对象
  */
  this.ele = ele || null;
  this.task = [];
  /** 
   * 单文件上传
   * paramObj: {url: '', filePath: '', formData: '', name: '', columnName: ''}
   * resol: {columnName: '', fileUrl: ''}
  */
  this.fileUpload = function (paramObj) {
    var that = this;
   
    return new Promise(function (resolve, reject) {
      if (paramObj.filePath) {
        var Task = wx.uploadFile({
          url: paramObj.url,
          filePath: paramObj.filePath,
          name: paramObj.name,
          formData: paramObj.formData,
          success: function (res) {
            let data = JSON.parse(res.data);
            let success = data.success;
            if (success == 1) {
              let resol = {
                columnName: paramObj.columnName,
                fileUrl: data.file_url,
              }
              console.log(resol);
              resolve(resol);
            } else {
              resolve(0);
            }
          }
        });
        that.task.push(Task);
        that.uploadTask(Task, paramObj.columnName);
      } else {
        resolve(0);
      }
      
    });
  }

  /**
   * 上传状况 progress, totalBytesSent, totalBytesExpectedToSend
  */
  this.uploadTask = function (Task, columnName) {
    var that = this;
    Task.onProgressUpdate((res) => {
      var key = 'uploadProgress.' + columnName
      res.totalBytesSent = (res.totalBytesSent / 1024 / 1024).toFixed(2);
      res.totalBytesExpectedToSend = (res.totalBytesExpectedToSend / 1024 / 1024).toFixed(2);
      that.ele.setData({
        [key]: res,
        showUploadProgress: Boolean(JSON.stringify(res) != '{}')
      })
      console.log(that.ele.data.uploadProgress);
    })
  }

  /**
   * 取消上传任务
  */
  this.stopTask = function () {
    console.log(this.task);
    wx.hideLoading();
    var that = this;
    for (let i = 0; i < this.task.length; i++) {
      if (this.task[i]) this.task[i].abort();
    }
  }

  /** 
   * 多文件上传
   * paramObjList: {paramObj1[, paramObj2 ,...]}
   * fileNameList: [{columnName: '', fileUrl: ''}, {} ...] / {{columnName1: fileUrl1}, {}, ...}
   * objType: array, json
  */
  this.uploadFileNameList = function (paramObjList, objType) {
    var that = this;
    this.task = [];
    var objType = objType || "array";
    return new Promise(function (resolve, reject) {
      let promiseArr = [];
      for (let i = 0; i < paramObjList.length; i++) {
        let promise = that.fileUpload(paramObjList[i]);
        promiseArr.push(promise);
      }
      Promise.all(promiseArr).then(res => {
        if (objType == "array") {
          let fileNameList = [];
          for (let i = 0; i < res.length; i++) {
            let fileNameOne = {
              columnName: res[i].columnName,
              fileUrl: res[i].fileUrl
            }
            fileNameList.push(fileNameOne);
          }
          console.log(fileNameList);
          resolve(fileNameList);
        } else if (objType == "json") {
          let fileNameList = {};
          for (let i = 0; i < res.length; i++) {
            fileNameList[res[i].columnName] = res[i].fileUrl;
          }
          console.log(fileNameList);
          resolve(fileNameList);
        }
      });
    })
  }
}

module.exports = {
  upload: upload,
}