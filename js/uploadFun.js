//被调用文件上传方法
function fileUpload(paramObj) {
  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: paramObj.url,
      filePath: paramObj.filePath,
      name: paramObj.name,
      formData: paramObj.formData,
      success: function (res) {
        let data = JSON.parse(res.data);
        let success = data.success;
        console.log(data);
        if (success == 1) {
          let resol = {
            columnName: paramObj.columnName,
            fileUrl: data.file_url,
          }
          resolve(resol);
        } else {
          resolve(0);
        }
      }
    });
  });
}
/*
*上传文件
*返回单/多文件的带字段名columnName,文件url地址fileUrl的数组中对象
*请使用for循环赋值对应data对象提交
*/
function uploadFileNameList (paramObjList) {
  return new Promise(function (resolve, reject) {
    let promiseArr = [];
    for (let i = 0; i < paramObjList.length; i++) {
      let promise = fileUpload(paramObjList[i]);
      promiseArr.push(promise);
    }
    Promise.all(promiseArr).then(res => {
      let fileNameList = [];
      for (let i = 0; i < res.length; i++) {
        //fileNameList[res[i].columnName] = res[i].fileUrl
        let fileNameList1 = {
          columnName: res[i].columnName,
          fileUrl: res[i].fileUrl
        }
        fileNameList.push(fileNameList1);
      }
      resolve(fileNameList);
    });
  })
}

module.exports = {
  fileUpload: fileUpload,
  uploadFileNameList: uploadFileNameList,
}