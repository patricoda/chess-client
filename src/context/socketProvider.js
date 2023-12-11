import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import SocketContext from "./socket";
import { io } from "socket.io-client";

export const SocketContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUser, setConnectedUser] = useState({
    userId: undefined,
    username: "",
  });
  //record whether or not a new username is required if no session was found on connecting
  const [usernameRequired, setUsernameRequired] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  const socket = useRef(io("localhost:3001", { autoConnect: false }));

  const handlePostEvent = useCallback((eventType, data) => {
    socket.current.emit(eventType, data);
  }, []);

  const setEventListener = useCallback((event, callback) => {
    socket.current.on(event, callback);
  }, []);

  const removeEventListener = useCallback((event, callback) => {
    socket.current.off(event, callback);
  }, []);

  const handleConnect = useCallback((username) => {
    //attach sessionId and username if applicable
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
      setNetworkError(null);
    });

    socket.current.on("disconnect", () => setIsConnected(false));

    socket.current.on("connect_error", (err) => {
      console.log(err.message);
      if (err.message === "Invalid username") {
        setUsernameRequired(true);
      } else {
        setNetworkError(err.message);
      }
    });

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
      networkError,
      usernameRequired,
      connectedUser,
      setEventListener,
      removeEventListener,
      handlePostEvent,
      handleConnect,
    }),
    [
      isConnected,
      networkError,
      usernameRequired,
      connectedUser,
      setEventListener,
      removeEventListener,
      handlePostEvent,
      handleConnect,
    ]
  );

  return (
    <SocketContext.Provider value={context}>{children}</SocketContext.Provider>
  );
};

export default memo(SocketContextProvider);
