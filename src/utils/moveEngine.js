import { type } from "../enums/enums";

export const getMoves = (boardState, tile) => {
  const validMoves = [];

  if (tile.piece.type === type.PAWN) {
    validMoves.push(boardState[tile.row - 1][tile.col]);
    //find piece's location in the boardState
    //push cells / tiles that are valid to move to
  }

  return validMoves;
};
