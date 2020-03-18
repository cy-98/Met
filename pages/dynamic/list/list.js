// pages/dynamic/list.js
var network = require("../../../utils/network.js");
import dynamic from '../../../modules/dynamic/dynamic.js';

let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        TabCur: 0,
        scrollLeft: 0,
        page: 1,
        totalPage: 1000,
        // pages:[1,1,1,1],
        dynamics: [],
        // followDynamic:[],
        // expressDynamic:[],
        // talkDynamic:[],
        // secondDynamic:[],
        //滚动页面位置
        loading: false,
        scroll: 0,
        readyRefresh: false,
        clientX: 0,
        clientY: 0,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        scrollWidth: 0,
        scrollLeftWidth: 0,
        windowWidth: 0,
        recommend: []
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
        });

    },
    onShow: function(options){
        getApp().updateBadge();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    clientHeight: res.windowHeight
                });
            }
        });
        wx.showLoading({
            title: '加载中....',
        });
        // this.getFollowDynamic(1,10);
        this.getRecommendDynamic(1, 5);
        // this.getTypeDynamic(0,1,10);
        // this.getTypeDynamic(1,1,10);
        // this.getTypeDynamic(2, 1, 10);


        this.getScrollWidth();


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
        })

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


    checkCor: function () {
        if (this.data.TabCur > 3) {
            this.setData({
                scrollLeft: 300
            })
        } else {
            this.setData({
                scrollLeft: 0
            })
        }
    },
    swiperchange: function (e) {
        var that = this
        console.log(e.detail.current)
        that.setData({
            TabCur: e.detail.current
        });
        this.checkCor();
    },
    addDynamic: function () {
        console.info("add dynamic");
        wx.navigateTo({
            url: '/pages/dynamic/add/add',
        })
    },
    clickContent(e) {
        dynamic.clickContent(e);
    },
    clickAvatar: function (e) {
        dynamic.clickAvatar(e);
    },
    clickImages: function (e) {
        dynamic.clickImages(e);
    },
    clickGood: function (e) {
        let item = e.currentTarget.dataset.item;
        let idx = e.currentTarget.dataset.idx;
        if (item.like) {
            network.unlikeDynamic({
                dynamicId: item.id, success: res => {
                    wx.showToast({
                        title: '取消点赞',
                        icon: 'none'
                    });
                }
            })

        } else {

            network.likeDynamic({
                dynamicId: item.id, success: res => {
                    wx.showToast({
                        title: '点赞成功',
                        icon: 'none'
                    });
                }
            })


        }
        item.like = !item.like;
        let dynamics = this.data.dynamics;
        dynamics.splice(idx, 1, item);
        this.setData({
            dynamics: dynamics
        })
        dynamic.clickGood(e);
    },
    getRecommendDynamic: function (page, size) {
        // 获取相关数据
        this.setData({
            loading: true
        })
        network.getRecommendDynamic({
            data: {page: page, size: size}, success: res => {
                wx.hideLoading();

                res.data.data.forEach(item => {
                    item.nickname = item.user.nickname,
                        item.avatar = item.user.avatar
                    item.commentNum = item.comments.length,
                        item.good = item.liker.length,
                        item.createTime = item.createTime.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                    item.anonymous = item.anonymous;
                    if (item.anonymous === 1) {
                        item.nickname = item.annonyUser.nickname;
                        item.avatar = item.annonyUser.avatar;
                    }
                });
                if (page === 1) {
                    this.setData({
                        dynamics: res.data.data,
                        loading: false,
                        totalPage: res.data.totalPage
                    });
                    return
                }
                let dynamics = this.data.dynamics || [];
                this.setData({
                    dynamics: dynamics.concat(res.data.data),
                    loading: false,
                    totalPage: res.data.totalPage
                });

            }
        });
    },

    //监听用户下拉动作
    onPullDownRefresh: function () {
        if (this.data.loading) return;
        console.log('刷新');
        // 标题栏显示刷新图标，转圈圈
        wx.showNavigationBarLoading();
        this.getRecommendDynamic(1, 5);
        wx.stopPullDownRefresh();

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let pages = this.data.page + 1;
        console.info(pages);
        if (this.data.loading || this.data.totalPage <= pages) return;
        console.info("通过校验了");
        // let curr = this.data.TabCur;
        wx.showLoading({
            title: '加载中....',
        });
        this.getRecommendDynamic(pages, 5);
        this.setData({
            pages: pages
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

        return {
            title: '转发',
            path: '/pages/dynamic/list/list',
            success: function (res) {
            }
        }
    }
})