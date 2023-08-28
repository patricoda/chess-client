import "./App.css";
import ChatRoom from "./components/chatRoom";
import Game from "./components/game";
import useChessServerChat from "./hooks/server/useChessServerChat";

function App() {
  const { socket, isOnline, messageHistory, handlePostMessage } =
    useChessServerChat();

  return (
    <div className="App">
      <div>{`${isOnline}`}</div>
      <Game />
      <ChatRoom
        messageHistory={messageHistory}
        handleMessageSubmit={handlePostMessage}
      />
    </div>
  );
}

export default App;
