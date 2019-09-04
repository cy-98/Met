// pages/mine/jwxt/jwxt.js
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuId:null,
    password:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindStuIdInput: function (e) {
    this.setData({
      stuId: e.detail.value
    })
  },
  bindPasswordInput:function(e){
    this.setData({
      password: e.detail.value
    })
  },
  formSubmit: function (e){
    console.info(this.data.stuId);
    console.info(this.data.password);
    if(!this.data.stuId){
      wx.showModal({
        title: '学号填一下',
        content: '没有填学号',
      });
      return;
    }
    if (!this.data.password) {
      wx.showModal({
        title: '密码填一下',
        content: '没有填密码',
      });
      return;
    }

    console.info(e);
    let data = {
      formId:e.detail.formId,
      stuId:this.data.stuId,
      password:this.data.password
    };
    utils.req('user/verify', data, function(res){
      console.info(res);
      if(res.code === 200){
        wx.showToast({
          title: '登录成功',
        });
        wx.reLaunch({
          url: '/pages/index/index',
        });
      }else{
        wx.showToast({
          title: '登录失败，检查账户密码是否正确',
        });
      }
    });
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