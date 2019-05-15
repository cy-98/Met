// pages/mine/user/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    scroll_left:'scroll_left',
    scroll_right:'scroll_right',
    checked:'checked bg-green',
    unchecked:'',
    ranIndex: Math.floor(Math.random() *5),
    bgColor: [
      'bg-gradual-orange', 'bg-gradual-blue', 'bg-gradual-red', 'bg-gradual-green', 'bg-gradual-pink'
    ]
  },
  
  tapchange:function(e){
    // this.index = e.target.dataset.id;

    console.log(e);
    this.setData({
      index:e.target.dataset.id
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
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