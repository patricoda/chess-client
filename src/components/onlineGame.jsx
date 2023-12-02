import { useContext, useEffect, useRef } from "react";
import useChessServerChat from "../hooks/server/useChessServerChat";
import useChessServerGameState from "../hooks/server/useChessServerGameState";
import ChatRoom from "./chatRoom";
import ChessBoard from "./chessboard";
import PromotionSelector from "./promotionSelector";
import SocketContext from "../context/socket";

const OnlineGame = () => {
  const { gameState, handleMovePiece, handlePromotePiece } =
    useChessServerGameState();
  const { messageHistory, handlePostMessage } = useChessServerChat();
  const dialogRef = useRef(null);

  const { isConnected, usernameRequired, handleConnect } =
    useContext(SocketContext);

  const handleNameSubmission = (e) => {
    e.preventDefault();
    //set name and attempt reconnect
    handleConnect({ username: e.currentTarget.name.value });
  };

  useEffect(() => {
    if (usernameRequired) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [usernameRequired]);

  return (
    <div>
      <dialog ref={dialogRef}>
        <form onSubmit={handleNameSubmission}>
          <input
            id="name"
            type="text"
            placeholder="Please enter your name"
            name="name"
          />
          <button>submit</button>
        </form>
      </dialog>
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
        <p>{`online = ${isConnected}`}</p>
        <p>{`is checkmate = ${gameState.isCheckmate}`}</p>
        <p>{`is stalemate = ${gameState.isStalemate}`}</p>
      </div>
    </div>
  );
};

export default OnlineGame;
