const app = getApp();
let utils = require('../../utils/util.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
  },
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync('userInfo', e.detail.userInfo);
      utils.getReq('user', {}, function(res){
        console.info(res.data.stuId);
        if(!res.data.stuId){
          console.info("data");
          wx.redirectTo({
            url: '/pages/mine/jwxt/jwxt',
          });
        }else{
          wx.switchTab({
            url: '/pages/dynamic/list/list',
          });

        }
      });


    }
  }
});
