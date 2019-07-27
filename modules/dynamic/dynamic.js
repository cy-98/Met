var dynamic = {
  clickAvatar:function(e){
    console.info(e);
    wx.navigateTo({
      url: '/pages/mine/user/info?id=' + e.currentTarget.dataset.user,
    })
  },
  clickContent: function(e){
    console.info(e);
    wx.navigateTo({
      url: '/pages/dynamic/index/index?id=' + e.currentTarget.dataset.id,
    })
  },
  clickImages: function(e){
    console.info(e);
    wx.previewImage({
      current:e.currentTarget.dataset.current,
      urls: e.currentTarget.dataset.all,
    })
  },
  
}
export default dynamic;