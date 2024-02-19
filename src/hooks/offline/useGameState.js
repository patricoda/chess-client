import { useEffect, useCallback, useRef, useState } from "react";
import Game from "../../classes/game";

//TODO: make this look like our server API, return same object for reusability of using components
export const useGameState = () => {
  //todo: pass players in
  const gameRef = useRef(
    new Game(-1, [{ userId: "player1" }, { userId: "player2" }])
  );
  const [gameState, setGameState] = useState({});

  const updateGameState = useCallback(() => {
    const gameState = gameRef.current.getGameState();
    setGameState({
      ...gameState,
      boardState: JSON.parse(gameState.boardState),
    });
  }, []);

  const handleMovePiece = useCallback(
    (from, to) => {
      gameRef.current.move(gameRef.current.getActivePlayer().userId, {
        from,
        to,
      });
      updateGameState();
    },
    [updateGameState]
  );

  const handlePromotePiece = useCallback(
    (e) => {
      gameRef.current.promote(gameRef.current.getActivePlayer().userId, {
        newType: e.currentTarget.dataset.value,
      });
      updateGameState();
    },
    [updateGameState]
  );

  const handleForfeit = useCallback(() => {
    gameRef.current.forfeit(gameRef.current.getActivePlayer().userId);
    updateGameState();
  }, [updateGameState]);

  useEffect(() => {
    gameRef.current.init();
    updateGameState();
  }, [updateGameState]);

  return {
    gameState,
    handleMovePiece,
    handlePromotePiece,
    handleForfeit,
  };
};

export default useGameState;
