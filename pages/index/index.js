var network = require("../../utils/network.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
  data: {
    timetables: [],
    userInfo:{},
    cardCur: 0,
    openLocationState:true,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://s2.ax1x.com/2019/09/04/nEdjAg.th.jpg'
    }, {
      id: 1,
      type: 'image',
        url: 'https://s2.ax1x.com/2019/09/04/nEwn3R.th.jpg',
    }, {
      id: 2,
      type: 'image',
        url: 'https://s2.ax1x.com/2019/09/04/nEwUgI.th.jpg'
    }],
    iconList: [{
      icon: 'skinfill',
      color: 'olive',
      badge: 0,
      name: '拼车',
      //url拼车
      url: '/pages/index/pinche/pinche'
    }],
    gridCol: 4,
    skin: false,
    recommend:[],
    location:false,
    markers: [],
  },
  openLocation:function(e){
    console.info(e);
    wx.setStorageSync("openLocationState", e.detail.value);
    this.setData({
      openLocationState:e.detail.value
    });
    if(e.detail.value){
      this.met();
    }else{
      this.setData({
        markers:[]
      });
      wx.showToast({
        title: '关闭定位信息',
      })
    }
  },
  //关注推荐的人
  attent(e){
    let id = e.detail.target.id;
    console.log(id)
    let formId = e.detail.formId
    console.log(e);
    let index = e.detail.target.dataset.index;
    wx.showLoading({
      title: '关注中....',
    });
    // pers 关注
    network.attentOthers({
      id:id,
      formId:formId,
      success:(res)=>{
        wx.hideLoading();
        let recommend = this.data.recommend;
        recommend[index].focus = true;
        this.setData({
          recommend: recommend
        })
      },
      fail:(res)=>{
        console.log(res)
      }
    })
  },
  unAttent(e){
    wx.showLoading({
      title: '取关中....',
    });
    let id = e.detail.target.id;
    console.info(e);

    let index = e.detail.target.dataset.index;
    // pers 关注
    network.cancelAttentOthers({
      id: id,
      success: (res) => {
        wx.hideLoading();
        let recommend = this.data.recommend;
        recommend[index].focus = false;
        this.setData({
          recommend: recommend
        })
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  met:function(){
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        console.log(res)
        let location = {}
        location.latitude = res.latitude;
        location.longitude = res.longitude;
        location.speed = res.speed;
        location.accuracy = res.accuracy;
        this.setData({
          location: location
        });
        network.punch({
          longitude: res.longitude,
          latitude: res.latitude,
          success: res => {
            console.info("发送位置信息");
          }
        });

      },
    });

    network.punches({
      success: res => {
        console.info(res);
        let markers = [];
        res.data.data.forEach(item => {
          let marker = {}
          marker.id = item.user.id;
          marker.latitude = item.latitude;
          marker.longitude = item.longitude;
          marker.iconPath = item.user.avatar;
          marker.width = 30;
          marker.height = 30;
          markers.push(marker);
        });
        this.setData({
          markers: markers
        })
      }
    })
  },

  onLoad() {

    let that = this;
    qqmapsdk = new QQMapWX({
      key: '5O2BZ-7QJKJ-TRGFA-KARQV-GSOW6-E2BAI'
    });
    //获取定位
  

  
    // 检测是否是开启位置信息的设置
    let state = wx.getStorageSync("openLocationState");
    if(state !== false){
      console.info("state 为空");
      wx.setStorageSync("openLocationState", true);
      this.setData({
        openLocationState:true
      });
      state = true;
    }
    this.setData({
      openLocationState: state
    })
    console.info(state);
    if (state) {
      this.met();
    }

    
    
    network.getOpenSchool({success:res => {
      console.info(res);
      let currWeek = res.data.week + 1;
      wx.setStorageSync("currWeek", currWeek);
      console.info("当前周数"+ currWeek);
      this.towerSwiper('swiperList');
      // 初始化towerSwiper 传已有的数组名即可
      let timetable = wx.getStorageSync("timetable") || null;
      let timetables = [];
      let today = (new Date()).getDay();
      if (!timetable) {
        network.getTimeTable({
          success: res => {
            res.data.forEach(item => {
              if (today === item.day) {
                item.week_list.forEach(week => {
                  if (week === currWeek) {
                    timetables.push(item);
                  }
                })
              }
            });
          },
          fail: res => {

          }
        });
      } else {
        timetable.forEach(item => {
          if (today === item.day) {
            item.week_list.forEach(week => {
              if (week === currWeek) {
                timetables.push(item);
              }
            })
          }
        });
      }

      this.setData({
        timetables: timetables
      })
    }})



    //获取推荐的人
    network.getRecommend({
      success: (res) => {
        let recommend = res.data.data;
        recommend.forEach(item => {
          item.focus = false;
        });
        this.setData({
          recommend:recommend
        })
        console.log(this.data.recommend)

      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  clickUser(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/mine/user/info?id=' + e.currentTarget.dataset.user.id,
    })
  },
  markertap:function(e){
    console.info(e);
    wx.navigateTo({
      url: '/pages/mine/user/info?id=' + e.markerId,
    })
  },

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  onShow(){
    let that =this;
    this.setData({
      userInfo:wx.getStorageSync("userInfo")
    });
    wx.authorize({
      scope: 'scope.userLocation',
      success: (res) => {
        this.setData({
          location:true
        })
      },
      fail:(res)=>{
        this.setData({
          location :false
        })
        wx.showToast({
          title: '请开启定位',
          icon:'none'
        })
      }
    })
  },
  openMap:function(e){
    console.log(this.data.location)
    var that = this
    wx.getSetting({
      success(res) {
        console.log(1)
        //这里判断是否有地位权限
        if (!res.authSetting['scope.userLocation']) {
          wx.openSetting({
            success:(res)=>{
              that.setData({
                location:true
              })
            }
          })
        }
      }

    })
  },
  controltap:function(e){
    console.log(e);
  },
  navgate:function(){
    
  },
  toJwxt(){
    wx.navigateTo({
      url: '/pages/mine/jwxt/jwxt',
    })
  },
  onShareAppMessage(){

    return {
      title: '转发',
      path: '/pages/index/index',
      success: function (res) { }
    }
  }
})