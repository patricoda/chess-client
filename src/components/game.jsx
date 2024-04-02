import ChessBoard from "./chessboard";
import PromotionSelector from "./promotionSelector";

export const Game = ({
  gameState,
  handleMovePiece,
  handlePromotePiece,
  playerAllegiance,
  flipPerspectiveForBlack,
}) => {
  const isPlayersTurn = playerAllegiance === gameState.playerTurn;

  return (
    <>
      {isPlayersTurn && gameState.isAwaitingPromotionSelection && (
        <PromotionSelector
          allegiance={gameState.playerTurn}
          promotionHandler={handlePromotePiece}
        />
      )}
      {!!gameState.boardState && (
        <ChessBoard
          moveHandler={handleMovePiece}
          playerAllegiance={playerAllegiance}
          boardState={gameState.boardState}
          legalMoves={gameState.legalMoves}
          isPlayersTurn={isPlayersTurn}
          flipPerspectiveForBlack={flipPerspectiveForBlack}
          latestMove={
            gameState.moveHistory[gameState.moveHistory.length - 1] ?? {}
          }
        />
      )}
    </>
  );
};
