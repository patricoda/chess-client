import useChessServerChat from "../hooks/server/useChessServerChat";
import useChessServerGameState from "../hooks/server/useChessServerGameState";
import ChatRoom from "./chatRoom";
import ChessBoard from "./chessboard";
import PromotionSelector from "./promotionSelector";

const OnlineGame = () => {
  const { isOnline, gameState, handleMovePiece, handlePromotePiece } =
    useChessServerGameState();
  const { messageHistory, handlePostMessage } = useChessServerChat();

  //TODO: promotion handler and coords
  return (
    <div className="App">
      {gameState.clientPlayer?.isPlayerTurn &&
        gameState.isAwaitingPromotionSelection && (
          <PromotionSelector
            allegiance={gameState.clientPlayer.allegiance}
            promotionHandler={handlePromotePiece}
          />
        )}
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
      <div>
        <p>{`online = ${isOnline}`}</p>
        <p>{`is checkmate = ${gameState.isCheckmate}`}</p>
        <p>{`is stalemate = ${gameState.isStalemate}`}</p>
      </div>
    </div>
  );
};

export default OnlineGame;
