export default class Piece {
  allegiance;
  type;
  validMoves = [];

  constructor(allegiance, type) {
    this.allegiance = allegiance;
    this.type = type;
  }

  isValidMove(row, col) {
    return this.validMoves.some((move) => move.row === row && move.col === col);
  }
}
