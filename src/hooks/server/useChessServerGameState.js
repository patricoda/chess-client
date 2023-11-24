import { useCallback, useEffect, useState } from "react";
import useSocketIO from "./useSocketIo";

export const useChessServerGameState = () => {
  const { socket, isOnline, handlePostEvent } = useSocketIO();
  const [gameState, setGameState] = useState({});

  const handlePostMove = useCallback(
    (move) => handlePostEvent("POST_MOVE", move),
    [handlePostEvent]
  );

  useEffect(() => {
    socket.on("GAME_INITIALISED", (gameState) => {
      console.log("received game started event");
      setGameState({
        ...gameState,
        boardState: JSON.parse(gameState.boardState),
      });
    });

    socket.on("GAME_STATE_UPDATED", (gameState) => {
      console.log("received game state update");
      setGameState({
        ...gameState,
        boardState: JSON.parse(gameState.boardState),
      });
    });

    handlePostEvent("AWAITING_GAME");
  }, [socket, handlePostEvent]);

  return { isOnline, gameState, handleMovePiece: handlePostMove };
};

export default useChessServerGameState;
