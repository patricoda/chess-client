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
  playerAllegiance,
  selectTileHandler,
  children,
}) => (
  <div
    onClick={() => playerAllegiance === allegiance && selectTileHandler(tile)}
    className={playerAllegiance === Allegiance.BLACK ? "flip" : ""}
  >
    {children}
  </div>
);

const Tile = ({
  tile,
  selectedTile,
  clientPlayer: { allegiance: playerAllegiance, legalMoves },
  moveHandler,
  ...props
}) => {
  const isValidMoveTile =
    legalMoves[selectedTile?.chessCoords]?.some(
      (coords) => coords === tile.chessCoords
    ) ?? false; //selectedTile?.piece.isValidMove(tile.row, tile.col);

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
        <Tile key={tile.chessCoords} tile={tile} {...props} />
      ))}
    </tr>
  );
};

const ChessBoard = ({
  boardState,
  moveHandler,
  clientPlayer,
  promotableCoords,
  onPromotionHandler,
  ...props
}) => {
  const { allegiance } = clientPlayer;
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
          allegiance={allegiance}
          promotionHandler={onPromotionHandler}
        />
      )}
      <table
        className={`chessboard ${
          allegiance === Allegiance.BLACK ? "flip" : ""
        }`}
      >
        <tbody>
          {boardState.tiles.map((tiles, i) => (
            <Row
              key={i}
              tiles={tiles}
              selectedTile={selectedTile}
              selectTileHandler={onSelectTileHandler}
              moveHandler={onMoveHandler}
              clientPlayer={clientPlayer}
              {...props}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ChessBoard;
