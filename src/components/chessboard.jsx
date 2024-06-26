import { useState, useCallback } from "react";
import { PieceType, Allegiance } from "@patricoda/chess-engine";
import { Pawn, Rook, Knight, Bishop, King, Queen } from "./piece";
import classNames from "classnames";

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
  pieceAllegiance,
  playerAllegiance,
  selectTileHandler,
  isPlayersTurn,
  shouldFlipBoard,
  children,
}) => (
  <div
    onClick={() =>
      playerAllegiance === pieceAllegiance &&
      isPlayersTurn &&
      selectTileHandler(tile)
    }
    className={shouldFlipBoard ? "flip" : ""}
  >
    {children}
  </div>
);

const Tile = ({
  tile,
  selectedTile,
  playerAllegiance,
  moveHandler,
  legalMoves,
  latestMove,
  ...props
}) => {
  const isValidMoveTile =
    legalMoves[selectedTile?.notation]?.some(
      (coords) => coords === tile.notation
    ) ?? false;

  const isLatestMoveTile =
    tile.notation === latestMove.from || tile.notation === latestMove.to;

  return (
    <td
      className={classNames({
        validMoveTile: isValidMoveTile,
        latestMoveTile: isLatestMoveTile,
      })}
      onClick={() => isValidMoveTile && moveHandler(tile)}
      id={`${tile.notation}`}
    >
      {tile.piece && (
        <Piece
          tile={tile}
          pieceAllegiance={tile.piece.allegiance}
          playerAllegiance={playerAllegiance}
          {...props}
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
        <Tile key={tile.notation} tile={tile} {...props} />
      ))}
    </tr>
  );
};

const ChessBoard = ({
  boardState,
  moveHandler,
  playerAllegiance,
  flipPerspectiveForBlack,
  ...props
}) => {
  const [selectedTile, setSelectedTile] = useState(null);
  const shouldFlipBoard =
    playerAllegiance === Allegiance.BLACK && flipPerspectiveForBlack;

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
      moveHandler(selectedTile.notation, tile.notation);
      setSelectedTile(null);
    },
    [moveHandler, selectedTile]
  );

  return (
    <table className={`chessboard ${shouldFlipBoard ? "flip" : ""}`}>
      <tbody>
        {boardState.map((tiles, i) => (
          <Row
            key={i}
            tiles={tiles}
            selectedTile={selectedTile}
            selectTileHandler={onSelectTileHandler}
            moveHandler={onMoveHandler}
            playerAllegiance={playerAllegiance}
            shouldFlipBoard={shouldFlipBoard}
            {...props}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ChessBoard;
