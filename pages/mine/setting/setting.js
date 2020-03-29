let utils = require("../../../utils/util.js");
let network = require("../../../utils/network.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatar: "",
        nickname: "",
        gender: "",
        birthday: "",
        love: "",
        profile: "",
        school: "",
        major: "",
        phone: ""
    },
    changeTel: function (e) {
        let phone = e.detail.value;
        this.setData({
            phone: phone
        })
    },
    changename: function (e) {
        let nickname = e.detail.value;
        this.setData({
            nickname: nickname
        })
    },
    //更改生日
    dateChange: function (e) {
        console.log(e)
        this.setData({
            birthday: e.detail.value
        })
    },
    //更改签名
    changeprofile: function (e) {
        this.setData({
            profile: e.detail.value
        })
    },
    nav: function (e) {
        wx.reLaunch({
            url: e.currentTarget.dataset.url
        })
    },
    // 提交 监测
    submit: function () {
        if (!(/^1[3456789]\d{9}$/.test(this.data.phone))) {
            wx.showToast({
                title: '请输入电话号码',
            })
            return
        }
        if (!this.data.nickname) {
            wx.showToast({
                title: '请输入昵称'
            })
            return
        }
        wx.showLoading({
            title: '修改中....',
        });
        if (!this.data.profile) {
            this.setData({
                profile: '这个人很懒'
            });
        }
        ;
        let data = {
            avatar: this.data.avatar,
            nickname: this.data.nickname,
            birthday: this.data.birthday,
            love: this.data.love,
            profile: this.data.profile,
            phone: this.data.phone
        }
        //post
        network.updateUserInfo({
            userInfo: data, success: res => {
                wx.hideLoading();
                wx.setStorageSync("userInfo", res.data);
                wx.switchTab({
                    url: '/pages/mine/index',
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    //获取
    onLoad:
        function (options) {
            network.getUserInfo({
                success: function () {
                    console.log("网络获取储存到本地")
                }
            });
            let userInfo = wx.getStorageSync("userInfo");
            console.log(userInfo)
            if (userInfo) {
                this.setData({
                    avatar: userInfo.avatar,
                    nickname: userInfo.nickname,
                    gender: userInfo.gender,
                    birthday: userInfo.birthday.split("T")[0],
                    love: userInfo.love,
                    profile: userInfo.profile,
                    school: userInfo.school,
                    major: userInfo.major,
                    phone: userInfo.phone
                })
            }

        },
    loveChange: function (e) {
        console.info(e);
        this.setData({
            love: e.detail.value
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    DateChange(e) {
        this.setData({
            date: e.detail.value
        })
    }
})
