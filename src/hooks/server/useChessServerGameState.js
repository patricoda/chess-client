import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";

export const useChessServerGameState = () => {
  const [gameState, setGameState] = useState({ isAwaitingGame: true });

  const {
    connectedUser,
    setEventListener,
    removeEventListener,
    handlePostEvent,
  } = useContext(SocketContext);

  const handlePostMove = useCallback(
    (from, to) =>
      handlePostEvent("POST_MOVE", {
        gameId: gameState.id,
        move: { from, to },
      }),
    [handlePostEvent, gameState.id]
  );

  const handlePostPromotionSelection = useCallback(
    (e) =>
      handlePostEvent("POST_PROMOTION_OPTION", {
        gameId: gameState.id,
        newRank: e.currentTarget.dataset.value,
      }),
    [handlePostEvent, gameState.id]
  );

  useEffect(() => {
    setEventListener("GAME_STARTED", (gameState) =>
      setGameState({
        ...gameState,
        isAwaitingGame: false,
        boardState: JSON.parse(gameState.boardState),
        clientPlayer: gameState.players.find(
          ({ id }) => id === connectedUser.userId
        ),
      })
    );

    setEventListener("GAME_STATE_UPDATED", (gameState) =>
      setGameState({
        ...gameState,
        isAwaitingGame: false,
        boardState: JSON.parse(gameState.boardState),
        clientPlayer: gameState.players.find(
          ({ id }) => id === connectedUser.userId
        ),
      })
    );

    handlePostEvent("AWAITING_GAME");

    return () => {
      //clean up events connected to socket instance as they persist outside of this hook
      removeEventListener("GAME_STARTED");
      removeEventListener("GAME_STATE_UPDATED");
    };
  }, [connectedUser, setEventListener, removeEventListener, handlePostEvent]);

  return {
    gameState,
    handleMovePiece: handlePostMove,
    handlePromotePiece: handlePostPromotionSelection,
  };
};

export default useChessServerGameState;
