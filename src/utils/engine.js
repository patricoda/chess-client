import {
  Allegiance,
  DirectionOperator,
  PieceType,
  SlidingPieceType
} from "../enums/enums";
import { boardDimensions } from "./values";

//TODO: put entire engine in hook with state for board? removes need to pass through and recalculate per reducer call
//definitely efficiencies to make here i.e. store positions, etc
export const getCheckingPieces = ({ boardState, activePlayer }) => {
  const tiles = boardState.tiles;
  const flatTileArray = boardState.tiles.flat();

  //test moves from king tile for different types of movement type, and see if that piece is present
  //to determine
  const kingTile = flatTileArray.find(
    ({ piece }) =>
      piece?.type === PieceType.KING && piece?.allegiance === activePlayer
  );

  const direction =
    kingTile.piece.allegiance === Allegiance.BLACK
      ? DirectionOperator.PLUS
      : DirectionOperator.MINUS;

  const pawnAttackTiles = getPawnCaptureMoves(
    tiles,
    kingTile,
    direction
  ).reduce((acc, { row, col }) => {
    const tile = boardState.findTileByCoords(row, col);
    const { piece } = tile;

    return piece?.type === PieceType.PAWN && piece?.allegiance !== activePlayer
      ? [...acc, tile]
      : acc;
  }, []);

  const knightAttackTiles = getKnightMoves(tiles, kingTile).reduce(
    (acc, { row, col }) => {
      const tile = boardState.findTileByCoords(row, col);
      const { piece } = tile;

      return piece?.type === PieceType.KNIGHT &&
        piece?.allegiance !== activePlayer
        ? [...acc, tile]
        : acc;
    },
    []
  );

  const lateralAttackTiles = getLateralMoves(tiles, kingTile).reduce(
    (acc, { row, col }) => {
      const tile = boardState.findTileByCoords(row, col);
      const { piece } = tile;

      return (piece?.type === PieceType.ROOK ||
        piece?.type === PieceType.QUEEN) &&
        piece?.allegiance !== activePlayer
        ? [...acc, tile]
        : acc;
    },
    []
  );

  const diagonalAttackTiles = getDiagonalMoves(tiles, kingTile).reduce(
    (acc, { row, col }) => {
      const tile = boardState.findTileByCoords(row, col);
      const { piece } = tile;

      return (piece?.type === PieceType.BISHOP ||
        piece?.type === PieceType.QUEEN) &&
        piece?.allegiance !== activePlayer
        ? [...acc, tile]
        : acc;
    },
    []
  );

  const attackTiles = [
    ...pawnAttackTiles,
    ...knightAttackTiles,
    ...lateralAttackTiles,
    ...diagonalAttackTiles
  ];

  //update valid moves for any checking pieces to resolve checked players moves correctly
  for (const tile of attackTiles) {
    generatePieceMoves(boardState, tile);
  }

  return attackTiles;
};

export const isCheckmate = ({ boardState, activePlayer, kingInCheck }) => {
  if (kingInCheck) {
    const flattenedTileArray = boardState.tiles.flat();

    const kingTile = flattenedTileArray.find(
      (tile) =>
        tile.piece?.type === PieceType.KING &&
        tile.piece?.allegiance === activePlayer
    );

    return !!!kingTile.piece.validMoves.length;
  }
};

export const generateMovesForActivePlayer = ({
  boardState,
  activePlayer,
  checkState: { inCheck, checkingPieces }
}) => {
  const populatedTiles = boardState.tiles
    .flat()
    .filter((tile) => tile.piece?.allegiance === activePlayer);

  //TODO: need to determine things like pins and blah
  for (const tile of populatedTiles) {
    generatePieceMoves(boardState, tile);
  }

  if (inCheck) {
    const kingTile = populatedTiles.find(
      (tile) =>
        tile.piece.type === PieceType.KING &&
        tile.piece.allegiance === activePlayer
    );

    //if multiple checkers, only king moves are valid
    if (checkingPieces.length === 1) {
      const [checkingTile] = checkingPieces;
      const { piece: checkingPiece } = checkingTile;
      //if checker is a sliding piece, check for blocking / capture moves
      const isSlidingPiece = !!SlidingPieceType[checkingPiece.type];

      for (const tile of populatedTiles) {
        //TODO: could make this more efficient by checking for this scenario when generating piece moves in the first place
        if (isSlidingPiece) {
          tile.piece.validMoves = tile.piece.validMoves.filter(
            ({ row, col }) =>
              (checkingTile.row === row && checkingTile.col === col) ||
              checkingPiece.validMoves.find(
                (checkingPieceMove) =>
                  checkingPieceMove.row === row && checkingPieceMove.col === col
              )
          );
        }
      }
    }
  }
};

export const generateAllMoves = ({ boardState }) => {
  const populatedTiles = boardState.tiles.flat().filter((tile) => tile.piece);
  for (const tile of populatedTiles) {
    generatePieceMoves(boardState, tile);
  }
};

export const generatePieceMoves = ({ tiles }, actionedTile, activePlayer) => {
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
      //keep this somewhere
      const attackedTiles = tiles
        .flat()
        .filter((tile) => tile.piece && tile.piece.allegiance !== activePlayer)
        .reduce((current, { piece }) => [...current, ...piece.validMoves], []);

      validMoves.push(
        ...getOmnidirectionalMoves(tiles, actionedTile, 2).filter((move) =>
          attackedTiles.includes(move)
        )
      );
      break;
    case PieceType.QUEEN:
      validMoves.push(...getOmnidirectionalMoves(tiles, actionedTile));
      break;
    default:
      break;
  }

  actionedTile.piece.validMoves = validMoves;
};

const getPawnMoves = (tiles, actionedTile) => {
  const direction =
    actionedTile.piece.allegiance === Allegiance.BLACK
      ? DirectionOperator.PLUS
      : DirectionOperator.MINUS;

  //pawns follow different rules for movement / capturing pieces
  const possibleMoves = getPawnPushMoves(tiles, actionedTile, direction).filter(
    (tile) => tile && !tile.piece
  );

  const possibleCapturingMoves = getPawnCaptureMoves(
    tiles,
    actionedTile,
    direction
  );

  return [...possibleMoves, ...possibleCapturingMoves].map(({ row, col }) => ({
    row,
    col
  }));
};

const getPawnPushMoves = (tiles, { row, col, piece }, direction) =>
  [
    tiles[nextTile(row, 1, direction)]?.[col],
    !piece.hasMoved && tiles[nextTile(row, 2, direction)]?.[col]
  ].filter((tile) => tile && !tile.piece);

const getPawnCaptureMoves = (tiles, { row, col, piece }, direction) =>
  [
    tiles[nextTile(row, 1, direction)]?.[
      nextTile(col, 1, DirectionOperator.PLUS)
    ],
    tiles[nextTile(row, 1, direction)]?.[
      nextTile(col, 1, DirectionOperator.MINUS)
    ]
  ].filter((tile) => tile && tile.piece?.isCapturable(piece));

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
