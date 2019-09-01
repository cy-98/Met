// pages/chat-list/chat-list.js
import {
  dealChatTime, msgShowTime
} from "../../utils/time";
/**
 * 会话列表页面
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conversations: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  toChat(e) {
    let item = e.currentTarget.dataset.item;
    delete item.latestMsg;
    delete item.unread;
    delete item.content;
    wx.navigateTo({
      url: `../chat/chat?friend=${JSON.stringify(item)}`
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
   // 这个是消息回调接口 当前是消息列表 如果获取消息 会进行一系列的操作
  onShow() {
    console.log('onshow')
    getApp().getIMHandler().setOnReceiveMessageListener({
      listener: (data) => {
        if (data.event === "msg_sync") {
          data.messages.forEach(msg => {
            let hasItem = false;
            let conversations = this.data.conversations;
            // 判断消息是否是已有列表中的消息
            conversations.forEach(con => {
              if (con.username === msg.from_username) {
                hasItem = true;
                con.unread_msg_count++;
                con.mtime = Date.now();
                getApp().globalData.messages.forEach(c => {
                  if (c.from_username === msg.from_username) {
                    c.msgs.push(msg); 
                  }
                });
                console.log('showed')
                let type = msg.content.msg_body.extras.type;
                if (type === undefined || type === "text")
                  con.latestMsg = msg.content.msg_body.text;
                else if (type === "voice")
                  con.latestMsg = "[语音]";
                else if (type === "image")
                  con.latestMsg = "[图片]";
              }
              con.timeStr =  msgShowTime(con.mtime);
            });
            // 如果不是消息列表的消息 我们进行添加一个新的消息进来
            if (!hasItem) {
              let conversation = {}
              conversation.name = msg.from_username;
              conversation.username = msg.from_username;
              // conversation.appkey = ;
              conversation.type = msg.msg_type;
              conversation.mtime = Date.now();
              conversation.nikeName = msg.from_username;
              conversation.unread_msg_count = conversation.unread_msg_count === undefined ? 1 : conversation.unread_msg_count++;
              conversations.push(conversation);
            }
            conversations.sort((a, b)=> {
              return b.mtime - a.mtime;
            });
            getApp().globalData.conversations = conversations;
            this.setData({
              conversations: conversations
            });
          });
        }

      }
    });
    // 获取消息列表后的操作 因为可能第一次或者前面打开可能导致页面数据没有加载完成 所以做了一个回调接口
    getApp().getIMHandler().setMsgListListener({
      listener: (data) => {
        console.info(data);
        let messages = getApp().globalData.messages || [];
        const currentTimestamp = Date.now();
        this.setLastMessage(data, messages);

      }
    });


    let conversations = getApp().globalData.conversations;
    let messages = getApp().globalData.messages;
    console.info(messages);

    this.setLastMessage(conversations, messages);
    // this.setData({conversations: getApp().globalData.conversations});
  },
  getConversationsItem(item) {
    let {
      latestMsg,
      ...msg
    } = item;
    return Object.assign(msg, JSON.parse(latestMsg));
  },
  conversationClick: function(res) {
    console.info(res);
    let con = res.currentTarget.dataset.item;
    let conversations = this.data.conversations;
    conversations.forEach(conversation => {
      if (con.username == conversation.username) {
        conversation.unread_msg_count = 0;
      }
    });
    this.setData({
      conversations: conversations
    });
    getApp().globalData.conversations = conversations;
    // console.info(JSON.stringify(con));
    wx.navigateTo({
      url: '/pages/chat/chat?conversation=' + JSON.stringify(con),
    })
  },
  // 设置最新的消息
  setLastMessage(converstaions, messages) {
    converstaions.forEach(conversation => {
      messages.forEach(con => {
        let type = con.msgs[con.msgs.length - 1].content.msg_body.extras.type;
        if (con.from_username === conversation.username) {
          console.info(type);
          if (type === undefined || type === "text")
            conversation.latestMsg = con.msgs[con.msgs.length - 1].content.msg_body.text;
          else if (type === "voice")
            conversation.latestMsg = "[语音]";
          else if (type === "image")
            conversation.latestMsg = "[图片]";

          // const time = dealChatTime(Date.now(), con.msgs[con.msgs.length - 1].ctime_ms);
          // conversation.timeStr = time.timeStr;
          conversation.timeStr = msgShowTime(conversation.mtime);

        }
      });
    });

    console.info(converstaions);
    converstaions.sort((a, b)=>{
      return b.mtime - a.mtime;
    })
    //
    wx.showTabBarRedDot({
      index: 2,
    })
    this.setData({
      conversations: converstaions
    });
  }
});