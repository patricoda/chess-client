import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import SocketContext from "./socket";
import { io } from "socket.io-client";

const connect = () => {};
export const SocketContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUser, setConnectedUser] = useState({
    userId: undefined,
    username: "",
  });
  //record whether or not a new username is required if no session was found on connecting
  const [usernameRequired, setUsernameRequired] = useState(false);

  const socket = useRef(io("localhost:3001", { autoConnect: false }));

  const handlePostEvent = useCallback((eventType, data) => {
    socket.current.emit(eventType, data);
  }, []);

  const setEventListener = useCallback((event, callback) => {
    socket.current.on(event, callback);
  }, []);

  const handleConnect = useCallback((username) => {
    //attach sessionId if stored
    socket.current.auth = {
      sessionId: localStorage.getItem("sessionId"),
      username,
    };
    socket.current.connect();
  }, []);

  useEffect(() => {
    socket.current.on("SESSION_INITIALISED", (sessionData) => {
      //store session ID for reconnection
      localStorage.setItem("sessionId", sessionData.sessionId);
      setConnectedUser({
        userId: sessionData.userId,
        username: sessionData.username,
      });
    });

    socket.current.on("connect", () => {
      console.log("connected");
      setIsConnected(true);
      setUsernameRequired(false);
    });
    socket.current.on("disconnect", () => setIsConnected(false));

    socket.current.on("connect_error", (err) => {
      console.log(err.message);
      setUsernameRequired(true);
    });

    //TODO: if dev only
    //TODO: unregister events?
    socket.current.onAny((event, ...args) => {
      console.log(event, args);
    });
  }, []);

  useEffect(() => {
    handleConnect();
  }, [handleConnect]);

  const context = useMemo(
    () => ({
      isConnected,
      usernameRequired,
      connectedUser,
      setConnectedUser,
      setEventListener,
      handlePostEvent,
      handleConnect,
    }),
    [
      isConnected,
      usernameRequired,
      connectedUser,
      setConnectedUser,
      setEventListener,
      handlePostEvent,
      handleConnect,
    ]
  );

  return (
    <SocketContext.Provider value={context}>{children}</SocketContext.Provider>
  );
};

export default memo(SocketContextProvider);
