const Pawn = ({ allegiance }) => (
  <i className={allegiance === "WHITE" ? "white" : "black"}>P</i>
);

const Rook = ({ allegiance }) => (
  <i className={allegiance === "WHITE" ? "white" : "black"}>R</i>
);

const Knight = ({ allegiance }) => (
  <i className={allegiance === "WHITE" ? "white" : "black"}>Kn</i>
);

const Bishop = ({ allegiance }) => (
  <i className={allegiance === "WHITE" ? "white" : "black"}>B</i>
);

const King = ({ allegiance }) => (
  <i className={allegiance === "WHITE" ? "white" : "black"}>K</i>
);

const Queen = ({ allegiance }) => (
  <i className={allegiance === "WHITE" ? "white" : "black"}>Q</i>
);

const renderTileContents = (contents) => {
  switch (contents?.type) {
    case "PAWN":
      return <Pawn allegiance={contents.allegiance} />;
    case "ROOK":
      return <Rook allegiance={contents.allegiance} />;
    case "KNIGHT":
      return <Knight allegiance={contents.allegiance} />;
    case "BISHOP":
      return <Bishop allegiance={contents.allegiance} />;
    case "KING":
      return <King allegiance={contents.allegiance} />;
    case "QUEEN":
      return <Queen allegiance={contents.allegiance} />;
    default:
      return <></>;
  }
};

const Row = ({ index, tiles }) => {
  const rowId = index + 1;
  return (
    <tr id={rowId}>
      {tiles.map((tile) => (
        <td id={`${tile.coords}`}>{renderTileContents(tile.contents)}</td>
      ))}
    </tr>
  );
};

const Board = ({ boardState }) => {
  return (
    <table className="chessboard">
      <tbody>
        {boardState.tiles.map((tiles, i) => (
          <Row index={i} tiles={tiles} />
        ))}
      </tbody>
    </table>
  );
};

export default Board;
