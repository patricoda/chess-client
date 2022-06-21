import { memo, useCallback, useEffect, useReducer } from "react";
import produce from "immer";
import BoardState from "../classes/board/boardState";
import Chessboard from "./chessboard";
import Piece from "../classes/piece";

const allegiance = Object.freeze({
  BLACK: "BLACK",
  WHITE: "WHITE"
});

const type = Object.freeze({
  PAWN: "PAWN",
  KING: "KING",
  QUEEN: "QUEEN",
  ROOK: "ROOK",
  BISHOP: "BISHOP",
  KNIGHT: "KNIGHT"
});

const defaultGameState = new BoardState();

const setPieces = (boardState) => {
  boardState.tiles[0][0].contents = new Piece(allegiance.BLACK, type.ROOK);
  boardState.tiles[0][1].contents = new Piece(allegiance.BLACK, type.KNIGHT);
  boardState.tiles[0][2].contents = new Piece(allegiance.BLACK, type.BISHOP);
  boardState.tiles[0][3].contents = new Piece(allegiance.BLACK, type.QUEEN);
  boardState.tiles[0][4].contents = new Piece(allegiance.BLACK, type.KING);
  boardState.tiles[0][5].contents = new Piece(allegiance.BLACK, type.BISHOP);
  boardState.tiles[0][6].contents = new Piece(allegiance.BLACK, type.KNIGHT);
  boardState.tiles[0][7].contents = new Piece(allegiance.BLACK, type.ROOK);

  boardState.tiles[1][0].contents = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][1].contents = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][2].contents = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][3].contents = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][4].contents = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][5].contents = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][6].contents = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][7].contents = new Piece(allegiance.BLACK, type.PAWN);

  boardState.tiles[6][0].contents = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][1].contents = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][2].contents = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][3].contents = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][4].contents = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][5].contents = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][6].contents = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][7].contents = new Piece(allegiance.WHITE, type.PAWN);

  boardState.tiles[7][0].contents = new Piece(allegiance.WHITE, type.ROOK);
  boardState.tiles[7][1].contents = new Piece(allegiance.WHITE, type.KNIGHT);
  boardState.tiles[7][2].contents = new Piece(allegiance.WHITE, type.BISHOP);
  boardState.tiles[7][3].contents = new Piece(allegiance.WHITE, type.QUEEN);
  boardState.tiles[7][4].contents = new Piece(allegiance.WHITE, type.KING);
  boardState.tiles[7][5].contents = new Piece(allegiance.WHITE, type.BISHOP);
  boardState.tiles[7][6].contents = new Piece(allegiance.WHITE, type.KNIGHT);
  boardState.tiles[7][7].contents = new Piece(allegiance.WHITE, type.ROOK);
};

const boardReducer = produce((state, action) => {
  switch (action.type) {
    case "SET_BOARD":
      setPieces(state);
      return state;
    case "MOVE_PIECE":
      const tiles = state.tiles;
      const sourceTile = tiles[tiles.length - action.sourceTile.row].find(
        (tile) => tile.column === action.sourceTile.column
      );
      const destinationTile = tiles[
        tiles.length - action.destinationTile.row
      ].find((tile) => tile.column === action.destinationTile.column);

      destinationTile.contents = sourceTile.contents;
      sourceTile.contents = null;

      return state;
    default:
      return state;
  }
});

const Game = () => {
  const [boardState, dispatch] = useReducer(boardReducer, defaultGameState);

  const onDropHandler = useCallback((sourceTile, dropTile) => {
    dispatch({ type: "MOVE_PIECE", sourceTile, destinationTile: dropTile });
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_BOARD" });
  }, []);

  return <Chessboard boardState={boardState} dropHandler={onDropHandler} />;
};

export default memo(Game);
