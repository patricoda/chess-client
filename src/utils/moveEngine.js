import { PieceType } from "../enums/enums";
import { boardDimensions } from "./values";

export const generateAllMoves = (boardState) => {
  const populatedTiles = boardState.tiles.flat().filter((tile) => tile.piece);
  for (const tile of populatedTiles) {
    generateMoves(boardState, tile);
  }
};

const getOmnidirectionalMoves = (tiles, pieceRow, pieceCol, distanceLimit) => [
  ...getLateralMoves(tiles, pieceRow, pieceCol, distanceLimit),
  ...getDiagonalMoves(tiles, pieceRow, pieceCol, distanceLimit)
];

const getLateralMoves = (
  tiles,
  pieceRow,
  pieceCol,
  distanceLimit = boardDimensions.rows
) => {
  const moves = [];

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow - i]?.[pieceCol]) {
      const { row: upwardRow, col: upwardCol } = tiles[pieceRow - i][pieceCol];

      moves.push({ row: upwardRow, col: upwardCol });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow + i]?.[pieceCol]) {
      const { row: downwardRow, col: downwardCol } =
        tiles[pieceRow + i][pieceCol];

      moves.push({ row: downwardRow, col: downwardCol });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow]?.[pieceCol - i]) {
      const { row: leftRow, col: leftCol } = tiles[pieceRow][pieceCol - i];

      moves.push({ row: leftRow, col: leftCol });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow]?.[pieceCol + i]) {
      const { row: leftRow, col: leftCol } = tiles[pieceRow][pieceCol + i];

      moves.push({ row: leftRow, col: leftCol });
    } else {
      break;
    }
  }

  return moves;
};

const getDiagonalMoves = (
  tiles,
  pieceRow,
  pieceCol,
  distanceLimit = boardDimensions.rows
) => {
  const moves = [];

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow - i]?.[pieceCol - i]) {
      const { row: leftDiagRow, col: leftDiagCol } =
        tiles[pieceRow - i][pieceCol - i];

      moves.push({ row: leftDiagRow, col: leftDiagCol });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow - i]?.[pieceCol + i]) {
      const { row: rightDiagRow, col: rightDiagCol } =
        tiles[pieceRow - i][pieceCol + i];

      moves.push({ row: rightDiagRow, col: rightDiagCol });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow + i]?.[pieceCol - i]) {
      const { row: leftDiagRow, col: leftDiagCol } =
        tiles[pieceRow + i][pieceCol - i];

      moves.push({ row: leftDiagRow, col: leftDiagCol });
    } else {
      break;
    }
  }

  for (let i = 1; i < distanceLimit; i++) {
    if (tiles[pieceRow + i]?.[pieceCol + i]) {
      const { row: rightDiagRow, col: rightDiagCol } =
        tiles[pieceRow + i][pieceCol + i];

      moves.push({ row: rightDiagRow, col: rightDiagCol });
    } else {
      break;
    }
  }

  return moves;
};

const getKnightMoves = (tiles, pieceRow, pieceCol) => {
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
    .filter((move) => move)
    .map(({ row, col }) => ({ row, col }));
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
      validMoves.push(...getKnightMoves(tiles, pieceRow, pieceCol));
      break;
    case PieceType.BISHOP:
      validMoves.push(...getDiagonalMoves(tiles, pieceRow, pieceCol));
      break;
    case PieceType.KING:
      validMoves.push(...getOmnidirectionalMoves(tiles, pieceRow, pieceCol, 2));
      break;
    case PieceType.QUEEN:
      validMoves.push(...getOmnidirectionalMoves(tiles, pieceRow, pieceCol));
      break;
    default:
      break;
  }

  piece.validMoves = validMoves;
};
