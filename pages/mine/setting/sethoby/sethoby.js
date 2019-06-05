// pages/mine/setting/sethoby/sethoby.js
const app = getApp(); //获取全局的颜色列表
var network = require("../../../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputTag:'',
    //标签背景颜色
    colorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    }, {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    }, {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    }, {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    }, {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    }, {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    }, {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    }, {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    }, {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    }, {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    }, {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    }, {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    }, {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    }, {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    }, {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    }],
    myTags:[],
    //标签列表
    taggroup: [
      {
        title: '爱往里睡'
      },
      {
        title: '氪不改命'
      },
      {
        title: '驴友'
      },
      {
        title: '球场西'
      },
      {
        title: '篮篮球'
      },
      {
        title: 'MUSIC'
      },
      {
        title: '麦霸'
      },
      {
        title: '球场梅西'
      },
      {
        title: '篮球篮球'
      },
      {
        title: 'MUSIC'
      },
      {
        title: '霸'
      },
      {
        title: '球场西'
      },
      {
        title: '篮球篮球篮球'
      },
      {
        title: 'MUIC'
      },
      {
        title: '麦霸'
      }
    ],
  },

  //标签输入
  inputTag:function(e){
    this.setData({
      inputTag:e.detail.value
    })
  },
  //添加标签
  addTag:function(){
    let list = this.data.myTags;
    let trim = this.data.inputTag.replace(/\s*/g, "")
    if (!trim){
      wx.showToast({
        title: '请输入内容',
      });
      return 
    }else{
      list.push({ title: trim });
      console.log(list);
      this.setData({
        myTags:list
      })
      network.addTag({
        content: trim,
        success: function (res) {
          console.log('添加兴趣')
        },
        fail: function () {
          console.log('fail')
        }
      })
    }
    
  },
  //添加选中的标签
  selectTag:function(e){
    let myTags = this.data.myTags;
    myTags.push({title:e.currentTarget.dataset.title});
    this.setData({
      myTags:myTags
    })
    network.addTag({
      content: e.currentTarget.dataset.title,
      success: function (res) {
        console.log('选择兴趣')
      },
      fail: function () {
        console.log('fail')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    




    //妄想实现随机颜色
    let that = this;
    //颜色列表
    console.info(that);
    let colorList = that.data.colorList;
    //标签列表
    let tags = that.data.taggroup;
    let tagsLen = tags.length;
    console.info(tags);
    let i = 0;
    do {
      let random = Math.floor(Math.random() * tagsLen);
      tags[i].color = colorList[random].name
     
      i++
    } while (i < tagsLen);


    that.setData({
      taggroup: tags
    });

  let userInfo = wx.getStorageSync("userInfo");
  console.info(userInfo);
  let myTags = [];
  let tag = userInfo.interest || [];
  tag.forEach(item => {
    myTags.push({
      title:item
    })
  });
  this.setData({
    myTags:myTags
  })

  },
  //妄想实现随机颜色


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