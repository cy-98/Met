// pages/mine/index.js
let utils = require("../../utils/util.js");
let network = require("../../utils/network.js")
let app = getApp()
Page({
  //TODO:  改变我的页面上部头像大小变化
  /**
   * 页面的初始数据
   */
  data: {
    person: {
      school: "",
      major: "",
      name:"",
      avatar:"/images/logo.png",
      attention:"",
      fans:""
    }
  },
  sethoby:function(){
    wx.navigateTo({
      url: '/pages/mine/setting/sethoby/sethoby',
    })
  },
  feedback:function(){
    wx.navigateTo({
      url: '/pages/mine/feedback/feedback',
    })
  },
  toActivity:function(){
    wx.navigateTo({
      url: '/pages/mine/activity/activity',
    })
  },
  identify:function(){
    wx.navigateTo({
      url: '/pages/mine/jwxt/jwxt',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取问题

    //获取别人的信息
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      person:{
        school:userInfo.school,
        major:userInfo.major,
        name:userInfo.name,
        avatar:userInfo.avatar
      }
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
    getApp().checkUser();
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