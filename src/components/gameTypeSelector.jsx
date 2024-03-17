import { faGlobe, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { memo } from "react";
import ButtonHolder from "./buttonHolder";

const GameTypeSelector = () => (
  <div className="game-type-selector">
    <ButtonHolder>
      <button title="play online" aria-label="play online">
        <Link to="online">
          <FontAwesomeIcon icon={faGlobe} title="Online" inverse />
        </Link>
      </button>
      <button title="play offline" aria-label="play offline">
        <Link to="offline">
          <FontAwesomeIcon icon={faUserGroup} title="Offline" inverse />
        </Link>
      </button>
    </ButtonHolder>
  </div>
);

export default memo(GameTypeSelector);
