const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list: [{
      title: '一周CP',
      img: 'https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg',
      url: '/indexes/indexes',
      time:'2019-6-19'
    },
    {
      title: '联盟院赛',
      img: 'https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg',
      url: '/animation/animation',
      time:'2019-6-19'
    },
    {
      title: '三运足球',
      img: 'https://image.weilanwl.com/color2.0/plugin/qpct2148.jpg',
      url: '/drawer/drawer',
      time:'2019-6-19'
    },
    {
      title: '海飞丝大放送',
      img: 'https://image.weilanwl.com/color2.0/plugin/qpczdh2307.jpg',
      url: '/verticalnav/verticalnav',
      time:'2019-6-19'
    }
    ]
  },
  methods: {
    toChild(e) {
      wx.navigateTo({
        url: '/pages/plugin' + e.currentTarget.dataset.url
      })
    },
  }
});