let utils = require("../../../utils/util.js");
let network = require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:"",
    nickname:"",
    gender:"",
    birthday:"",
    love:"",
    profile:"",
    school:"",
    major:""

  },
  changename:function(e){
    let nickname = e.detail.value;

    this.setData({
      nickname:nickname
    })
  },
  //更改生日
  dateChange:function(e){
      console.log(e)
      this.setData({
        birthday:e.detail.value
      })
  },
  //更改签名
  changeprofile:function(e){
    this.setData({
      profile:e.detail.value
    })
  },
  // 提交 监测
  submit:function(){
    if(!this.data.nickname){
      wx.showToast({
        title:'请输入昵称'

      })
      return ;
    
      
    }
    if (!this.data.profile) {
      this.setData({
        profile: '这个人很懒'
      });
    };
    let data = {
      avatar: this.data.avatar,
      nickname: this.data.nickname,
      birthday: this.data.birthday,
      love: this.data.love,
      profile: this.data.profile
    }
    //post
    network.updateUserInfo({userInfo:data, success:res => {
      console.info("已经醒了");
      wx.setStorageSync("userInfo", this.data)
      wx.switchTab({
        url: '/pages/mine/index',
      })
    }})
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  //获取
  onLoad: 
    function (options) {
      network.getUserInfo({success:function(){
        console.log("网络获取储存到本地")
      }});
      let userInfo = wx.getStorageSync("userInfo");
      console.log(userInfo)
      if(!!userInfo){
        this.setData({
          avatar: userInfo.avatar,
          nickname: userInfo.nickname,
          gender: userInfo.gender === 1 ? "男" : "女",
          birthday: userInfo.birthday.split("T")[0],
          love: userInfo.love,
          profile: userInfo.profile,
          school: userInfo.school,
          major: userInfo.major
        })
      }
      
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

  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  }
})