import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessKing,
  faChessQueen,
  faChessBishop,
  faChessRook,
  faChessKnight,
  faChessPawn
} from "@fortawesome/free-solid-svg-icons";
import { useDrag, useDrop } from "react-dnd";

const Pawn = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessPawn} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessPawn} size="3x" />
  );

const Rook = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessRook} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessRook} size="3x" />
  );

const Knight = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessKnight} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessKnight} size="3x" />
  );

const Bishop = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessBishop} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessBishop} size="3x" />
  );

const King = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessKing} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessKing} size="3x" />
  );

const Queen = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessQueen} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessQueen} size="3x" />
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
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PIECE",
    canDrag: () => true,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    item: tile
  }));

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: "PIECE",
    canDrop: () => true,
    drop: (item) => dropHandler(item, tile),
    collect: (monitor) => ({
      canDrop: !!monitor.canDrop()
    })
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
