import { memo } from "react";

export const LeaveButton = ({ onClick }) => (
  <button onClick={onClick} title="leave" aria-label="leave">
    Leave
  </button>
);

export default memo(LeaveButton);
