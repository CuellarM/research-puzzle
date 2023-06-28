import io from 'socket.io-client';

export const playerSocket = io('http://localhost:3001/');