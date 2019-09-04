// pages/list/list.js
import * as chatInput from "../../modules/chat-input/chat-input";
import IMOperator from "./im-operator";
import UI from "./ui";
import MsgManager from "./msg-manager";

/**
 * 聊天页面
 */
Page({

    /**
     * 页面的初始数据
     */
    data: {
        textMessage: '',
        chatItems: [],
        latestPlayVoicePath: '',
        isAndroid: true,
        chatStatue: 'open',
        avatar:"",
        imOperator: null,
        adjust:false,
        bottom:0
    },
    chatInputBindFocusEvent:(e)=>{
      console.log('1')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        // const friend = JSON.parse(options.friend);
      console.info(options);
        let con = JSON.parse(options.conversation);
        console.log(con);
        this.initData();
        // wx.setNavigationBarTitle({
        //     title: con.nickName || ''
        // });
        this.setData({
          title:con.nickName || ''
        });

      var that = this;
      console.info("con");
      console.info(con);
      console.info("con end");
      getApp().getIMHandler().getUserInfo({
        userId: con.username, success: function (res) {
          // 使用region代替avatar
          console.info("good");
          console.info(res);
          // that._opts._otherHeadUrl = res.user_info.region;
          con['avatar'] = res.user_info.address;
          console.info("con");
          console.info(con);
          console.info("con end");
          that.setData({
            avatar:res.user_info.address
          });
          that.imOperator = new IMOperator(that, con);
          that.UI = new UI(that);
          that.msgManager = new MsgManager(that);

          that.imOperator.onSimulateReceiveMsg((msg) => {
            that.msgManager.showMsg({ msg })
          });
          that.UI.updateChatStatus('正在聊天中...');
          that.imOperator.getMsgHistory((msg) => {
            that.msgManager.showMsg({ msg })
          });
        }
      });
        
        
      getApp().getIMHandler().updateUnread(con.name);
    },
    initData() {
        let that = this;
        let systemInfo = wx.getSystemInfoSync();
        chatInput.init(this, {
            systemInfo: systemInfo,
            minVoiceTime: 1,
            maxVoiceTime: 60,
            startTimeDown: 56,
            format: 'mp3',//aac/mp3
            sendButtonBgColor: 'mediumseagreen',
            sendButtonTextColor: 'white',
            extraArr: [{
                picName: 'choose_picture',
                description: '照片'
            }, {
                picName: 'take_photos',
                description: '拍摄'
            }, {
                picName: 'close_chat',
                description: '自定义功能'
            }],
            // tabbarHeigth: 48
        });

        that.setData({
            pageHeight: systemInfo.windowHeight,
            isAndroid: systemInfo.system.indexOf("Android") !== -1,
        });
        wx.setNavigationBarTitle({
            title: '好友'
        });
        that.textButton();
        that.extraButton();
        that.voiceButton();
    },
    textButton() {
        chatInput.setTextMessageListener((e) => {
            let content = e.detail.value;
            this.msgManager.sendMsg({type: IMOperator.TextType, content});
        });
    },
    voiceButton() {
        chatInput.recordVoiceListener((res, duration) => {
            let tempFilePath = res.tempFilePath;
            this.msgManager.sendMsg({type: IMOperator.VoiceType, content: tempFilePath, duration});
        });
        chatInput.setVoiceRecordStatusListener((status) => {
            this.msgManager.stopAllVoice();
        })
    },

    //模拟上传文件，注意这里的cbOk回调函数传入的参数应该是上传文件成功时返回的文件url，这里因为模拟，我直接用的savedFilePath
    //上传文件    看不懂
    simulateUploadFile({savedFilePath, duration, itemIndex, success, fail}) {
        setTimeout(() => {
            let urlFromServerWhenUploadSuccess = savedFilePath;
            success && success(urlFromServerWhenUploadSuccess);
        }, 1000);
    },
    
    extraButton() {
        let that = this;
        chatInput.clickExtraListener((e) => {
            let chooseIndex = parseInt(e.currentTarget.dataset.index);
            if (chooseIndex === 2) {
                that.myFun();
                return;
            }
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['compressed'],
                sourceType: chooseIndex === 0 ? ['album'] : ['camera'],
                success: (res) => {
                    this.msgManager.sendMsg({type: IMOperator.ImageType, content: res.tempFilePaths[0]})
                }
            });

        });
    },
    /**
     * 自定义事件
     */
    myFun() {
        wx.showModal({
            title: '小贴士',
            content: '演示更新会话状态',
            confirmText: '确认',
            showCancel: true,
            success: (res) => {
                if (res.confirm) {
                    this.msgManager.sendMsg({type: IMOperator.CustomType})
                }
            }
        })
    },

    resetInputStatus() {
        chatInput.closeExtraView();
    },

    sendMsg({content, itemIndex, success}) {
        this.imOperator.onSimulateSendMsg({
            content,
            success: (msg) => {
                this.UI.updateViewWhenSendSuccess(msg, itemIndex);
                success && success(msg);
            },
            fail: () => {
                this.UI.updateViewWhenSendFailed(itemIndex);
            }
        })
    },
    /**
     * 重发消息
     * @param e
     */
    resendMsgEvent(e) {
        const itemIndex = parseInt(e.currentTarget.dataset.resendIndex);
        const item = this.data.chatItems[itemIndex];
        this.UI.updateDataWhenStartSending(item, false, false);
        this.msgManager.resend({...item, itemIndex});
    },
});