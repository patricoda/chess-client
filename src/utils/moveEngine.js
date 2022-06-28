import { PieceType } from "../enums/enums";

export const generateAllMoves = (boardState) => {
  const populatedTiles = boardState.tiles.flat().filter((tile) => tile.piece);
  for (const tile of populatedTiles) {
    generateMoves(tile);
  }
};

export const generateMoves = ({ piece, row, col }) => {
  const validMoves = [];
  switch (piece.type) {
    case PieceType.PAWN:
      validMoves.push({ row: row - 1, col });
      break;
    case PieceType.ROOK:
      validMoves.push({ row: row - 1, col });
      break;
    case PieceType.KNIGHT:
      validMoves.push({ row: row - 1, col });
      break;
    case PieceType.BISHOP:
      validMoves.push({ row: row - 1, col });
      break;
    case PieceType.KING:
      validMoves.push({ row: row - 1, col });
      break;
    case PieceType.QUEEN:
      validMoves.push({ row: row - 1, col });
      break;
    default:
      break;
  }

  piece.validMoves = validMoves;
};
