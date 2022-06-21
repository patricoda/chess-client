import { immerable } from "immer";

export default class Tile {
  [immerable] = true;
  column;
  row;
  contents;

  constructor(column, row) {
    this.column = column;
    this.row = row;
  }

  get coords() {
    return `${this.column + this.row}`;
  }
}
