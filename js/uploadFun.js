
/** 
 * 单文件上传
 * paramObj: {url: '', filePath: '', formData: '', name: '', columnName: ''}
 * resol: {columnName: '', fileUrl: ''}
*/
function fileUpload(paramObj, ele) {
  return new Promise(function (resolve, reject) {
    let Task = wx.uploadFile({
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
    uploadTask(Task, ele);
  });
}

/**
 * 上传状况
 */
function uploadTask(Task, ele) {
  Task.onProgressUpdate((res) => {
    var key = 'percent.' + columnName;
    ele.setData({
      [key]: res.progress,
    })
    console.log(ele.data.percent);
    /*console.log('已经上传的数据长度', res.totalBytesSent)
    console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)*/
  })
}

/** 
 * 多文件上传
 * paramObjList: {paramObj1[, paramObj2 ,...]}
 * fileNameList: [{columnName: '', fileUrl: ''}, {} ...] / {{columnName1: fileUrl1}, {}, ...}
 * objType: array, json
*/
function uploadFileNameList(paramObjList, objType, ele) {
  var objType = objType || "array";
  var ele = ele || null;
  return new Promise(function (resolve, reject) {
    let promiseArr = [];
    for (let i = 0; i < paramObjList.length; i++) {
      let promise = fileUpload(paramObjList[i], ele);
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

module.exports = {
  fileUpload: fileUpload,
  uploadFileNameList: uploadFileNameList,
  uploadObj: uploadObj,
}