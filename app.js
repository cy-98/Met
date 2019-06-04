//app.js
import AppIMDelegate from "./delegate/app-im-delegate";
var utils = require('./utils/util.js');
App({
  globalData: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    conversations: [],
    messges: [],
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
    cos:null
  },
  getIMHandler() {
    return this.appIMDelegate.getIMHandlerDelegate();
  },
  onLaunch(options) {
    let that = this;

    wx.checkSession({
      success: function () {
        //存在登陆态
        console.info("已经登录了");
      },
      fail: function () {
        //不存在登陆态
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: utils.rootUrl + 'login?code=' + res.code,
              success: function (data) {
                console.log(data);
                if (data.data['code'] === 400) {
                  wx.showToast({
                    title: 'token请求失败',
                  });
                } else if (data.data['code'] === 200) {
                  wx.setStorageSync('token', data.data['data']);
                  console.info("存储token成功");

                }
              },
              fail: function () {

              }
            })
          }
        });
      }
    });

    let userInfo = wx.getStorageSync("userInfo");
    console.info(userInfo);
    if (this.globalData.canIUse && !userInfo) {
      wx.redirectTo({
        url: '/pages/auth/auth',
      })
    }





    this.appIMDelegate = new AppIMDelegate(this);
    this.appIMDelegate.onLaunch(options);

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    });
  },
  onHide() {
    this.appIMDelegate.onHide();
  },
  onShow(options) {
    this.appIMDelegate.onShow(options);
  }
});