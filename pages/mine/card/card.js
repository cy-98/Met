// pages/mine/card/card.js
let network = require("../../../utils/network");
let utils = require("../../../utils/util");
Page({
    refresh: function (event) {
        console.info("刷新余额");
        wx.showToast({
            title: '刷新余额中...'
        });
        this.getData();

    },

    customInput: function (event) {
        console.info(event);
        this.setData({
            customNum: event.detail.value
        })
    },

    formSubmit: function (event) {
        console.info(event);
        wx.showLoading({
            title: '正在充值'
        });
        let tmp = {
            0: 20,
            1: 50,
            2: 100,
            3: this.data.customNum
        };
        let num = tmp[this.data.customType];
        if (num === 0) {
            wx.showToast({
                title: '数额不能为空',
                icon: 'none'
            });
            return;
        }
        console.info("开始充值");
        network.recharge({
            num: num * 100, success: res => {
                wx.hideLoading();
                console.info("充值数据加载成功:{}", res);
                let tmp = JSON.parse(res.data);
                if (tmp.IsSucceed) {
                    let balance = num * 100 + this.data.balance;
                    this.setData({
                        balance
                    });
                    let orders = this.data.orders;
                    orders.unshift({
                        MERCNAME: "银行转账",
                        TRANAMT: num,
                        OCCTIME: utils.formatTime(new Date())
                    });
                    this.setData({
                        orders
                    });
                    wx.showToast({
                        title: "充值成功"
                    })
                }else {
                    wx.showToast({
                        title: "充值失败",
                        icon: 'none'
                    })
                }
            }
        })
    },


    /**
     * 页面的初始数据
     */
    data: {
        customNum: 0,
        customType: 0,
        balance: 0,
        orders: []
    },

    selectNum: function (e) {
        console.info(e);
        this.setData({
            customType: e.currentTarget.dataset.type
        })
    },

    getData: function () {
        network.getCardInfo({
            success: res => {
                console.info(res);
                console.info("一卡通页面数据获取");
                let balance = JSON.parse(res.data.balance);
                console.info(balance);
                // 处理余额
                if (!balance.IsSucceed) {
                    let msg = JSON.parse(balance.Msg);
                    let card = msg.query_card.card[0];
                    console.info(card);
                    this.setData({
                        balance: parseInt(card.db_balance) + parseInt(card.unsettle_amount)
                    })
                }
                let orders = JSON.parse(res.data.orders);
                if (!orders.issucceed) {
                    this.setData({
                        orders: orders.rows
                    })
                }
                wx.setStorageSync("cardInfo", res.data);

                wx.hideLoading();

            }
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '数据正在刷新'
        });
        let cardInfo = wx.getStorageSync("cardInfo") || null;
        if (cardInfo) {
            let balance = JSON.parse(cardInfo.balance);
            console.info(balance);
            // 处理余额
            if (!balance.IsSucceed) {
                let msg = JSON.parse(balance.Msg);
                let card = msg.query_card.card[0];
                console.info(card);
                this.setData({
                    balance: parseInt(card.db_balance) + parseInt(card.unsettle_amount)
                })
            }
            let orders = JSON.parse(cardInfo.orders);
            if (!orders.issucceed) {
                this.setData({
                    orders: orders.rows
                })
            }
        }
        this.getData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})