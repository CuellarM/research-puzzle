import io from 'socket.io-client';

export const playerSocket = io('https://puzzle-node-service-a46c.onrender.com');

// LOCAL RUN
// export const playerSocket = io('http://localhost:3001');
