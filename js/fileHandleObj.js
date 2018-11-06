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
 * urls: []或""
 */
function dowload(urls) {
  this.urls = urls;
  this.url = "";//可变动url
  /**
   * 下载单网络文件
   * 返回: 本地临时路径
   * 类型: 字符串
  */
  this.downloadFile = function () {
    var that = this;
    var urls = this.urls
    return new Promise(function (resolve, reject) {
      if (urls.length > 0) {
        if (typeof (urls == "object") && urls.length > 1 && that.url) {
          var url = that.url;
        } else if ((typeof (urls == "object") && urls.length == 1) || (typeof (urls == "string") && urls.length != "")) {
          var url = typeof (that.urls == "object") ? that.urls[0] : that.urls;
        }
        wx.downloadFile({
          url: url,
          success(res) {
            resolve(res.tempFilePath);
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
    var urls = that.urls;
    var promiseArr = [];
    return new Promise(function (resolve, reject) {
      if (typeof (urls == "object") && urls.length > 0) {
        console.log(urls);
        for (let i = 0; i < urls.length; i++) {
          that.url = urls[i];
          let promise = that.downloadFile();
          promiseArr.push(promise);
        }
        Promise.all(promiseArr).then((res) => {
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