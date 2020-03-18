// pages/chat-list/chat-list.js
import {
    dealChatTime, msgShowTime
} from "../../utils/time";

const network = require('../../utils/network.js');
import bus from '../../utils/bus.js';

/**
 * 会话列表页面
 */
Page({
    /**
     * 页面的初始数据
     */
    data: {
        conversations: [],
        contents: [],
        unReadNotice: 0,
        totalUnread: 0,
        unReadMsg: 0,
        scrollWidth: 0,
        scrollLeftWidth: 0,
        windowWidth: 0,
        recommend: [],
        lastNotice: null
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        bus.on('ReceiveMsg', (msg) => {
            console.info("在消息列表页获取消息");
            console.info(msg);
        });

        //获取推荐的人
        network.getRecommend({
            success: (res) => {
                let recommend = res.data.data;
                recommend.forEach(item => {
                    item.focus = false;
                });
                var scrollWidth = wx.getSystemInfoSync().windowWidth;
                this.setData({
                    recommend: recommend,
                    scrollWidth: scrollWidth / 5 * (recommend.length + 1),
                    windowWidth: scrollWidth
                })
                console.log(this.data.recommend)

            },
            fail: (res) => {
                console.log(res)
            }
        });




        this.getScrollWidth();

    },



    getScrollWidth: function () {
        var scrollWidth = wx.getSystemInfoSync().windowWidth;
        this.setData({
            scrollWidth: scrollWidth / 5 * 1,
            windowWidth: scrollWidth
        })
    },
    scrollleft: function (e) {
        console.log(e);
    },
    lowerRight: function (e) {
        console.log(e);
    },

    toChat(e) {
        let item = e.currentTarget.dataset.item;
        delete item.latestMsg;
        delete item.unread;
        delete item.content;
        wx.navigateTo({
            url: `../chat/chat?friend=${JSON.stringify(item)}`
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    // 这个是消息回调接口 当前是消息列表 如果获取消息 会进行一系列的操作
    onShow() {
        // getApp().checkUser();
        const  app = getApp();
        // app.checkUserStuId();

        this.setData({
            conversations: app.globalData.conversations,
            unReadMsg: app.globalData.unreadMsgNum,
            unReadNotice: app.globalData.unreadNoticeNum,
            lastNotice: app.globalData.lastNotice,
            contents: app.globalData.notification
        })

    },

    clickUser: function (e) {
        console.info(e);
        wx.navigateTo({
            url: '/pages/mine/user/info?id=' + e.currentTarget.dataset.userid,
            success: function (res) {
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        })
    },

    friendsClick: () => {
        wx.navigateTo({
            url: '/pages/friends/friends',
        });
    },
    infoClick: () => {
        wx.navigateTo({
            url: '/pages/chat-list/dynamicInfo',
        });
    },
    conversationClick: function (res) {
        console.info(res);
        let con = res.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/chat/chat?userId=' + con.user.id,
        })
    }
});