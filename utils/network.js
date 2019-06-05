let util = require("util.js");

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



module.exports = {
  updateUserInfo:updateUserInfo
}