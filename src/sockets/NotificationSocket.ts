import { io, Socket } from 'socket.io-client';
import { env } from '../config/env';

let socket: Socket | null = null;

export function connectNotificationSocket(token: string) {
  if (socket) {
    return socket;
  }

  socket = io(env.apiUrl, {
    transports: ['websocket'],
    auth: {
      token,
    },
  });

  return socket;
}

export function disconnectNotificationSocket() {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
}

export function getNotificationSocket() {
  return socket;
}
