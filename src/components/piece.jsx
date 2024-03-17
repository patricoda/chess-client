import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessKing,
  faChessQueen,
  faChessBishop,
  faChessRook,
  faChessKnight,
  faChessPawn,
} from "@fortawesome/free-solid-svg-icons";

export const Pawn = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessPawn} inverse />
  ) : (
    <FontAwesomeIcon icon={faChessPawn} />
  );

export const Rook = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessRook} inverse />
  ) : (
    <FontAwesomeIcon icon={faChessRook} />
  );

export const Knight = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessKnight} inverse />
  ) : (
    <FontAwesomeIcon icon={faChessKnight} />
  );

export const Bishop = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessBishop} inverse />
  ) : (
    <FontAwesomeIcon icon={faChessBishop} />
  );

export const King = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessKing} inverse />
  ) : (
    <FontAwesomeIcon icon={faChessKing} />
  );

export const Queen = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessQueen} inverse />
  ) : (
    <FontAwesomeIcon icon={faChessQueen} />
  );
