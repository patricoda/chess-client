import { useCallback, useEffect, useState } from "react";
import useSocketIO from "./useSocketIo";

export const useChessServerGameState = () => {
  const { socket, isOnline, handlePostEvent } = useSocketIO();
  const [gameState, setGameState] = useState({});

  const handlePostMove = useCallback(
    (from, to) =>
      handlePostEvent("POST_MOVE", {
        gameId: gameState.gameId,
        move: { from, to },
      }),
    [handlePostEvent, gameState.gameId]
  );

  useEffect(() => {
    socket.on("GAME_INITIALISED", (gameState) => {
      console.log("received game started event");
      setGameState({
        ...gameState,
        boardState: JSON.parse(gameState.boardState),
        clientPlayer: gameState.players.find(({ id }) => id === socket.id),
      });
    });

    socket.on("GAME_STATE_UPDATED", (gameState) => {
      console.log("received game state update");
      setGameState({
        ...gameState,
        boardState: JSON.parse(gameState.boardState),
        clientPlayer: gameState.players.find(({ id }) => id === socket.id),
      });
    });

    handlePostEvent("AWAITING_GAME");
  }, [socket, handlePostEvent]);

  return { isOnline, gameState, handleMovePiece: handlePostMove };
};

export default useChessServerGameState;
