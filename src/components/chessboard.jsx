import { useState, useCallback } from "react";

import { PieceType } from "../enums/enums";
import { useDrag, useDrop } from "react-dnd";
import { Pawn, Rook, Knight, Bishop, King, Queen } from "./piece";

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

const Piece = ({
  tile,
  allegiance,
  activePlayer,
  dragHandler,
  dragEndHandler,
  children
}) => {
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

  return (
    <div ref={(node) => (activePlayer === allegiance ? drag(node) : node)}>
      {children}
    </div>
  );
};

const Tile = ({
  tile,
  heldPiece,
  dropHandler,
  dragHandler,
  dragEndHandler,
  activePlayer
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
      {tile.piece && (
        <Piece
          tile={tile}
          allegiance={tile.piece.allegiance}
          activePlayer={activePlayer}
          dragHandler={dragHandler}
          dragEndHandler={dragEndHandler}
        >
          {renderPiece(tile.piece)}
        </Piece>
      )}
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
  const [heldPiece, setHeldPiece] = useState(null);

  const onDragHandler = useCallback(({ piece }) => {
    setHeldPiece(piece);
  }, []);

  const onDragEndHandler = useCallback(() => {
    setHeldPiece(null);
  }, []);

  return (
    <table className="chessboard">
      <tbody>
        {boardState.tiles.map((tiles, i) => (
          <Row
            key={i}
            tiles={tiles}
            heldPiece={heldPiece}
            dragHandler={onDragHandler}
            dragEndHandler={onDragEndHandler}
            {...props}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Board;
