import { useCallback, useEffect, useState } from "react";
import useSocketIO from "./useSocketIo";

export const useChessServerGameState = () => {
  const { socket, isOnline, handlePostEvent } = useSocketIO();
  const [gameState, setGameState] = useState([]);

  const handlePostMove = useCallback(
    (move) => handlePostEvent("POST_MOVE", move),
    [handlePostEvent]
  );

  useEffect(() => {
    socket.on("GAME_STATE_UPDATED", (gameState) => {
      console.log("received game state update");
      setGameState(gameState);
    });

    handlePostEvent("AWAITING_GAME");
  }, [socket, handlePostEvent]);

  return { isOnline, gameState, handlePostMove };
};

export default useChessServerGameState;
