const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

// 引入cors库
const cors = require('cors');

// 设置CORS中间件，允许所有跨域请求，在实际应用中可根据需要进行更精准的设置
app.use(cors());

const port = process.env.PORT || 3133;

const io = new Server(server, {
  cors: {
    origin: '*',
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  },
});

// 当有客户端连接时触发
io.on('connection', (socket) => {
  console.log('一个客户端已连接', 'socket.recovered:', socket.recovered);

  // 当接收到客户端发送的消息时触发
  socket.on('message', (msg) => {
    console.log('收到客户端消息:', msg);
    // 这里可以对收到的消息进行处理，然后可以选择向客户端发送响应等操作
    // 例如，向发送消息的客户端回发一个确认消息
    socket.emit('response', '已收到你的消息');
  });

  // 当客户端断开连接时触发
  socket.on('disconnect', () => {
    console.log('一个客户端已断开连接');
  });
});

// 启动服务器，监听在3133端口
server.listen(port, () => {
  console.log('服务器已启动，正在监听端口3133');
});
