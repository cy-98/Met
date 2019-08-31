var network = require("../../utils/network.js");
Page({
  data: {
    timetables: [],
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }],
    iconList: [{
      icon: 'cardboardfill',
      color: 'red',
      badge: 0,
      name: '课表',
      url: '/pages/index/timetable/timetable'
    }, {
      icon: 'recordfill',
      color: 'orange',
      badge: 0,
      name: '考试',
      url: '/pages/index/exam/exam'
    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '成绩',
      url: '/pages/index/grade/grade'
    }, {
      icon: 'noticefill',
      color: 'olive',
      badge: 0,
      name: '兴趣',
      url: '/pages/mine/setting/sethoby/sethoby'
    }],
    gridCol: 4,
    skin: false,
    recommend:[]
  },
  onLoad() {
    let currWeek = 15;
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
    //获取推荐的人
    network.getRecommend({
      success: (res) => {
        let recommend = res.data.data;
        this.setData({
          recommend:recommend
        })
        console.log(this.data.recommend)

      },
      fail: (res) => {
        console.log(res)
      }
    })

    this.setData({
      timetables: timetables
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
  }
})