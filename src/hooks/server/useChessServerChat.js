import { useCallback, useEffect, useState } from "react";
import useSocketIO from "./useSocketIo";

export const useChessServerChat = () => {
  const { socket, isOnline, handlePostEvent } = useSocketIO();
  const [messageHistory, setMessageHistory] = useState([]);

  const handlePostMessage = useCallback(
    (message) => handlePostEvent("POST_MESSAGE", message),
    [handlePostEvent]
  );

  useEffect(() => {
    socket.on("MESSAGE_RECEIVED", (message) => {
      console.log("received message - ", message);
      setMessageHistory((prevMessages) => [...prevMessages, message]);
    });
  }, [socket]);

  return { isOnline, messageHistory, handlePostMessage };
};

export default useChessServerChat;
