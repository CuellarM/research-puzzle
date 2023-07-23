import io from 'socket.io-client';

export const playerSocket = io('https://puzzle-node-service.vercel.app/');