import { State, Position, Direction } from "./types";
import {
  WIDTH,
  HEIGHT,
  INITIAL_SPEED,
  INITIAL_LENGTH,
  GROW_PER_APPLE
} from "./constants";
import {
  getNextSquare,
  isDeath,
  appleIndex,
  randomAvailable
} from "./selectors";
import {
  ActionTypes,
  DO_MOVE,
  DO_GROW,
  SWITCH_DIRECTION,
  SPEED_UP,
  RESTART,
  PAUSE
} from "./actions";

export const getInitialState = (): State => {
  /**
   * want to include one apple, but need to put snake into the state first in order to use reducer
   */

  /**
   * start at the beginning of the board
   * initial direction is up, so additional squares go below
   */
  const x = Math.floor(WIDTH / 2);
  const y = Math.floor(HEIGHT / 2);
  const initialSnake = [...new Array(INITIAL_LENGTH)].map((_, i) => ({
    x,
    y: y + i
  }));

  const state = {
    direction: Direction.UP,
    snakeSquares: initialSnake,
    appleSquares: [],
    obstacleSquares: [],
    speed: INITIAL_SPEED,
    score: 0,
    isDead: false,
    isFull: false,
    isPlaying: true, //maybe start false and have a start button?
    needsGrow: 0
  };

  //have to pass in a second arg
  const applePos = randomAvailable(state, { x: -1, y: -1 });

  return {
    ...state,
    appleSquares: [applePos]
  };
};

export const reducer = (state: State, action: ActionTypes): State => {
  console.log(action);
  switch (action.type) {
    case DO_MOVE:
      const next = getNextSquare(state);
      return handleSnakeShift(
        handleDeath(handleAppleEat(state, next), next),
        next
      );
    case SPEED_UP:
      return {
        ...state,
        speed: state.speed * action.payload
      };

    case SWITCH_DIRECTION:
      return {
        ...state,
        direction: action.payload
      };
    case DO_GROW:
      return state;
    case RESTART:
      return getInitialState();
    case PAUSE:
      //toggles pause
      return {
        ...state,
        isPlaying: !state.isPlaying
      };
    default:
      return state;
  }
};

const handleDeath = (state: State, next: Position): State => {
  if (isDeath(state, next)) {
    return {
      ...state,
      isDead: true,
      isPlaying: false
    };
  } else return state;
};

const handleAppleEat = (state: State, next: Position): State => {
  const index = appleIndex(state, next);
  if (index !== -1) {
    //need to increment score and place another apple
    const nextApple = randomAvailable(state, next);
    return {
      ...state,
      score: state.score + 1,
      appleSquares: [
        ...state.appleSquares.slice(0, index),
        ...state.appleSquares.slice(index + 1),
        nextApple
      ],
      needsGrow: GROW_PER_APPLE
    };
  } else return state;
};

const handleSnakeShift = (state: State, next: Position): State => {
  //when awaiting grow, don't remove from tail but do decrement needsGrow
  if (state.needsGrow > 0) {
    return {
      ...state,
      snakeSquares: [next, ...state.snakeSquares],
      needsGrow: state.needsGrow - 1
    };
  }
  //otherwise add to head and take one off the tail end
  else {
    return {
      ...state,
      snakeSquares: [next, ...state.snakeSquares.slice(0, -1)]
    };
  }
};
