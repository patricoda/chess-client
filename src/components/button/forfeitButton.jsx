import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

export const ForfeitButton = ({ onClick }) => (
  <button onClick={onClick} title="forfeit" aria-label="forfeit">
    <FontAwesomeIcon icon={faFlag} inverse />
  </button>
);

export default memo(ForfeitButton);
