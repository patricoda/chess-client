import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessKing,
  faChessQueen,
  faChessBishop,
  faChessRook,
  faChessKnight,
  faChessPawn
} from "@fortawesome/free-solid-svg-icons";

export const Pawn = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessPawn} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessPawn} size="3x" />
  );

export const Rook = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessRook} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessRook} size="3x" />
  );

export const Knight = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessKnight} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessKnight} size="3x" />
  );

export const Bishop = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessBishop} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessBishop} size="3x" />
  );

export const King = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessKing} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessKing} size="3x" />
  );

export const Queen = ({ allegiance }) =>
  allegiance === "WHITE" ? (
    <FontAwesomeIcon icon={faChessQueen} inverse size="3x" />
  ) : (
    <FontAwesomeIcon icon={faChessQueen} size="3x" />
  );
