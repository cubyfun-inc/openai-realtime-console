import { createServer } from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

import pkg from 'bcryptjs';
const { hashSync } = pkg;

const httpServer = createServer();

const io = new Server(httpServer, {
  path: '/v1/realtime',
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
});

instrument(io, {
  auth: {
    type: 'basic',
    username: 'batata@developer',
    password: hashSync('iYvdj1qa1FWy4AKAWTi5', 10),
  },
});

console.log('httpServer.listen(3000)');

httpServer.listen(3000);
