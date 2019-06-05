let util = require("util.js");
//updateUserInfo getUserInfo 是设置界面的个人信息获取和保存
function updateUserInfo({userInfo, success, fail}){
  util.req("user", userInfo, res => {
    if(res.code === 200){
      wx.setStorageSync("userInfo", userInfo);      
      success && success(res);
    }
    else
      fail && fail(res);
  });
}
function getUserInfo({success}){
  util.getReq("user",{},function(res){
    wx.setStorageSync("userInfo", res.data);
    success && success(res);
  });
}

//添加兴趣标签
function addTag ({content,success,fail}){
  util.req("interest",{content:content},function(res){
    console.log(res);
    if(res.code === 200){
      success && success(res);
    }else{
      fail && fail(res);
    }
  })
}



module.exports = {
  updateUserInfo:updateUserInfo,
  getUserInfo:getUserInfo,
  addTag:addTag
}