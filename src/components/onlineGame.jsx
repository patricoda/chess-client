import useChessServerChat from "../hooks/server/useChessServerChat";
import useChessServerGameState from "../hooks/server/useChessServerGameState";
import ChatRoom from "./chatRoom";
import ChessBoard from "./chessboard";

const OnlineGame = () => {
  const { isOnline, gameState, handleMovePiece } = useChessServerGameState();
  const { messageHistory, handlePostMessage } = useChessServerChat();

  //TODO: promotion handler and coords
  return (
    <div className="App">
      <div>{`${isOnline}`}</div>
      {!!gameState.boardState && (
        <ChessBoard
          moveHandler={handleMovePiece}
          boardState={gameState.boardState}
          clientPlayer={gameState.clientPlayer}
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
