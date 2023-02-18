import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socket";

export const useSocketIo = () => {
  const [isOnline, setIsOnline] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("connect", () => {
      setIsOnline(true);
    });
    socket.on("disconnect", () => setIsOnline(false));
  }, [socket]);

  return { socket, isOnline };
};

export default useSocketIo;
