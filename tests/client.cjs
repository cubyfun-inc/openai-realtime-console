const { io } = require('socket.io-client');

// 创建一个连接到服务端的socket实例
const socket = io('http://localhost:3133', {
  transports: ['websocket'], // or
});

// 当成功连接到服务端时触发
socket.on('connect', () => {
  console.log('已成功连接到服务端');

  // 向服务端发送一条消息
  const message = '这是来自客户端的消息';
  socket.emit('message', message);

  console.log('recovered?', socket.recovered);

//   setTimeout(() => {
//     if (socket.io.engine) {
//       // close the low-level connection and trigger a reconnection
//       socket.io.engine.close();
//     }
//   }, 10000);
});

// 当接收到服务端发送的响应消息时触发
socket.on('response', (responseMsg) => {
  console.log('收到服务端响应:', responseMsg);
});

// 当与服务端断开连接时触发
socket.on('disconnect', (e) => {
  console.log('已与服务端断开连接111', e);
});
