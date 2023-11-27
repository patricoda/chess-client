import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";

export const useSocketIO = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [connectedUser, setConnectedUser] = useState({});

  const socket = useContext(SocketContext);

  const handlePostEvent = useCallback(
    (eventType, data) => {
      socket.emit(eventType, data);
    },
    [socket]
  );

  useEffect(() => {
    //check for active session
    const sessionId = localStorage.getItem("sessionId");
    socket.auth = { sessionId };
    socket.connect();

    socket.on("SESSION_INITIALISED", (sessionData) => {
      //store session ID for reconnection
      localStorage.setItem("sessionId", sessionData.sessionId);
      setConnectedUser({
        username: sessionData.username,
        userId: sessionData.userId,
      });
    });

    socket.on("connect", () => {
      console.log("connected");
      setIsOnline(true);
    });

    socket.on("disconnect", () => setIsOnline(false));
  }, [socket]);

  return { socket, connectedUser, isOnline, handlePostEvent };
};

export default useSocketIO;
