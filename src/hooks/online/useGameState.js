import { useCallback, useContext, useEffect, useReducer } from "react";
import { SocketContext } from "../../context/socket";

export const useGameState = () => {
  const {
    connectedUser,
    setEventListener,
    removeEventListener,
    handlePostEvent,
  } = useContext(SocketContext);

  const [gameState, dispatch] = useReducer(
    (gameState, action) => {
      switch (action.type) {
        case "IS_AWAITING_GAME": {
          return { isAwaitingGame: true };
        }
        case "GAME_INITIALISED":
          const newGameDetails = action.gameDetails;
          const newGameState = newGameDetails.gameState;

          //discover the player instance associated to the client
          const clientPlayer = newGameState.players.find(
            ({ userId }) => userId === connectedUser.userId
          );

          return {
            ...newGameState,
            boardState: JSON.parse(newGameState.boardState),
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

  const handleForfeit = useCallback(
    () => handlePostEvent("FORFEIT"),
    [handlePostEvent]
  );

  const handleLeaveGame = useCallback(
    () => handlePostEvent("LEAVE_GAME"),
    [handlePostEvent]
  );

  const handleFindNewGame = useCallback(() => {
    dispatch({ type: "IS_AWAITING_GAME" });
    handlePostEvent("FIND_GAME");
  }, [dispatch, handlePostEvent]);

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
      handlePostEvent("FIND_GAME");
    }
  }, [handlePostEvent, connectedUser]);

  return {
    gameState,
    handleMovePiece: handlePostMove,
    handlePromotePiece: handlePostPromotionSelection,
    handleForfeit,
    handleLeaveGame,
    handleFindNewGame,
  };
};

export default useGameState;
