import IIMHandler from "../interface/i-im-handler";

import bus from '../../../utils/bus.js'


export default class Web extends IIMHandler {
    constructor() {
        super();
        this._onSocketOpen();
        this._onSocketMessage();
        this._onSocketError();
        this._onSocketClose();
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
                    connect();
                }
            }
        })

        // 监听 WebSocket 连接关闭事件
        wx.onSocketClose(function (res) {
            console.log("WebSocket 连接关闭")
            socketConnected = false;
            // 断线重连
            if (reconnect) {
                connect();
            }
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
            })

        })
    }


    // 发送消息
    sendSocketMessage(msg) {
        // console.log(msg);
        // 如果socket已连接则发送消息
        if (this.socketConnected) {
            wx.sendSocketMessage({
                data: msg
            })
        } else {
            // socket没有连接将消息放入队列中
            this.messageQueue = [];
            this.messageQueue.push(msg);
        }
    }

    // 关闭连接
    close() {
        if (this.socketConnected) {
            wx.closeSocket()
            this.socketConnected = false;
        }
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
        this.initSocket();
        return;

    }

    _sendMsgImp({
                    content,
                    success,
                    fail
                }) {
        wx.sendSocketMessage({
            data: JSON.stringify(content),
            success: () => {
                success && success(content);
            },
            fail: (res) => {
                fail && fail(res);
            }
        });
    }


    /**
     * 关闭webSocket
     */
    closeConnection() {
        wx.closeSocket();
    }

    connect() {
        wx.connectSocket({
            url: options.url + "?token=" + wx.getStorageSync("token"),
            method: 'GET'
        });
    }

    _onSocketError(cb) {
        wx.onSocketError((res) => {
            console.log("WebSocket 错误事件")
            if (!this.socketConnected) {
                // 断线重连
                if (this.reconnect) {
                    this.connect();
                }
            }
        })
    }

    _onSocketClose(cb) {
        wx.onSocketClose((res) => {
            console.log("WebSocket 连接关闭")
            socketConnected = false;
            // 断线重连
            if (this.reconnect) {
                this.connect();
            }
        });
    }

    _onSocketOpen() {
        wx.onSocketOpen((res) => {
            console.log("WebSocket 连接成功")
            this.socketConnected = true;
            this.ws.onopen();
            // 连接成功后，将队列中的消息发送出去
            let queueLength = this.messageQueue.length
            for (let i = 0; i < queueLength; i++) {
                this.sendSocketMessage(this.messageQueue.shift())
            }
        });
    }

    /**
     * webSocket是在这里接收消息的
     * 在socket连接成功时，服务器会主动给客户端推送一条消息类型为login的信息，携带了用户的基本信息，如id，头像和昵称。
     * 在login信息接收前发送的所有消息，都会被推到msgQueue队列中，在登录成功后会自动重新发送。
     * 这里我进行了事件的分发，接收到非login类型的消息，会回调监听函数。
     * @private
     */
    _onSocketMessage() {
        wx.onSocketMessage((res) => {
            this.ws.onmessage(res);
        })
    }

}