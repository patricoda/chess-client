import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

export const OnlineGameButton = ({ onClick }) => (
  <button onClick={onClick} title="play online" aria-label="play online">
    <FontAwesomeIcon icon={faGlobe} title="Online" inverse />
  </button>
);

export default memo(OnlineGameButton);
