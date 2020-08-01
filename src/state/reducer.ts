import {Position, State} from "../types";
import {GROW_PER_APPLE, MAX_OBSTACLES, SPEED_UP_RATIO} from "../constants";
import {getNextSquare, isAppleSquare, isDeadly, isMatch, randomAvailable} from "./selectors";
import {
    ActionTypes,
    DO_MOVE,
    EXPIRE_OBSTACLE,
    PAUSE,
    PLACE_OBSTACLE,
    RESTART,
    SPEED_UP,
    SWITCH_DIRECTION
} from "./actions";
import {getInitialState} from "./initialState";

export const reducer = (state: State, action: ActionTypes): State => {
    console.log(action);
    switch (action.type) {
        case DO_MOVE:
            const next = getNextSquare(state);
            if (isDeadly(state, next)) {
                //don't want to move the snake head forward beyond the walls, so return before doing shift
                return handleDeath(state);
            } else if (isAppleSquare(state, next)) {
                //appleEat needs to be the inner because appleEat increases the needsGrow which snakeShift looks at
                return handleSnakeShift(handleAppleEat(state, next), next);
            } else {
                //standard snake move into empty space
                return handleSnakeShift(state, next);
            }
        case SPEED_UP:
            return {
                ...state,
                speed: state.speed * (action.payload || SPEED_UP_RATIO)
            };
        case SWITCH_DIRECTION:
            return {
                ...state,
                direction: action.payload
            };
        case RESTART:
            return {
                ...getInitialState(),
                topScore: Math.max(state.score, state.topScore)
            };
        case PAUSE:
            //toggles pause value
            //use pause keys to trigger play again from game over
            if (state.isDead) {
                return reducer(state, {type: RESTART});
            }
            return {
                ...state,
                isPlaying: !state.isPlaying
            };
        case PLACE_OBSTACLE:
            //add new obstacle at the end of the array
            if (state.obstacleSquares.length >= MAX_OBSTACLES) {
                return state;
            }
            return {
                ...state,
                obstacleSquares: [...state.obstacleSquares, randomAvailable(state)]
            };
        case EXPIRE_OBSTACLE:
            //remove the first position in the array, the oldest one
            //maybe don't allow empty?
            return {
                ...state,
                obstacleSquares: state.obstacleSquares.slice(1)
            };
        default:
            return state;
    }
};

const handleDeath = (state: State): State => {
    return {
        ...state,
        isDead: true,
        isPlaying: false
    };
};

const handleAppleEat = (state: State, next: Position): State => {
    //need to increment score, remove eaten apple, and place another apple
    const nextApple = randomAvailable(state, next);
    return {
        ...state,
        score: state.score + 1,
        appleSquares: [
            ...state.appleSquares.filter(pos => !isMatch(next)(pos)),
            nextApple
        ],
        needsGrow: GROW_PER_APPLE
    };
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
