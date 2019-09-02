// pages/dynamic/index.js
var network = require("../../../utils/network.js");
// var util = require("../../../utils/util.js")
let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    commentHidden: true,
    //评论内容
    comment: '',
    //随机颜色
    ranIndex: Math.floor(Math.random() * 6),
    bgColor: [
      'bg-gradual-orange', 'bg-gradual-blue', 'bg-gradual-red', 'bg-gradual-green', 'bg-gradual-pink'
    ],
    ColorList: app.globalData.ColorList,
    replyUser: null,
    cmtAt: '评论',
    dynamic: {}
  },
  //显示评论
  comment: function(e) {
    console.log(e)
    //判断回复或者评论
    this.setData({
      commentType: {
        type: e.currentTarget.dataset.class,
        index: e.currentTarget.dataset.index
      },
      commentHidden: !this.data.commentHidden //关闭输入框
    })
  },
  //输入评论
  inputChange: function(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  //提交评论
  submitComment: function(e) {
    console.log(e)
    let formId = e.detail.formId;
    let that = this;
    let req_data = {
      content: that.data.comment,
    }
    //评论回复其他买家，否则认为回复卖家
    if (that.data.replyUser != null) {
      let cuuser = that.data.replyUser;
      let cuId = that.data.replyUser.id;
      let cuName = that.data.replyUser.nickname;
      req_data["reply"] = 1;
      req_data["replyUser"] = cuId;
    }
    network.addComment({
      id: that.data.dynamic.id,
      formId:formId,
      content: req_data["content"],
      reply: req_data["reply"],
      replyUser: req_data["replyUser"],
      success: (res) => {
        console.info(res);
        console.log(that.data.dynamic.comments);
        let user = {
          avatar: this.data.userInfo.avatar,
          nickname: that.data.userInfo.nickname
        }
        let comment = {
          content: req_data.content,
          user: user,
          createTime: new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        }
        let dynamic = that.data.dynamic;
        console.log(dynamic)
        dynamic.comments.push(comment);
        that.setData({
          dynamic: dynamic,
          comment: "",
          replyUser: null
        });
      }
    });

  },
  // 回复
  commentAt: function(e) {
    console.log(e)
    let user = e.currentTarget.dataset.user;
    this.setData({
      replyUser: user,
      cmtAt: '@' + user.nickname
    })
    console.log(this.data.replyUser)
  },
  //点赞
  like: function() {

  },
  clickImages: function(e) {
    console.info(e);
    wx.previewImage({
      current: e.currentTarget.dataset.current,
      urls: e.currentTarget.dataset.all,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo;
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        userInfo = res.data;
        this.setData({
          userInfo: userInfo
        })
        console.log(this.data.userInfo.avatar)
      },
      fail: (res) => {
        console.log(res)
      }
    })
    network.getDynamic({
      id: options.id,
      success: res => {
        res.data.createTime = res.data.createTime.replace(/T/g, ' ').substr(0, 19);
        if (res.data.comments) {
          res.data.comments.forEach(item => {
            item.createTime = item.createTime.replace(/T/g, ' ').substr(0, 19);
          });
        }
        this.setData({
          dynamic: res.data
        })
      }
    });

  },

})