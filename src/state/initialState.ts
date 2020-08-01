import {Direction, State} from "../types";
import {HEIGHT, INITIAL_LENGTH, INITIAL_SPEED, WIDTH} from "../constants";
import {randomAvailable} from "./selectors";

export const getInitialState = (): State => {
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
        topScore: 0,
        isDead: false,
        isFull: false,
        isPlaying: true, //maybe start false and have a start button?
        needsGrow: 0
    };

    /**
     * want to include one apple, but need to put snake into the state first in order to use reducer
     */
    const applePos = randomAvailable(state);

    return {
        ...state,
        appleSquares: [applePos]
    };
};
