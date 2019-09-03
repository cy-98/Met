// pages/mine/user/slefDynamic.js

var network = require("../../../utils/network.js");
import dynamic from '../../../modules/dynamic/dynamic.js';
Page({

    /**
     * 页面的初始数据
     */
  data: {
    dynamics: [],
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


    // 获取相关数据
    network.getOtherDynamic({
      userId:wx.getStorageSync("userInfo").id, success: res => {
        console.log(res)
        res.data.data.forEach(item => {
          item.nickname = item.user.nickname,
            item.avatar = item.user.avatar,
            item.commentNum = item.comments.length,
            item.good = item.liker.length,
            item.watch = (new Date().getTime()) % 100;
            item.anonymous = item.anonymous;
            if (item.anonymous === 1) {
              item.nickname = item.annonyUser.nickname;
              item.avatar = item.annonyUser.avatar;
            }
        })
        this.setData({
          dynamics: res.data.data
        })
      }
    });




  },

  clickContent(e){
    dynamic.clickContent(e);
    // console.info(e);
    // wx.navigateTo({
    //   url: '/pages/dynamic/index/index?id=' + e.currentTarget.dataset.item.id,
    // })
  },
  clickAvatar: function (e) {
    // console.info(e);
    // console.info("avatar");
    dynamic.clickAvatar(e);
  },
  clickImages: function (e) {
    dynamic.clickImages(e);
  },

  swiperchange: function (e) {
    var that = this
    console.log(e.detail.current)
    that.setData({
      TabCur: e.detail.current
    })
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