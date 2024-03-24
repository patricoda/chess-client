import { memo } from "react";

const PlayerProfile = ({ player, ...props }) => (
  <div className="player-profile" {...props}>
    {player.username}
  </div>
);

export default memo(PlayerProfile);
