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
      },{
        title:"学霸"
      },{
        title: '球场西'
      },{
        title: '篮篮球'
      },{
        title: 'MUSIC'
      },{
        title:'学渣'
      },{
        title: '麦霸'
      },{
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
  addTag:function(e){
    let formId  = e.detail.formId;
    let list = this.data.myTags;
    let trim = this.data.inputTag.replace(/\s*/g, "");
    if (!trim){
      wx.showToast({
        title: '请输入内容',
      });
      return 
    }else{
      let color = this.data.colorList[Math.floor(Math.random() * this.data.colorList.length)]
      list.push({ title: trim,
                  color: color.name
       });
      console.log(list);
      this.setData({
        myTags:list
      })
      console.log(formId);
      let tag = {
        content: trim,
        formId: formId,
        success: function (res) {
          console.log('添加兴趣')
        },
        fail: function () {
          console.log('fail')
        }
      }
      console.log(tag.formId)
      network.addTag(tag)
    }
    
  },
  //添加选中的标签
  selectTag:function(e){
    let formId=  e.detail.formId;
    let myTags = this.data.myTags;
    let color = this.data.colorList[Math.floor(Math.random() * this.data.colorList.length)].name;
    myTags.push({
      title:e.currentTarget.dataset.title,
      color:color
    });
    this.setData({
      myTags:myTags
    });
    network.addTag({
      content: e.currentTarget.dataset.title,
      formId:formId,
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
    let that = this;
    //获取标签
    network.getUserInfo({ success:res =>{
      let userInfo = wx.getStorageSync("userInfo");
      let myTags = [];
      let tag = userInfo.interest || [];
      //添加颜色
      tag.forEach(item => {
        let randex = Math.floor(Math.random() * tags.length);
        let color = colorList[randex].name;
        myTags.push({
          color: color,
          title: item
        })
      });
      this.setData({
        myTags: myTags
      })
    }});

    //妄想实现随机颜色
    
    //颜色列表
    let colorList = that.data.colorList;
    //标签列表
    let tags = that.data.taggroup;
    let tagsLen = tags.length;

    let i = 0;
    do {
      let random = Math.floor(Math.random() * colorList.length);
      tags[i].color = colorList[random].name
      i++
    } while (i < tagsLen);


    that.setData({
      taggroup: tags
    });



  },
  //妄想实现随机颜色

  //删除标签
  deleteTag:function(e){

    let formId = e.detail.formId;
    network.deleteTag({
      content:e.currentTarget.dataset.item.title,
      formId: formId,
      success:res => {
      },
      fail: res => {
      }
    });
    let myTags = this.data.myTags;
    myTags.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      myTags:myTags
    });

  }



})