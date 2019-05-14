//app.js
import AppIMDelegate from "./delegate/app-im-delegate";

App({
    globalData: {
        userInfo: {},
        conversations:[],
        messges:[]
    },
    getIMHandler() {
        return this.appIMDelegate.getIMHandlerDelegate();
    },
    onLaunch(options) {
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