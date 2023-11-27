import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io("localhost:3001", { autoConnect: false });

export const setAuth = (authObj) => (socket.auth = authObj);

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export const SocketContext = createContext(socket);
