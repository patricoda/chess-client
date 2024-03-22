import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

export const LeaveIconButton = ({ onClick }) => (
  <button onClick={onClick} title="leave" aria-label="leave">
    <FontAwesomeIcon icon={faSignOut} inverse />
  </button>
);

export default memo(LeaveIconButton);
