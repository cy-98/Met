// pages/mine/setting/sethoby/sethoby.js
const app = getApp();//获取全局的颜色列表
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //标签背景颜色
    ColorList: [
      {title: '嫣红',name: 'red',color: '#e54d42'
      },{title: '桔橙',name: 'orange',color: '#f37b1d'
      },{title: '明黄',name: 'yellow',color: '#fbbd08'
      },{title: '橄榄',name: 'olive',color: '#8dc63f'
      },{title: '森绿',name: 'green',color: '#39b54a'
      },{title: '天青',name: 'cyan',color: '#1cbbb4'
      },{title: '海蓝',name: 'blue',color: '#0081ff'
      },{title: '姹紫',name: 'purple',color: '#6739b6'
      },{title: '木槿',name: 'mauve',color: '#9c26b0'
      },{title: '桃粉',name: 'pink',color: '#e03997'
      },{title: '棕褐',name: 'brown',color: '#a5673f'
      },{title: '玄灰',name: 'grey',color: '#8799a3'
      },{title: '草灰',name: 'gray',color: '#aaaaaa'
      },{title: '墨黑',name: 'black',color: '#333333'
      },{title: '雅白',name: 'white',color: '#ffffff'}
    ],
    //标签列表
    Taggroup: [{title: '爱往死里睡', color: 'red' },
     { title: '氪不改命', color: 'green' },
     { title: '驴友', color: 'cyan' },
     { title: '球场梅西', color: 'grey' },
     { title: '篮球篮球篮球', color: 'olive' },
     { title: 'MUSIC', color: 'yellow' },
     { title: '麦霸', color: 'white' }],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //妄想实现随机颜色
    let that = this,
        //颜色列表
        colorList = that.data.ColorList,
        //标签列表
        tags = that.data.Taggroup,
        tagsLen = tags.length;
    console.log(tags)
    let i = 0;
        //TO DO
    do{
        let random = Math.floor(Math.random() * tagsLen);
        tags[i].color = colorList[random]
        console.log(tags[i])
        console.log(colorList[random])
        i++
      }while(i<tagsLen);
    that.setData({
      Taggroup:tags
    })
  },
  //妄想实现随机颜色


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}})