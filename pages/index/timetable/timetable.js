// pages/index/timetable/timetable.js
let network = require("../../../utils/network.js");
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     timetables:[],
//     colorArrays: ["#55efc4", "#81ecec", "#55efc4", "#fd79a8", "#74b9ff", "#55efc4", "#81ecec", "#fd79a8"]
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     let timetable = wx.getStorageSync("timetable") || null;
//     let tmp = [];
//     let currWeek = wx.getStorageSync("currWeek");
//     console.info(currWeek);
//     let timetables = [];


//     if(!timetable){
      // network.getTimeTable({
      //   success: res => {
      //     res.data.forEach(item => {
            
      //         item.week_list.forEach(week => {
      //           if (week === currWeek) {
      //             timetables.push(item);
      //           }
      //         })
            
      //     });
      //     this.setData({ timetables: timetables });
      //   },
      //   fail: res => {

      //   }
      // });
      
//     }else{
//       timetable.forEach(item => {
//         item.week_list.forEach(week => {
//           if (week === currWeek) {
//             timetables.push(item);
//           }
//         })
//       });
//       this.setData({timetables:timetables});
//     }
//   }
// })















let app = getApp();

Page({
  data: {
    // wxml 的 margin-top 相关
    navH: 0,
    // 添加课程之类的功能显示与否
    popupShow: false,
    // 各个课程的颜色
    colorArrays: [
      "rgba(125,91,230,1)",
      "rgba(30,192,255,1)",
      "rgba(249,192,12,1)",
      "rgba(246,134,87,1)",
      "rgba(224,60,138,1)",
      "rgba(20,146,230,1)",
      "rgba(65,211,189,1)",
      "rgba(234,94,148,1)",
      "rgba(38,128,235,1)",
      "rgba(2,182,197,1)",
      "rgba(0,170,144,1)",
      "rgba(0,137,167,1)",
      "rgba(255,177,27,1)",
      "rgba(140,215,144,1)",
      "rgba(219,77,109,1)",
    ],
    // 颜色键值对
    colorObj: {},
    // 本周课程
    thisWeekCourse: [],
    currentWeek: 1,
    // 当前周
    dangqianzhou: 1,
    weekName: "第一周",

    // 每节课开始的时间
    classTimestart: ["08:00", "08:55", "10:15", "11:10", "14:00", "14:55", "16:15", "17:10", "19:00", "19:55"],
    // 每节课结束的时间
    classTimeend: ["08:50", "09:45", "11:05", "12:00", "14:50", "15:45", "17:05", "18:00", "19:50", "20:45"],
    // 月份
    month: 2,
    // 这一整个学期从开始到结束的日期
    wholeSemesterDays: [],
    // 包含本周7天的日期
    WeeklyDate: [{
        zhouji: "周一"
      },
      {
        zhouji: "周二"
      },
      {
        zhouji: "周三"
      },
      {
        zhouji: "周四"
      },
      {
        zhouji: "周五"
      },
      {
        zhouji: "周六"
      },
      {
        zhouji: "周日"
      }
    ],
    // 缩小型课表的相关数据
    shrinkKCB: [],
    // 显示或隐藏缩小型课表 flag
    shrinkKCBFlag: false,
    // 设置横向滚动条位置以便展示的缩小型课表默认下面是当前周
    scrollLeft: 0,

    today: true,
    skinClass: "bg-gradual-blue",
    skinOpacity: ""

  },

  onLoad() {
    this.setNavHeight();

    this.getInfo();
    this.getTimeTableInfo();

    this.getTermDay();
    this.setWeeklyDate();
    this.setMonth();

    this.setSameColor();

    this.setShrinkKCBData();
  },


  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  /* 
    navH 获取不同手机系统最上部电量一栏的导航高度,在 app.js 中有相关代码
  */
  setNavHeight() {
    this.setData({
      navH: app.globalData.navHeight
    })
  },

  /* 
    点击显示或隐藏导航周
  */
  ShrinkKCBshow() {
    let dangqianzhou = this.data.dangqianzhou;
    // 计算当前周距离左部的距离
    let scrollLeft = (dangqianzhou - 3) * 140;
    if (this.data.shrinkKCBFlag === true) {
      this.setData({
        shrinkKCBFlag: false
      })
    } else {
      this.setData({
        shrinkKCBFlag: true
      })
      // 设置默认当前周显示在中央
      setTimeout(() => {
        //假装异步获取数据
        this.setData({
          scrollLeft
        });
      }, 100);
    }
  },

  /* 
    设置缩小型课表的数据
  */
  setShrinkKCBData() {
    let temp = wx.getStorageSync('shrinkKCB') || null;
    if (temp !== null) {
      this.setData({
        shrinkKCB: temp
      });
      return;
    }
    let shrinkKCB = [];
    for (let i = 1; i < 21; i++) {
      let obj = {};
      obj["index"] = i;
      obj["msg"] = [];
      shrinkKCB.push(obj);
    }
    let kbcopy = wx.getStorageSync("timetable").slice();
    let len1 = kbcopy.length;
    for (let i = 0; i < len1; i++) {
      // 得到课程涉及的所有周
      let week_list = kbcopy[i].week_list;
      let len2 = week_list.length;
      for (let j = 0; j < len2; j++) {
        let obj = {};
        obj.weekList = week_list[j];
        obj.day = kbcopy[i].day;
        obj.start = (kbcopy[i].start + 1) / 2;
        shrinkKCB[obj.weekList - 1]["msg"].push(obj);
        // 如果是4节连课，比如实验课
        if (kbcopy[i].step === 4) {
          let obj2 = {};
          obj2.weekList = week_list[j];
          obj2.day = kbcopy[i].day;
          obj2.start = (kbcopy[i].start + 3) / 2;
          shrinkKCB[obj.weekList - 1]["msg"].push(obj2);
        }
      }
    }
    wx.setStorageSync('shrinkKCB', shrinkKCB);
    this.setData({
      shrinkKCB
    })
  },

  /* 
    导航周点击通过index切换周
  */
  shrinkKCBchange(e) {
    // console.log(e);
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentWeek: index,
      weekName: "第" + (index) + "周"
    });
    wx.setNavigationBarTitle({
      title: "第" + this.data.currentWeek + "周",
    })
    this.getTimeTableInfo();
    this.setWeeklyDate();
    this.setMonth();
  },


  /*
    为相同课程设置相同颜色，根据其课程的不同 id 对应不同颜色
  */
  setSameColor() {
    let temp = wx.getStorageSync('colorObj') || null;
    if (temp !== null) {
      this.setData({
        colorObj: temp
      });
      return;
    }
    console.log('设置课程颜色的函数被调用了');
    let ids = [];
    let kbcopy = wx.getStorageSync("timetable").slice(); // 原有课程

    let len1 = kbcopy.length;
    // 将所有课程（固有课程和添加课程）的 id 放入 ids 
    for (let i = 0; i < len1; i++) {
      if (!ids.includes(kbcopy[i]["id"])) {
        ids.push(kbcopy[i]["id"]);
      }
    }
    // 将id对应颜色存在 colorObj 中
    let colorObj = {};
    let colorArrays = this.data.colorArrays;

    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];
      colorObj[id] = colorArrays[i];
    }
    wx.setStorageSync('colorObj', colorObj);
    this.setData({
      colorObj
    })
  },

  /*
    根据七天中的第一天的月份得到当前月份
  */
  setMonth() {
    let firstDay = this.data.WeeklyDate[0]["yueri"];
    let month = new Date(firstDay).getMonth() + 1 || 9;
    this.setData({
      month
    })
  },

  /*
    设置当前显示的一周日期
  */
  setWeeklyDate() {
    let WeeklyDate = this.data.WeeklyDate;
    let wholeSemesterDays = wx.getStorageSync('wholeSemesterDays');
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    for (let i = 0; i < 7; i++) {
      WeeklyDate[i]["yueri"] = wholeSemesterDays[(this.data.currentWeek - 1) * 7 + i];
      let month2 = WeeklyDate[i]["yueri"].slice(0, 2);
      let day2 = WeeklyDate[i]["yueri"].slice(3);
      // console.log(day2);
      // console.log(month2);
      // console.log(day);
      // console.log(month);

      if (month == month2 && day == day2) {
        WeeklyDate[i]["now"] = true;
      } else {
        WeeklyDate[i]["now"] = false;
      }
    }
    this.setData({
      WeeklyDate
    })
  },

  /*
    获取这一学期第一天开始到学期末的日期
  */
  getTermDay() {
    let temp = wx.getStorageSync('wholeSemesterDays') || null;
    if (temp !== null) {
      return;
    }
    let that = this;
    let wholeSemesterDays = [];
    // 第1周到第20周 140 天
    for (let i = 0; i < 140; i++) {
      wholeSemesterDays.push(that.getDateStr(i).substring(5))
    }
    wx.setStorageSync("wholeSemesterDays", wholeSemesterDays)
  },

  /*
    
  */
  getDateStr(AddDayCount) {
    // let openDate = wx.getStorageSync("openDate") || 1551053280000; // 2019-02-25
    let openDate = wx.getStorageSync("openDate") || 1566777600000; // 2019-07-28
    let dd = new Date(openDate)
    dd.setDate(dd.getDate() + AddDayCount);
    //获取AddDayCount天后的日期  
    let y = dd.getFullYear();
    let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0  
    let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0  
    return y + "/" + m + "/" + d;
  },


  /* 
    
  */
  getInfo() {
    let currentWeek = wx.getStorageSync("currWeek") || 1;
    this.setData({
      currentWeek: currentWeek,
      dangqianzhou: currentWeek
    });
    wx.setNavigationBarTitle({
      title: "第" + currentWeek + "周"
    })
  },

  /* 
    获取课表信息
  */
  getTimeTableInfo() {
    let that = this;
    let kb = wx.getStorageSync("timetable") || null;
    let thisWeekCourse = [];
    let kbcopy = wx.getStorageSync("timetable").slice();
    // 生成这周的固有课表
    that.createThisWeekCourse(kbcopy, thisWeekCourse);
    that.setData({
      thisWeekCourse
    });
  },

  /* 
    kb为传过来的固定课表或者自己添加的课程
  */
  createThisWeekCourse(kb, thisWeekCourse) {
    let that = this;
    kb.forEach(item => {
      if (that.hasSubject(item['week_list'], that.data.currentWeek)) {
        let subject = {}
        subject.xqj = item['day'];
        subject.skjc = item['start'];
        subject.skcd = item['step'];
        subject.kcmc = item['name'] + "@" + item['room'];
        subject.id = item['id'];
        thisWeekCourse.push(subject);
      };
    });
  },

  /* 
    判断是否为本周的课程
  */
  hasSubject(arr, val) {
    return arr.some((x) => {
      return x === val
    })
  },

  /* 
    下拉刷新
  */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      this.getInfo();
      this.getTimeTableInfo();

      this.setWeeklyDate();
      this.setMonth();

      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  }
})