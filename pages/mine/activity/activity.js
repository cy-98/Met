// pages/mine/activity/activity.js
var network = require("../../../utils/network.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getActivity();
  },
  getActivity() {
    let that = this;
    network.getActivities({
      success: res => {
        res.data.data.forEach(item=>{
          item.startTime = item.start.split(" ")[0]
          item.endTime = item.endTime.split(" ")[0]          
        })
        that.setData({
          activities: res.data.data
        })
      }
    })
  },
  actdetail(e) {
    console.log(e);
    // let id = 
    wx.navigateTo({
      url: `/pages/mine/activity/detail/detail?id=${e.currentTarget.dataset.id}`,
    })
  }
})