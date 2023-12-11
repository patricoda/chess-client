import ChessBoard from "./chessboard";
import PromotionSelector from "./promotionSelector";

export const Game = ({ gameState, handleMovePiece, handlePromotePiece }) => {
  const isPlayersTurn =
    gameState.clientPlayer.allegiance === gameState.playerTurn;

  return (
    <>
      {isPlayersTurn && gameState.isAwaitingPromotionSelection && (
        <PromotionSelector
          allegiance={gameState.clientPlayer.allegiance}
          promotionHandler={handlePromotePiece}
        />
      )}
      {!!gameState.boardState && (
        <ChessBoard
          moveHandler={handleMovePiece}
          boardState={gameState.boardState}
          legalMoves={gameState.legalMoves}
          clientPlayer={gameState.clientPlayer}
          isPlayersTurn={isPlayersTurn}
        />
      )}
    </>
  );
};
