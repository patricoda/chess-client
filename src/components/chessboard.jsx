import { useState, useCallback } from "react";

import { PieceType } from "../enums/enums";
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
  selectTileHandler,
  children
}) => (
  <div onClick={() => activePlayer === allegiance && selectTileHandler(tile)}>
    {children}
  </div>
);

const Tile = ({
  tile,
  selectedTile,
  moveHandler,
  selectTileHandler,
  activePlayer
}) => {
  const isValidMoveTile = selectedTile?.piece.isValidMove(tile.row, tile.col);

  return (
    <td
      className={isValidMoveTile ? "validMoveTile" : ""}
      onClick={() => isValidMoveTile && moveHandler(tile)}
      id={`${tile.chessCoords}`}
    >
      {tile.piece && (
        <Piece
          tile={tile}
          allegiance={tile.piece.allegiance}
          activePlayer={activePlayer}
          selectTileHandler={selectTileHandler}
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

const Board = ({ boardState, moveHandler, ...props }) => {
  const [selectedTile, setSelectedTile] = useState(null);

  const onSelectTileHandler = useCallback(
    (tile) => {
      if (selectedTile !== tile) {
        setSelectedTile(tile);
      } else {
        setSelectedTile(null);
      }
    },
    [selectedTile]
  );

  const onMoveHandler = useCallback(
    (tile) => {
      moveHandler(selectedTile, tile);
      setSelectedTile(null);
    },
    [moveHandler, selectedTile]
  );

  return (
    <table className="chessboard">
      <tbody>
        {boardState.tiles.map((tiles, i) => (
          <Row
            key={i}
            tiles={tiles}
            selectedTile={selectedTile}
            selectTileHandler={onSelectTileHandler}
            moveHandler={onMoveHandler}
            {...props}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Board;
