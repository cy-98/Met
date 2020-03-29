// pages/dynamic/index.js
var network = require("../../../utils/network.js");
// var util = require("../../../utils/util.js")
let app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        commentHidden: true,
        //评论内容
        comment: [],
        //随机颜色
        ranIndex: Math.floor(Math.random() * 5),
        bgColor: [
            'bg-gradual-orange', 'bg-gradual-blue', 'bg-gradual-red', 'bg-gradual-green', 'bg-gradual-pink'
        ],
        ColorList: app.globalData.ColorList,
        replyUser: null,
        cmtAt: '评论',
        dynamic: {},
        unshake: false,//防抖
    },
    //输入评论
    inputChange: function (e) {
        this.setData({
            comment: e.detail.value
        })
    },
    clickUser: function (e) {
        console.info(e);
        wx.navigateTo({
            url: '/pages/mine/user/info?id=' + e.currentTarget.dataset.user.id,
        })
    },
    //提交评论
    submitComment: function (e) {
        this.setData({
            unshake: true
        });
        if (!this.data.comment || this.data.comment == "") {
            wx.showToast({
                title: '内容不能为空',
            });
            this.setData({
                unshake: false
            });
            return;
        }
        console.log(this.data.replyUser)
        let formId = e.detail.formId;
        let that = this;
        let req_data = {
            content: that.data.comment,
        }
        //评论回复其他买家，否则认为回复卖家
        if (this.data.replyUser != null) {
            let cuuser = that.data.replyUser;
            let cuId = that.data.replyUser.id;
            let cuName = that.data.replyUser.nickname;
            req_data["reply"] = 1;
            req_data["replyUser"] = cuId;
        }
        wx.showLoading({
            title: '评论中....',
        });
        network.addFormId({formId});
        network.addComment({
            id: that.data.dynamic.id,
            content: req_data["content"],
            reply: req_data["reply"],
            replyUser: req_data["replyUser"],
            success: (res) => {
                wx.hideLoading();
                console.log(that.data.dynamic.comments);
                let reply = 0,
                    replyUser = null;
                console.log(this.data.reply)
                if (this.data.reply == 1) {
                    console.log(this.data.reply)
                    reply = this.data.reply
                    replyUser = this.data.replyUser
                }
                let user = {
                    avatar: this.data.userInfo.avatar,
                    nickname: this.data.userInfo.nickname,
                }
                if (this.data.reply == 1) {
                    reply = this.data.reply;
                    replyUser = this.data.replyUser;
                }
                let comment = {
                    content: req_data.content,
                    user: user,
                    createTime: new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''),
                    reply: reply,
                    replyUser: replyUser
                }
                let dynamic = that.data.dynamic;
                console.log(dynamic)
                if (!dynamic.comments) {
                    dynamic.comments = [];
                }
                dynamic.comments.push(comment);
                that.setData({
                    dynamic: dynamic,
                    comment: "",
                    cmtAt: "评论",
                    replyUser: null,
                    unshake: false
                });

            }
        });

    },
    // 回复
    commentAt: function (e) {
        console.log(e)
        let user = e.currentTarget.dataset.user;
        this.setData({
            replyUser: user,
            reply: 1,
            cmtAt: '@' + user.nickname,
        })
        console.log(this.data.replyUser.name)
    },
    //点赞
    clickGood: function () {
        let dynamic = this.data.dynamic;
        if (dynamic.like) {
            network.unlikeDynamic({
                dynamicId: dynamic.id, success: res => {
                    wx.showToast({
                        title: '取消点赞',
                        icon: 'none'
                    });
                }
            })

        } else {

            network.likeDynamic({
                dynamicId: dynamic.id, success: res => {
                    wx.showToast({
                        title: '点赞成功',
                        icon: 'none'
                    });
                }
            })


        }
        dynamic.like = !dynamic.like;
        this.setData({
            dynamic: dynamic
        })
    },
    clickImages: function (e) {
        console.info(e);
        wx.previewImage({
            current: e.currentTarget.dataset.current,
            urls: e.currentTarget.dataset.all,
        })
    },
    delDynamic: function () {
        wx.showModal({
            title: '确定要删除吗',
            content: '删除不可撤销',
            success: res => {
                if (res.confirm) {
                    console.log('用户点击确定');
                    network.delDynamic({
                        id: this.data.dynamic.id,
                        success: res => {
                            wx.reLaunch({
                                url: '/pages/dynamic/list/list',
                            });
                        }
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        });


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中....',
        });
        let userInfo;
        wx.getStorage({
            key: 'userInfo',
            success: (res) => {
                userInfo = res.data;
                this.setData({
                    userInfo: userInfo
                })
                console.log(this.data.userInfo.avatar)
            },
            fail: (res) => {
                console.log(res)
            }
        })
        network.getDynamic({
            id: options.id,
            success: res => {
                wx.hideLoading();
                res.data.createTime = res.data.createTime.replace(/T/g, ' ').substr(0, 19);
                if (res.data.comments) {
                    res.data.comments.forEach(item => {
                        item.createTime = item.createTime.replace(/T/g, ' ').substr(0, 19);
                    });
                }
                this.setData({
                    dynamic: res.data
                })
            }
        });

    },
    onShareAppMessage() {

        return {
            title: '转发',
            path: '/pages/dynamic/index/index?id=' + this.data.dynamic.id,
            success: function (res) {
            }
        }
    }

})
