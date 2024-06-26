import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import useGameState from "../hooks/online/useGameState";
import SocketContext from "../context/socket";
import NewUserDialog from "./dialog/newUserDialog";
import { ErrorDialog } from "./dialog/errorDialog";
import { Game } from "./game";
import { Dialog } from "./dialog/dialog";
import { useNavigate } from "react-router-dom";
import GameResultDialog from "./dialog/gameResultDialog";
import { SocketContextProvider } from "../context/socketProvider";
import { GameStatus } from "@patricoda/chess-engine";
import ButtonHolder from "./buttonHolder";
import LeaveButton from "./button/leaveButton";
import ForfeitButton from "./button/forfeitButton";
import LeaveIconButton from "./button/leaveIconButton";
import NewGameButton from "./button/newGameButton";
import PlayerProfile from "./playerProfile";
import WidgetContainer from "./widgetContainer";

const OnlineGameWithContext = () => (
  <SocketContextProvider>
    <OnlineGame />
  </SocketContextProvider>
);

const OnlineGame = () => {
  const navigate = useNavigate();
  const {
    gameState,
    handleMovePiece,
    handlePromotePiece,
    handleForfeit,
    handleLeaveGame,
    handleFindNewGame,
  } = useGameState();

  const { networkError, usernameRequired, handleConnect, handleDisconnect } =
    useContext(SocketContext);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      //set name and attempt reconnect
      handleConnect(e.currentTarget.name.value);
    },
    [handleConnect]
  );

  const handleLeaveAndFindNewGame = useCallback(() => {
    handleLeaveGame();
    handleFindNewGame();
  }, [handleLeaveGame, handleFindNewGame]);

  const hasGameEnded = useMemo(
    () =>
      [GameStatus.CHECKMATE, GameStatus.STALEMATE, GameStatus.FORFEIT].includes(
        gameState.status
      ),
    [gameState.status]
  );

  const handleLeave = useCallback(
    () =>
      //navigating away will unmount the page and handle forfeit / leaving events
      navigate("/"),
    [navigate]
  );

  useEffect(() => {
    //if leaving page via back button or similar, consider active game abandoned
    return () => handleDisconnect();
  }, [handleDisconnect]);

  return (
    <>
      <ErrorDialog
        isVisible={networkError && networkError !== "Invalid username"}
      >
        <p>{networkError}</p>
        <LeaveButton onClick={handleLeave} />
      </ErrorDialog>
      <NewUserDialog handleSubmit={handleSubmit} isVisible={usernameRequired} />
      {gameState.isAwaitingGame ? (
        <Dialog isVisible={gameState.isAwaitingGame}>
          <p>Finding an opponent...</p>
          <LeaveButton onClick={handleLeave} />
        </Dialog>
      ) : (
        <>
          {hasGameEnded && <GameResultDialog gameState={gameState} />}
          {gameState.status !== GameStatus.NOT_STARTED && (
            <div className="game-container">
              <WidgetContainer className="header">
                <PlayerProfile
                  player={gameState.players.find(
                    (player) => player.userId !== gameState.clientPlayer.userId
                  )}
                />
              </WidgetContainer>
              <Game
                gameState={gameState}
                handleMovePiece={handleMovePiece}
                handlePromotePiece={handlePromotePiece}
                playerAllegiance={gameState.clientPlayer.allegiance}
                flipPerspectiveForBlack={true}
              />
              <WidgetContainer className="footer">
                <PlayerProfile player={gameState.clientPlayer} />
                <ButtonHolder>
                  {hasGameEnded ? (
                    <>
                      <NewGameButton onClick={handleLeaveAndFindNewGame} />
                      <LeaveIconButton onClick={handleLeave} />
                    </>
                  ) : (
                    <ForfeitButton onClick={handleForfeit} />
                  )}
                </ButtonHolder>
              </WidgetContainer>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OnlineGameWithContext;
