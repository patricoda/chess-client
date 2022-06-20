import { memo, useState } from "react";
import Chessboard from "./chessboard";

//1 pawn
const defaultGameState = [
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0]
];

const Game = () => {
  const [gameState, setGameState] = useState(defaultGameState);

  return <Chessboard gameState={gameState} />;
};

export default memo(Game);
