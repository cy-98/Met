
const network = require('../../../../utils/network.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:'',
    start:'',
    destination:'',
    date: '',
    setout:'',
    leave:'',
    content:'准时 不赖账'
  },
  inputTel:function(e){
    console.log(e)
    this.setData({
      tel:e.detail.value
    })
  },
  chooseDate: function (e) {
    console.log(e)
    this.setData({
      date:e.detail.value
    })
  },
  chooseLocationS: function (e) {
    wx.chooseLocation({
      success:  (res)=> {
        console.log(res)
        this.setData({
          start: res.name
        })
      }
    })
  },
  chooseLocationD: function (e) {
    wx.chooseLocation({
      success: (res)=> {
        this.setData({
          destination: res.name
        })
      }
    })
  },
  goTime: function (e) {
    console.log(e)
    this.setData({
      setout: e.detail.value
    })
  },
  inputLeave: function (e) {
    console.log(e)
    this.setData({
      leave: e.detail.value
    })
  },
  inputContent:function(e){
    this.setData({
      content:e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  submit:function(){
    let today = Date().split(' ')[2];
    if(typeof (this.data.leave) !== "number" && this.data.leave >= 4){
      wx.showToast({
        title: '剩余人数必须为小于4的数字',
      })
      return
    }else if(this.data.destination === '' || this.data.start === '' || this.data.setout === '' || this.data.tel === '' || this.data.date === ''){
      wx.showToast({
        title: '所填信息不能为空',
      })
      return
    } else if (!(/^1[3456789]\d{9}$/.test(this.data.tel))){
      wx.showToast({
        title: '请输入正确的电话号码',
      })
      return
    }
    let context = {
      departure : this.data.start,
      destination : this.data.destination,
      leave : Number(this.data.leave),
      startTime: this.data.date + ' ' + this.data.setout+":00",
      des : this.data.content
    }
    console.log(context)
    network.newCarpool({
      context:context,
      success:()=>{
        wx.navigateTo({
          url: '/pages/index/pinche/pinche',
        })
      },
      fail:()=>{
        wx.showToast({
          title: '时间好像晚于今天哦，不会是要时空穿梭吧',
        })
      }})
  },  
  onLoad: function (options) {

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