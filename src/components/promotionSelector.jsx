import { Bishop, Knight, Queen, Rook } from "./piece";

export const PromotionSelector = ({ allegiance, promotionHandler }) => (
  <div className="overlay">
    <div id="promotionSelection" className="selectionContainer">
      <div class="option-box" data-value="QUEEN" onClick={promotionHandler}>
        <Queen allegiance={allegiance} />
      </div>
      <div class="option-box" data-value="ROOK" onClick={promotionHandler}>
        <Rook allegiance={allegiance} />
      </div>
      <div class="option-box" data-value="KNIGHT" onClick={promotionHandler}>
        <Knight allegiance={allegiance} />
      </div>
      <div class="option-box" data-value="BISHOP" onClick={promotionHandler}>
        <Bishop allegiance={allegiance} />
      </div>
    </div>
  </div>
);

export default PromotionSelector;
