export default class Tile {
  file;
  rank;
  contents;

  constructor(file, rank) {
    this.file = file;
    this.rank = rank;
  }

  get coords() {
    return `${this.file + this.rank}`;
  }
}
