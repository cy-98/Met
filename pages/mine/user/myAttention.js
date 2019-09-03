// pages/mine/user/myAttention.js
const network = require('../../../utils/network.js');
import dynamic from '../../../modules/dynamic/dynamic.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.users.length)
    network.getUserFollow({
      success:(res)=>{
        this.setData({
          users:res.data || []
        });
      },
      fail:()=>{

      }
    });
  },
  clickUser(e) {
    dynamic.clickAvatar(e);
  },
  clickUser(e) {
    // 跳转用户界面
    console.log(e)
    dynamic.clickAvatar(e)
  },
})