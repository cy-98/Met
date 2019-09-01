import {
  dealChatTime
} from "../../utils/time";

/**
 * 这个类是IM模拟类，作为示例仅供参考。
 */
export default class IMOperator {
  static VoiceType = 'voice';
  static TextType = 'text';
  static ImageType = 'image';
  static CustomType = 'custom';

  constructor(page, opts) {
    this._opts = opts;
    this._latestTImestamp = 0; //最新消息的时间戳
    this._myHeadUrl = wx.getStorageSync('userInfo').avatar;
    this._otherHeadUrl = this._opts.avatar;
    let that = this;

  }

  getFriendId() {
    return this._opts.username;
  }

  onSimulateReceiveMsg(cbOk) {
    getApp().getIMHandler().setOnReceiveMessageListener({
      listener: (msg) => {
        if (!msg) {
          return;
        }
        let msgItem;
        msg.messages.forEach(item => {
          // 说明是私聊
          let messages = getApp().globalData.messages;
          if (item.msg_type === 3) {
            // 说明是文本消息
            if (item.content.msg_type === undefined) item.content.msg_type === "text";

            let msgObj = {};
            msgObj.type = item.content.msg_body.extras.type;
            msgObj.isMy = false;
            msgObj.content = item.content.msg_body.text;
            msgObj.duration = item.content.msg_body.extras.duration;
            msgItem = this.createNormalChatItem(msgObj);
            this._latestTImestamp = item.content.create_time;
            // 添加到用户的消息中 不一定是当前的用户的
            messages.forEach(conversation => {
              if (conversation.from_username === item.from_username) {
                conversation.msgs.push(item);
              }
            })
          }
          getApp().globalData.messages = messages;
          // 判断当前的来的消息是否是聊天界面的用户消息 如果是当前的用户消息 就展示出来
          if(item.from_username === this.getFriendId()){
            cbOk && cbOk(msgItem);
          }else{
            // 设置接受消息的未读消息 需要判断当前页面的用户是否是接受消息的用户
            let conversations = getApp().globalData.conversations;
            conversations.forEach(con => {
              // 给对应的用户添加消息未读数
              if(con.username === item.from_username){
                con.unread_msg_count ++;
                con.mtime = Date.now();
              }
            });
            getApp().globalData.conversations = conversations;
          }


        })
      }
    });

  }

  onSimulateSendMsg({
    content,
    success,
    fail
  }) {
    //这里content即为要发送的数据
    //这里的content是一个对象了，不再是一个JSON格式的字符串。这样可以在发送消息的底层统一处理。
    let data = content;
    getApp().getIMHandler().sendMsg({
      content,
      success: (content) => {
        //这个content格式一样,也是一个对象
        const item = this.createNormalChatItem(content);
        console.info(content);
        this._latestTImestamp = content.ctime_ms;

        let messages = getApp().globalData.messages;
        messages.forEach(conversation => {
          if (conversation.from_username === item.friendId) {

            var msgContent = new Object;
            msgContent.content = {};
            msgContent.content.from_id = "abc123";
            msgContent.content.msg_body = {};
            msgContent.content.msg_body.extras = {};
            msgContent.content.msg_body.extras.type = content.type;
            msgContent.content.msg_body.extras.duration = content.duration;
            msgContent.content.msg_body.text = data.content;
            msgContent.ctime_ms = Date.now();
            msgContent.content.msg_type = "text";
            msgContent.msg_type = 3;
            conversation.msgs.push(msgContent);
          }
        });
        getApp().globalData.messages = messages;
        console.info(getApp().globalData.messages);


        success && success(item);
      },
      fail
    });
  }

  createChatItemContent({
    type = IMOperator.TextType,
    content,
    duration
  } = {}) {
    // if (!content.replace(/^\s*|\s*$/g, '')) return;
    // let content = url;
    return {
      content,
      type,
      conversationId: 0, //会话id，目前未用到
      userId: getApp().globalData.userInfo.userId,
      friendId: this.getFriendId(), //好友id
      duration
    };
  }

