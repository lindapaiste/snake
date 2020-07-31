import { Direction } from "./types";

export const DO_MOVE = "DO_MOVE";

export const DO_GROW = "DO_GROW";

export const SWITCH_DIRECTION = "SWITCH_DIRECTION";

export const SPEED_UP = "SPEED_UP";

export const RESTART = "RESTART";

export const PAUSE = "PAUSE";

/**
 * create a link beteen payload types and the the specific action type
 */

interface ActionSwitchDir {
  type: typeof SWITCH_DIRECTION;
  payload: Direction;
}

interface ActionSpeedUp {
  type: typeof SPEED_UP;
  payload: number;
}

interface ActionGrow {
  type: typeof DO_GROW;
  payload?: number;
}

/**
 * actions with no payload don't need to be defined separately
 */

interface TypeOnlyAction {
  type: typeof DO_MOVE | typeof RESTART | typeof PAUSE;
}

export type ActionTypes =
  | TypeOnlyAction
  | ActionSwitchDir
  | ActionGrow
  | ActionSpeedUp;

export const arrowPress = (dir: Direction): ActionTypes => ({
  type: SWITCH_DIRECTION,
  payload: dir
});

export const moveSnake = (): ActionTypes => ({
  type: DO_MOVE
});

export const speedUp = (ratio: number): ActionTypes => ({
  type: SPEED_UP,
  payload: ratio
});

export const restart = (): ActionTypes => ({
  type: RESTART
});

export const pause = (): ActionTypes => ({
  type: PAUSE
});
