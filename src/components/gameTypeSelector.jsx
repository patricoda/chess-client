import { faGlobe, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";

const GameTypeSelector = () => {
  const navigate = useNavigate();

  const handleOnlineClick = () => {
    navigate("online");
  };

  return (
    <div id="gameTypeSelection" className="selectionContainer">
      <div className="option-box">
        <FontAwesomeIcon
          icon={faGlobe}
          size="3x"
          title="Online"
          onClick={handleOnlineClick}
        />
      </div>
      <div className="option-box">
        <Link to="offline">
          <FontAwesomeIcon icon={faUserGroup} size="3x" title="Offline" />
        </Link>
      </div>
    </div>
  );
};

export default GameTypeSelector;
