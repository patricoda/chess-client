import { Allegiance, DirectionOperator, PieceType } from "../enums/enums";
import { boardDimensions } from "./values";

//TODO: put entire engine in hook with state for board? removes need to pass through and recalculate per reducer call
//definitely efficiencies to make here i.e. store positions, etc
export const isKingInCheck = ({ boardState, activePlayer }) => {
  const tiles = boardState.tiles;
  const flatTileArray = boardState.tiles.flat();

  const kingTile = flatTileArray.find(
    ({ piece }) =>
      piece?.type === PieceType.KING && piece?.allegiance === activePlayer
  );

  const direction =
    kingTile.piece.allegiance === Allegiance.BLACK
      ? DirectionOperator.PLUS
      : DirectionOperator.MINUS;

  //test moves from king tile for different types of movement type, and see if that piece is present
  //to determine
  return (
    getPawnCaptureMoves(tiles, kingTile, direction).some(({ row, col }) => {
      const { piece } = boardState.findTileByCoords(row, col);
      return (
        piece?.type === PieceType.PAWN && piece?.allegiance !== activePlayer
      );
    }) ||
    getKnightMoves(tiles, kingTile).some(({ row, col }) => {
      const { piece } = boardState.findTileByCoords(row, col);
      return (
        piece?.type === PieceType.KNIGHT && piece?.allegiance !== activePlayer
      );
    }) ||
    getLateralMoves(tiles, kingTile).some(({ row, col }) => {
      const { piece } = boardState.findTileByCoords(row, col);
      return (
        (piece?.type === PieceType.ROOK || piece?.type === PieceType.QUEEN) &&
        piece?.allegiance !== activePlayer
      );
    }) ||
    getDiagonalMoves(tiles, kingTile).some(({ row, col }) => {
      const { piece } = boardState.findTileByCoords(row, col);
      return (
        (piece?.type === PieceType.BISHOP || piece?.type === PieceType.QUEEN) &&
        piece?.allegiance !== activePlayer
      );
    })
  );
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
  kingInCheck
}) => {
  const populatedTiles = boardState.tiles
    .flat()
    .filter((tile) => tile.piece?.allegiance === activePlayer);

  if (kingInCheck) {
    const kingTile = populatedTiles.find(
      (tile) =>
        tile.piece.type === PieceType.KING &&
        tile.piece.allegiance === activePlayer
    );

    //TODO: will need to expand on this, as other pieces may be able to block the attack
    //or capture the piece making check
    //generatePieceMoves(boardState, kingTile, activePlayer);
  } else {
    //TODO: need to determine things like pins and blah
    for (const tile of populatedTiles) {
      generatePieceMoves(boardState, tile);
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
