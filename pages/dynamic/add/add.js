// pages/dynamic/add/add.js
let utils = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    index: 0,
    picker: ['表白墙', '约学习', "二手"],
    content:"",
    annous:false,
    unshake:false
  },

  ChooseImage:function(){
    var that = this;
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        wx.showLoading({
          title: '上传中....',
        })
        res.tempFilePaths.forEach(function (item) {
          wx.uploadFile({
            url: 'https://school.chpz527.cn/api/upload',
            filePath: item,
            name: 'file',
            success: function (res) {
              wx.hideLoading();
              console.log(JSON.parse(res.data));
              var data = JSON.parse(res.data)
              that.setData({
                imgList: that.data.imgList.concat(data.file_name)
              })
            },
            fail: function () {
              util.isError('图片上传失败', that);
            }
          })
        });

      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这个图片吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  textareaAInput(e){
    this.setData({
      'content':e.detail.value
    });
  },
  PickerChange(e){
    console.info(e);
    this.setData({index:e.detail.value});
  },
  changeAnnous(e){
    console.info(e);
    this.setData({
      annous:e.detail.value
    });
  },

  formSubmit: function(e){
    this.setData({
      unshake:true
    });
    console.info(e.detail.formId);
    let formId = e.detail.formId;
    if(!this.data.content || this.data.content == ""){
      wx.showToast({
        title: '内容不能为空',
      });
      this.setData({
        unshake:false
      })
      return;
    }
    let data = {
      content : this.data.content,
      images: this.data.imgList.join(","),
      type: this.data.index,
      anonymous: this.data.annous ? 1 : 0,
      formId:formId
    }
    wx.showLoading({
      title: '提交中....',
    });
    utils.req("dynamic", data, res => {
      console.info(res);
      wx.hideLoading();
      if(res.code === 200){
        wx.redirectTo({
          url: '/pages/dynamic/index/index?id=' + res.data.id,
        })
      }else{
        wx.showToast({
          title: '发布失败',
        });
      }
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})