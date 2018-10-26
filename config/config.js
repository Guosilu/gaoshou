// 定义常量
const baseUrl = 'https://aa.zdcom.net.cn/';
const loginUrl = baseUrl + 'gaoshou/api/loginApi.php'; 
const uploadUrl = baseUrl + 'gaoshou/api/uploadApi.php';
const publicationUrl = baseUrl + 'gaoshou/api/publicationApi.php'; 
const activityUrl = baseUrl + 'gaoshou/api/activityApi.php';
const activity_orderUrl = baseUrl + 'gaoshou/api/activity_orderApi.php';
const squareUrl = baseUrl + 'gaoshou/api/squareApi.php';
const coreUrl = baseUrl + "gaoshou/core/";
const img = baseUrl + "gaoshou/images/";
const comment = baseUrl +'gaoshou/api/commentApi.php';
const payApi = baseUrl +'gaoshou/pay/GetSth.php'

// 对外接口
module.exports = {
  loginUrl: loginUrl,
  uploadUrl: uploadUrl,
  publicationUrl: publicationUrl,
  activityUrl: activityUrl,
  activity_orderUrl: activity_orderUrl,
  coreUrl: coreUrl,
  img: img,
  squareUrl: squareUrl,
  comment: comment,
  payApi: payApi
}