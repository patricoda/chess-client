import { memo, useState } from "react";
import { Dialog } from "./dialog";

const getGameResultContent = (gameState) => {
  let content = null;

  if (gameState.status === "STALEMATE") {
    content = <p>Stalemate!</p>;
  } else if (gameState.status === "FORFEIT") {
    content = <p>Forfeit! {gameState.winningPlayer} wins!</p>;
  } else {
    content = <p>Checkmate! {gameState.winningPlayer} wins!</p>;
  }

  return content;
};

const GameResultDialog = ({ gameState }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => setIsVisible(false);

  return (
    <Dialog isVisible={isVisible}>
      {getGameResultContent(gameState)}
      <button onClick={handleClose}>close</button>
    </Dialog>
  );
};

export default memo(GameResultDialog);
