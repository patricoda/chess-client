import { useState, useCallback } from "react";
import { PieceType, Allegiance } from "../enums/enums";
import { Pawn, Rook, Knight, Bishop, King, Queen } from "./piece";
import PromotionSelector from "./promotionSelector";

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
  playerTurn,
  selectTileHandler,
  flipBoardOnPlayerChange,
  children,
}) => (
  <div
    onClick={() => playerTurn === allegiance && selectTileHandler(tile)}
    className={
      flipBoardOnPlayerChange && playerTurn === Allegiance.BLACK ? "flip" : ""
    }
  >
    {children}
  </div>
);

const Tile = ({ tile, selectedTile, moveHandler, ...props }) => {
  const isValidMoveTile = selectedTile?.piece.isValidMove(tile.row, tile.col);

  return (
    <td
      className={isValidMoveTile ? "validMoveTile" : ""}
      onClick={() => isValidMoveTile && moveHandler(tile)}
      id={`${tile.chessCoords}`}
    >
      {tile.piece && (
        <Piece tile={tile} allegiance={tile.piece.allegiance} {...props}>
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

const ChessBoard = ({
  board,
  moveHandler,
  playerTurn,
  flipBoardOnPlayerChange,
  promotableCoords,
  onPromotionHandler,
  ...props
}) => {
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
      moveHandler(selectedTile.chessCoords, tile.chessCoords);
      setSelectedTile(null);
    },
    [moveHandler, selectedTile]
  );

  return (
    <>
      {!!promotableCoords && (
        <PromotionSelector
          allegiance={playerTurn}
          promotionHandler={onPromotionHandler}
        />
      )}
      <table
        className={`chessboard ${
          flipBoardOnPlayerChange && playerTurn === Allegiance.BLACK
            ? "flip"
            : ""
        }`}
      >
        <tbody>
          {board.tiles.map((tiles, i) => (
            <Row
              key={i}
              tiles={tiles}
              selectedTile={selectedTile}
              selectTileHandler={onSelectTileHandler}
              moveHandler={onMoveHandler}
              playerTurn={playerTurn}
              flipBoardOnPlayerChange={flipBoardOnPlayerChange}
              {...props}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ChessBoard;
