import { useCallback, useContext } from "react";
import useChessServerChat from "../hooks/server/useChessServerChat";
import useChessServerGameState from "../hooks/server/useChessServerGameState";
import ChatRoom from "./chatRoom";
import SocketContext from "../context/socket";
import NewUserDialog from "./dialog/newUserDialog";
import { ErrorDialog } from "./dialog/errorDialog";
import { Game } from "./game";
import { Dialog } from "./dialog/dialog";
import { useNavigate } from "react-router-dom";

const OnlineGame = () => {
  const navigate = useNavigate();
  const { gameState, handleMovePiece, handlePromotePiece } =
    useChessServerGameState();
  const { messageHistory, handlePostMessage } = useChessServerChat();

  const { isConnected, networkError, usernameRequired, handleConnect } =
    useContext(SocketContext);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      //set name and attempt reconnect
      handleConnect(e.currentTarget.name.value);
    },
    [handleConnect]
  );

  const handleSubmitMessage = useCallback(
    (message) => {
      handlePostMessage(gameState.id, message);
    },
    [handlePostMessage, gameState.id]
  );

  const handleLeaveGame = useCallback(() => {
    //TODO
    navigate("/");
  }, [navigate]);

  return (
    <div className="wrapper">
      <ErrorDialog
        isVisible={networkError && networkError !== "Invalid username"}
      >
        <p>{networkError}</p>
      </ErrorDialog>
      {usernameRequired ? (
        <NewUserDialog handleSubmit={handleSubmit} isVisible={true} />
      ) : gameState.isAwaitingGame ? (
        <Dialog isVisible={true}>
          <p>Please wait...</p>
        </Dialog>
      ) : (
        <>
          <Dialog isVisible={gameState.isStalemate}>
            <p>Stalemate!</p>
          </Dialog>
          <Dialog isVisible={gameState.isCheckmate}>
            <p>
              {gameState.winningPlayer?.id === gameState.clientPlayer?.id
                ? "You win!"
                : "You lose!"}
            </p>
          </Dialog>
          <Game
            gameState={gameState}
            handleMovePiece={handleMovePiece}
            handlePromotePiece={handlePromotePiece}
          />
          <ChatRoom
            messageHistory={messageHistory}
            handleMessageSubmit={handleSubmitMessage}
          />
          <input type="button" onClick={handleLeaveGame} value="leave" />
          <div>
            <p>{`online = ${isConnected}`}</p>
            <p>{`is checkmate = ${gameState.isCheckmate}`}</p>
            <p>{`is stalemate = ${gameState.isStalemate}`}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default OnlineGame;
