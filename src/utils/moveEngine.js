import { PieceType } from "../enums/enums";
import { boardDimensions } from "./values";

export const generateAllMoves = (boardState) => {
  const populatedTiles = boardState.tiles.flat().filter((tile) => tile.piece);
  for (const tile of populatedTiles) {
    generateMoves(boardState, tile);
  }
};

const getLateralMoves = (tiles, pieceRow, pieceCol) => {
  const moves = [];
  tiles.forEach((tileRow, i) => {
    if (i === pieceRow) {
      for (let { row, col } of tileRow) {
        moves.push({ row, col });
      }
    } else {
      moves.push({ row: i, col: pieceCol });
    }
  });

  return moves;
};

const getDiagonalMovement = (tiles, pieceRow, pieceCol) => {
  const moves = [];

  for (let i = 0; i < boardDimensions.rows; i++) {
    if (tiles[pieceRow - i] && tiles[pieceRow - i][pieceCol - i]) {
      const { row: leftDiagRow, col: leftDiagCol } =
        tiles[pieceRow - i][pieceCol - i];

      moves.push({ row: leftDiagRow, col: leftDiagCol });
    } else {
      break;
    }
  }

  for (let i = 0; i < boardDimensions.rows; i++) {
    if (tiles[pieceRow - i] && tiles[pieceRow - i][pieceCol + i]) {
      const { row: rightDiagRow, col: rightDiagCol } =
        tiles[pieceRow - i][pieceCol + i];

      moves.push({ row: rightDiagRow, col: rightDiagCol });
    } else {
      break;
    }
  }

  for (let i = 0; i < boardDimensions.rows; i++) {
    if (tiles[pieceRow + i] && tiles[pieceRow + i][pieceCol - i]) {
      const { row: leftDiagRow, col: leftDiagCol } =
        tiles[pieceRow + i][pieceCol - i];

      moves.push({ row: leftDiagRow, col: leftDiagCol });
    } else {
      break;
    }
  }

  for (let i = 0; i < boardDimensions.rows; i++) {
    if (tiles[pieceRow + i] && tiles[pieceRow + i][pieceCol + i]) {
      const { row: rightDiagRow, col: rightDiagCol } =
        tiles[pieceRow + i][pieceCol + i];

      moves.push({ row: rightDiagRow, col: rightDiagCol });
    } else {
      break;
    }
  }

  return moves;
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
      validMoves.push(...getLateralMoves(tiles, pieceRow, pieceCol));
      break;
    case PieceType.KNIGHT:
      validMoves.push({ row: pieceRow - 1, col: pieceCol });
      break;
    case PieceType.BISHOP:
      validMoves.push(...getDiagonalMovement(tiles, pieceRow, pieceCol));
      break;
    case PieceType.KING:
      validMoves.push({ row: pieceRow - 1, col: pieceCol });
      break;
    case PieceType.QUEEN:
      validMoves.push(...getLateralMoves(tiles, pieceRow, pieceCol));
      break;
    default:
      break;
  }

  piece.validMoves = validMoves;
};
