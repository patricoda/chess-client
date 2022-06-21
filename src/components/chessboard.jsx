import React, { useRef } from "react";
import { DraggableCore } from "react-draggable";

const Pawn = ({ allegiance, nodeRef, ...props }) => {
  return (
    <i
      ref={nodeRef}
      className={allegiance === "WHITE" ? "white" : "black"}
      {...props}
    >
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

const Tile = ({ tile, clickHandler }) => {
  const nodeRef = React.useRef(null);

  return (
    <DraggableCore
      nodeRef={nodeRef}
      onStart={() => {
        return clickHandler(tile);
      }}
      onStop={() => clickHandler(tile)}
    >
      <td ref={nodeRef} id={`${tile.coords}`}>
        {renderTileContents(tile, clickHandler)}
      </td>
    </DraggableCore>
  );
};

const Row = ({ index, tiles, clickHandler }) => {
  const rowId = index + 1;
  return (
    <tr id={rowId}>
      {tiles.map((tile) => (
        <Tile tile={tile} clickHandler={clickHandler} />
      ))}
    </tr>
  );
};

const Board = ({ boardState, clickHandler }) => {
  return (
    <table className="chessboard">
      <tbody>
        {boardState.tiles.map((tiles, i) => (
          <Row index={i} tiles={tiles} clickHandler={clickHandler} />
        ))}
      </tbody>
    </table>
  );
};

export default Board;
