import { PieceType } from "../enums/enums";

export const generateAllMoves = (boardState) => {
  const populatedTiles = boardState.tiles.flat().filter((tile) => tile.piece);
  for (const tile of populatedTiles) {
    generateMoves(boardState, tile);
  }
};

export const generateMoves = (
  { tiles },
  { piece, row: pieceRow, col: pieceCol }
) => {
  const validMoves = [];
  switch (piece.type) {
    case PieceType.PAWN:
      validMoves.push({ row: pieceRow - 1, col: pieceCol });
      break;
    case PieceType.ROOK:
      tiles.forEach((tileRow, i) => {
        if (i === pieceRow) {
          for (let { row, col } of tileRow) {
            validMoves.push({ row, col });
          }
        } else {
          validMoves.push({ row: i, col: pieceCol });
        }
      });
      break;
    case PieceType.KNIGHT:
      validMoves.push({ row: pieceRow - 1, col: pieceCol });
      break;
    case PieceType.BISHOP:
      validMoves.push({ row: pieceRow - 1, col: pieceCol });
      break;
    case PieceType.KING:
      validMoves.push({ row: pieceRow - 1, col: pieceCol });
      break;
    case PieceType.QUEEN:
      validMoves.push({ row: pieceRow - 1, col: pieceCol });
      break;
    default:
      break;
  }

  piece.validMoves = validMoves;
};
