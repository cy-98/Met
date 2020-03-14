// pages/mine/index.js
let utils = require("../../utils/util.js");
let network = require("../../utils/network.js")
let app = getApp();
var doommList = [];
let page = null;
class Doomm {
  constructor(text, top, time, color) {
    this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
  }
}

Page({
  //TODO:  改变我的页面上部头像大小变化
  /**
   * 页面的初始数据
   */
  data: {
    person: {
      school: "",
      major: "",
      name: "",
      avatar: "/images/logo.png",
      attention: "",
      fans: "",
      doommData: []
    }
  },

  nav: function(e) {
    console.info(e);
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    page = this;
  

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    getApp().checkUser();

    network.getUserInfo({
      success: () => {
        console.log("网络获取储存到本地");
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({
          person: {
            school: userInfo.school,
            major: userInfo.major,
            name: userInfo.name,
            avatar: userInfo.avatar,
            gender: userInfo.gender,
            grade: userInfo.grade,
            tags: userInfo.interest,
            focusNum: userInfo.focusNum,
            dynamicNum: userInfo.dynamicNum,
            fansNum: userInfo.fansNum
          },
        });
        doommList = [];

        if (this.data.person.tags) {
          this.data.person.tags.forEach(item => {
            doommList.push(new Doomm(item, Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10 + 3)));
            this.setData({
              doommData: doommList
            });
          })
        }

      }
    });

  },
})