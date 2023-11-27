import { faGlobe, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuth } from "../context/socket";

const GameTypeSelector = () => {
  const dialogRef = useRef(null);
  const navigate = useNavigate();

  const handleOnlineClick = () => {
    //check if there is already a user session, otherwise, prompt user for name
    if (localStorage.getItem("sessionId")) {
      navigate("online");
    } else {
      dialogRef.current.showModal();
    }
  };

  const handleNameSubmission = (e) => {
    e.preventDefault();
    setAuth({ username: e.currentTarget.name.value });
    navigate("online");
  };

  return (
    <div className="overlay">
      <dialog ref={dialogRef}>
        <form onSubmit={handleNameSubmission}>
          <input
            id="name"
            type="text"
            placeholder="Please enter your name"
            name="name"
          />
          <button>submit</button>
        </form>
      </dialog>
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
    </div>
  );
};

export default GameTypeSelector;
