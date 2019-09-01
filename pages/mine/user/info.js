// pages/mine/user/info.js
var network = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户信息
    nickname:'',
    profile:'',
    major:'',
    avatar:'',
    stuId:"",
    //问题列表
    questions: [],
    randomOpacity: [],
    random: Math.floor(Math.random() * 5),
    opacity: [0.28, 0.33, 0.35, 0.75, 0.86, 0.9, 0.8],
    randomColorArr: [],
    //颜色 标签云
    colorArr: ["#EE2C2C", "#ff7070", "#EEC900", "#4876FF", "#ff6100",
      "#7DC67D", "#E17572", "#7898AA", "#C35CFF", "#33BCBA", "#C28F5C",
      "#FF8533", "#6E6E6E", "#428BCA", "#5cb85c", "#FF674F", "#E9967A",
      "#66CDAA", "#00CED1", "#9F79EE", "#CD3333", "#FFC125", "#32CD32",
      "#00BFFF", "#68A2D5", "#FF69B4", "#DB7093", "#CD3278", "#607B8B"
    ],
    //标签云
    labArr: [],
    //页面切换
    index: 0,
    scroll_left: 'scroll_left',
    scroll_right: 'scroll_right',
    checked: 'checked bg-green',
    unchecked: '',
    ranIndex: Math.floor(Math.random() * 5),
  },

  tapchange: function(e) {
    // this.index = e.target.dataset.id;

    console.log(e);
    this.setData({
      index: e.target.dataset.id
    });

  },
  sendMessage:function(){
    let con = {
      "username":this.data.stuId,
      "avatar":this.data.avatar,
      "nickName":this.data.nickname
    };

    wx.navigateTo({
      url: '/pages/chat/chat?conversation=' + JSON.stringify(con),
    })
  },
  addFriend:function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.info(options);
    let that = this;
    //获取别人的信息
    network.getOtherInfo({
      userId: options.id,
      success: function(res) {
        console.log('获取成功');
        let interest = res.data.interest;
        that.setData({
          labArr: interest,
          avatar : res.data.avatar,
          nickname : res.data.nickname,
          profile : res.data.profile,
          major : res.data.major,
          stuId:res.data.stuId
        })
        //实现随机颜色
        console.log(that)
        var labLen = that.data.labArr.length,
          colorArr = that.data.colorArr,
          colorLen = colorArr.length,
          randomColorArr = [];
        //透明度
        let opaArr = that.data.opacity,
          randomOpacity = [],
          opaLen = opaArr.length;
        //判断执行
        do {
          let random = colorArr[Math.floor(Math.random() * colorLen)];
          randomColorArr.push(random);
          //透明度
          let randomOpa = opaArr[Math.floor(Math.random() * opaLen)];
          randomOpacity.push(randomOpa)
          labLen--;
        } while (labLen > 0)

        that.setData({
          randomColorArr: randomColorArr,
          randomOpacity: randomOpacity
        });
      },
      fail: function() {
        console.log('获取失败');
      }
    })
    console.log(options);

    // //获取别人的问题
    // network.getOtherQuestion({
    //   userId: options.id,
    //   success: function(res) {
    //     console.log('获取问题成功');
    //     let questions = res.data.questions
    //     that.setData({
    //       questions:questions
    //     })
    //   },
    //   fail: function() {
    //     console.log('获取问题失败');
    //   }
    // })



    
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})