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
    util.getReq("user", {}, function (res) {
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
    util.getReq("user/" + userId, {}, function (res) {
        console.info(res);
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    });
}


// 获取推荐的动态
function getRecommendDynamic({data, success, fail}) {
    util.getReq("dynamic/recommend", data, function (res) {
        console.info(res);
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    })
}

function likeDynamic({
                         dynamicId, success, fail
                     }) {
    util.req("dynamic/" + dynamicId + "/like", {}, function (res) {
        console.info(res);
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    });
}

function unlikeDynamic({
                           dynamicId, success, fail
                       }) {
    util.req("dynamic/" + dynamicId + "/unlike", {}, function (res) {
        console.info(res);
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    });
}

// 获取关注用户的动态
function getFollowDynamic({
                              data,
                              success,
                              fail
                          }) {
    util.getReq("dynamic/follow", data, function (res) {
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
                        }) {
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

function getMyDynamic({
                          success,
                          fail
                      }) {
    util.getReq("/user/dynamic", {}, res => {
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
                    }) {
    util.getReq("dynamic/" + id, {}, res => {
        console.info(res);
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    });
}

//关注
function attentOthers({
                          id,
                          formId,
                          success,
                          fail
                      }) {
    util.req("/user/follow", {userId: id, formId: formId}, res => {
        console.log(res);
        if (res.code == 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    })
}

/**
 * 取消关注
 */
function cancelAttentOthers({
                                id, formId, success, fail
                            }) {
    util.req("/user/unfollow", {userId: id, formId: formId}, res => {
        console.log(res);
        if (res.code == 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    })
}


//获取推荐的人
function getRecommend({success, fail}) {
    util.getReq('user/recommend', {}, res => {
        console.log(res);
        if (res.code == 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }

    });

}


function getConversion({success, fail}) {
    util.getReq('chat/conversion', {}, res => {
        console.log(res);
        if (res.code == 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    });
}

function getChatList({userId, success, fail}) {
    util.getReq(userId + '/chat', {}, res => {
        console.log(res);
        if (res.code == 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    });
}

function readChatMsg({userId, success, fail}) {
    util.req(userId + '/hasRead', {}, res => {
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
        year: 2020,
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
        year: 2020,
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

function getExam({success, fail}) {
    util.getReq("exam", {
        year: 2020,
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

function getUniAll({success, fail}) {
    util.getReq("school/uni/all", {
        year: 2020,
        term: 2
    }, res => {
        console.info(res);
        if (res.code === 200) {
            console.info("加载数据成功");
            console.info(res);
            // res.data = util.decrypt(res.data);
            // success && success(res);
        } else {
            fail && fail(res);
        }
    }, err => {

    }, true);
}

function getCardInfo({success, fail}) {
    util.getReq("school/uni/cardInfo", {}, res => {
        console.info(res);
        if (res.code === 200) {
            console.info("加载数据成功");
            console.info(res);
            success && success(res);
        } else {
            fail && fail(res);
        }
    }, err => {

    }, true);
}


/**
 * 得到粉丝信息
 */
function getUserFollower({success, fail}) {
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
function getUserFollow({success, fail}) {
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
function addTag({content, formId, success, fail}) {
    util.req("interest", {
        content: content,
        formId: formId
    }, function (res) {
        console.log(res);
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    })
}

function deleteTag({content, formId, success, fail}) {
    util.deleteReq("interest", {
        content: content,
        formId: formId
    }, res => {
        console.info(res);
        if (res.code === 200)
            success && success(res);
        else
            fail && fail(res);
    });
}

function addComment({id, formId, content, reply, replyUser, success}) {
    let data = {"content": content, formId: formId};
    if (reply && replyUser) {
        data["reply"] = reply;
        data["replyUser"] = replyUser;
    }
    util.req('/dynamic/' + id + '/comment', data, function (res) {
        console.info(res);
        if (res.code === 200)
            success && success(res);
        else
            fail && fail(res);
    });
}

function commitComment({
                           id,
                           success,
                           fail
                       }) {
    util.getReq("dynamic",
        {
            id: id,
            comment: comment
        }, res => {
            console.log(res);
            if (res.code === 200) {
                success && success(res)
            } else {
                fail && fail(res)
            }
        });

}

/**
 * 开学时间获取当前周获取
 */
function getOpenSchool({
                           success,
                           fail
                       }) {
    util.getReq("openSchool",
        {}, res => {
            console.log(res);
            if (res.code === 200) {
                success && success(res)
            } else {
                fail && fail(res)
            }
        });

}

/**
 * 获取用户的所有消息
 */
function getMessages({success, fail}) {
    util.getReq("user/message", {}, res => {
            console.log(res);
            if (res.code === 200) {
                success && success(res)
            } else {
                fail && fail(res)
            }
        });
}

function searchUser({param, seccess, fail}) {
    param = param + '';
    util.req("search/user", param, res => {
        console.log(res)
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }
    });
}

/**
 * 读取一条消息 传入消息的id
 */
function readMessage({msgId, success, fail}) {
    util.req("user/message/" + msgId + "/read", {}, res => {
        console.log(res);
    });
}

function readAllMessage({success, fail}) {
    util.req("user/message/allRead", {}, res => {
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }

    });
}

// 登陆教务系统
function loginJwxt({data, success, fail}) {
    util.req('user/verify', data, res => {
        console.log(res);
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }
    });
}

function delDynamic({id, success, fail}) {
    util.deleteReq("/dynamic/" + id, {}, res => {
        console.log(res);
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }
    });
}

function searchUser({params, formId, success, fail}) {
    util.getReq("search/user", {params: params, formId: formId}, res => {
        console.log(res);
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }
    });
}

/**
 * 向后台发送位置信息
 */
function punch({latitude, longitude, success, fail}) {
    util.req("/punch", {latitude: latitude, longitude: longitude}, res => {
        console.log(res);
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }
    });
}

/**
 * 获取别人的位置信息
 */
function punches({latitude, longitude, success, fail}) {
    util.getReq("/punches", {}, res => {
        console.log(res);
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }
    });
}

//获取拼车列表
function getCarpool({page, size, success, fail}) {
    let url = `/carpools/?page=${page}&size=${size}`;
    util.getReq(url, {}, res => {
        console.log('拼车信息')
        console.log(res)
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }
    });
}

function getMyappointment({success, fail}) {
    util.getReq('/my/appointments', {}, res => {
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }
    })
}

function getMycarpool({success, fail}) {
    util.getReq('my/carpools?page=1&size=10', {}, res => {
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }
    })
}

function bookCarpool({id, success, fail}) {
    util.req(`/carpool/${id}/appointment`, {id: id}, res => {
        console.log(res)
        if (res.code === 200) {
            success && success(res)
        } else {
            wx.showToast({
                title: res.msg,
            })
            fail && fail(res)
        }
    })
}

function cancelBookCarpool({id, success, fail}) {
    util.req('/cancel/carpool/' + id, {}, res => {
        console.log(res)
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }
    })
}

function getCarpoolDetail({id, success, fail}) {
    util.getReq('/carpool/' + id, {}, res => {
        console.log(res)
        if (res.code === 200) {
            success && success(res)
        } else {
            fail && fail(res)
        }
    })
}

function deleteMycarpool({id, success, fail}) {
    util.deleteReq(`carpool/${id}`, {}, res => {
        console.info(res);
        if (res.code === 200)
            success && success(res);
        else
            fail && fail(res);
    })
}

function newCarpool({context, success, fail}) {
    util.req('carpool', context, res => {
        console.info(res);
        if (res.code === 200)
            success && success(res);
        else
            fail && fail(res);
    })
}

function getActivities({success, fail}) {
    util.getReq("activities", {page: 1, size: 10}, res => {
        console.info(res);
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    });
}

function getDetailAct({id, success, fail}) {
    util.getReq("activity/" + id, {}, res => {
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    })
}

function signUpAct({id, success, fail}) {
    util.getReq(`activity/${id}join`, {}, res => {
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    })
}

function getBanner({success, fail}) {
    util.getReq(`banner`, {}, res => {
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    })
}

function recharge({num, success, fail}){
    util.req("school/uni/ykt/recharge", {num: num}, res => {
        console.info(res);
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    }, err => {

    }, true);
}

function libInfo({success, fail}){
    util.getReq("school/uni/libInfo", {}, res => {
        console.info(res);
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    }, err => {

    }, true);
}

function findBook({name, success, fail}){
    util.getReq("school/uni/lib/findBook", {
        name: name
    }, res => {
        console.info(res);
        if (res.code === 200) {
            success && success(res);
        } else {
            fail && fail(res);
        }
    }, err => {

    }, true);
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
    getTimeTable: getTimeTable,
    getExam: getExam,
    getGrade: getGrade,
    getRecommendDynamic: getRecommendDynamic,
    getDynamic: getDynamic,
    getFollowDynamic: getFollowDynamic,
    getTypeDynamic: getTypeDynamic,
    commitComment: commitComment,
    addComment: addComment,
    getRecommend: getRecommend,
    attentOthers: attentOthers,
    cancelAttentOthers: cancelAttentOthers,
    getUserFollower: getUserFollower,
    getUserFollow: getUserFollow,
    getOpenSchool: getOpenSchool,
    getMessages: getMessages,
    readMessage: readMessage,
    readAllMessage: readAllMessage,
    getMyDynamic: getMyDynamic,
    loginJwxt: loginJwxt,
    searchUser: searchUser,
    delDynamic: delDynamic,
    punch: punch,
    punches: punches,
    getCarpool: getCarpool,
    getMycarpool: getMycarpool,
    bookCarpool: bookCarpool,
    cancelBookCarpool: cancelBookCarpool,
    getMyappointment: getMyappointment,
    getCarpoolDetail: getCarpoolDetail,
    deleteMycarpool: deleteMycarpool,
    newCarpool: newCarpool,
    getActivities: getActivities,
    getDetailAct: getDetailAct,
    signUpAct: signUpAct,
    getBanner: getBanner,
    unlikeDynamic: unlikeDynamic,
    likeDynamic: likeDynamic,
    getConversion: getConversion,
    getChatList: getChatList,
    readChatMsg: readChatMsg,
    getUniAll: getUniAll,
    getCardInfo: getCardInfo,
    recharge: recharge,
    libInfo: libInfo,
    findBook: findBook
}