import { memo, useState } from "react";
import Chessboard from "./chessboard";

//1 pawn
const defaultGameState = [
  ["r", "kn", "b", "k", "q", "b", "kn", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["r", "kn", "b", "k", "q", "b", "kn", "r"]
];

const Game = () => {
  const [gameState, setGameState] = useState(defaultGameState);

  return <Chessboard gameState={gameState} />;
};

export default memo(Game);
