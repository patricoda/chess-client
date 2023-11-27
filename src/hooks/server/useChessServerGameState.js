import { useCallback, useEffect, useState } from "react";
import useSocketIO from "./useSocketIo";

export const useChessServerGameState = () => {
  const { socket, connectedUser, isOnline, handlePostEvent } = useSocketIO();
  const [gameState, setGameState] = useState({});

  const handlePostMove = useCallback(
    (from, to) =>
      handlePostEvent("POST_MOVE", {
        gameId: gameState.gameId,
        move: { from, to },
      }),
    [handlePostEvent, gameState.gameId]
  );

  const handlePostPromotionSelection = useCallback(
    (e) =>
      handlePostEvent("POST_PROMOTION_OPTION", {
        gameId: gameState.gameId,
        newRank: e.currentTarget.dataset.value,
      }),
    [handlePostEvent, gameState.gameId]
  );

  useEffect(() => {
    socket.on("GAME_STATE_UPDATED", (gameState) => {
      console.log("received game state update");
      console.log(gameState);
      setGameState({
        ...gameState,
        boardState: JSON.parse(gameState.boardState),
        clientPlayer: gameState.players.find(
          ({ id }) => id === connectedUser.userId
        ),
      });
    });

    handlePostEvent("AWAITING_GAME");
  }, [socket, connectedUser, handlePostEvent]);

  return {
    isOnline,
    gameState,
    handleMovePiece: handlePostMove,
    handlePromotePiece: handlePostPromotionSelection,
  };
};

export default useChessServerGameState;
