import { memo, useMemo } from "react";
import useGameState from "../hooks/offline/useGameState";
import { Game } from "./game";
import GameResultDialog from "./dialog/gameResultDialog";
import { GameStatus } from "@patricoda/chess-engine";

//TODO: put this back in
const flipBoardOnPlayerChange = false;

const OfflineGame = () => {
  const { gameState, handleMovePiece, handlePromotePiece, handleForfeit } =
    useGameState();

  const hasGameEnded = useMemo(
    () =>
      [GameStatus.CHECKMATE, GameStatus.STALEMATE, GameStatus.FORFEIT].includes(
        gameState.status
      ),
    [gameState.status]
  );

  return (
    <>
      {hasGameEnded && <GameResultDialog gameState={gameState} />}
      <Game
        gameState={gameState}
        handleMovePiece={handleMovePiece}
        handlePromotePiece={handlePromotePiece}
        playerAllegiance={gameState.playerTurn}
      />
    </>
  );
};

export default memo(OfflineGame);
