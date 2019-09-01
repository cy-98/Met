let util = require("util.js");
//updateUserInfo getUserInfo 是设置界面的个人信息获取和保存
function updateUserInfo({
  userInfo,
  success,
  fail
}) {
  util.req("user", userInfo, res => {
    if (res.code === 200) {
      wx.setStorageSync("userInfo", userInfo);
      success && success(res);
    } else
      fail && fail(res);
  });
}

function getUserInfo({
  success
}) {
  util.getReq("user", {}, function(res) {
    wx.setStorageSync("userInfo", res.data);
    success && success(res);
  });
}
// 获取别人的信息
function getOtherInfo({
  userId,
  success,
  fail
}) {
  util.getReq("user/" + userId, {}, function(res) {
    console.info(res);
    if (res.code === 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  });
}



// 获取推荐的动态
function getRecommendDynamic({data,success,fail}) {
  util.getReq("dynamic/recommend", data, function(res) {
    console.info(res);
    if (res.code === 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  })
}
// 获取关注用户的动态
function getFollowDynamic({
  data,
  success,
  fail
}) {
  util.getReq("dynamic/follow", data, function(res) {
    console.info(res);
    if (res.code === 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  })
}

function getTypeDynamic({
  type,
  data,
  success,
  fail
}){
  util.getReq("dynamic/type/" + type, data, function (res) {
    console.info(res);
    if (res.code === 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  })
}

function getOtherDynamic({
  userId,
  success,
  fail
}) {
  util.getReq("user/" + userId + "/dynamic", {}, res => {
    console.info(res);
    if (res.code === 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  });
}

function getDynamic({
  id,
  success,
  fail
}){
  util.getReq("dynamic/" + id, {}, res => {
    console.info(res);
    if (res.code === 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  });
}
//关注推荐的人
function attentOthers({
  id,
  success,
  fail
}){
  util.req("/user/follow", {userId:id}, res => {
    console.log(res);
    if (res.code == 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  })
}
//获取推荐的人
function getRecommend({success,fail}){
  util.getReq('user/recommend',{},res=>{
    console.log(res);
    if (res.code == 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
 
  });

}


// 更新问题
function updateQuestion({
  data,
  success,
  fail
}) {
  util.req("question", data, res => {
    console.info(res);
    if (res.code == 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  })
}

function getMyQuestion({
  success,
  fail
}) {
  util.getReq("question", {}, res => {
    console.info(res);
    if (res.code === 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  });
}
function getOtherQuestion({
  userId,
  success,
  fail
}) {
  util.getReq("/user/" + userId + "/question", {}, res => {
    console.info(res);
    if (res.code === 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  });
}
function getTimeTable({
  success,
  fail
}) {
  util.getReq("timetable", {
    year: 2018,
    term: 2
  }, res => {
    console.info(res);
    if (res.code === 200) {
      wx.setStorageSync("timetable", res.data);
      success && success(res);
    } else {
      fail && fail(res);
    }
  });
}

function getGrade({
  success,
  fail
}) {
  util.getReq("grade", {
    year: 2018,
    term: 2
  }, res => {
    console.info(res);
    if (res.code === 200) {
      wx.setStorageSync("grade", res.data);
      success && success(res);
    } else {
      fail && fail(res);
    }
  });
}

function getExam({
  success,
  fail
}) {
  util.getReq("exam", {
    year: 2018,
    term: 2
  }, res => {
    console.info(res);
    if (res.code === 200) {
      wx.setStorageSync("exam", res.data);
      success && success(res);
    } else {
      fail && fail(res);
    }
  });
}



/**
 * 得到粉丝信息
 */
function getUserFollower({
  success,fail
}){
  util.getReq("/user/follower", {}, res => {
    console.info(res);
    if (res.code === 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  });
}

/**
 *  获取自己的关注信息
 */
function getUserFollow({
  success, fail
}) {
  util.getReq("/user/follow", {}, res => {
    console.info(res);
    if (res.code === 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  });
}






//添加兴趣标签
function addTag({
  content,
  success,
  fail
}) {
  util.req("interest", {
    content: content
  }, function(res) {
    console.log(res);
    if (res.code === 200) {
      success && success(res);
    } else {
      fail && fail(res);
    }
  })
}

function deleteTag({
  content,
  success,
  fail
}) {
  util.deleteReq("interest", {
    content: content
  }, res => {
    console.info(res);
    if (res.code === 200)
      success && success(res);
    else
      fail && fail(res);
  });
}
function addComment({id, content, reply, replyUser, success}){
  let data = {"content":content};
  if(reply && replyUser){
    data["reply"] = reply;
    data["replyUser"] = replyUser;
  }
  util.req('/dynamic/'+id+'/comment',data, function (res) {
    console.info(res);
    if (res.code === 200)
      success && success(res);
    else
      fail && fail(res);
  });
}
function commitComment ({
  id,
  success,
  fail
}){
  util.getReq("dynamic",
  {id:id,
   comment:comment},res=>{
     console.log(res);
     if(res.code === 200 ){
       success && success(res)
     }else{
       fail && fail(res)
     }
   });

}

//获取兴趣标签
function getTag() {

}



module.exports = {
  updateUserInfo: updateUserInfo,
  getUserInfo: getUserInfo,
  addTag: addTag,
  deleteTag: deleteTag,
  getOtherInfo: getOtherInfo,
  updateQuestion: updateQuestion,
  getMyQuestion: getMyQuestion,
  getOtherQuestion: getOtherQuestion,
  getOtherDynamic: getOtherDynamic,
  getTimeTable:getTimeTable,
  getExam:getExam,
  getGrade:getGrade,
  getRecommendDynamic:getRecommendDynamic,
  getDynamic: getDynamic,
  getFollowDynamic: getFollowDynamic,
  getTypeDynamic: getTypeDynamic,
  commitComment:commitComment,
  addComment:addComment,
  getRecommend:getRecommend,
  attentOthers:attentOthers,
  getUserFollower: getUserFollower

}