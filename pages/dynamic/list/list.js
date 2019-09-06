// pages/dynamic/list.js
var network = require("../../../utils/network.js");
import dynamic from '../../../modules/dynamic/dynamic.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    pages:[1,1,1,1],
    dynamics:[],
    followDynamic:[],
    expressDynamic:[],
    talkDynamic:[],
    //滚动页面位置
    scroll:0,
    readyRefresh:false,
    clientX:0,
    clientY:0
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    this.getFollowDynamic(1,10);
    this.getRecommendDynamic(1,5);
    this.getTypeDynamic(0,1,10);
    this.getTypeDynamic(1,1,10);
  },
  comment:function(){
    
  },
  addDynamic: function() {
    console.info("add dynamic");
    wx.navigateTo({
      url: '/pages/dynamic/add/add',
    })
  },
  clickContent(e){
    dynamic.clickContent(e);
  },
  clickAvatar: function(e){
    dynamic.clickAvatar(e);
  },
  clickImages: function(e){
    dynamic.clickImages(e);
  },
  getRecommendDynamic: function(page, size){
    // 获取相关数据
    network.getRecommendDynamic({
      data: { page: page, size: size }, success: res => {
        res.data.data.forEach(item => {
            item.nickname = item.user.nickname,
            item.avatar = item.user.avatar
            item.commentNum = item.comments.length,
            item.good = item.liker.length,
            item.createTime = item.createTime.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
            item.anonymous = item.anonymous;
            if(item.anonymous === 1){
              item.nickname = item.annonyUser.nickname;
              item.avatar = item.annonyUser.avatar;
            }
        });
        if( page === 1){
          this.setData({
            dynamics: res.data.data
          });
          return 
        }
        let dynamics = this.data.dynamics || [];
        this.setData({
          dynamics: dynamics.concat(res.data.data)
        });
      }
    });
  },
  getFollowDynamic: function(page,size){
    network.getFollowDynamic({
      data: { page: page, size: size }, success: res => {
        res.data.data.forEach(item => {
          item.nickname = item.user.nickname,
            item.avatar = item.user.avatar,
            item.commentNum = item.comments.length,
            item.good = item.liker.length,
            item.watch = (new Date().getTime()) % 100,
            item.createTime = item.createTime.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            item.anonymous = item.anonymous;
            if (item.anonymous === 1) {
              item.nickname = item.annonyUser.nickname;
              item.avatar = item.annonyUser.avatar;
            }


        });
        let followDynamic = this.data.followDynamic || [];
        this.setData({
          followDynamic: followDynamic.concat(res.data.data)
        })
      }
    });
  },
  getTypeDynamic: function(type, page, size){
    network.getTypeDynamic({
      type: type,
      data: { page: page, size: size }, success: res => {
        res.data.data.forEach(item => {
          item.nickname = item.user.nickname,
            item.avatar = item.user.avatar,
            item.commentNum = item.comments.length,
            item.good = item.liker.length,
            item.watch = (new Date().getTime()) % 100,
            item.createTime = item.createTime.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            item.anonymous = item.anonymous;
            if (item.anonymous === 1) {
              item.nickname = item.annonyUser.nickname;
              item.avatar = item.annonyUser.avatar;
            }
        });
        if(type === 0){
          let expressDynamic = this.data.expressDynamic|| [];
          this.setData({
            expressDynamic: expressDynamic.concat(res.data.data)
          });
        }else if(type === 1){
          let talkDynamic = this.data.talkDynamic || [];
          this.setData({
            talkDynamic: talkDynamic.concat(res.data.data)
          });
        }

      }
    });
  },

  swiperchange: function(e) {
    var that = this
    console.log(e.detail.current)
    that.setData({
      TabCur: e.detail.current
    });
  },

  /**
   * 页面相关事件处理函数--
   */
  //监听滚动
  mytouchstart:function(e){
    console.log(e)
    let that = this;
    this.setData({
      clientX: e.changedTouches[0].clientX,
      clientY: e.changedTouches[0].clientY
    });

    var timer = setTimeout(()=>{
      console.log(that)
      console.log(this)
      if (that.data.scroll === 0) {
        that.setData({
          readyRefresh: true
        });
      }
    },100)
    
  },
  mytouchend:function(e){
    console.info(e);
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    if( Math.abs(x - this.data.clientX) / Math.abs(y - this.data.clientY) > 0.8 ){
      console.info("左右滑动的趋势大一点")
      return;
    }

    if (Math.abs(y - this.data.clientY) < 50) {
      console.info("差别太小")
      return;
    }

    if(this.data.scroll === 0 && this.data.readyRefresh === true){
      wx.startPullDownRefresh();
    }
  },
  scrollbot: function (e) {
    console.info(e);
     //这个就是滚动到的位置,可以用这个位置来写判断
    let scroll = e.detail.scrollTop;
    console.log(scroll)
    this.setData({
      scroll:scroll
    })
  },
  //监听用户下拉动作
  onPullDownRefresh: function() {
    console.log('刷新')
    let pages = this.data.pages;
    let curr = this.data.TabCur;
    switch (curr) {
      case 0:
        // this.setData({
        //   dynamics:[]
        // });
        this.getRecommendDynamic(1, 5);
        break;
      case 1:
        // this.setData({
        //   followDynamic: []
        // });
        this.getFollowDynamic(1, 10);
        break;
      case 2:
        // this.setData({
        //   expressDynamic: []
        // });
        this.getTypeDynamic(0,1, 10);
        break;
      case 3:
        // this.setData({
        //   talkDynamic: []
        // });
        this.getTypeDynamic(1, 1, 10);
        break;
    }
    wx.stopPullDownRefresh();
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let pages = this.data.pages;
    let curr = this.data.TabCur;
    switch (curr){
      case 0:
        this.getRecommendDynamic(++pages[0], 5);
        break;
      case 1:
        this.getFollowDynamic(++pages[1], 10);
        break;
      case 2:
        this.getTypeDynamic(0, ++pages[2], 10);
        break;
      case 3:
        this.getTypeDynamic(1, ++pages[3], 10);
        break;
    }
    this.setData({
      pages:pages
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

    return {
      title: '转发',
      path: '/pages/dynamic/list/list',
      success: function (res) { }
    }
  }
})