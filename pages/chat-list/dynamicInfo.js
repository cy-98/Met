// pages/chat-list/dynamicInfo.js
const network = require('../../utils/network.js');
import bus from "../../utils/bus"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        contents: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        bus.emit('clearNotice');
        network.getMessages({
            success: (res) => {
                res.data.forEach(item => {
                    item.createTime = item.createTime.replace('T', ' ').substr(0, 16);
                });
                this.setData({
                    contents: res.data
                })
            },
            fail: (res) => {
                console.log(res);
            }
        });
        this.cleanAllMessage();


    },
    intoDynamic: (e) => {
        network.readMessage({
            msgId: e.currentTarget.dataset.id,
            success: (res) => {
                console.log(res)
            },
            fail: (res) => {
                console.log(res)
            }
        })
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url,
        })
    },
    back: () => {
        wx.redirectTo({
            url: 'pages/chat-list/chat-list',
        })
    },
    cleanAllMessage: function () {
        wx.showLoading({
            title: '清除消息中....',
        });
        network.readAllMessage({
            success: res => {
                wx.hideLoading();
                network.getMessages({
                    success: (res) => {
                        res.data.forEach(item => {
                            item.createTime = item.createTime.replace('T', ' ').substr(0, 16);
                        })
                        this.setData({
                            contents: res.data
                        })
                    },
                    fail: (res) => {
                        console.log(res);
                    }
                });
            }
        })
    },



})