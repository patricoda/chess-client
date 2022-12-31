import {
  Allegiance,
  DirectionOperator,
  PieceType,
  SlidingPieceType
} from "../enums/enums";
import { boardDimensions } from "./values";

//TODO: put entire engine in hook with state for board? removes need to pass through and recalculate per reducer call
//definitely efficiencies to make here i.e. store positions, etc
export const movePiece = (
  boardState,
  { row: sourceRow, col: sourceCol },
  { row: destRow, col: destCol }
) => {
  const sourceTile = boardState.findTileByCoords(sourceRow, sourceCol);
  const destinationTile = boardState.findTileByCoords(destRow, destCol);

  const sourcePiece = sourceTile.piece;

  if (sourcePiece.type === PieceType.KING && !sourcePiece.hasMoved) {
    //find castling rook data if move made is a castling move
    const castlingRookCoords = sourceTile.piece.validMoves.find(
      ({ row, col }) => col === destCol && row === destRow
    ).castlingRookCoords;

    if (castlingRookCoords) {
      const rookSourceTile = boardState.findTileByCoords(
        castlingRookCoords.source.row,
        castlingRookCoords.source.col
      );

      const rookDestinationTile = boardState.findTileByCoords(
        castlingRookCoords.destination.row,
        castlingRookCoords.destination.col
      );

      rookDestinationTile.piece = rookSourceTile.piece;
      rookDestinationTile.piece.hasMoved = true;
      rookSourceTile.piece = null;
    }
  }

  destinationTile.piece = sourcePiece;
  destinationTile.piece.hasMoved = true;
  sourceTile.piece = null;
};

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

const evaluatePins = (boardState, kingTile) => {
  const tiles = boardState.tiles;
  const flatTileArray = boardState.tiles.flat();

  const lateralAttackingTiles = getLateralMoves(
    tiles,
    kingTile,
    boardDimensions.rows,
    true
  ).reduce((acc, { row, col }) => {
    const tile = boardState.findTileByCoords(row, col);
    const { piece } = tile;

    return (piece?.type === PieceType.ROOK ||
      piece?.type === PieceType.QUEEN) &&
      piece?.allegiance !== kingTile.piece.allegiance
      ? [...acc, tile]
      : acc;
  }, []);

  const diagonalAttackingTiles = getDiagonalMoves(
    tiles,
    kingTile,
    boardDimensions.rows,
    true
  ).reduce((acc, { row, col }) => {
    const tile = boardState.findTileByCoords(row, col);
    const { piece } = tile;

    return (piece?.type === PieceType.BISHOP ||
      piece?.type === PieceType.QUEEN) &&
      piece?.allegiance !== kingTile.piece.allegiance
      ? [...acc, tile]
      : acc;
  }, []);

  for (const attackingTile of [
    ...lateralAttackingTiles,
    ...diagonalAttackingTiles
  ]) {
    //TODO: consider getDirectLineBetweenTiles returning tiles not coords..?
    const inbetweenTileCoords = getDirectLineBetweenTiles(
      boardState.tiles,
      attackingTile,
      kingTile,
      true
    );

    const inbetweenTilesWithPieces = flatTileArray.filter(
      (tile) =>
        tile.piece &&
        inbetweenTileCoords.find(({ row, col }) => {
          return tile.row === row && tile.col === col;
        })
    );

    //if there is a single piece between an opposing sliding piece and the king, it is pinned
    if (inbetweenTilesWithPieces.length === 1) {
      const piece = inbetweenTilesWithPieces[0].piece;

      if (piece.allegiance !== kingTile.piece.allegiance) {
        continue;
      } else {
        if (piece.type === PieceType.PAWN) {
          piece.pushMoves = piece.pushMoves.filter((move) =>
            inbetweenTileCoords.some(
              ({ row, col }) => move.row === row && move.col === col
            )
          );

          piece.captureMoves = piece.captureMoves.filter(
            (move) =>
              move.row === attackingTile.row && move.col === attackingTile.col
          );
        } else {
          piece.validMoves = piece.validMoves.filter(
            ({ row, col }) =>
              (row === attackingTile.row && col === attackingTile.col) ||
              inbetweenTileCoords.some(
                (tile) => row === tile.row && col === tile.col
              )
          );
        }

        piece.isPinned = true;
      }
    }
  }
};

