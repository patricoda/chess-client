import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

export const OfflineGameButton = ({ onClick }) => (
  <button onClick={onClick} title="play offline" aria-label="play offline">
    <FontAwesomeIcon icon={faUserGroup} title="Offline" inverse />
  </button>
);

export default memo(OfflineGameButton);
