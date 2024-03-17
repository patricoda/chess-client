import { memo } from "react";
import { Bishop, Knight, Queen, Rook } from "./piece";
import ButtonHolder from "./buttonHolder";

export const PromotionSelector = ({ allegiance, promotionHandler }) => (
  <div className="overlay">
    <ButtonHolder
      id="promotionSelection"
      className="promotion-selection-container"
    >
      <button
        title="Queen"
        aria-label="Queen"
        className="promotion-option"
        data-value="QUEEN"
        onClick={promotionHandler}
      >
        <Queen allegiance={allegiance} />
      </button>
      <button
        title="Rook"
        aria-label="Rook"
        className="promotion-option"
        data-value="ROOK"
        onClick={promotionHandler}
      >
        <Rook allegiance={allegiance} />
      </button>
      <button
        title="Knight"
        aria-label="Knight"
        className="promotion-option"
        data-value="KNIGHT"
        onClick={promotionHandler}
      >
        <Knight allegiance={allegiance} />
      </button>
      <button
        title="Bishop"
        aria-label="Bishop"
        className="promotion-option"
        data-value="BISHOP"
        onClick={promotionHandler}
      >
        <Bishop allegiance={allegiance} />
      </button>
    </ButtonHolder>
  </div>
);

export default memo(PromotionSelector);
