import { useEffect, useCallback } from "react";
import { useImmerReducer } from "use-immer";
import Board from "../classes/board/board";
import { Allegiance, PieceType } from "../enums/enums";
import {
  setPieces,
  refreshBoardState,
  getActivePlayerValidMoves,
  getCheckingPieces,
  movePiece,
  hasMovedToEndOfBoard,
  promotePiece
} from "../utils/engine";

const defaultGameState = {
  activePlayer: Allegiance.WHITE,
  board: new Board(),
  checkingPieces: [],
  moveHistory: [],
  promotableTile: null,
  isStalemate: false,
  isCheckmate: false
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "INITIATE_GAME":
      setPieces(state.board);
      refreshBoardState(state);

      return state;
    case "MOVE_PIECE":
      movePiece(state.board, action.sourceTile, action.destinationTile);

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

      //mark for promotion if applicable
      if (
        action.sourceTile.piece.type === PieceType.PAWN &&
        hasMovedToEndOfBoard(action.sourceTile.piece, action.destinationTile)
      ) {
        state.promotableTile = action.destinationTile;
      }

      return state;
    case "PROMOTE_PIECE":
      promotePiece(state.board, action.tile, action.newRank);
      state.promotableTile = null;

      return state;
    case "PROGRESS_GAME":
      if (!state.promotableTile) {
        state.activePlayer =
          state.activePlayer === Allegiance.WHITE
            ? Allegiance.BLACK
            : Allegiance.WHITE;

        state.checkingPieces = getCheckingPieces(state);

        refreshBoardState(state);

        if (!getActivePlayerValidMoves(state).length) {
          if (state.checkingPieces.length) {
            state.isCheckmate = true;
            alert(`checkmate! ${state.activePlayer} loses!`);
          } else {
            state.isStalemate = true;
            alert(`stalemate!`);
          }
        }
      }

      return state;
    default:
      return state;
  }
};

export const useChessEngine = () => {
  const [gameState, dispatch] = useImmerReducer(gameReducer, defaultGameState);

  const movePiece = useCallback(
    (sourceTile, dropTile) => {
      dispatch({
        type: "MOVE_PIECE",
        sourceTile,
        destinationTile: dropTile
      });

      dispatch({
        type: "PROGRESS_GAME"
      });
    },
    [dispatch]
  );

  const promotePiece = useCallback(
    (e) => {
      dispatch({
        type: "PROMOTE_PIECE",
        tile: gameState.promotableTile,
        newRank: e.currentTarget.dataset.value
      });

      dispatch({
        type: "PROGRESS_GAME"
      });
    },
    [dispatch, gameState.promotableTile]
  );

  useEffect(() => {
    dispatch({
      type: "INITIATE_GAME"
    });
  }, [dispatch]);

  const { board, activePlayer, promotableTile, isStalemate, isCheckmate } =
    gameState;

  return {
    board,
    activePlayer,
    promotableTile,
    isStalemate,
    isCheckmate,
    movePiece,
    promotePiece
  };
};

export default useChessEngine;