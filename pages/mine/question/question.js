// pages/mine/question/question.js
var network = require("../../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question1:null,
    question2:null,
    question3:null
  },
  input1:function(e){
    this.setData({
      question1:e.detail.value
    });
  },
  input2: function(e){
    this.setData({
      question2: e.detail.value
    });
  },
  input3: function (e) {
    this.setData({
      question3: e.detail.value
    });
  },
  formSubmit: function(e){
    console.info(e);
    if(!this.data.question1 || !this.data.question2 || !this.data.question3){
      wx.showToast({
        title: '问题内容不能为空',
      });
      return;
    }
    network.updateQuestion({data:{
      question:this.data.question1 + "," + this.data.question2 + "," + this.data.question3
    },
    success: res => {
      console.info("跳转页面")
      wx.switchTab({
        url: '/pages/mine/index',
      });
    },
    fail: res => {

    }})

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    network.getMyQuestion({success:res => {
      that.setData({
        question1:res.data.questions[0],
        question2: res.data.questions[1],
        question3:res.data.questions[2]
      })
    }})
  },

  
})