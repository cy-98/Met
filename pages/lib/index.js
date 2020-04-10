// pages/lib/index.js
const app = getApp();
const network = require("../../utils/network");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        curr: 0,
        CustomBar: app.globalData.CustomBar,
        StatusBar: app.globalData.StatusBar,
        loanHistory: [],
        loanInfo: [],
        userInfo: [],
        searchText: "",
        searchContent: []
    },
    NavChange: function (e) {
        console.info("切换页面");
        this.setData({
            curr: e.currentTarget.dataset.current
        })
    },
    search: function (e) {
        console.info(e);
        if (e.detail.value) {
            network.findBook({
                name: e.detail.value,
                success: res => {
                    console.info("查询数据成功");
                    console.info(res);
                    let content = JSON.parse(res.data);
                    // 查询成功
                    if (content.success){
                        this.setData({
                            searchContent: content.data.searchResult
                        })
                    } else {
                        wx.showToast({
                            title: "查询失败",
                            icon: 'none'
                        })
                    }

                }
            })
        } else {
            wx.showToast({
                title: '请输入查询内容',
                icon: 'none'
            });
            return;
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        network.libInfo({
            success: res => {
                console.info("获取图书馆信息成功");
                console.info(res);
                // 处理当前借阅
                let loanInfo = JSON.parse(res.data.loanInfo);
                console.info(loanInfo);
                if (loanInfo.success) {
                    loanInfo.data.searchResult.forEach((item) => {
                       let normReturnDate = new Date(item.normReturnDate);
                       if (normReturnDate.getTime() < new Date().getTime()){
                           item.normReturn = false;
                       } else {
                           item.normReturn = true;
                       }
                    });

                    this.setData({
                        loanInfo: loanInfo.data.searchResult
                    })
                }
                // 处理历史借阅

                let historyInfo = JSON.parse(res.data.loanHistory);
                console.info(historyInfo);
                if (historyInfo.success) {
                    this.setData({
                        loanHistory: historyInfo.data.searchResult
                    })
                }


            }
        })
    },

    renewBook: function(e){
      console.info(e);
      let loanId = e.currentTarget.dataset.loanId;
      console.info(loanId);
      network.renewBook({
          bookId: loanId,
          success: res => {
              console.info(res);
              const result = JSON.parse(res.data);
              if (result.success){
                  wx.showToast({
                      title: "续借成功"
                  })
              } else {
                  wx.showToast({
                      title: "续借失败",
                      icon: "none"
                  })
              }
          }, fail: err => {
              console.info(err);
          }
      })

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
})
