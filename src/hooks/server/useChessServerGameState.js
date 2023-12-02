import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";

export const useChessServerGameState = () => {
  const [gameState, setGameState] = useState({});

  const { connectedUser, setEventListener, handlePostEvent } =
    useContext(SocketContext);

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
    setEventListener("GAME_STATE_UPDATED", (gameState) =>
      setGameState({
        ...gameState,
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
