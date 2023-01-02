import { memo, useCallback, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import BoardState from "../classes/board/boardState";
import Chessboard from "./chessboard";
import Piece from "../classes/piece";
import { Allegiance, PieceType } from "../enums/enums";
import {
  refreshBoardState,
  isCheckmate,
  getCheckingPieces,
  movePiece
} from "../utils/engine";
import Pawn from "../classes/pawn";

const defaultGameState = {
  activePlayer: Allegiance.WHITE,
  boardState: new BoardState(),
  checkingPieces: [],
  moveHistory: []
};

const setPieces = (boardState) => {
  boardState.tiles[0][0].piece = new Piece(Allegiance.BLACK, PieceType.ROOK);
  boardState.tiles[0][1].piece = new Piece(Allegiance.BLACK, PieceType.KNIGHT);
  boardState.tiles[0][2].piece = new Piece(Allegiance.BLACK, PieceType.BISHOP);
  boardState.tiles[0][3].piece = new Piece(Allegiance.BLACK, PieceType.QUEEN);
  boardState.tiles[0][4].piece = new Piece(Allegiance.BLACK, PieceType.KING);
  boardState.tiles[0][5].piece = new Piece(Allegiance.BLACK, PieceType.BISHOP);
  boardState.tiles[0][6].piece = new Piece(Allegiance.BLACK, PieceType.KNIGHT);
  boardState.tiles[0][7].piece = new Piece(Allegiance.BLACK, PieceType.ROOK);

  boardState.tiles[1][0].piece = new Pawn(Allegiance.BLACK);
  boardState.tiles[1][1].piece = new Pawn(Allegiance.BLACK);
  boardState.tiles[1][2].piece = new Pawn(Allegiance.BLACK);
  boardState.tiles[1][3].piece = new Pawn(Allegiance.BLACK);
  boardState.tiles[1][4].piece = new Pawn(Allegiance.BLACK);
  boardState.tiles[1][5].piece = new Pawn(Allegiance.BLACK);
  boardState.tiles[1][6].piece = new Pawn(Allegiance.BLACK);
  boardState.tiles[1][7].piece = new Pawn(Allegiance.BLACK);

  boardState.tiles[6][0].piece = new Pawn(Allegiance.WHITE);
  boardState.tiles[6][1].piece = new Pawn(Allegiance.WHITE);
  boardState.tiles[6][2].piece = new Pawn(Allegiance.WHITE);
  boardState.tiles[6][3].piece = new Pawn(Allegiance.WHITE);
  boardState.tiles[6][4].piece = new Pawn(Allegiance.WHITE);
  boardState.tiles[6][5].piece = new Pawn(Allegiance.WHITE);
  boardState.tiles[6][6].piece = new Pawn(Allegiance.WHITE);
  boardState.tiles[6][7].piece = new Pawn(Allegiance.WHITE);

  boardState.tiles[7][0].piece = new Piece(Allegiance.WHITE, PieceType.ROOK);
  boardState.tiles[7][1].piece = new Piece(Allegiance.WHITE, PieceType.KNIGHT);
  boardState.tiles[7][2].piece = new Piece(Allegiance.WHITE, PieceType.BISHOP);
  boardState.tiles[7][3].piece = new Piece(Allegiance.WHITE, PieceType.QUEEN);
  boardState.tiles[7][4].piece = new Piece(Allegiance.WHITE, PieceType.KING);
  boardState.tiles[7][5].piece = new Piece(Allegiance.WHITE, PieceType.BISHOP);
  boardState.tiles[7][6].piece = new Piece(Allegiance.WHITE, PieceType.KNIGHT);
  boardState.tiles[7][7].piece = new Piece(Allegiance.WHITE, PieceType.ROOK);
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "SET_BOARD":
      setPieces(state.boardState);

      return state;
    case "MOVE_PIECE":
      movePiece(state.boardState, action.sourceTile, action.destinationTile);

      state.moveHistory.push({
        source: {
          row: action.sourceTile.row,
          col: action.sourceTile.col,
          piece: action.sourceTile.piece
        },
        destination: {
          row: action.destinationTile.row,
          col: action.destinationTile.col
        }
      });

      return state;
    case "SWAP_PLAYER_TURN":
      state.activePlayer =
        state.activePlayer === Allegiance.WHITE
          ? Allegiance.BLACK
          : Allegiance.WHITE;

      return state;
    case "EVALUATE_CHECK_STATE":
      state.checkingPieces = getCheckingPieces(state);

      return state;
    case "GENERATE_MOVES":
      refreshBoardState(state);

      return state;
    case "DETERMINE_CHECKMATE":
      if (isCheckmate(state)) {
        state.isCheckmate = true;
        alert(`checkmate! ${state.activePlayer} loses!`);
      }
      return state;
    default:
      return state;
  }
};

const Game = () => {
  const [gameState, dispatch] = useImmerReducer(gameReducer, defaultGameState);

  const onDropHandler = useCallback(
    (sourceTile, dropTile) => {
      dispatch({
        type: "MOVE_PIECE",
        sourceTile,
        destinationTile: dropTile
      });

      dispatch({
        type: "SWAP_PLAYER_TURN"
      });

      dispatch({
        type: "EVALUATE_CHECK_STATE"
      });

      dispatch({
        type: "GENERATE_MOVES"
      });

      dispatch({
        type: "DETERMINE_CHECKMATE"
      });
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch({ type: "SET_BOARD" });

    dispatch({
      type: "GENERATE_MOVES"
    });
  }, [dispatch]);

  return (
    <Chessboard
      dropHandler={onDropHandler}
      boardState={gameState.boardState}
      activePlayer={gameState.activePlayer}
    />
  );
};

export default memo(Game);
