import { immerable } from "immer";
import Tile from "./tile";
import { boardDimensions } from "../../utils/values";

export default class Board {
  [immerable] = true;
  tiles = [];

  constructor() {
    this.generateTiles();
  }

  generateTiles() {
    this.tiles = [...Array(boardDimensions.rows)].map((row, r) =>
      [...Array(boardDimensions.columns)].map((col, c) => new Tile(r, c))
    );
  }

  findTileByCoords(row, col) {
    return this.tiles[row][col];
  }
}
