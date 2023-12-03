import ChessBoard from "./chessboard";
import PromotionSelector from "./promotionSelector";

export const Game = ({ gameState, handleMovePiece, handlePromotePiece }) => {
  return (
    <>
      {gameState.clientPlayer?.isPlayerTurn &&
        gameState.isAwaitingPromotionSelection && (
          <PromotionSelector
            allegiance={gameState.clientPlayer.allegiance}
            promotionHandler={handlePromotePiece}
          />
        )}
      {!!gameState.boardState && (
        <ChessBoard
          moveHandler={handleMovePiece}
          boardState={gameState.boardState}
          clientPlayer={gameState.clientPlayer}
        />
      )}
    </>
  );
};
