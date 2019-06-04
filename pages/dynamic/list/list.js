// pages/dynamic/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    dynamics:[
      {
        'nickname':'张三',
        'content':"你可真棒",
        'time':'2019-12-12',
        'watch':25,
        'good':'12',
        'commentNum':'12',
        'avatar':'',
        'images':[]
      },
      {
        'nickname': '李四',
        'content': "你可真棒",
        'time': '2019-12-12',
        'watch': 25,
        'good': '12',
        'commentNum': '12',
        'avatar': '',
        'images': []
      }
    ]
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },
  addDynamic: function() {
    console.info("add dynamic");
    wx.navigateTo({
      url: '/pages/dynamic/add/add',
    })
  },

  swiperchange: function(e) {
    var that = this
    console.log(e.detail.current)
    that.setData({
      TabCur: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})