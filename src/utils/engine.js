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

  const pawnCheckingTiles = getPawnCaptureMoves(
    tiles,
    kingTile,
    direction
  ).pseudoMoves.reduce((acc, { row, col }) => {
    const tile = boardState.findTileByCoords(row, col);
    const { piece } = tile;

    return piece?.type === PieceType.PAWN && piece?.allegiance !== activePlayer
      ? [...acc, tile]
      : acc;
  }, []);

  const knightCheckingTiles = getKnightMoves(tiles, kingTile).reduce(
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

  const lateralCheckingTiles = getLateralMoves(tiles, kingTile).reduce(
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

  const diagonalCheckingTiles = getDiagonalMoves(tiles, kingTile).reduce(
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

  const checkingTiles = [
    ...pawnCheckingTiles,
    ...knightCheckingTiles,
    ...lateralCheckingTiles,
    ...diagonalCheckingTiles
  ];

  return checkingTiles;
};

export const isCheckmate = ({ boardState, activePlayer, checkState }) => {
  if (checkState.inCheck) {
    const flattenedTileArray = boardState.tiles.flat();

    const tilesWithValidMoves = flattenedTileArray.filter(
      ({ piece }) =>
        piece?.allegiance === activePlayer && piece.validMoves.length
    );

    return !!!tilesWithValidMoves.length;
  }
};

export const refreshBoardState = ({
  boardState,
  activePlayer,
  checkState: { inCheck, checkingPieces }
}) => {
  const tiles = boardState.tiles.flat();

  const currentPlayerPopulatedTiles = tiles.filter(
    (tile) => tile.piece?.allegiance === activePlayer
  );
  const otherPlayerPopulatedTiles = tiles.filter(
    (tile) => tile.piece && tile.piece.allegiance !== activePlayer
  );

  const allPopulatedTiles = [
    ...otherPlayerPopulatedTiles,
    ...currentPlayerPopulatedTiles
  ];

  //TODO: pins, en passant, castling
  for (const tile of allPopulatedTiles) {
    generatePieceMoves(boardState, tile, activePlayer);
  }

  const attackedTiles = otherPlayerPopulatedTiles.reduce(
    (current, { piece }) => [
      ...current,
      ...(piece.type === PieceType.PAWN
        ? piece.pseudoCaptureMoves
        : piece.validMoves)
    ],
    []
  );

  const kingTile = currentPlayerPopulatedTiles.find(
    (tile) => tile.piece.type === PieceType.KING
  );

  if (inCheck) {
    //if multiple checkers, only king moves are valid
    if (checkingPieces.length === 1) {
      const [checkingTile] = checkingPieces;
      const { piece: checkingPiece } = checkingTile;
      //if checker is a sliding piece, check for blocking / capture moves
      const isSlidingPiece = !!SlidingPieceType[checkingPiece.type];
      let tilesInCheck = [];

      //get tiles on shared line between king and checking piece to evaluate blockers and escape moves
      if (isSlidingPiece) {
        tilesInCheck = getDirectLineBetweenTiles(
          boardState,
          checkingTile,
          kingTile,
          false
        );
      }

      for (const tile of currentPlayerPopulatedTiles) {
        if (tile !== kingTile) {
          tile.piece.validMoves = tile.piece.validMoves.filter(
            ({ row, col }) =>
              (checkingTile.row === row && checkingTile.col === col) ||
              tilesInCheck.find((tile) => tile.row === row && tile.col === col)
          );
        }
      }
    }
  }

  //filter king moves based on attacking tiles, etc
  generateLegalKingMoves(boardState, kingTile, attackedTiles);
};

export const generateLegalKingMoves = ({ tiles }, kingTile, attackedTiles) => {
  kingTile.piece.validMoves = kingTile.piece.validMoves.filter((move) => {
    const moveIsAttacked = attackedTiles.some(
      ({ row, col }) => move.row === row && move.col === col
    );

    //TODO: for each capture move, determine whether or not it would put the king in check
    //TODO: for each move, determine whether or not it is also checked by checking piece
    //do i just need pseudo moves..?

    return !moveIsAttacked;
  });
};

//get direct tile coordinates on line shared between two tiles
const getDirectLineBetweenTiles = (
  { tiles },
  tile1,
  tile2,
  includePseudoTiles
) => {
  const { row: tile1Row, col: tile1Col } = tile1;
  const { row: tile2Row, col: tile2Col } = tile2;

  //determine direction towards tile
  const rowDirection =
    tile2Row > tile1Row
      ? DirectionOperator.PLUS
      : tile2Row < tile1Row
      ? DirectionOperator.MINUS
      : null;

  const colDirection =
    tile2Col > tile1Col
      ? DirectionOperator.PLUS
      : tile2Col < tile1Col
      ? DirectionOperator.MINUS
      : null;

  return generateMovesInDirection(
    tiles,
    rowDirection,
    colDirection,
    boardDimensions.rows,
    tile1,
    includePseudoTiles
  );
};

export const generatePieceMoves = ({ tiles }, actionedTile) => {
  const validMoves = [];
  const piece = actionedTile.piece;

  switch (piece.type) {
    case PieceType.PAWN:
      const { pushMoves, captureMoves, pseudoCaptureMoves } = getPawnMoves(
        tiles,
        actionedTile
      );
      piece.pushMoves = pushMoves;
      piece.captureMoves = captureMoves;
      piece.pseudoCaptureMoves = pseudoCaptureMoves;
      return;
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

  piece.validMoves = validMoves;
};

const getPawnMoves = (tiles, actionedTile) => {
  const direction =
    actionedTile.piece.allegiance === Allegiance.BLACK
      ? DirectionOperator.PLUS
      : DirectionOperator.MINUS;

  //pawns follow different rules for movement / capturing pieces
  const pushMoves = getPawnPushMoves(tiles, actionedTile, direction);

  const { pseudoMoves: pseudoCaptureMoves, legalMoves: captureMoves } =
    getPawnCaptureMoves(tiles, actionedTile, direction);

  return {
    pushMoves,
    pseudoCaptureMoves,
    captureMoves
  };
};

const getPawnPushMoves = (tiles, { row, col, piece }, direction) =>
  [
    tiles[nextTile(row, 1, direction)]?.[col],
    !piece.hasMoved && tiles[nextTile(row, 2, direction)]?.[col]
  ]
    .filter((tile) => tile && !tile.piece)
    .map(({ row, col }) => ({
      row,
      col
    }));

const getPawnCaptureMoves = (tiles, { row, col, piece }, direction) => {
  const pseudoMoves = [
    tiles[nextTile(row, 1, direction)]?.[
      nextTile(col, 1, DirectionOperator.PLUS)
    ],
    tiles[nextTile(row, 1, direction)]?.[
      nextTile(col, 1, DirectionOperator.MINUS)
    ]
  ]
    .filter((tile) => tile)
    .map(({ row, col }) => ({
      row,
      col
    }));

  const legalMoves = pseudoMoves.filter(({ row, col }) =>
    tiles[row][col].piece?.isCapturable(piece)
  );

  return { pseudoMoves, legalMoves };
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
  { row: pieceRow, col: pieceCol, piece: actionedPiece },
  generatePseudoMoves = false
) => {
  const moves = [];

  for (let i = 1; i < distanceLimit; i++) {
    const tile =
      tiles[nextTile(pieceRow, i, rowDirection)]?.[
        nextTile(pieceCol, i, colDirection)
      ];

    if (tile) {
      const { row, col, piece } = tile;

      if (!generatePseudoMoves && piece) {
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
