import { useCallback, useContext, useEffect } from "react";
import { SocketContext } from "../../context/socket";
import { useImmerReducer } from "use-immer";

export const useChessServerGameState = () => {
  const {
    connectedUser,
    setEventListener,
    removeEventListener,
    handlePostEvent,
  } = useContext(SocketContext);

  const [gameState, dispatch] = useImmerReducer(
    (gameState, action) => {
      switch (action.type) {
        case "GAME_INITIALISED":
          const newGameDetails = action.gameDetails;
          const newGameState = newGameDetails.gameState;

          //map user details e.g. name and online status, onto players array
          const players = newGameState.players.map((player) => ({
            ...player,
            ...newGameDetails.userDetails.find(
              ({ id }) => id === player.userId
            ),
          }));

          //discover the player instance associated to the client
          const clientPlayer = players.find(
            ({ userId }) => userId === connectedUser.userId
          );

          return {
            ...newGameState,
            boardState: JSON.parse(newGameState.boardState),
            players,
            clientPlayer,
            isAwaitingGame: false,
          };

        case "GAME_STATE_UPDATED":
          return {
            ...action.gameState,
            boardState: JSON.parse(action.gameState.boardState),
            //ensure we retain any non-changing values from initial game status
            isAwaitingGame: false,
            players: gameState.players,
            clientPlayer: gameState.clientPlayer,
          };
        case "USER_CONNECTED":
          const connectingUser = gameState.players.find(
            ({ userId }) => userId === action.userId
          );

          if (connectingUser) {
            connectingUser.isConnected = true;
          }
          break;
        case "USER_DISCONNECTED":
          const disconnectingUser = gameState.players.find(
            ({ userId }) => userId === action.userId
          );

          if (disconnectingUser) {
            disconnectingUser.isConnected = false;
          }
          break;
        default:
          break;
      }
    },
    { isAwaitingGame: true }
  );

  const handlePostMove = useCallback(
    (from, to) =>
      handlePostEvent("POST_MOVE", {
        move: { from, to },
      }),
    [handlePostEvent]
  );

  const handlePostPromotionSelection = useCallback(
    (e) =>
      handlePostEvent("POST_PROMOTION_OPTION", {
        newType: e.currentTarget.dataset.value,
      }),
    [handlePostEvent]
  );

  useEffect(() => {
    setEventListener("GAME_INITIALISED", ({ userDetails, gameState }) => {
      dispatch({
        type: "GAME_INITIALISED",
        gameDetails: { userDetails, gameState },
      });
    });

    setEventListener("GAME_STATE_UPDATED", (gameState) =>
      dispatch({ type: "GAME_STATE_UPDATED", gameState })
    );

    setEventListener("USER_CONNECTED", (userId) => {
      dispatch({ type: "USER_CONNECTED", userId });
    });

    setEventListener("USER_DISCONNECTED", (userId) => {
      dispatch({ type: "USER_DISCONNECTED", userId });
    });

    return () => {
      //clean up events connected to socket instance as they persist outside of this hook
      removeEventListener("GAME_INITIALISED");
      removeEventListener("GAME_STATE_UPDATED");
      removeEventListener("USER_CONNECTED");
      removeEventListener("USER_DISCONNECTED");
    };
  }, [setEventListener, removeEventListener, handlePostEvent, dispatch]);

  useEffect(() => {
    if (connectedUser.userId) {
      handlePostEvent("AWAITING_GAME");
    }
  }, [handlePostEvent, connectedUser]);

  return {
    gameState,
    handleMovePiece: handlePostMove,
    handlePromotePiece: handlePostPromotionSelection,
  };
};

export default useChessServerGameState;
