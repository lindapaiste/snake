import React, { useReducer, useEffect, useRef, useCallback } from "react";
import "./styles.css";
import { SPEED_UP_EVERY } from "./constants";
import Board from "./Render";
import { getInitialState, reducer } from "./reducer";
import { getKeyDirection } from "./util";
import { arrowPress, moveSnake, speedUp, restart, pause } from "./actions";

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
  //use useRef to have a persistant reference
  //initialize to a number so that clearInterval doesn't have to be conditional
  const intervalId = useRef<number>(-1);

  useEffect(() => {
    //clear the previous
    clearInterval(intervalId.current);

    //set interval to new value
    intervalId.current = setInterval(callback, timeout);

    //return clearInterval cleanup
    return () => clearInterval(intervalId.current);
  }, [callback, timeout]);
};

/**
 * version which handles useCallback internally
 */
export const useInterval = (
  callback: () => void,
  deps: any[],
  timeout: number
): void => {
  const memo = useCallback(callback, deps);
  _useInterval(memo, timeout);
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  /**
   * add keyPress event listener to the window to respond to arrow keys
   *
   * pause on press "P" key or spacebar
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "Space") {
        console.log("pause");
        dispatch(pause());
        return;
      }
      const dir = getKeyDirection(e);
      //do nothing if other key pressed
      console.log(e);
      if (dir !== null) {
        //potentially ignore opposite direction??
        dispatch(arrowPress(dir));
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [dispatch]);

  /**
   * move effect -- move every x seconds until death
   */
  useInterval(
    () => {
      if (state.isPlaying) {
        dispatch(moveSnake());
      }
    },
    [dispatch, state.isPlaying],
    state.speed
  );

  /**
   * speed up effect
   * increases speed by 10% (multiplicitively) on the given interval
   * could keep going after death and it wouldn't matter
   */
  useInterval(
    () => {
      if (state.isPlaying) {
        dispatch(speedUp(0.9));
      }
    },
    [dispatch, state.isPlaying],
    SPEED_UP_EVERY
  );

  /**
   * should the snake grow over time?  or just when eating an apple?
   */

  /**
   * effect to expire apples?
   */

  const onPressRestart = useCallback(() => dispatch(restart()), [dispatch]);

  return <Board state={state} onPressRestart={onPressRestart} />;
}
