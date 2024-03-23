import { useNavigate } from "react-router-dom";
import { memo, useCallback } from "react";
import ButtonHolder from "./buttonHolder";
import OnlineGameButton from "./button/onlineGameButton";
import OfflineGameButton from "./button/offlineGameButton";

const GameTypeSelector = () => {
  const navigate = useNavigate();

  const onlineGameClickHandler = useCallback(() => navigate("/online"));
  const offlineGameClickHandler = useCallback(() => navigate("/offline"));

  return (
    <div className="game-type-selector">
      <ButtonHolder>
        <OnlineGameButton onClick={onlineGameClickHandler} />
        <OfflineGameButton onClick={offlineGameClickHandler} />
      </ButtonHolder>
    </div>
  );
};

export default memo(GameTypeSelector);
