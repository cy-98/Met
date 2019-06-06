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
// 获取别人的信息
function getOtherInfo({userId, success, fail}){
  util.getReq("user/" + userId, {}, function(res){
    console.info(res);
    if(res.code === 200){
      success && success(res);
    }else{
      fail && fail(res);
    }
  });
}
// 获取推荐的动态
function getRecommendDynamic({success, fail}){
  util.getReq("dynamic/recommend", {}, function(res){
    console.info(res);
    if(res.code === 200){
      success && success(res);
    }else{
      fail && fail(res);
    }
  })
}
// 获取关注用户的动态
function getFollowDynamic({success, fail}){
  util.getReq("dynamic/follow", {}, function(res){
    console.info(res);
    if(res.code === 200){
      success && success(res);
    }else{
      fail && fail(res);
    }
  })
}
// 更新问题
function updateQuestion({data, success, fail}){
  util.req("question", data, res => {
    console.info(res);
    if(res.code == 200){
      success && success(res);
    }else{
      fail && fail(res);
    }
  })
}

function getMyQuestion({success, fail}){
  util.getReq("question", {}, res => {
    console.info(res);
    if(res.code === 200){
      success && success(res);
    }else{
      fail && fail(res);
    }
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

function deleteTag({content, success, fail}){
  util.deleteReq("interest", {content:content}, res => {
    console.info(res);
    if(res.code === 200)
      success && success(res);
    else
      fail && fail(res);
  });
}

//获取兴趣标签
function getTag(){
  
}



module.exports = {
  updateUserInfo:updateUserInfo,
  getUserInfo:getUserInfo,
  addTag:addTag,
  deleteTag:deleteTag,
  getOtherInfo:getOtherInfo,
  updateQuestion:updateQuestion,
  getMyQuestion:getMyQuestion
}