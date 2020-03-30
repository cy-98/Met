// pages/list/list.js
import * as chatInput from "../../modules/chat-input/chat-input";
import IMOperator from "./im-operator";
import UI from "./ui";
import MsgManager from "./msg-manager";

console.log(chatInput);
const network = require('../../utils/network.js');
import {
    dealChatTime
} from "../../utils/time";

let lastTime = 0;
import bus from "../../utils/bus.js"

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
        avatar: "",
        imOperator: null,
        adjust: false,
        bottom: 0,
        userInfo: null,
        scrollTop: 0,
        unreadNum: 0
    },
    chatInputBindFocusEvent: (e) => {
        console.log('1')
    },

    createChatItem(msg) {
        const time = dealChatTime(new Date(msg.createTime).getTime(), lastTime);
        let obj = {
            msgId: 0, //消息id
            friendId: this.data.userInfo.id, //好友id
            isMy: msg.srcId != this.data.userInfo.id, //我发送的消息？
            showTime: time.ifShowTime, //是否显示该次发送时间
            time: time.timeStr, //发送时间 如 09:15,
            timestamp: new Date(msg.createTime).getTime(), //该条数据的时间戳，一般用于排序
            type: msg.msgType, //内容的类型，目前有这几种类型： text/voice/image/custom | 文本/语音/图片/自定义
            content: msg.content, // 显示的内容，根据不同的类型，在这里填充不同的信息。
            headUrl: msg.srcId != this.data.userInfo.id ? this.data.myInfo.avatar : this.data.userInfo.avatar, //显示的头像，自己或好友的。
            sendStatus: 'success', //发送状态，目前有这几种状态：sending/success/failed | 发送中/发送成功/发送失败
            voiceDuration: msg.duration, //语音时长 单位秒
            isPlaying: false, //语音是否正在播放
        };
        lastTime = new Date(msg.createTime).getTime();
        return obj;
    },

    onShow(options) {
        console.info(options);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        network.readChatMsg({userId: options.userId});

        let userId = options.userId;
        this.msgManager = new MsgManager(this);
        let myInfo = wx.getStorageSync("userInfo");
        this.setData({
            myInfo: myInfo
        });

        let unreadNum = getApp().globalData.unreadMsgNum;
        let conversations = getApp().globalData.conversations;
        conversations.forEach((con) => {
            if (con.user.id === userId){
                getApp().globalData.unreadMsgNum -= con.unread;
                con.unread = 0;
            }
        });
        unreadNum = getApp().globalData.unreadMsgNum;
        this.setData({
            unreadNum
        });

        bus.on('ReceiveMsg', msg => {
            console.info("接受到消息:" + msg);

            console.info("播放提示音");
            const innerAudioContext = wx.createInnerAudioContext();//新建一个createInnerAudioContext();
            innerAudioContext.autoplay = true;//音频自动播放设置
            innerAudioContext.src = '/audio/notice.mp3';//链接到音频的地址
            innerAudioContext.onPlay(() => {
            });//播放音效
            innerAudioContext.onError((res) => {//打印错误
                console.log(res.errMsg);//错误信息
                console.log(res.errCode);//错误码
            });

            // 接收到消息是当前用户的
            if (msg.srcId == this.data.userInfo.id) {
                let chatItems = this.data.chatItems;
                let msgItem = this.createChatItem(msg);
                chatItems.push(msgItem);
                this.setData({
                    chatItems
                });
                // 通知APP 这个消息已经读取了
                bus.emit('ReadMsg', this.data.userInfo.id);

            }else{
                this.setData({
                    unreadNum: this.data.unreadNum + 1
                })
            }


        });


        network.getChatList({
            userId: userId,
            success: res => {
                console.info(res);
                this.imOperator = new IMOperator(this, res.data);
                let chatItems = [];
                this.setData({
                    userInfo: res.data.user
                })
                res.data.records.forEach(item => {
                    let msgItem = this.createChatItem(item);
                    chatItems.push(msgItem);
                })

                this.setData({
                    userInfo: res.data.user,
                    chatItems: chatItems
                });
                let that = this;

                that.UI = new UI(that);
                this.initData();

                const query = wx.createSelectorQuery();
                query.select('#chatScrollView').boundingClientRect();
                query.selectViewport().scrollOffset()

                query.exec(function (res) {
                    console.info(res);
                    that.setData({
                        scrollTop: (res[0].bottom + res[0].height + res[0].top) * 1000
                    })
                    // res[0].top       // #the-id节点的上边界坐标
                    // res[1].scrollTop // 显示区域的竖直滚动位置
                })

            }
        });

    },
    initData() {
        let that = this;
        let systemInfo = wx.getSystemInfoSync();
        chatInput.init(this, {
            systemInfo: systemInfo,
            minVoiceTime: 1,
            maxVoiceTime: 60,
            startTimeDown: 56,
            format: 'mp3', //aac/mp3
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
                description: '渣男语录'
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
            console.info("发送消息:" + content);

            this.msgManager.sendMsg({
                type: IMOperator.TextType,
                content
            });
        });
    },
    voiceButton() {
        chatInput.recordVoiceListener((res, duration) => {
            let tempFilePath = res.tempFilePath;
            this.msgManager.sendMsg({
                type: IMOperator.VoiceType,
                content: tempFilePath,
                duration
            });
        });
        chatInput.setVoiceRecordStatusListener((status) => {
            this.msgManager.stopAllVoice();
        })
    },

    //模拟上传文件，注意这里的cbOk回调函数传入的参数应该是上传文件成功时返回的文件url，这里因为模拟，我直接用的savedFilePath
    //上传文件    看不懂
    simulateUploadFile({
                           savedFilePath,
                           duration,
                           itemIndex,
                           success,
                           fail
                       }) {
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
                    this.msgManager.sendMsg({
                        type: IMOperator.ImageType,
                        content: res.tempFilePaths[0]
                    })
                }
            });

        });
    },
    /**
     * 自定义事件
     */
    myFun() {
        wx.request({
            url: 'https://api.lovelive.tools/api/SweetNothings',
            method: 'GET',
            success: res => {
                console.info(res);
                this.setData({
                    textMessage: res.data
                });
                this.msgManager.sendMsg({
                    type: IMOperator.TextType,
                    content: res.data
                });
            }
        })
        // this.setData({
        //     textMessage: 'nb'
        // })
        // wx.showModal({
        //     title: '小贴士',
        //     content: '演示更新会话状态',
        //     confirmText: '确认',
        //     showCancel: true,
        //     success: (res) => {
        //         if (res.confirm) {
        //             this.msgManager.sendMsg({
        //                 type: IMOperator.CustomType
        //             })
        //         }
        //     }
        // })
    },

    clickNotice: function(e){
      wx.navigateTo({
          url: "/pages/chat/chat?userId=" + e.currentTarget.dataset.userid
      })
    },

    resetInputStatus() {
        chatInput.closeExtraView();
    },

    sendMsg({
                content,
                itemIndex,
                success
            }) {
        console.info("发送消息");
        content.friendId = this.data.userInfo.id;
        content.userId = this.data.myInfo.id;
        bus.emit('SendMsg', content);
        this.UI.updateViewWhenSendSuccess(content, itemIndex);
        success && success(content);
    },
    /**
     * 重发消息
     * @param e
     */
    resendMsgEvent(e) {
        const itemIndex = parseInt(e.currentTarget.dataset.resendIndex);
        const item = this.data.chatItems[itemIndex];
        this.UI.updateDataWhenStartSending(item, false, false);
        this.msgManager.resend({
            ...item,
            itemIndex
        });
    },

    onUnload: function (e) {
        network.readChatMsg(this.data.userInfo.id);
        console.info("设置已读消息");
        bus.emit('ReadMsg', this.data.userInfo.id);

    }

});
