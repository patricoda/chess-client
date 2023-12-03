import { createContext } from "react";

export const context = {
  connectedUser: undefined,
  isConnected: false,
  setEventListener: undefined,
  handlePostEvent: undefined,
  setConnectedUser: undefined,
  connect: undefined,
  networkError: undefined,
  usernameRequired: false,
};

export const SocketContext = createContext(context);

export default SocketContext;
