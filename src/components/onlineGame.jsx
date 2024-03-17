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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faPlus, faSignOut } from "@fortawesome/free-solid-svg-icons";

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
  const gameStatus = useRef("");

  //store game status as a ref to ensure we do not mutate handleAbandon and accidentally call our 'unmount' useEffect hook
  useEffect(() => {
    gameStatus.current = gameState.status;
  }, [gameState.status]);

  const { networkError, usernameRequired, handleConnect } =
    useContext(SocketContext);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      //set name and attempt reconnect
      handleConnect(e.currentTarget.name.value);
    },
    [handleConnect]
  );

  const handleLeavePage = useCallback(() => {
    if (gameStatus.current === GameStatus.IN_PROGRESS) {
      handleForfeit();
    }

    handleLeaveGame();
  }, [handleLeaveGame, handleForfeit]);

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

  const handleLeave = useCallback(() => {
    //navigating away will unmount the page and handle forfeit / leaving events
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    //if leaving page via back button or similar, consider active game abandoned
    return () => handleLeavePage();
  }, [handleLeavePage]);

  return (
    <>
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
          <div className="game-container">
            <Game
              gameState={gameState}
              handleMovePiece={handleMovePiece}
              handlePromotePiece={handlePromotePiece}
              playerAllegiance={gameState.clientPlayer.allegiance}
            />
            <ButtonHolder>
              {hasGameEnded ? (
                <>
                  <button
                    onClick={handleLeaveAndFindNewGame}
                    title="find new game"
                    aria-label="find new game"
                  >
                    <FontAwesomeIcon icon={faPlus} inverse />
                  </button>
                  <button
                    onClick={handleLeave}
                    title="leave"
                    aria-label="leave"
                  >
                    <FontAwesomeIcon icon={faSignOut} inverse />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleForfeit}
                  title="forfeit"
                  aria-label="forfeit"
                >
                  <FontAwesomeIcon icon={faFlag} inverse />
                </button>
              )}
            </ButtonHolder>
          </div>
        </>
      )}
    </>
  );
};

export default OnlineGameWithContext;
