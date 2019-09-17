// pages/index/pinche/pincheDetail/detail.js
const network = require('../../../../utils/network.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carPool:{},
    book:"",
    userId:""
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
  deleteCarpool:function(e){
    console.info(e);
    network.deleteMycarpool({id:e.currentTarget.dataset.id,
      success:()=>{
        console.info("删除成功");
        wx.showToast({
          title: '删除成功',
        })
        wx.redirectTo({
          url: '/pages/index/pinche/pinche',
        })
      }
    })
  },
  onLoad: function (options) {
    wx.getStorage({
      key: 'userInfo',
      success: (res) =>{
        this.setData({
          userId:res.data.id
        })
      },
    })
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