import { memo } from "react";
import Chessboard from "./chessboard";
import useChessEngine from "../hooks/chessEngine/useChessEngine";

const flipBoardOnPlayerChange = false;

const OfflineGame = () => {
  //TODO: move promotable tile to board, perhaps import PGN string in for board setup
  const {
    board,
    playerTurn,
    promotableCoords,
    handleMovePiece,
    handlePromotePiece,
  } = useChessEngine();

  return (
    <>
      <Chessboard
        promotableCoords={promotableCoords}
        onPromotionHandler={handlePromotePiece}
        moveHandler={handleMovePiece}
        board={board}
        playerTurn={playerTurn}
        flipBoardOnPlayerChange={flipBoardOnPlayerChange}
      />
    </>
  );
};

export default memo(OfflineGame);
