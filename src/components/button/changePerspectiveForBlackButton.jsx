import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

export const FlipPerspectiveForBlackButton = ({
  id = "flip-board-button",
  value,
  onClick,
}) => (
  <button
    title="flip board perspective for black"
    aria-label="flip board perspective for black"
    role="checkbox"
    onClick={onClick}
    aria-checked={value}
  >
    <FontAwesomeIcon icon={faRepeat} inverse={!value} />
  </button>
);

export default memo(FlipPerspectiveForBlackButton);
