import { useDrag, useDrop } from "react-dnd";

const Pawn = ({ allegiance, ...props }) => {
  return (
    <i className={allegiance === "WHITE" ? "white" : "black"} {...props}>
      P
    </i>
  );
};

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

const renderTileContents = (tile) => {
  switch (tile.contents?.type) {
    case "PAWN":
      return <Pawn allegiance={tile.contents.allegiance} />;
    case "ROOK":
      return <Rook allegiance={tile.contents.allegiance} />;
    case "KNIGHT":
      return <Knight allegiance={tile.contents.allegiance} />;
    case "BISHOP":
      return <Bishop allegiance={tile.contents.allegiance} />;
    case "KING":
      return <King allegiance={tile.contents.allegiance} />;
    case "QUEEN":
      return <Queen allegiance={tile.contents.allegiance} />;
    default:
      return <></>;
  }
};

const Tile = ({ tile, dropHandler }) => {
  const [, drag] = useDrag(() => ({
    type: "PIECE",
    item: tile
  }));

  const [, drop] = useDrop(() => ({
    accept: "PIECE",
    drop: (item) => dropHandler(item, tile)
  }));

  return (
    <td ref={(node) => drag(drop(node))} id={`${tile.coords}`}>
      {renderTileContents(tile)}
    </td>
  );
};

const Row = ({ tiles, ...props }) => {
  return (
    <tr>
      {tiles.map((tile) => (
        <Tile key={tile.coords} tile={tile} {...props} />
      ))}
    </tr>
  );
};

const Board = ({ boardState, ...props }) => {
  return (
    <table className="chessboard">
      <tbody>
        {boardState.tiles.map((tiles, i) => (
          <Row key={i} tiles={tiles} {...props} />
        ))}
      </tbody>
    </table>
  );
};

export default Board;
