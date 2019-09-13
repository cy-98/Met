// pages/index/pinche/mypinche/mypinche.js
const network = require('../../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carPool:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  toDetail:(e)=>{
    console.log(e)
    wx.navigateTo({
      url: `/pages/index/pinche/pincheDetail/detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  deletePinche:(e)=>{
    network.deleteMycarpool({
      id:e.currentTarget.dataset.id,
      success:()=>{},
      fail:()=>{}})
  },
  
  onLoad: function (options) {
    
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
    network.getMycarpool({
      success: (res) => {
        console.log(res)
        this.setData({
          carPool:res.data
        })
      },
      fail: (res) => {
        console.log(res)
      }
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