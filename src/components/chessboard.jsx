import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessKing,
  faChessQueen,
  faChessBishop,
  faChessRook,
  faChessKnight,
  faChessPawn
} from "@fortawesome/free-solid-svg-icons";
import { PieceType } from "../enums/enums";
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

const renderPiece = ({ type, allegiance }) => {
  switch (type) {
    case PieceType.PAWN:
      return <Pawn allegiance={allegiance} />;
    case PieceType.ROOK:
      return <Rook allegiance={allegiance} />;
    case PieceType.KNIGHT:
      return <Knight allegiance={allegiance} />;
    case PieceType.BISHOP:
      return <Bishop allegiance={allegiance} />;
    case PieceType.KING:
      return <King allegiance={allegiance} />;
    case PieceType.QUEEN:
      return <Queen allegiance={allegiance} />;
    default:
      return <></>;
  }
};

const renderTileContents = (tile, dragHandler, dragEndHandler) => {
  return (
    tile.piece && (
      <Piece
        tile={tile}
        dragHandler={dragHandler}
        dragEndHandler={dragEndHandler}
      >
        {renderPiece(tile.piece)}
      </Piece>
    )
  );
};

const Piece = ({ tile, dragHandler, dragEndHandler, children }) => {
  const [, drag] = useDrag(
    () => ({
      type: "PIECE",
      item: () => {
        dragHandler(tile);
        return tile;
      },
      end: dragEndHandler
    }),
    [tile]
  );

  return <div ref={(node) => drag(node)}>{children}</div>;
};

const Tile = ({
  tile,
  heldPiece,
  dropHandler,
  dragHandler,
  dragEndHandler
}) => {
  const isValidDropTile = heldPiece?.isValidMove(tile.row, tile.col);

  const [, drop] = useDrop(
    () => ({
      accept: "PIECE",
      canDrop: () => isValidDropTile,
      drop: (item) => dropHandler(item, tile)
    }),
    [heldPiece]
  );

  return (
    <td
      className={isValidDropTile ? "validDropTile" : ""}
      ref={(node) => drop(node)}
      id={`${tile.chessCoords}`}
    >
      {renderTileContents(tile, dragHandler, dragEndHandler)}
    </td>
  );
};

const Row = ({ tiles, ...props }) => {
  return (
    <tr>
      {tiles.map((tile) => (
        <Tile key={tile.chessCoords} tile={tile} {...props} />
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
