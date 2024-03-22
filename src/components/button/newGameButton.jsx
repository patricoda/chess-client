import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

export const NewGameButton = ({ onClick }) => (
  <button onClick={onClick} title="start new game" aria-label="start new game">
    <FontAwesomeIcon icon={faPlus} inverse />
  </button>
);

export default memo(NewGameButton);
