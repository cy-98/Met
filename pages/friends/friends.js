const app = getApp();
var network = require("../../utils/network.js");
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    inputValue:'',
    users:[]
  },
  onLoad:function() {

    network.getUserFollower({
      success:res => {
        this.setData({
          users:res.data
        })
      },
      fail: res => {

      }
    })

  },
  clickUser:function(e){
    wx.navigateTo({
      url: '/pages/mine/user/info?id=' + e.currentTarget.dataset.user.id,
    })
  },

  searchUser:function(e){
    if(this.data.inputValue === ""){
      wx.showToast({
        title: '不能为空',
      });
      return;
    }
    network.searchUser({
      params : this.data.inputValue,
      formId : e.detail.formId,
      success:(res)=>{
        this.setData({
          users:res.data.data
        })
      },
      fail:()=>{
        //没有该用户
      }
    })
  },
  bindValue:function(e){
    this.setData({
      inputValue:e.detail.value
    })
  }
});