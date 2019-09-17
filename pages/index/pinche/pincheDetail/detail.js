// pages/index/pinche/pincheDetail/detail.js
const network = require('../../../../utils/network.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carPool:{},
    book:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  booking: function (e) {

    console.log(e)
    network.bookCarpool({
      id: e.currentTarget.dataset.id, success: () => {
        console.log(1)
        wx.showToast({
          title: '预约成功',
        })
        this.setData({
          book: true
        })
        console.log(this.data.book)
      }, fail: () => {
        wx.showToast({
          title: '预约失败',
        })
      }
    })
  },
  cancelBooking: function (e) {
    
    network.cancelBookCarpool({
      id: e.currentTarget.dataset.id,
      success: () => {
        wx.showToast({
          title: '取消成功',
        })
        this.setData({
          book: false
        })
        console.log(this.data.book)
      }, fail: () => {

      }
    })
  },
  onLoad: function (options) {
    console.log(options.id)
    network.getCarpoolDetail({id:options.id,success:(res)=>{
      if (res.data){
        this.setData({
          carPool: res.data,
          book:res.data.book
        })
        return
      }else{
        this.setData({
          carPoll:false
        })
      }
      
    }})
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