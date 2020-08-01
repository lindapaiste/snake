import React, {
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useState
} from "react";
import "./styles.css";
import {
  SPEED_UP_EVERY,
  OBSTACLE_EVERY,
  OBSTACLE_EXPIRE,
} from "./constants";
import Board from "./Render";
import { reducer } from "./state/reducer";
import { getKeyDirection } from "./util";
import { useActions } from "./state/actions";
import {getInitialState} from "./state/initialState";

//requestAnimationFrame?

/**
 * function handles all of the effects and pases off the state to thge render component
 */

/**
 * hook which clears a timeout on unmount
 */

/**
 * this version assumes that callback is created with useCallback/useMemo,
 * and therefore refreshes itself on dependency change
 */
export const _useInterval = (callback: () => void, timeout: number): void => {
  //when changing callback, need to clear the previous interval
  //use useRef to have a persistent reference
  //typescript got confused about the return value when not prefixing with window.
  const intervalId = useRef(-1);

  useEffect(() => {
    //clear the previous
    window.clearInterval(intervalId.current);

    //set interval to new value
    intervalId.current = window.setInterval(callback, timeout);

    //return clearInterval cleanup
    return () => window.clearInterval(intervalId.current);
  }, [callback, timeout]);
};

/**
 * version which handles useCallback internally
 */
export const useInterval = (callback: () => void, deps: any[], timeout: number): void => {
  const memo = useCallback(callback, deps);
  _useInterval(memo, timeout);
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  const actions = useActions(dispatch);

  const [ticks, setTicks] = useState(0);

  /**
   * add keyPress event listener to the window to respond to arrow keys
   *
   * pause on press "P" key or space bar
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "p" || e.code === "Space") {
        actions.togglePause();
        return;
      }
      const dir = getKeyDirection(e);
      //do nothing if other key pressed
      if (dir !== null) {
        //potentially ignore opposite direction??
        actions.arrowPress(dir);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [actions]);

  /**
   * move effect -- move every x seconds until death
   * having multiple intervals does not seem to work, so need to tie everything to one
   * save the number of moves as "ticks" and use this to trigger actions on every n ticks
   */
  useInterval(
    () => {
      if (state.isPlaying) {
        actions.moveSnake();
        setTicks(t => t + 1);
        if (ticks % SPEED_UP_EVERY === 0) {
          actions.speedUp();
        }
        if (ticks % OBSTACLE_EVERY === 0) {
          actions.placeObstacle();
        }
        if (ticks % OBSTACLE_EXPIRE === 0) {
          actions.expireObstacle();
        }
      }
    },
    [actions, state.isPlaying],
    state.speed
  );

  /**
   * should the snake grow over time?  or just when eating an apple?
   */

  /**
   * effect to expire apples?
   */

  return <Board state={state} {...actions} />;
}
