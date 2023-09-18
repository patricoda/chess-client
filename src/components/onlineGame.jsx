import useChessServerChat from "../hooks/server/useChessServerChat";
import useChessServerGameState from "../hooks/server/useChessServerGameState";
import ChatRoom from "./chatRoom";

const OnlineGame = () => {
  const { isOnline, gameState, handlePostMove } = useChessServerGameState();
  const { messageHistory, handlePostMessage } = useChessServerChat();

  return (
    <div className="App">
      <div>{`${isOnline}`}</div>
      {
        //TODO extract board from offlineGame and use here, too
      }
      <ChatRoom
        messageHistory={messageHistory}
        handleMessageSubmit={handlePostMessage}
      />
    </div>
  );
};

export default OnlineGame;
