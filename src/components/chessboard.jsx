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

const renderTileContents = (tile, dragHandler) => {
  switch (tile.piece?.type) {
    case PieceType.PAWN:
      return (
        <Piece tile={tile} dragHandler={dragHandler}>
          <Pawn allegiance={tile.piece.allegiance} />
        </Piece>
      );
    case PieceType.ROOK:
      return (
        <Piece tile={tile} dragHandler={dragHandler}>
          <Rook allegiance={tile.piece.allegiance} />
        </Piece>
      );
    case PieceType.KNIGHT:
      return (
        <Piece tile={tile} dragHandler={dragHandler}>
          <Knight allegiance={tile.piece.allegiance} />
        </Piece>
      );
    case PieceType.BISHOP:
      return (
        <Piece tile={tile} dragHandler={dragHandler}>
          <Bishop allegiance={tile.piece.allegiance} />
        </Piece>
      );
    case PieceType.KING:
      return (
        <Piece tile={tile} dragHandler={dragHandler}>
          <King allegiance={tile.piece.allegiance} />
        </Piece>
      );
    case PieceType.QUEEN:
      return (
        <Piece tile={tile} dragHandler={dragHandler}>
          <Queen allegiance={tile.piece.allegiance} />
        </Piece>
      );
    default:
      return <></>;
  }
};

const Piece = ({ tile, dragHandler, children }) => {
  const [, drag] = useDrag(
    () => ({
      type: "PIECE",
      item: () => {
        dragHandler(tile);
        return tile;
      }
    }),
    []
  );

  return <div ref={(node) => drag(node)}>{children}</div>;
};

const Tile = ({ tile, heldPiece, dropHandler, dragHandler }) => {
  const [, drop] = useDrop(
    () => ({
      accept: "PIECE",
      canDrop: () => heldPiece.isValidMove(tile.row, tile.col),
      drop: (item) => dropHandler(item, tile)
    }),
    [heldPiece]
  );

  return (
    <td ref={(node) => drop(node)} id={`${tile.chessCoords}`}>
      {renderTileContents(tile, dragHandler)}
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
