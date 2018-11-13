// 定义常量
//const defaultImg = '/images/myDefault.png';
const baseUrl = 'https://aa.zdcom.net.cn/';
const defaultImg = baseUrl + '/gaoshou/upload/img/myDefault.png';
const loginUrl = baseUrl + 'gaoshou/api/loginApi.php'; 
const uploadUrl = baseUrl + 'gaoshou/api/uploadApi.php';
const publicationUrl = baseUrl + 'gaoshou/api/publicationApi.php'; 
const activityUrl = baseUrl + 'gaoshou/api/activityApi.php';
const activity_orderUrl = baseUrl + 'gaoshou/api/activity_orderApi.php';
const squareUrl = baseUrl + 'gaoshou/api/squareApi.php';
const searchUrl = baseUrl + 'gaoshou/api/searchApi.php';
const coreUrl = baseUrl + "gaoshou/core/";
const img = baseUrl + "gaoshou/images/";
const comment = baseUrl +'gaoshou/api/commentApi.php';
const payApi = baseUrl +'gaoshou/pay/GetSth.php'
const forum = baseUrl + 'gaoshou/api/forumApi.php';
const myUrl = baseUrl + 'gaoshou/api/myApi.php';
const integralUrl = baseUrl + 'gaoshou/api/integralApi.php';

// 对外接口
module.exports = {
  defaultImg: defaultImg,
  loginUrl: loginUrl,
  uploadUrl: uploadUrl,
  publicationUrl: publicationUrl,
  activityUrl: activityUrl,
  activity_orderUrl: activity_orderUrl,
  coreUrl: coreUrl,
  img: img,
  squareUrl: squareUrl,
  searchUrl: searchUrl,
  comment: comment,
  payApi: payApi,
  forum: forum,
  myUrl: myUrl,
  integralUrl: integralUrl,
}