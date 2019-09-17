// pages/index/exam/exam.js
var network = require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exams:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let exams = wx.getStorageSync("exams") || null;
    if(!exams){
      network.getExam({success: res => {
        res.data.forEach(item => {
          let openDate = new Date(item.time).getTime();
          let day = Math.trunc((openDate - new Date().getTime()) / (1000 * 60 * 60 * 24) + 1);
          if (day >= 0) {
            item.relese = "剩余" + day + "天";
          } else {
            item.relese = "已结束";
          }
        })
        this.setData({
          exams:res.data
        });
      }});
    }else{
      this.setData({
        exams:exams
      });
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
  onShareAppMessage() {

    return {
      title: '转发',
      path: '/pages/dynamic/index/index?id=' + this.data.dynamic.id,
      success: function (res) { }
    }
  }
})