// pages/dynamic/index.js
var network = require("../../../utils/network.js");
// var util = require("../../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    commentHidden: true,
    //评论内容
    comment: '',
    //随机颜色
    ranIndex: Math.floor(Math.random() * 10),
    bgColor: [
      'bg-gradual-orange', 'bg-gradual-blue', 'bg-gradual-yellow', 'bg-gradual-red', 'bg-gradual-green', 'bg-gradual-pink', 'bg-gradual-white'
    ],
    ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ],
    dynamic: {},
    users: [{
      avart: "https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png",
      nickname: "扭曲丛林",
      content: "矿大的日子",
      time: "2019.9.19",
      index:'0',
      answer: [{
        nickname: "黑色玫瑰",
        content: "北大的日子",
        time: "2020.19.9"
      }]
    }]
  },
  //显示评论
  comment: function(e) {
    console.log(e)
    
    //判断回复或者评论
    this.setData({
      commentType: { type: e.currentTarget.dataset.class, 
                     index: e.currentTarget.dataset.index},
      commentHidden: !this.data.commentHidden//关闭输入框
    })
  },
  //输入评论
  changeInput:function(e){
    this.setData({
      comment: e.detail.value
    })
  },
  //提交评论
  submit:function(){
    let self = this;
    let comment = this.data.comment;
    let user = ''
    //获取用户信息
    wx.getStorage('userInfo',res => {
      user = res.nickname
    })
  },
  // submit: function() {
  //   let users = this.data.users;
  //   let self = this;
  //   //添加评论  或者 添加回复
  //   //评论
  //   function commentFn () {
  //     users.push({
  //       avart: "https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png",
  //       nickname: "newUser",
  //       content: self.data.comment,
  //       time: Date(),
  //       index:users.length,
  //       answer:[]
  //     })
  //     self.setData({
  //       users: users,
  //       commentHidden: !self.data.commentHidden
  //     })
  //   }
  //   //回复
  //   function answerFn () {
  //     console.log(self.data.users[self.data.commentType.index].answer)
  //     let answer = self.data.users[self.data.commentType.index].answer;
  //     console.log(self.data.commentType.index)
  //     users[self.data.commentType.index].answer.push(({
  //       nickname: "用户名称",
  //       content: self.data.comment,
  //       time: "2020.19.9"
  //     }))
  //     self.setData({
  //       users:users,
  //       commentHidden: !self.data.commentHidden
  //     })
  //   }
  //   this.data.commentType === 'comment'?commentFn():answerFn()
    
  // },
  //点赞
  like:function(){
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.info(options);
    network.getDynamic({
      id: options.id,
      success: res => {
        res.data.createTime = res.data.createTime.split('T')[0] + "."+ res.data.createTime.split('T')[1].split('+')[0]
        this.setData({
          dynamic: res.data
        })
      }
    });

  },

})