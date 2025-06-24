// utils/socket.js
import { io } from "socket.io-client";

const socket = io("https://apisonehaat.dousoftit.com", {
    transports: ['websocket'],
  });

export default socket;