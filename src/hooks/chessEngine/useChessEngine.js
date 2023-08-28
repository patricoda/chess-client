import { useEffect, useCallback } from "react";
import { useImmerReducer } from "use-immer";
import Board from "../../classes/board/board";
import { Allegiance } from "../../enums/enums";
import {
  setPieces,
  generateLegalMoves,
  getActivePlayerValidMoves,
  getCheckingPieces,
  movePiece,
  promotePiece,
  isPromotable,
} from "./engine";

const defaultGameState = {
  activePlayer: Allegiance.WHITE,
  board: new Board(),
  checkingPieces: [],
  moveHistory: [],
  promotableCoords: null,
  isStalemate: false,
  isCheckmate: false,
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "INITIATE_GAME":
      setPieces(state.board);
      generateLegalMoves(state);

      return state;
    case "MOVE_PIECE":
      //TODO mostRecentMove needs to be refactored
      state.promotableCoords = isPromotable(
        state.board,
        action.source,
        action.destination
      )
        ? action.destination
        : null;

      movePiece(state.board, action.source, action.destination);

      state.moveHistory.push({
        source: action.source,
        destination: action.destination,
      });

      return state;
    case "PROMOTE_PIECE":
      promotePiece(state.board, action.coords, action.newRank);
      state.promotableCoords = null;

      return state;
    case "PROGRESS_GAME":
      if (!state.promotableCoords) {
        state.activePlayer =
          state.activePlayer === Allegiance.WHITE
            ? Allegiance.BLACK
            : Allegiance.WHITE;

        state.checkingPieces = getCheckingPieces(state);

        generateLegalMoves(state);

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

  const handleMovePiece = useCallback(
    (source, destination) => {
      dispatch({
        type: "MOVE_PIECE",
        source,
        destination,
      });

      dispatch({
        type: "PROGRESS_GAME",
      });
    },
    [dispatch]
  );

  const handlePromotePiece = useCallback(
    (e) => {
      dispatch({
        type: "PROMOTE_PIECE",
        coords: gameState.promotableCoords,
        newRank: e.currentTarget.dataset.value,
      });

      dispatch({
        type: "PROGRESS_GAME",
      });
    },
    [dispatch, gameState.promotableCoords]
  );

  useEffect(() => {
    dispatch({
      type: "INITIATE_GAME",
    });
  }, [dispatch]);

  const { board, activePlayer, promotableCoords, isStalemate, isCheckmate } =
    gameState;

  return {
    board,
    activePlayer,
    promotableCoords,
    isStalemate,
    isCheckmate,
    handleMovePiece,
    handlePromotePiece,
  };
};

export default useChessEngine;
