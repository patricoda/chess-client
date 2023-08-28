import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";

export const useSocketIO = () => {
  const [isOnline, setIsOnline] = useState(false);
  const socket = useContext(SocketContext);

  const handlePostEvent = useCallback(
    (eventType, data) => {
      socket.emit(eventType, data);
    },
    [socket]
  );

  useEffect(() => {
    socket.on("connect", () => {
      setIsOnline(true);
    });

    socket.on("disconnect", () => setIsOnline(false));
  }, [socket]);

  return { socket, isOnline, handlePostEvent };
};

export default useSocketIO;
