import { memo, useCallback, useEffect, useReducer, useState } from "react";
import produce from "immer";
import BoardState from "../classes/board/boardState";
import Chessboard from "./chessboard";
import Piece from "../classes/piece";
import { Allegiance, PieceType } from "../enums/enums";
import { generateAllMoves, generateMoves } from "../utils/moveEngine";

const defaultGameState = new BoardState();

const setPieces = (boardState) => {
  boardState.tiles[0][0].piece = new Piece(Allegiance.BLACK, PieceType.ROOK);
  boardState.tiles[0][1].piece = new Piece(Allegiance.BLACK, PieceType.KNIGHT);
  boardState.tiles[0][2].piece = new Piece(Allegiance.BLACK, PieceType.BISHOP);
  boardState.tiles[0][3].piece = new Piece(Allegiance.BLACK, PieceType.QUEEN);
  boardState.tiles[0][4].piece = new Piece(Allegiance.BLACK, PieceType.KING);
  boardState.tiles[0][5].piece = new Piece(Allegiance.BLACK, PieceType.BISHOP);
  boardState.tiles[0][6].piece = new Piece(Allegiance.BLACK, PieceType.KNIGHT);
  boardState.tiles[0][7].piece = new Piece(Allegiance.BLACK, PieceType.ROOK);

  boardState.tiles[1][0].piece = new Piece(Allegiance.BLACK, PieceType.PAWN);
  boardState.tiles[1][1].piece = new Piece(Allegiance.BLACK, PieceType.PAWN);
  boardState.tiles[1][2].piece = new Piece(Allegiance.BLACK, PieceType.PAWN);
  boardState.tiles[1][3].piece = new Piece(Allegiance.BLACK, PieceType.PAWN);
  boardState.tiles[1][4].piece = new Piece(Allegiance.BLACK, PieceType.PAWN);
  boardState.tiles[1][5].piece = new Piece(Allegiance.BLACK, PieceType.PAWN);
  boardState.tiles[1][6].piece = new Piece(Allegiance.BLACK, PieceType.PAWN);
  boardState.tiles[1][7].piece = new Piece(Allegiance.BLACK, PieceType.PAWN);

  boardState.tiles[6][0].piece = new Piece(Allegiance.WHITE, PieceType.PAWN);
  boardState.tiles[6][1].piece = new Piece(Allegiance.WHITE, PieceType.PAWN);
  boardState.tiles[6][2].piece = new Piece(Allegiance.WHITE, PieceType.PAWN);
  boardState.tiles[6][3].piece = new Piece(Allegiance.WHITE, PieceType.PAWN);
  boardState.tiles[6][4].piece = new Piece(Allegiance.WHITE, PieceType.PAWN);
  boardState.tiles[6][5].piece = new Piece(Allegiance.WHITE, PieceType.PAWN);
  boardState.tiles[6][6].piece = new Piece(Allegiance.WHITE, PieceType.PAWN);
  boardState.tiles[6][7].piece = new Piece(Allegiance.WHITE, PieceType.PAWN);

  boardState.tiles[7][0].piece = new Piece(Allegiance.WHITE, PieceType.ROOK);
  boardState.tiles[7][1].piece = new Piece(Allegiance.WHITE, PieceType.KNIGHT);
  boardState.tiles[7][2].piece = new Piece(Allegiance.WHITE, PieceType.BISHOP);
  boardState.tiles[7][3].piece = new Piece(Allegiance.WHITE, PieceType.QUEEN);
  boardState.tiles[7][4].piece = new Piece(Allegiance.WHITE, PieceType.KING);
  boardState.tiles[7][5].piece = new Piece(Allegiance.WHITE, PieceType.BISHOP);
  boardState.tiles[7][6].piece = new Piece(Allegiance.WHITE, PieceType.KNIGHT);
  boardState.tiles[7][7].piece = new Piece(Allegiance.WHITE, PieceType.ROOK);

  generateAllMoves(boardState);
};

const boardReducer = produce((state, action) => {
  switch (action.type) {
    case "SET_BOARD":
      setPieces(state);
      return state;
    case "MOVE_PIECE":
      const sourceTile = state.findTileByCoords(
        action.sourceTile.row,
        action.sourceTile.col
      );
      const destinationTile = state.findTileByCoords(
        action.destinationTile.row,
        action.destinationTile.col
      );

      destinationTile.piece = sourceTile.piece;
      sourceTile.piece = null;

      generateMoves(destinationTile);

      return state;
    default:
      return state;
  }
});

const Game = () => {
  const [heldPiece, setHeldPiece] = useState(null);
  const [boardState, dispatch] = useReducer(boardReducer, defaultGameState);

  const onDragHandler = useCallback(({ piece }) => {
    setHeldPiece(piece);
  }, []);

  const onDropHandler = useCallback((sourceTile, dropTile) => {
    dispatch({ type: "MOVE_PIECE", sourceTile, destinationTile: dropTile });
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_BOARD" });
  }, []);

  return (
    <Chessboard
      heldPiece={heldPiece}
      boardState={boardState}
      dragHandler={onDragHandler}
      dropHandler={onDropHandler}
    />
  );
};

export default memo(Game);
