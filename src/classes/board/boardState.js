import { immerable } from "immer";
import Tile from "./tile";

const COLUMN_VALUES = "abcdefgh";

export default class BoardState {
  [immerable] = true;
  columnsLength = 8;
  rowsLength = 8;
  tiles = [];

  constructor() {
    this.generateTiles();
  }

  generateTiles() {
    for (let c = 0; c < this.columnsLength; c++) {
      this.tiles.push([]);
      for (let r = 0; r < this.rowsLength; r++) {
        this.tiles[c].push(new Tile(COLUMN_VALUES[r], this.columnsLength - c));
      }
    }
  }
}
