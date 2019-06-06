// pages/index/timetable/timetable.js
let network = require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timetables:[],
    colorArrays: ["#55efc4", "#81ecec", "#55efc4", "#fd79a8", "#74b9ff", "#55efc4", "#81ecec", "#fd79a8"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let timetable = wx.getStorageSync("timetable") || null;
    if(!timetable){
      network.getTimeTable({success: res => {
        this.setData({
          timetables:res.data
        })
      }})
    }else{
      this.setData({timetables:timetable});
    }
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