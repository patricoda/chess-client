import { memo, useCallback, useMemo } from "react";
import useGameState from "../hooks/offline/useGameState";
import { Game } from "./game";
import GameResultDialog from "./dialog/gameResultDialog";
import { GameStatus } from "@patricoda/chess-engine";
import { useNavigate } from "react-router-dom";
import ButtonHolder from "./buttonHolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faPlus, faSignOut } from "@fortawesome/free-solid-svg-icons";

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
              <button
                onClick={handleStartGame}
                title="start new game"
                aria-label="start new game"
              >
                <FontAwesomeIcon icon={faPlus} inverse />
              </button>
              <button onClick={handleLeave} title="leave" aria-label="leave">
                <FontAwesomeIcon icon={faSignOut} inverse />
              </button>
            </>
          ) : (
            <button
              onClick={handleForfeit}
              title="forfeit"
              aria-label="forfeit"
            >
              <FontAwesomeIcon icon={faFlag} inverse />
            </button>
          )}
        </ButtonHolder>
      </div>
    </>
  );
};

export default memo(OfflineGame);
