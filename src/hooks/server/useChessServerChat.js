import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";

export const useChessServerChat = () => {
  const [messageHistory, setMessageHistory] = useState([]);

  const { setEventListener, handlePostEvent } = useContext(SocketContext);

  const handlePostMessage = useCallback(
    (roomId, message) => handlePostEvent("POST_MESSAGE", { roomId, message }),
    [handlePostEvent]
  );

  useEffect(
    () =>
      setEventListener("MESSAGE_RECEIVED", (message) =>
        setMessageHistory((prevMessages) => [...prevMessages, message])
      ),
    [setEventListener]
  );

  return { messageHistory, handlePostMessage };
};

export default useChessServerChat;
