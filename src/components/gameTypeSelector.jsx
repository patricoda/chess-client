import { faGlobe, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const GameTypeSelector = () => (
  <div className="overlay">
    <div id="gameTypeSelection" className="selectionContainer">
      <div className="option-box">
        <Link to="online">
          <FontAwesomeIcon icon={faGlobe} size="3x" title="Online" />
        </Link>
      </div>
      <div className="option-box">
        <Link to="offline">
          <FontAwesomeIcon icon={faUserGroup} size="3x" title="Offline" />
        </Link>
      </div>
    </div>
  </div>
);

export default GameTypeSelector;
