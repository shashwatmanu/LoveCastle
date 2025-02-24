import { io } from 'socket.io-client';

const socket = io('http://localhost:8080'); // Backend URL

export default socket;
