// pages/chat-list/dynamicInfo.js
const network = require('../../utils/network.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    network.getMessages({
      success: (res) => {
        res.data.forEach(item=>{
          item.createTime = item.createTime.replace('T', ' ').substr(0,16);
        })
        this.setData({
          contents:res.data
        })
      },
      fail: (res) => {
        console.log(res);
      }
    });
    this.cleanAllMessage();

  },
  intoDynamic:(e)=>{
    network.readMessage({
      msgId:e.currentTarget.dataset.id,
      success:(res)=>{
        console.log(res)
      },
      fail:(res)=>{
        console.log(res)
      }
    })
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  back:()=>{
    wx.redirectTo({
      url: 'pages/chat-list/chat-list',
    })
  },
  cleanAllMessage:function(){
    wx.showLoading({
      title: '清除消息中....',
    });
    network.readAllMessage({success : res => {
      wx.hideLoading();
      network.getMessages({
        success: (res) => {
          res.data.forEach(item => {
            item.createTime = item.createTime.replace('T', ' ').substr(0, 16);
          })
          this.setData({
            contents: res.data
          })
        },
        fail: (res) => {
          console.log(res);
        }
      });
    }})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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