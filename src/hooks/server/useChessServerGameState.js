import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";

export const useChessServerGameState = () => {
  const [gameState, setGameState] = useState({ isAwaitingGame: true });

  const { connectedUser, setEventListener, handlePostEvent } =
    useContext(SocketContext);

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
  }, [connectedUser, setEventListener, handlePostEvent]);

  return {
    gameState,
    handleMovePiece: handlePostMove,
    handlePromotePiece: handlePostPromotionSelection,
  };
};

export default useChessServerGameState;
