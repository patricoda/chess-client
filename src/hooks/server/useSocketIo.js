import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";

export const useSocketIO = () => {
  const [isOnline, setIsOnline] = useState(false);

  const [user, setUser] = useState(null);
  const socket = useContext(SocketContext);

  const handlePostEvent = useCallback(
    (eventType, data) => {
      socket.emit(eventType, data);
    },
    [socket]
  );

  useEffect(() => {
    setIsOnline(socket.connected);
    //TODO needs to be ID not socket ID when implemented.
    //TODO add user context / store to store ID and name
    setUser({ id: socket.id });
    socket.on("connect", (e) => {
      console.log("connected");
      setIsOnline(true);
    });

    socket.on("disconnect", () => setIsOnline(false));
  }, [socket]);

  return { socket, isOnline, handlePostEvent };
};

export default useSocketIO;
