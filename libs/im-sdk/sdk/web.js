import IIMHandler from "../interface/i-im-handler";

import bus from '../../../utils/bus.js'


export default class Web extends IIMHandler {
    constructor() {
        super();
        this._app = undefined;

        // this.socketConnected = false;
        // // 待发送的消息队列
        // this.messageQueue = [];
        // // 是否断线重连
        // this.reconnect = true;

        // this.Stomp = require('../../../utils/stomp.js').Stomp;
        // this.ws = {
        //   send: this.sendSocketMessage,
        //   close: this.close
        // }

    }

    initSocket() {
        let that = this;
        // socket是否连接
        let socketConnected = false;
        // 待发送的消息队列
        let messageQueue = [];
        // 是否断线重连
        let reconnect = true;

        // 发送消息
        function sendSocketMessage(msg) {
            // console.log(msg);
            // 如果socket已连接则发送消息
            if (socketConnected) {
                wx.sendSocketMessage({
                    data: msg
                })
            } else {
                // socket没有连接将消息放入队列中
                messageQueue.push(msg);
            }
        }

        // 关闭连接
        function close() {
            if (socketConnected) {
                wx.closeSocket()
                socketConnected = false;
            }
        }

        // 符合WebSocket定义的对象
        var ws = {
            send: sendSocketMessage,
            close: close
        }

        // 创建一个 WebSocket 连接
        function connect() {
            let token = wx.getStorageSync("token");
            console.info(token);
            if (token){
                wx.connectSocket({
                    url: "wss://met.chpz527.cn/im?token=" + wx.getStorageSync("token"),
                    // url: "ws://127.0.0.1:8888/im?token=" + wx.getStorageSync("token"),
                    success: res => {
                        console.info(res);
                    },
                    fail: err => {
                        console.info(err);
                    }
                })
            } else {
                console.info("token为空现在不进行连接")
            }


        }

        connect();

        // 监听 WebSocket 连接打开事件
        wx.onSocketOpen(function (res) {
            console.log("WebSocket 连接成功");
            socketConnected = true;
            ws.onopen();
            // 连接成功后，将队列中的消息发送出去
            let queueLength = messageQueue.length;
            for (let i = 0; i < queueLength; i++) {
                sendSocketMessage(messageQueue.shift())
            }
        })

        // 监听 WebSocket 接受到服务器的消息事件
        wx.onSocketMessage(function (res) {
            console.info(res);
            ws.onmessage(res);
        })

        // 监听 WebSocket 错误事件
        wx.onSocketError(function (res) {
            console.log("WebSocket 错误事件")
            if (!socketConnected) {
                // 断线重连
                if (reconnect) {
                    setTimeout(() => {
                        connect();
                    }, 2000)
                    // connect();
                }
            }
        })

        // 监听 WebSocket 连接关闭事件
        wx.onSocketClose(function (res) {
            console.log("WebSocket 连接关闭");
            socketConnected = false;
            if (reconnect){
                setTimeout(() => {
                    connect();
                }, 2000)
            }
            // connect();
        })


        const Stomp = require('../../../utils/stomp.js').Stomp;

        /**
         * 定期发送心跳或检测服务器心跳
         *  The heart-beating is using window.setInterval() to regularly send heart-beats and/or check server heart-beats.
         *  可看stomp.js的源码（195,207，489行），由于小程序没有window对象，所以我们要调用小程序的定时器api实现
         */
        Stomp.setInterval = function (interval, f) {
            return setInterval(f, interval);
        };
        // 结束定时器的循环调用
        Stomp.clearInterval = function (id) {
            return clearInterval(id);
        };

        const stompClient = Stomp.over(ws);
        // let app = getApp();
        console.info(this._app.globalData);
        this._app.globalData.socketClient = stompClient;

        stompClient.connect({}, function (callback) {
            console.info("stompClient连接成功");

            // 订阅自己的
            stompClient.subscribe('/user/queue/sendUser', function (message, headers) {
                console.log('收到只发送给我的消息:', message.body);
                bus.emit('ReceiveMsg', JSON.parse(message.body));
                message.ack();
            });

            stompClient.subscribe("/user/queue/sendNotice", function (message, headers) {
                console.log('收到通知:', message.body);
                bus.emit('ReceiveNotice', JSON.parse(message.body));
                message.ack();
            });

        });

        console.info("订阅消息发送");
        // 在外面订阅消息 就没有重复发送消息的bug
        bus.on('SendMsg', (msg) => {
            console.info("监听到消息了");
            console.info(msg);
            // 向服务端发送消息
            stompClient.send("/sendServer", {}, JSON.stringify({
                'content': msg.content,
                'user': msg.friendId,
                'duration': msg.duration ? msg.duration : 0,
                'msgType': msg.type
            }));
        });

        stompClient.disconnect(() => {
            console.info("stompClient断开连接");
        })
    }





    /**
     * 创建WebSocket连接
     * 如：this.imWebSocket = new IMWebSocket();
     *    this.imWebSocket.createSocket({url: 'ws://10.4.97.87:8001'});
     * 如果你使用本地服务器来测试，那么这里的url需要用ws，而不是wss，因为用wss无法成功连接到本地服务器
     * @param options 建立连接时需要的配置信息，这里是传入的url，即你的服务端地址，端口号不是必需的。
     */
    createConnection({
                         options
                     }) {

        console.info(options);
        this._app = options.app;
        if (this._app.globalData.socketClient){
            console.info("不需要重新注册了已经有了");
            return;
        } else {
            this.initSocket();
        }

    }

}
