import { memo, useState } from "react";
import { Dialog } from "./dialog";

const getGameResultContent = (gameState) => {
  let content = null;

  if (gameState.status === "STALEMATE") {
    content = <p>Stalemate!</p>;
  } else {
    content = (
      <p>
        {gameState.winningPlayer?.userId === gameState.clientPlayer?.userId
          ? "You win!"
          : "You lose!"}
      </p>
    );
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
