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
  onLoad: function (options) {
    let arr;
    network.getMyappointment({
      success:(res)=>{
        console.log(res)
        // res.data.forEach(item=>{
        //   network.getCarpoolDetail({
        //     id:item.id,
        //     success:(res)=>{
        //       arr.push[res.data]
        //       console.log(arr)
        //     }
        //   })
        // })
        res.data.forEach(item=>{
          console.log(item);
          // if(item.carPool.startTime) {
          //   item.carpool.startTime = item.carpool.startTime.replace('T', ' ').substr(0, 16);
          // }
          // if(item.carPool.updateTime) {
          //   item.carpool.updateTime = item.carpool.updateTime.replace('T', ' ').substr(0, 16);
          // }
        })
        this.setData({
          carPool:res.data
        })
      },fail:()=>{

      }})
  },

  // deleteMycarpool

  deletePinche(e){
    console.log(e);
    network.deleteMycarpool({id:e.currentTarget.dataset.id});
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