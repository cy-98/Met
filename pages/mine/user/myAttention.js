// pages/mine/user/myAttention.js
const network = require('../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.users.length)
    network.getUserFollow({
      success:(res)=>{
        this.setData({
          users:res.data
        })
      },
      fail:()=>{

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
  clickUser(e) {
    // 跳转用户界面

    let user = e.currentTarget.dataset.user;
    let con = {
      "username": user.stuId,
      "avatar": user.avatar,
      "nickName": user.nickname
    };
    wx.navigateTo({
      url: '/pages/chat/chat?conversation=' + JSON.stringify(con),
    })
  },
})