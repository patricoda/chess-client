import { PieceType } from "../enums/enums";
import { boardDimensions } from "./values";

export const generateAllMoves = (boardState) => {
  const populatedTiles = boardState.tiles.flat().filter((tile) => tile.piece);
  for (const tile of populatedTiles) {
    generateMoves(boardState, tile);
  }
};

const getOmnidirectionalMoves = (tiles, actionedTile, distanceLimit) => [
  ...getLateralMoves(tiles, actionedTile, distanceLimit),
  ...getDiagonalMoves(tiles, actionedTile, distanceLimit)
];

const getLateralMoves = (
  tiles,
  { row: pieceRow, col: pieceCol, piece: actionedPiece },
  distanceLimit = boardDimensions.rows
) => {
  const moves = [];

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow - i]?.[pieceCol]) {
      const { row, col, piece } = tiles[pieceRow - i][pieceCol];

      if (piece) {
        if (piece.isCapturable(actionedPiece)) {
          moves.push({ row, col });
        }
        break;
      }

      moves.push({ row, col });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow + i]?.[pieceCol]) {
      const { row, col, piece } = tiles[pieceRow + i][pieceCol];

      if (piece) {
        if (piece.isCapturable(actionedPiece)) {
          moves.push({ row, col });
        }
        break;
      }

      moves.push({ row, col });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow]?.[pieceCol - i]) {
      const { row, col, piece } = tiles[pieceRow][pieceCol - i];

      if (piece) {
        if (piece.isCapturable(actionedPiece)) {
          moves.push({ row, col });
        }
        break;
      }

      moves.push({ row, col });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow]?.[pieceCol + i]) {
      const { row, col, piece } = tiles[pieceRow][pieceCol + i];

      if (piece) {
        if (piece.isCapturable(actionedPiece)) {
          moves.push({ row, col });
        }
        break;
      }

      moves.push({ row, col });
    } else {
      break;
    }
  }

  return moves;
};

const getDiagonalMoves = (
  tiles,
  { row: pieceRow, col: pieceCol, piece: actionedPiece },
  distanceLimit = boardDimensions.rows
) => {
  const moves = [];

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow - i]?.[pieceCol - i]) {
      const { row, col, piece } = tiles[pieceRow - i][pieceCol - i];

      if (piece) {
        if (piece.isCapturable(actionedPiece)) {
          moves.push({ row, col });
        }
        break;
      }

      moves.push({ row, col });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow - i]?.[pieceCol + i]) {
      const { row, col, piece } = tiles[pieceRow - i][pieceCol + i];

      if (piece) {
        if (piece.isCapturable(actionedPiece)) {
          moves.push({ row, col });
        }
        break;
      }

      moves.push({ row, col });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow + i]?.[pieceCol - i]) {
      const { row, col, piece } = tiles[pieceRow + i][pieceCol - i];

      if (piece) {
        if (piece.isCapturable(actionedPiece)) {
          moves.push({ row, col });
        }
        break;
      }

      moves.push({ row, col });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow + i]?.[pieceCol + i]) {
      const { row, col, piece } = tiles[pieceRow + i][pieceCol + i];

      if (piece) {
        if (piece.isCapturable(actionedPiece)) {
          moves.push({ row, col });
        }
        break;
      }

      moves.push({ row, col });
    } else {
      break;
    }
  }

  return moves;
};

const getKnightMoves = (
  tiles,
  { row: pieceRow, col: pieceCol, piece: actionedPiece }
) => {
  const possibleMoves = [
    tiles[pieceRow - 2]?.[pieceCol - 1],
    tiles[pieceRow - 2]?.[pieceCol + 1],
    tiles[pieceRow + 2]?.[pieceCol - 1],
    tiles[pieceRow + 2]?.[pieceCol + 1],
    tiles[pieceRow - 1]?.[pieceCol - 2],
    tiles[pieceRow - 1]?.[pieceCol + 2],
    tiles[pieceRow + 1]?.[pieceCol - 2],
    tiles[pieceRow + 1]?.[pieceCol + 2]
  ];

  return possibleMoves
    .filter(
      (move) => move && (!move.piece || move.piece.isCapturable(actionedPiece))
    )
    .map(({ row, col }) => ({ row, col }));
};

export const generateMoves = ({ tiles }, actionedTile) => {
  const validMoves = [];
  switch (actionedTile.piece.type) {
    case PieceType.PAWN:
      validMoves.push({ row: actionedTile.row - 1, col: actionedTile.col });
      break;
    case PieceType.ROOK:
      validMoves.push(...getLateralMoves(tiles, actionedTile));
      break;
    case PieceType.KNIGHT:
      validMoves.push(...getKnightMoves(tiles, actionedTile));
      break;
    case PieceType.BISHOP:
      validMoves.push(...getDiagonalMoves(tiles, actionedTile));
      break;
    case PieceType.KING:
      validMoves.push(...getOmnidirectionalMoves(tiles, actionedTile, 2));
      break;
    case PieceType.QUEEN:
      validMoves.push(...getOmnidirectionalMoves(tiles, actionedTile));
      break;
    default:
      break;
  }

  actionedTile.piece.validMoves = validMoves;
};
