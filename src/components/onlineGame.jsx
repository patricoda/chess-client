import useChessServerChat from "../hooks/server/useChessServerChat";
import useChessServerGameState from "../hooks/server/useChessServerGameState";
import ChatRoom from "./chatRoom";
import ChessBoard from "./chessboard";

const OnlineGame = () => {
  const { isOnline, gameState, handlePostMove } = useChessServerGameState();
  const { messageHistory, handlePostMessage } = useChessServerChat();

  //TODO: promotion handler and coords
  return (
    <div className="App">
      <div>{`${isOnline}`}</div>
      {gameState.boardState && (
        <ChessBoard
          moveHandler={handlePostMove}
          board={gameState.boardState}
          playerTurn={gameState.playerTurn}
        />
      )}
      <ChatRoom
        messageHistory={messageHistory}
        handleMessageSubmit={handlePostMessage}
      />
    </div>
  );
};

export default OnlineGame;
