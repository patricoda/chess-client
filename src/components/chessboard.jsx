const COLUMN_VALUES = "abcdefgh";

const renderCellContents = (data) => {
  switch (data) {
    case "r":
      return <i>R</i>;
    case "kn":
      return <i>Kn</i>;
    case "b":
      return <i>B</i>;
    case "k":
      return <i>K</i>;
    case "q":
      return <i>Q</i>;
    case "p":
      return <i>P</i>;
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
