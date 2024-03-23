import { memo, useCallback, useMemo } from "react";
import useGameState from "../hooks/offline/useGameState";
import { Game } from "./game";
import GameResultDialog from "./dialog/gameResultDialog";
import { GameStatus } from "@patricoda/chess-engine";
import { useNavigate } from "react-router-dom";
import ButtonHolder from "./buttonHolder";
import NewGameButton from "./button/newGameButton";
import LeaveIconButton from "./button/leaveIconButton";
import ForfeitButton from "./button/forfeitButton";

//TODO: put this back in
const flipBoardOnPlayerChange = false;

const OfflineGame = () => {
  const navigate = useNavigate();
  const {
    gameState,
    handleMovePiece,
    handlePromotePiece,
    handleForfeit,
    handleStartGame,
  } = useGameState();

  const hasGameEnded = useMemo(
    () =>
      [GameStatus.CHECKMATE, GameStatus.STALEMATE, GameStatus.FORFEIT].includes(
        gameState.status
      ),
    [gameState.status]
  );

  const handleLeave = useCallback(() => navigate("/"), [navigate]);

  return (
    <>
      {hasGameEnded && <GameResultDialog gameState={gameState} />}
      {gameState.status !== GameStatus.NOT_STARTED && (
        <div className="game-container">
          <Game
            gameState={gameState}
            handleMovePiece={handleMovePiece}
            handlePromotePiece={handlePromotePiece}
            playerAllegiance={gameState.playerTurn}
          />
          <ButtonHolder>
            {hasGameEnded ? (
              <>
                <NewGameButton onClick={handleStartGame} />
                <LeaveIconButton onClick={handleLeave} />
              </>
            ) : (
              <ForfeitButton onClick={handleForfeit} />
            )}
          </ButtonHolder>
        </div>
      )}
    </>
  );
};

export default memo(OfflineGame);
