import { memo } from "react";
import Chessboard from "./chessboard";
import PromotionSelector from "./promotionSelector";
import useChessEngine from "../hooks/chessEngine/useChessEngine";

const flipBoardOnPlayerChange = false;

const OfflineGame = () => {
  //TODO: move promotable tile to board, perhaps import PGN string in for board setup
  const {
    board,
    activePlayer,
    promotableCoords,
    handleMovePiece,
    handlePromotePiece,
  } = useChessEngine();

  return (
    <>
      {!!promotableCoords && (
        <PromotionSelector
          allegiance={activePlayer}
          promotionHandler={handlePromotePiece}
        />
      )}
      <Chessboard
        moveHandler={handleMovePiece}
        board={board}
        activePlayer={activePlayer}
        flipBoardOnPlayerChange={flipBoardOnPlayerChange}
      />
    </>
  );
};

export default memo(OfflineGame);