const handleSingleCheck = (
  boardState,
  currentPlayerPopulatedTiles,
  kingTile,
  checkingTile
) => {
  const { piece: checkingPiece } = checkingTile;
  //if checker is a sliding piece, check for blocking / capture moves
  const isSlidingPiece = !!SlidingPieceType[checkingPiece.type];
  let tilesInCheck = [];

  //get tiles on shared line between king and checking piece to evaluate blockers and escape moves
  if (isSlidingPiece) {
    tilesInCheck = getDirectLineBetweenTiles(
      boardState.tiles,
      checkingTile,
      kingTile
    );
  }

  for (const tile of currentPlayerPopulatedTiles) {
    const piece = tile.piece;

    if (tile !== kingTile && !piece.isPinned) {
      //TODO: this block is very similar to generating pins, reuse possible?
      if (piece.type === PieceType.PAWN) {
        piece.pushMoves = piece.pushMoves.filter(({ row, col }) =>
          tilesInCheck.some((tile) => tile.row === row && tile.col === col)
        );

        piece.captureMoves = piece.captureMoves.filter(
          ({ row, col }) => checkingTile.row === row && checkingTile.col === col
        );
      } else {
        piece.validMoves = piece.validMoves.filter(
          ({ row, col }) =>
            (checkingTile.row === row && checkingTile.col === col) ||
            tilesInCheck.some((tile) => tile.row === row && tile.col === col)
        );
      }
    }
  }
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

  //TODO: en passant, castling
  //TODO: can we check 'check' before generating pseudo moves? more efficient?
  //TODO: do we even need a separate pseudo move generator?
  //TODO: handle removal of moves / don't generate when checked by 2 or more pieces

  for (const tile of currentPlayerPopulatedTiles) {
    generatePseudoLegalMoves(boardState, tile, activePlayer);
    tile.piece.isPinned = false;
  }

  const kingTile = currentPlayerPopulatedTiles.find(
    (tile) => tile.piece.type === PieceType.KING
  );

  //if there are two checking pieces, only king moves are valid
  if (checkingPieces.length !== 2) {
    evaluatePins(boardState, kingTile);
  }

  //TODO: does it make sense to have 'inCheck' passed through? just do it here and remove step?
  //if there is only one checking piece, filter moves so that pieces can only block check
  if (checkingPieces.length === 1) {
    handleSingleCheck(
      boardState,
      currentPlayerPopulatedTiles,
      kingTile,
      checkingPieces[0]
    );
  }

  //filter king moves based on attacking tiles, etc
  evaluateLegalKngMoves(boardState, kingTile);
};

export const evaluateLegalKngMoves = (boardState, kingTile) => {
  //for each move, move the king temporarily, and see if it would be in check
  kingTile.piece.validMoves = kingTile.piece.validMoves.filter((move) => {
    const destinationTile = boardState.findTileByCoords(move.row, move.col);
    const kingPiece = kingTile.piece;
    const piece = destinationTile.piece;

    destinationTile.piece = kingTile.piece;
    kingTile.piece = null;

    const tileIsAttacked = !!getCheckingPieces({
      boardState,
      activePlayer: kingPiece.allegiance
    }).length;

    destinationTile.piece = piece;
    kingTile.piece = kingPiece;

    return !tileIsAttacked;
  });
};

