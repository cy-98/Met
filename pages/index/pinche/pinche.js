// pages/index/pinche/pinche.js
const network = require('../../../utils/network.js');
import dynamic from '../../../modules/dynamic/dynamic.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carPool:[]
  },
  sendMessage:function(e){
    console.log(e)
    let con = {
      "username":e.target.dataset.user.stuId,
      "avatar":e.target.dataset.user.avatar,
      "nickName":e.target.dataset.user.nikcname
    }
    wx.navigateTo({
      url:`/pages/chat/chat?conversation=`+JSON.stringify(con)
    })
  },
  clickAvatar: function (e) {
    dynamic.clickAvatar(e);
  },
  //预约
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  toMypinche:function(){
    wx.navigateTo({
      url: '/pages/index/pinche/mypinche/mypinche',
    })
  },
  toMyAppointment:function(){
    wx.navigateTo({
      url: '/pages/index/pinche/myappointment/myappointment',
    })
  },
  toDetail:function(e){
    console.log(e)
    wx.navigateTo({
      url: `/pages/index/pinche/pincheDetail/detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  newPinche:function(){
    wx.navigateTo({
      url: '/pages/index/pinche/add/add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
    network.getCarpool({
      page: 1, size: 10,
      success: (res) => {
        this.setData({
          carPool: res.data.data
        })
      }, fail: () => { }
    })
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