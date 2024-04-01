import { Game } from "@patricoda/chess-engine";
import { useEffect, useCallback, useRef, useState } from "react";

export const useGameState = () => {
  const gameRef = useRef(null);
  const [gameState, setGameState] = useState({});

  const updateGameState = useCallback(() => {
    const gameState = gameRef.current.getGameState();
    setGameState({
      ...gameState,
      boardState: gameState.board,
    });
  }, []);

  const handleMovePiece = useCallback(
    (from, to) => {
      gameRef.current.move({ from, to });
      updateGameState();
    },
    [updateGameState]
  );

  const handlePromotePiece = useCallback(
    (e) => {
      gameRef.current.promote(e.currentTarget.dataset.value);
      updateGameState();
    },
    [updateGameState]
  );

  const handleForfeit = useCallback(() => {
    gameRef.current.forfeit(gameRef.current.playerTurn);
    updateGameState();
  }, [updateGameState]);

  const handleStartGame = useCallback(() => {
    gameRef.current = new Game();
    gameRef.current.init();
    updateGameState();
  }, [updateGameState]);

  useEffect(() => {
    handleStartGame();
  }, [handleStartGame]);

  return {
    gameState,
    handleMovePiece,
    handlePromotePiece,
    handleForfeit,
    handleStartGame,
  };
};

export default useGameState;
