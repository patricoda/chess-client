import { useCallback, useContext, useMemo } from "react";
import useChessServerChat from "../hooks/server/useChessServerChat";
import useChessServerGameState from "../hooks/server/useChessServerGameState";
import ChatRoom from "./chatRoom";
import SocketContext from "../context/socket";
import NewUserDialog from "./dialog/newUserDialog";
import { ErrorDialog } from "./dialog/errorDialog";
import { Game } from "./game";
import { Dialog } from "./dialog/dialog";
import { useNavigate } from "react-router-dom";
import GameResultDialog from "./dialog/gameResultDialog";

const OnlineGame = () => {
  const navigate = useNavigate();
  const {
    gameState,
    handleMovePiece,
    handlePromotePiece,
    handleForfeit,
    handleLeaveGame,
    handleFindNewGame,
  } = useChessServerGameState();
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

  const handleLeave = useCallback(() => {
    handleLeaveGame();
    navigate("/");
  }, [handleLeaveGame, navigate]);

  const handleLeaveAndFindNewGame = useCallback(() => {
    handleLeaveGame();
    handleFindNewGame();
  }, [handleLeaveGame, handleFindNewGame]);

  const hasGameEnded = useMemo(
    () => ["CHECKMATE", "STALEMATE", "FORFEIT"].includes(gameState.status),
    [gameState.status]
  );

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
          {hasGameEnded && <GameResultDialog gameState={gameState} />}
          <Game
            gameState={gameState}
            handleMovePiece={handleMovePiece}
            handlePromotePiece={handlePromotePiece}
          />
          <ChatRoom
            messageHistory={messageHistory}
            handleMessageSubmit={handleSubmitMessage}
          />
          {hasGameEnded ? (
            <>
              <input
                type="button"
                onClick={handleLeaveAndFindNewGame}
                value="find new game"
              />
              <input type="button" onClick={handleLeave} value="leave" />
            </>
          ) : (
            <input type="button" onClick={handleForfeit} value="forfeit" />
          )}
          <div>
            <p>{`online = ${isConnected}`}</p>
            <p>{`white online = ${
              gameState.players?.find((player) => player.allegiance === "WHITE")
                ?.isConnected
            }`}</p>
            <p>{`black online = ${
              gameState.players?.find((player) => player.allegiance === "BLACK")
                ?.isConnected
            }`}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default OnlineGame;
