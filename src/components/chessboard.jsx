const COLUMN_VALUES = "abcdefgh";

const renderCellContents = (data) => {
  switch (data) {
    case 0:
      return <i>0</i>;
    case 1:
      return <i>p</i>;
  }
};

const Row = ({ index, cells }) => {
  const rowId = index + 1;
  return (
    <tr id={rowId}>
      {cells.map((cellData, cellIndex) => (
        <td id={`${COLUMN_VALUES[cellIndex] + rowId}`}>
          {renderCellContents(cellData)}
        </td>
      ))}
    </tr>
  );
};

const Board = ({ gameState }) => {
  return (
    <table className="chessboard">
      <tbody>
        {gameState.map((cells, i) => (
          <Row index={i} cells={cells} />
        ))}
      </tbody>
    </table>
  );
};

export default Board;
