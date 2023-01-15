import { memo } from "react";
import Chessboard from "./chessboard";
import PromotionSelect from "./promotionSelect";
import useChessEngine from "../hooks/useChessEngine";

const flipBoardOnPlayerChange = false;

const Game = () => {
  //TODO: move promotable tile to board, perhaps import PGN string in for board setup
  const { board, activePlayer, promotableTile, movePiece, promotePiece } =
    useChessEngine();

  return (
    <>
      {!!promotableTile && (
        <PromotionSelect
          allegiance={activePlayer}
          promotionHandler={promotePiece}
        />
      )}
      <Chessboard
        moveHandler={movePiece}
        board={board}
        activePlayer={activePlayer}
        flipBoardOnPlayerChange={flipBoardOnPlayerChange}
      />
    </>
  );
};

export default memo(Game);
