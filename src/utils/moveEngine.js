import { Allegiance, DirectionOperator, PieceType } from "../enums/enums";
import { boardDimensions } from "./values";

export const generateAllMoves = (boardState) => {
  const populatedTiles = boardState.tiles.flat().filter((tile) => tile.piece);
  for (const tile of populatedTiles) {
    generateMoves(boardState, tile);
  }
};

export const generateMoves = ({ tiles }, actionedTile) => {
  const validMoves = [];
  switch (actionedTile.piece.type) {
    case PieceType.PAWN:
      validMoves.push(...getPawnMoves(tiles, actionedTile));
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

const getPawnMoves = (
  tiles,
  { row: pieceRow, col: pieceCol, piece: actionedPiece }
) => {
  const direction =
    actionedPiece.allegiance === Allegiance.BLACK
      ? DirectionOperator.PLUS
      : DirectionOperator.MINUS;

  const possibleMoves = [
    tiles[nextTile(pieceRow, 1, direction)]?.[pieceCol],
    !actionedPiece.hasMoved &&
      tiles[nextTile(pieceRow, 2, direction)]?.[pieceCol]
  ].filter((tile) => tile && !tile.piece);

  const possibleCapturingMoves = [
    tiles[nextTile(pieceRow, 1, direction)]?.[
      nextTile(pieceCol, 1, DirectionOperator.PLUS)
    ],
    tiles[nextTile(pieceRow, 1, direction)]?.[
      nextTile(pieceCol, 1, DirectionOperator.MINUS)
    ]
  ].filter((tile) => tile && tile.piece?.isCapturable(actionedPiece));

  return [...possibleMoves, ...possibleCapturingMoves].map(({ row, col }) => ({
    row,
    col
  }));
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
      (tile) => tile && (!tile.piece || tile.piece.isCapturable(actionedPiece))
    )
    .map(({ row, col }) => ({ row, col }));
};

const getOmnidirectionalMoves = (tiles, actionedTile, distanceLimit) => [
  ...getLateralMoves(tiles, actionedTile, distanceLimit),
  ...getDiagonalMoves(tiles, actionedTile, distanceLimit)
];

const getLateralMoves = (
  tiles,
  actionedTile,
  distanceLimit = boardDimensions.rows
) => {
  const moves = [];

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.MINUS,
      null,
      distanceLimit,
      actionedTile
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.PLUS,
      null,
      distanceLimit,
      actionedTile
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      null,
      DirectionOperator.MINUS,
      distanceLimit,
      actionedTile
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      null,
      DirectionOperator.PLUS,
      distanceLimit,
      actionedTile
    )
  );

  return moves;
};

const getDiagonalMoves = (
  tiles,
  actionedTile,
  distanceLimit = boardDimensions.rows
) => {
  const moves = [];

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.MINUS,
      DirectionOperator.MINUS,
      distanceLimit,
      actionedTile
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.MINUS,
      DirectionOperator.PLUS,
      distanceLimit,
      actionedTile
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.PLUS,
      DirectionOperator.MINUS,
      distanceLimit,
      actionedTile
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.PLUS,
      DirectionOperator.PLUS,
      distanceLimit,
      actionedTile
    )
  );

  return moves;
};

const generateMovesInDirection = (
  tiles,
  rowDirection,
  colDirection,
  distanceLimit,
  { row: pieceRow, col: pieceCol, piece: actionedPiece }
) => {
  const moves = [];

  for (let i = 1; i < distanceLimit; i++) {
    const tile =
      tiles[nextTile(pieceRow, i, rowDirection)]?.[
        nextTile(pieceCol, i, colDirection)
      ];

    if (tile) {
      const { row, col, piece } = tile;

      if (piece) {
        if (piece.isCapturable(actionedPiece)) {
          moves.push({ row, col });
        }
        return moves;
      }

      moves.push({ row, col });
    } else {
      return moves;
    }
  }

  return moves;
};

const nextTile = (a, b, direction) => {
  switch (direction) {
    case DirectionOperator.PLUS:
      return a + b;
    case DirectionOperator.MINUS:
      return a - b;
    default:
      return a;
  }
};
