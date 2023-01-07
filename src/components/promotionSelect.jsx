import { Bishop, Knight, Queen, Rook } from "./piece";

export const PromotionSelect = ({ allegiance, promotionHandler }) => (
  <div id="overlay">
    <div id="promotionSelection">
      <div
        class="piece-promotion-box"
        data-value="QUEEN"
        onClick={promotionHandler}
      >
        <Queen allegiance={allegiance} />
      </div>
      <div
        class="piece-promotion-box"
        data-value="ROOK"
        onClick={promotionHandler}
      >
        <Rook allegiance={allegiance} />
      </div>
      <div
        class="piece-promotion-box"
        data-value="KNIGHT"
        onClick={promotionHandler}
      >
        <Knight allegiance={allegiance} />
      </div>
      <div
        class="piece-promotion-box"
        data-value="BISHOP"
        onClick={promotionHandler}
      >
        <Bishop allegiance={allegiance} />
      </div>
    </div>
  </div>
);

export default PromotionSelect;
