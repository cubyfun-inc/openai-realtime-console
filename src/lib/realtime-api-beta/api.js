import { RealtimeEventHandler } from './event_handler.js';
import { RealtimeUtils } from './utils.js';
import { io } from 'socket.io-client';

export class RealtimeAPI extends RealtimeEventHandler {
  /**
   * Create a new RealtimeAPI instance
   * @param {{url?: string, debug?: boolean}} [settings]
   * @returns {RealtimeAPI}
   */
  constructor({ url, debug, path } = {}) {
    super();
    this.url = url;
    this.path = path ?? '';
    this.debug = !!debug;
    this.socket = null;
  }

  /**
   * Tells us whether or not the socket is connected
   * @returns {boolean}
   */
  isConnected() {
    return !!this.socket && this.socket.connected;
  }

  /**
   * Writes Socket.io logs to console
   * @param  {...any} args
   * @returns {true}
   */
  log(...args) {
    const date = new Date().toISOString();
    const logs = [`[Socket.io/${date}]`].concat(args).map((arg) => {
      if (typeof arg === 'object' && arg !== null) {
        return JSON.stringify(arg, null, 2);
      } else {
        return arg;
      }
    });
    if (this.debug) {
      console.log(...logs);
    }
    return true;
  }

  /**
   * Connects to Realtime API Socket.io Server
   * @returns {Promise<true>}
   */
  async connect() {
    if (this.isConnected()) {
      throw new Error(`Already connected`);
    }

    const socket = io(this.url, {
      path: this.path,
      query: {
        characterTplName: 'Batagon',
      },
      auth: {
        'Batata-Auth': '25e5eee5-5ca1-4573-bfae-fc8d1b57f6ab',
        // authorization: '',
        // authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QzQGN1YnkuZnVuIiwic3ViIjoiZjhlMjZiNjUtODk5My00ODVjLWE4ODEtMzRiOWUzYzI0OTE5IiwiaWF0IjoxNzEyMTIwODM2LCJleHAiOjE3MTIxNDk2MzZ9.1rBbokLIUx-zfPDTlxtzoYM0ndYIBgg2WZwXEZmUa2k',
        // authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQGN1YnkuZnVuIiwic3ViIjoiNGFlN2MyZjEtOGI5Mi00ZDk0LTlkNzItYWU1NGM5OGJjODhhIiwiaWF0IjoxNzI5NzM3ODkxLCJleHAiOjE3Mjk3NjY2OTF9.3YYu8zNXABBsOBGBk7jA2qS2EjLlOqyKnSYd_GCXTUA',
      },
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.on('message', (data) => {
      let message;
      if (typeof data === 'string') {
        message = JSON.parse(data.toString());
      } else {
        message = data;
      }

      this.receive(message.type, message);
    });

    socket.on('call_client_function', (data, callback) => {
      console.log('call_client_function', data);

      // callback({ status: 'success', data: 'Hello back!' });
    });

    return new Promise((resolve, reject) => {
      const connectionErrorHandler = (e) => {
        this.disconnect();
        reject(
          new Error(`Could not connect to "${this.url}, error: ${e?.message}"`)
        );
      };

      socket.on('connect_error', connectionErrorHandler);
      socket.on('connect', () => {
        // console.log('recovered?', socket.recovered);

        // setTimeout(() => {
        //   console.log('setTimeout');
        //   if (socket.io.engine) {
        //     console.log('1111,222');
            
        //     // close the low-level connection and trigger a reconnection
        //     socket.io.engine.close();
        //   }
        // }, 10000);

        this.log(`Connected to "${this.url}"`);
        socket.off('connect_error', connectionErrorHandler);

        socket.on('error', () => {
          this.disconnect();
          this.log(`Error, disconnected from "${this.url}"`);
          this.dispatch('close', { error: true });
        });
        socket.on('disconnect', () => {
          this.disconnect();
          this.log(`Disconnected from "${this.url}"`);
          this.dispatch('close', { error: false });
        });
        this.socket = socket;
        resolve(true);
      });
    });
  }

  /**
   * Disconnects from Realtime API server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      return true;
    }
  }

  /**
   * Receives an event from Socket.io and dispatches as "server.{eventName}" and "server.*" events
   * @param {string} eventName
   * @param {{[key: string]: any}} event
   * @returns {true}
   */
  receive(eventName, event) {
    this.log(`received:`, eventName, event);
    this.dispatch(`server.${eventName}`, event);
    this.dispatch('server.*', event);
    return true;
  }

  /**
   * Sends an event to Socket.io and dispatches as "client.{eventName}" and "client.*" events
   * @param {string} eventName
   * @param {{[key: string]: any}} event
   * @returns {true}
   */
  send(eventName, data) {
    if (!this.isConnected()) {
      throw new Error(`RealtimeAPI is not connected`);
    }
    data = data || {};
    if (typeof data !== 'object') {
      throw new Error(`data must be an object`);
    }
    const event = {
      event_id: RealtimeUtils.generateId('evt_'),
      type: eventName,
      ...data,
    };
    this.dispatch(`client.${eventName}`, event);
    this.dispatch('client.*', event);
    this.log(`sent:`, eventName, event);
    this.socket.emit('message', event); // 通过 socket.io 发事件
    return true;
  }

  sendCustom(eventName, data) {
    this.socket.emit(eventName, data); // 通过 socket.io 发事件
    return true;
  }


  /**
   * emit 自定义事件
   * @param {string} eventName
   * @param {{[key: string]: any}} event
   * @returns {true}
   */
    sendCustom(eventName, data) {
      if (!this.isConnected()) {
        throw new Error(`RealtimeAPI is not connected`);
      }
      this.socket.emit(eventName, data); // 通过 socket.io 发事件
      return true;
    }
}
