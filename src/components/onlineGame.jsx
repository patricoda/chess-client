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
  const { gameState, handleMovePiece, handlePromotePiece, handleForfeit } =
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
    //TODO: disconnect
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
          <Dialog isVisible={gameState.status === "STALEMATE"}>
            <p>Stalemate!</p>
          </Dialog>
          <Dialog
            isVisible={["CHECKMATE", "FORFEIT"].includes(gameState.status)}
          >
            <p>
              {gameState.winningPlayer?.userId ===
              gameState.clientPlayer?.userId
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
          <input type="button" onClick={handleForfeit} value="forfeit" />
          <div>
            <p>{`online = ${isConnected}`}</p>
            <p>{`white online = ${
              gameState.players?.find((player) => player.allegiance === "WHITE")
                .isConnected
            }`}</p>
            <p>{`black online = ${
              gameState.players?.find((player) => player.allegiance === "BLACK")
                .isConnected
            }`}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default OnlineGame;