  createNormalChatItem({
    type = IMOperator.TextType,
    content = '',
    isMy = true,
    duration
  } = {}) {
    if (!content) return;




    const currentTimestamp = Date.now();
    const time = dealChatTime(currentTimestamp, this._latestTImestamp);
    let obj = {
      msgId: 0, //消息id
      friendId: this.getFriendId(), //好友id
      isMy: isMy, //我发送的消息？
      showTime: time.ifShowTime, //是否显示该次发送时间
      time: time.timeStr, //发送时间 如 09:15,
      timestamp: currentTimestamp, //该条数据的时间戳，一般用于排序
      type: type, //内容的类型，目前有这几种类型： text/voice/image/custom | 文本/语音/图片/自定义
      content: content, // 显示的内容，根据不同的类型，在这里填充不同的信息。
      headUrl: isMy ? this._myHeadUrl : this._otherHeadUrl, //显示的头像，自己或好友的。
      sendStatus: 'success', //发送状态，目前有这几种状态：sending/success/failed | 发送中/发送成功/发送失败
      voiceDuration: duration, //语音时长 单位秒
      isPlaying: false, //语音是否正在播放
    };
    obj.saveKey = obj.friendId + '_' + obj.msgId; //saveKey是存储文件时的key
    return obj;
  }

  createHistoryChatItem({
    type = IMOperator.TextType,
    content = '',
    isMy = true,
    duration,
    lastTime = 0,
    thisTime = 0
  } = {}) {
    if (!content) return;

  
    // const currentTimestamp = Date.now();
    const time = dealChatTime(thisTime, lastTime);
    console.info(time);
    let obj = {
      msgId: 0, //消息id
      friendId: this.getFriendId(), //好友id
      isMy: isMy, //我发送的消息？
      showTime: time.ifShowTime, //是否显示该次发送时间
      time: time.timeStr, //发送时间 如 09:15,
      timestamp: thisTime, //该条数据的时间戳，一般用于排序
      type: type, //内容的类型，目前有这几种类型： text/voice/image/custom | 文本/语音/图片/自定义
      content: content, // 显示的内容，根据不同的类型，在这里填充不同的信息。
      headUrl: isMy ? this._myHeadUrl : this._otherHeadUrl, //显示的头像，自己或好友的。
      sendStatus: 'success', //发送状态，目前有这几种状态：sending/success/failed | 发送中/发送成功/发送失败
      voiceDuration: duration, //语音时长 单位秒
      isPlaying: false, //语音是否正在播放
    };
    obj.saveKey = obj.friendId + '_' + obj.msgId; //saveKey是存储文件时的key
    return obj;
  }


  getMsgHistory(msgManager) {
    // let messages = getApp().globalData.messages;
    getApp().getIMHandler().getConversationSync((data) => {

    });
    let messages = getApp().globalData.messages;
    // let messages = data;
    console.info(messages);

    if (messages === undefined) {
      getApp().globalData.messages = [];
      messages = [];
    }
    messages.forEach(conversation => {
      if (conversation.from_username === this.getFriendId()) {
        let msgs = [];
        conversation.msgs.slice(-8).forEach(msg => {

          let msgObj = Object;
          msgObj.type = msg.content.msg_body.extras.type;
          msgObj.isMy = msg.content.from_id != this.getFriendId();
          msgObj.content = msg.content.msg_body.text;
          msgObj.duration = msg.content.msg_body.extras.duration;
          msgObj.thisTime = msg.ctime_ms;
          msgObj.lastTime = this._latestTImestamp;
          const msgItem = this.createHistoryChatItem(msgObj);

          this._latestTImestamp = msg.ctime_ms;
          msgManager && msgManager(msgItem);
          msgs.push(msg.msg_id);

        });

        conversation.msgs.slice(0, -8).forEach(msg => {

          let msgObj = Object;
          msgObj.type = msg.content.msg_body.extras.type;
          msgObj.isMy = msg.content.from_id != this.getFriendId();
          msgObj.content = msg.content.msg_body.text;
          msgObj.duration = msg.content.msg_body.extras.duration;
          msgObj.thisTime = msg.ctime_ms;
          msgObj.lastTime = this._latestTImestamp;
          const msgItem = this.createHistoryChatItem(msgObj);

          this._latestTImestamp = msg.ctime_ms;
          msgManager && msgManager(msgItem);
          msgs.push(msg.msg_id);

        });

        getApp().getIMHandler().reciptReport(conversation.from_username, msgs);


      }
    });

  }

  static createCustomChatItem() {
    return {
      timestamp: Date.now(),
      type: IMOperator.CustomType,
      content: '会话已关闭'
    }
  }

}