//get direct tile coordinates on line shared between two tiles, only works on straight lines.
const getDirectLineBetweenTiles = (
  tiles,
  tile1,
  tile2,
  generateMovesPastBlockers = false
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

  const distance =
    rowDirection === null
      ? Math.abs(tile2Col - tile1Col)
      : Math.abs(tile2Row - tile1Row);

  return generateMovesInDirection(
    tiles,
    rowDirection,
    colDirection,
    distance,
    tile1,
    generateMovesPastBlockers
  );
};

export const generatePseudoLegalMoves = ({ tiles }, actionedTile) => {
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
      validMoves.push(...getCastlingMoves(tiles, actionedTile));
      break;
    case PieceType.QUEEN:
      validMoves.push(...getOmnidirectionalMoves(tiles, actionedTile));
      break;
    default:
      break;
  }

  piece.validMoves = validMoves;
};

const getCastlingMoves = (tiles, kingTile) => {
  const king = kingTile.piece;
  const castlingMoves = [];

  if (!king.hasMoved) {
    let rowToEvaluate;

    if (king.allegiance === Allegiance.BLACK) {
      rowToEvaluate = tiles[0];
    } else {
      rowToEvaluate = tiles[tiles.length - 1];
    }

    const unmovedRookTiles = rowToEvaluate.filter(
      ({ piece: tilePiece }) =>
        tilePiece &&
        tilePiece.allegiance === king.allegiance &&
        tilePiece.type === PieceType.ROOK &&
        !tilePiece.hasMoved
    );

    for (const rookTile of unmovedRookTiles) {
      const inbetweenTileCoords = getDirectLineBetweenTiles(
        tiles,
        kingTile,
        rookTile,
        true
      );

      const piecesBetweenKingAndRook = rowToEvaluate.some(
        (tile) =>
          tile.piece &&
          inbetweenTileCoords.find(({ row, col }) => {
            return tile.row === row && tile.col === col;
          })
      );

      if (piecesBetweenKingAndRook) {
        continue;
      } else {
        castlingMoves.push({
          ...inbetweenTileCoords[1],
          castlingRookCoords: {
            source: { row: rookTile.row, col: rookTile.col },
            destination: inbetweenTileCoords[0]
          }
        });
      }
    }
  }

  return castlingMoves;
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
  distanceLimit = boardDimensions.rows,
  generateMovesPastBlockers = false
) => {
  const moves = [];

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.MINUS,
      null,
      distanceLimit,
      actionedTile,
      generateMovesPastBlockers
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.PLUS,
      null,
      distanceLimit,
      actionedTile,
      generateMovesPastBlockers
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      null,
      DirectionOperator.MINUS,
      distanceLimit,
      actionedTile,
      generateMovesPastBlockers
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      null,
      DirectionOperator.PLUS,
      distanceLimit,
      actionedTile,
      generateMovesPastBlockers
    )
  );

  return moves;
};

const getDiagonalMoves = (
  tiles,
  actionedTile,
  distanceLimit = boardDimensions.rows,
  generateMovesPastBlockers = false
) => {
  const moves = [];

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.MINUS,
      DirectionOperator.MINUS,
      distanceLimit,
      actionedTile,
      generateMovesPastBlockers
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.MINUS,
      DirectionOperator.PLUS,
      distanceLimit,
      actionedTile,
      generateMovesPastBlockers
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.PLUS,
      DirectionOperator.MINUS,
      distanceLimit,
      actionedTile,
      generateMovesPastBlockers
    )
  );

  moves.push(
    ...generateMovesInDirection(
      tiles,
      DirectionOperator.PLUS,
      DirectionOperator.PLUS,
      distanceLimit,
      actionedTile,
      generateMovesPastBlockers
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
  generateMovesPastBlockers = false
) => {
  const moves = [];

  for (let i = 1; i < distanceLimit; i++) {
    const tile =
      tiles[nextTile(pieceRow, i, rowDirection)]?.[
        nextTile(pieceCol, i, colDirection)
      ];

    if (tile) {
      const { row, col, piece } = tile;

      if (!generateMovesPastBlockers && piece) {
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
