let JMessage = require('../../../utils/jmessage-wxapplet-sdk-1.4.0.min.js');
import IIMHandler from "../interface/i-im-handler";

var utilMd5 = require('../../../utils/md5util.js');
export default class WebSocketHandlerImp extends IIMHandler {
  constructor() {
    super();
    this. 
    this._onSocketMessage();
    this._onSocketError();
    this._onSocketClose();
    this.jim = new JMessage()
    this.appkey = "8cd84b5756d6366b8e0c30cb";
    this.onMsgRecListener = null;
    this.onMsgListListener = null;
  }


  createConnection({ options }) {
    // 初始化 进行登录 注册
    let timestamp = new Date().getTime();
    let signature = utilMd5.hexMD5("appkey=" + this.appkey + "&timestamp=" + timestamp + "&random_str=abcdefghijk_1234567890&key=ebc66effd808b17a1efa5306");
    console.info("signature" + signature);
    this.jim.init({
      "appkey": this.appkey,
      "random_str": "abcdefghijk_1234567890",
      "signature": signature,
      "timestamp": timestamp,
      "flag":1     //flag  :  是否启用消息漫游记录  0 ： 否  1 ： 是
    }).onSuccess(data =>  {
      //TODO
      console.info("success");

      this.jim.login({
        'username':"abc123",
        "password":"123Ghhhh",
      }).onSuccess(data => {
        console.info(data);
        console.info("login success");

        this.jim.getConversation().onSuccess(data => {
          console.info(data);
          getApp().globalData.conversations = data.conversations;
          this.onMsgListListener && this.onMsgListListener(data.conversations);
          // wx.setStorage({
          //   key: 'conversations',
          //   data: data.conversations,
          // });
        }).onFail(data => {
          console.error(data);
        });

        this.jim.onSyncConversation(data => {
          console.info(data);
          getApp().globalData.messages = data;
          
        });

        this.jim.onMsgReceive(data => {
          console.info("接收到消息开始处理");
          console.info(data);
          this.onMsgRecListener && this.onMsgRecListener(data);
          console.info("处理消息结束");
        });


      }).onFail(data => {
        console.info("login err");
        console.info(data);
        if(data.code === 880103){
          this.jim.register({
            'username':'abc123',
            'password':'123Ghhhh',
            'address': '深圳'
          }).onSuccess(function(data){
            console.info(data);
            console.info("注册成功");
          }).onFail(function(data){
            console.error("注册失败");
            console.error(data);
          });
        }
      });




    }).onFail(function (data) {
      //TODO
      console.info("fail");
    });  
  }

  /*
   * 发送消息
   */
  _sendTextMsg({ content, success, fail }){
    this.jim.sendSingleMsg({
      'target_username': content.friendId,
      'content': content.content,
      'extras':{'type':content.type, 'duration':content.duration}
    }).onSuccess(function (data, msg) {
      //data.code 返回码
      //data.message 描述
      //data.msg_id 发送成功后的消息 id
      //data.ctime_ms 消息生成时间,毫秒
      //data.appkey 用户所属 appkey
      //data.target_username 用户名
      //msg.content 发送成功消息体,见下面消息体详情
      console.info(data);
      success && success(content);
      // success && success(data);  
    }).onFail(function (data) {
      //data.code 返回码
      //data.message 描述
      console.info(data);
      fail && fail(data);
    });
  }

  _onSocketOpen(){

  }

  _onSocketClose(){

  }

  _onSocketError(){

  }
  _onSocketMessage(){

  }
  getConversations(success, fail){
    // this.jim.getConversation().onSuccess(data => {
    //   console.info(data);
    //   success && success(data);
    // }).onFail(data => {
    //   console.info(data);
    //   fail && fail(data);
    // });
    // console.info(getApp().globalData.messages);
    success && success(getApp().globalData.messages);
  }
  /**
   * 监听离线消息
   * 
   */
  sendMsg({content, success, fail}){
    console.info("发送消息good");
    console.info(content);
    let type = content.type;
    this._sendTextMsg({content, success, fail});
    // switch(type){
    //   case "text":
    //     // console.info(content.content);
    //     this._sendTextMsg({content, success, fail});
    //     break;
    //   case "image":
    //     this._sendImageMsg({content, success, fail});
    //     break;
    // }
    console.info("发送消息good");
  }

  setOnReceiveMessageListener({listener}){
    this.onMsgRecListener = listener;
  }
  setMsgListListener({listener}){
    this.onMsgListListener = listener;
  }
  getResource(media_id){
    this.jim.getResource({
      'media_id':media_id
    }).onSuccess(data => {
      return data.url;
    }).onFail(data => {
      console.error(data);
      return "baidu";
    });
  }

  getConversationSync({success}){
    console.info("同步消息")
    this.jim.onSyncConversation(data => {
      console.info(data);
      getApp().globalData.messages = data;
      success && success(data);
    });

  }
  reciptReport(username, msg_ids){
    this.jim.addSingleReceiptReport({'username':username, 'msg_ids':msg_ids})
      .onSuccess((data, msg_ids) => {
        console.info(data);
      }).onFail((data, msg_ids) => {

      }); 
  }

  getFriendList({success}){
    this.jim.getFriendList().onSuccess(data => {
      console.info(data);
      success && success(data);
    })
  }



}