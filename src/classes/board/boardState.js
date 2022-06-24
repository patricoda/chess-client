import { immerable } from "immer";
import Tile from "./tile";
import { boardDimensions } from "../../utils/values";

export default class BoardState {
  [immerable] = true;
  tiles = [];

  constructor() {
    this.generateTiles();
  }

  generateTiles() {
    for (let r = 0; r < boardDimensions.rows; r++) {
      this.tiles.push([]);
      for (let c = 0; c < boardDimensions.columns; c++) {
        this.tiles[r].push(new Tile(r, c));
      }
    }
  }

  findTileByCoords(row, col) {
    return this.tiles[row][col];
  }
}
