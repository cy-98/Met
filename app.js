//app.js
import AppIMDelegate from "./delegate/app-im-delegate";

let network = require("./utils/network");

var utils = require('./utils/util.js');
import bus from './utils/bus'

App({
    globalData: {
        userInfo: {},
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        conversations: [],
        messges: [],
        ColorList: [
            {
                title: '嫣红',
                name: 'red',
                color: '#e54d42'
            },
            {
                title: '桔橙',
                name: 'orange',
                color: '#f37b1d'
            },
            {
                title: '明黄',
                name: 'yellow',
                color: '#fbbd08'
            },
            {
                title: '橄榄',
                name: 'olive',
                color: '#8dc63f'
            },
            {
                title: '森绿',
                name: 'green',
                color: '#39b54a'
            },
            {
                title: '天青',
                name: 'cyan',
                color: '#1cbbb4'
            },
            {
                title: '海蓝',
                name: 'blue',
                color: '#0081ff'
            },
            {
                title: '姹紫',
                name: 'purple',
                color: '#6739b6'
            },
            {
                title: '木槿',
                name: 'mauve',
                color: '#9c26b0'
            },
            {
                title: '桃粉',
                name: 'pink',
                color: '#e03997'
            },
            {
                title: '棕褐',
                name: 'brown',
                color: '#a5673f'
            },
            {
                title: '玄灰',
                name: 'grey',
                color: '#8799a3'
            },
            {
                title: '草灰',
                name: 'gray',
                color: '#aaaaaa'
            },
            {
                title: '墨黑',
                name: 'black',
                color: '#333333'
            },
            {
                title: '雅白',
                name: 'white',
                color: '#ffffff'
            },
        ],
        cos: null
    },
    getIMHandler() {
        return this.appIMDelegate.getIMHandlerDelegate();
    },
    onLaunch(options) {
        console.log(this.userInfo);


        let that = this;
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: utils.rootUrl + 'login?code=' + res.code,
                    success: function (data) {
                        console.log(data);
                        if (data.data['code'] === 400) {
                            wx.showToast({
                                title: 'token请求失败',
                            });
                        } else if (data.data['code'] === 200) {
                            wx.setStorageSync('token', data.data['data']);
                            console.info("存储token成功");

                        }
                    },
                    fail: function () {

                    }
                })
            }
        });

        let userInfo = wx.getStorageSync("userInfo") || false;
        console.info(userInfo);
        if (!userInfo) {
            console.info(userInfo);
            wx.reLaunch({
                url: '/pages/auth/auth',
                success: function () {
                    console.info("success")
                },
                fail: function () {
                    console.info("fail")
                },
                complete: function () {
                    console.info()
                }
            });

        }

        // 获取消息列表
        this.getConversation();


        // 监听消息
        bus.on('ReceiveMsg', (msg) => {
            console.info("在App获取消息");
            console.info(msg);
            let hasCon = false;
            this.globalData.conversations.forEach(con => {
                // if ()
                if (con.user.id == msg.srcId){
                    // con.last
                    con.lastRecord = msg;
                    hasCon = true;
                }
            });

            if (!hasCon){
                this.getConversation();
            }

            
        });

        bus.on('ReadMsg', (msg) => {
            console.info('已读消息');
            this.globalData.conversations.forEach(con => {
                // if ()
                if (con.user.id == msg.srcId){
                    // con.last
                    this.globalData.unreadMsgNum -= con.unread;
                    con.unread = 0;
                    this.updateBadge();
                }
            })
        });

        bus.on('clearNotice', () => {
            // 已经读取了所有通知 现在开始清除
            console.info("已经读取了所有通知 现在开始清除");
            this.globalData.notification.forEach(item => {
                item.hasRead = true;
            });
            this.globalData.unreadNoticeNum = 0;
            this.updateBadge();
        });

        this.appIMDelegate = new AppIMDelegate(this);
        this.appIMDelegate.onLaunch(options);

        wx.getSystemInfo({
            success: e => {
                this.globalData.StatusBar = e.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.Custom = custom;
                this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
                this.globalData.navHeight = e.statusBarHeight;
            }
        });
    },

    updateBadge: function(){
        let tmp = this.globalData.unreadMsgNum + this.globalData.unreadNoticeNum;
        console.info("当前的badge为" + tmp);
        if (tmp > 0) {
            wx.setTabBarBadge({
                index: 2,
                text: '' + (tmp),
            })
        }else{
            wx.removeTabBarBadge({
                index: 2
            })
        }
    },

    getConversation: function () {
        network.getConversion({
            success: res => {
                let unread = 0;
                res.data.conversations.forEach(item => {
                    unread += item.unread;
                });
                this.globalData.unreadMsgNum = unread;
                res.data.notification.forEach(item => {
                    if (!item.hasRead) {
                        unread++;
                    }
                });
                this.globalData.unreadNoticeNum = unread - this.globalData.unreadMsgNum;
                console.info(res);
                this.globalData.conversations = res.data.conversations;
                this.globalData.notification = res.data.notification;
                this.globalData.allUnreadNum = unread;
                this.globalData.lastNotice = res.data.notification[0];
                // 判断当前是否需要设置badge
                if (unread > 0) {
                    wx.setTabBarBadge({
                        index: 2,
                        text: '' + (unread),
                    })
                }
            }
        })
    },

    onHide() {
        this.appIMDelegate.onHide();
    },
    onShow(options) {
        this.appIMDelegate.onShow(options);

        //初始获取定位权限
        wx.authorize({
            scope: 'scope.userLocation',
            success: (res) => {
                console.log(res)
            },
        })
    },
    checkUser() {
        let userInfo = wx.getStorageSync("userInfo") || false;
        console.info(userInfo);
        if (!userInfo) {
            console.info(userInfo);
            wx.reLaunch({
                url: '/pages/auth/auth',
                success: function () {
                    console.info("success")
                },
                fail: function () {
                    console.info("fail")
                },
                complete: function () {
                    console.info()
                }
            });
        }
    },
    checkUserStuId() {
        let userInfo = wx.getStorageSync("userInfo") || false;
        console.info(userInfo);
        if (!userInfo || !userInfo.stuId) {
            console.info(userInfo);
            wx.reLaunch({
                url: '/pages/auth/auth',
                success: function () {
                    console.info("success")
                },
                fail: function () {
                    console.info("fail")
                },
                complete: function () {
                    console.info()
                }
            });
        }
    }
});