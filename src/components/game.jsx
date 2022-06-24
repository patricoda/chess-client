import { memo, useCallback, useEffect, useReducer } from "react";
import produce from "immer";
import BoardState from "../classes/board/boardState";
import Chessboard from "./chessboard";
import Piece from "../classes/piece";
import { allegiance, type } from "../enums/enums";

const defaultGameState = new BoardState();

const setPieces = (boardState) => {
  boardState.tiles[0][0].piece = new Piece(allegiance.BLACK, type.ROOK);
  boardState.tiles[0][1].piece = new Piece(allegiance.BLACK, type.KNIGHT);
  boardState.tiles[0][2].piece = new Piece(allegiance.BLACK, type.BISHOP);
  boardState.tiles[0][3].piece = new Piece(allegiance.BLACK, type.QUEEN);
  boardState.tiles[0][4].piece = new Piece(allegiance.BLACK, type.KING);
  boardState.tiles[0][5].piece = new Piece(allegiance.BLACK, type.BISHOP);
  boardState.tiles[0][6].piece = new Piece(allegiance.BLACK, type.KNIGHT);
  boardState.tiles[0][7].piece = new Piece(allegiance.BLACK, type.ROOK);

  boardState.tiles[1][0].piece = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][1].piece = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][2].piece = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][3].piece = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][4].piece = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][5].piece = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][6].piece = new Piece(allegiance.BLACK, type.PAWN);
  boardState.tiles[1][7].piece = new Piece(allegiance.BLACK, type.PAWN);

  boardState.tiles[6][0].piece = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][1].piece = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][2].piece = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][3].piece = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][4].piece = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][5].piece = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][6].piece = new Piece(allegiance.WHITE, type.PAWN);
  boardState.tiles[6][7].piece = new Piece(allegiance.WHITE, type.PAWN);

  boardState.tiles[7][0].piece = new Piece(allegiance.WHITE, type.ROOK);
  boardState.tiles[7][1].piece = new Piece(allegiance.WHITE, type.KNIGHT);
  boardState.tiles[7][2].piece = new Piece(allegiance.WHITE, type.BISHOP);
  boardState.tiles[7][3].piece = new Piece(allegiance.WHITE, type.QUEEN);
  boardState.tiles[7][4].piece = new Piece(allegiance.WHITE, type.KING);
  boardState.tiles[7][5].piece = new Piece(allegiance.WHITE, type.BISHOP);
  boardState.tiles[7][6].piece = new Piece(allegiance.WHITE, type.KNIGHT);
  boardState.tiles[7][7].piece = new Piece(allegiance.WHITE, type.ROOK);
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
