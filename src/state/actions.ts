import {Direction} from "../types";
import {Dispatch} from "react";

export const DO_MOVE = "DO_MOVE";

export const DO_GROW = "DO_GROW";

export const SWITCH_DIRECTION = "SWITCH_DIRECTION";

export const SPEED_UP = "SPEED_UP";

export const RESTART = "RESTART";

export const PAUSE = "PAUSE";

export const PLACE_OBSTACLE = "PLACE_OBSTACLE";

export const EXPIRE_OBSTACLE = "EXPIRE_OBSTACLE";

/**
 * create a link between payload types and the the specific action type
 */

interface ActionSwitchDir {
    type: typeof SWITCH_DIRECTION;
    payload: Direction;
}

interface ActionSpeedUp {
    type: typeof SPEED_UP;
    payload?: number;
}

interface ActionGrow {
    type: typeof DO_GROW;
    payload?: number;
}

/**
 * actions with no payload don't need to be defined separately
 */

interface TypeOnlyAction {
    type:
        | typeof DO_MOVE
        | typeof RESTART
        | typeof PAUSE
        | typeof PLACE_OBSTACLE
        | typeof EXPIRE_OBSTACLE;
}

export type ActionTypes =
    | TypeOnlyAction
    | ActionSwitchDir
    | ActionGrow
    | ActionSpeedUp;

/**
 * rather than importing action creators and having to wrap each one in dispatch,
 * pass in dispatch to the hook and return a function which already includes dispatch
 *
 * don't think I need useCallback since they should recreate when dispatch changes
 */
export const useActions = (dispatch: Dispatch<ActionTypes>) => {
    return {
        togglePause: () =>
            dispatch({
                type: PAUSE
            }),
        start: () =>
            dispatch({
                type: RESTART
            }),
        arrowPress: (dir: Direction) =>
            dispatch({
                type: SWITCH_DIRECTION,
                payload: dir
            }),
        moveSnake: () =>
            dispatch({
                type: DO_MOVE
            }),
        speedUp: (ratio?: number) =>
            dispatch({
                type: SPEED_UP,
                payload: ratio
            }),
        placeObstacle: () =>
            dispatch({
                type: PLACE_OBSTACLE
            }),
        expireObstacle: () =>
            dispatch({
                type: EXPIRE_OBSTACLE
            })
    };
};
