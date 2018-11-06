/**
 * 非直接使用
 * 请复制一份自行修改
 */
//实例化upload对象
function upload() {
  /** 
   * 单文件上传
   * paramObj: {url: '', filePath: '', formData: '', name: '', columnName: ''}
   * resol: {columnName: '', fileUrl: ''}
  */
  this.fileUpload = function (paramObj) {
    var that = this;
    return new Promise(function (resolve, reject) {
      if (paramObj.filePath) {
        wx.uploadFile({
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
      } else {
        resolve(0);
      }
      
    });
  }

  /** 
   * 多文件上传
   * paramObjList: {paramObj1[, paramObj2 ,...]}
   * fileNameList: [{columnName: '', fileUrl: ''}, {} ...] / {{columnName1: fileUrl1}, {}, ...}
   * objType: array, json
  */
  this.uploadFileNameList = function (paramObjList, objType) {
    var that = this;
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

/**
 * 下载单网络文件对象
 */
function dowload(urls) {
  this.urls = urls;
  /**
   * 下载单网络文件
   * 返回: 本地临时路径
   * 类型: 字符串
  */
  this.downloadFile = function () {
    return new Promise(function (resolve, reject) {
      if ((typeof (this.urls == "object") && urls.length === 1) || (typeof(this.urls == "string") && urls.length != "")) {
        var url = typeof(this.urls == "object") ? this.urls[0] : this.urls;
        wx.downloadFile({
          url: url,
          success(res) {
            if (res.statusCode === 200) {
              resolve(res.tempFilePath);
            }
          }
        })
      } else {
        resolve(0)
      }
    });
  }

  /**
   * 下载多网络文件
   * 返回: 本地临时路径
   * 类型: 数组
   */
  this.downloadFileList = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      if (typeof (that.urls == "object") && urls.length > 0) {
        var urls = that.urls;
        var promiseArr = [];
        for (let i = 0; i < urls.length; i++) {
          let promise = that.downloadFile(urls[i]);
          promiseArr.push(promise);
        }
        Promise.all(promiseArr).then((res) => {
          console.log(res);
          resolve(res);
        });
      }
      
    })
  }
}

module.exports = {
  upload: upload,
  dowload: dowload
}