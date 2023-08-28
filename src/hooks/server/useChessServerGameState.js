import { useCallback, useEffect, useState } from "react";

//TODO: perhaps split between chat room and game data
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
  }, [socket]);

  return { isOnline, messageHistory, handlePostMove };
};

export default useChessServerGameState;
