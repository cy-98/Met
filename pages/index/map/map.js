var network = require("../../../utils/network.js");
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: false,
    markers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    qqmapsdk = new QQMapWX({
      key: '5O2BZ-7QJKJ-TRGFA-KARQV-GSOW6-E2BAI'
    });
    that.openMap()
      // wx.showModal({
      //   content: '是否开启定位?',
      //   success(res) {
      //     if (res.confirm) {
      //       wx.openSetting({
      //         success:(res)=>{
      //           wx.setStorage({
      //             key: 'openLocationState',
      //             data: true,
      //           })
      //           that.met()
      //         }
      //       })
      //       that.openMap()
      //     } else if (res.cancel) {
      //       wx.switchTab({
      //         url: "/pages/index/index",
      //       })
      //     }
      //   }
      // })

   
    
    //获取定位
    // 检测是否是开启位置信息的设置
  },
  openLocation: function (e) {
    console.info(e);
    let openLocationState = !wx.getStorageSync("openLocationState");
    
    if (openLocationState) {
      this.met();
      wx.setStorageSync("openLocationState", openLocationState);

      this.setData({
        openLocationState: openLocationState
      });
    } else {


      
      wx.showModal({
        title: '是否要关闭定位',
        content: '关闭定位后不能查看别人的定位哦',
        success: res => {
          console.info(res);
          if (res.confirm){
            this.setData({
              openLocationState: openLocationState
            });
            this.setData({
              markers: []
            });
            wx.setStorageSync("openLocationState", openLocationState);
            wx.reLaunch({
              url: '/pages/index/index',
            });


            wx.showToast({
              title: '关闭定位信息',
            });


          }
        },
      })

      
    }
  },
  met: function () {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        console.log(res)
        let location = {}
        location.latitude = res.latitude;
        location.longitude = res.longitude;
        location.speed = res.speed;
        location.accuracy = res.accuracy;
        this.setData({
          location: location
        });
        network.punch({
          longitude: res.longitude,
          latitude: res.latitude,
          success: res => {
            console.info("发送位置信息");
          }
        });

      },
    });

    network.punches({
      success: res => {

        let markers = [];
        res.data.data.forEach(item => {
          let marker = {}
          marker.id = item.user.id;
          marker.latitude = item.latitude;
          marker.longitude = item.longitude;
          marker.iconPath = item.user.avatar;
          marker.width = 30;
          marker.height = 30;
          markers.push(marker);
        });
        this.setData({
          markers: markers
        })
      }
    })
  },
  openMap: function (e) {
    console.log(this.data.location)
    
    var that = this
    wx.getSetting({
      success(res) {

        //这里判断是否有地位权限
        if (!res.authSetting['scope.userLocation']) {
          wx.openSetting({
            success: (res) => {
              that.setData({
                location: true
              })
            },
            fail:(res)=>{
              console.log(res)
              wx.showModal({
                content: '请开启权限',
                success:(res)=>{
                  if(res.confirm){
                    wx.openSetting({
                      success:(res)=>{
                        that.setData({
                          location:true
                        })
                      }
                    })
                  }
                },
                fail:()=>{
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              })
            }
          })
        }
      }

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //获取定位
    let that = this;
    // 检测是否是开启位置信息的设置
    let state = wx.getStorageSync("openLocationState");
    if (state !== false) {
      console.info("state 为空");
      wx.setStorageSync("openLocationState", true);
      this.setData({
        openLocationState: true
      });
      state = true;
    }
    this.setData({
      openLocationState: state
    })
    console.info(state);
    if (state) {
      this.met();
    } else {
      wx.showModal({
        content: '是否开启定位?',
        success(res) {
          if (res.confirm) {
            that.openLocation();
          } else if (res.cancel) {
            wx.switchTab({
              url: "/pages/index/index",
            })
          }
        }
      })
    }
    //初始获取定位权限
    wx.authorize({
      scope: 'scope.userLocation',
      success: (res) => {
        console.log(res)//检测定位
        wx.getStorage({
          key: 'openLocationState',
          success: function(res) {

          },
          fail:function(){
            wx.setStorage({
              key: 'openLocationState',
              data: true,
            })
          }
        })
      },
      fail:(res)=>{
        console.log(res)//检测定位
        wx.setStorage({
          key: 'openLocationState',
          data: false,
        })
      }
    })
  },
  markertap: function (e) {
    console.info(e);
    wx.navigateTo({
      url: '/pages/mine/user/info?id=' + e.markerId,
    })
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
})