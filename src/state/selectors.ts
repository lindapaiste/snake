import {Position, State} from "../types";
import {allSquares, isOutOfBounds, nextSquare} from "../util";

/**
 * get an array of all of the empty squares,
 * which is used to place the next obstacle or apple
 */
const emptySquares = (state: State): Position[] => {
    return allSquares().filter(
        pos =>
            !isAppleSquare(state, pos) &&
            !isObstacleSquare(state, pos) &&
            !isSnakeSquare(state, pos)
    );
};

/**
 * pick an empty square to place the next apple or obstacle
 * optionally pass a next argument to avoid the square that is being moved into
 */
export const randomAvailable = (state: State, next?: Position): Position => {
    let empty = emptySquares(state)
    if (next) empty = empty.filter(sq => !isMatch(next)(sq));
    return empty[Math.floor(Math.random() * empty.length)];
};

/**
 * helper which compares two position objects for equality based on the values of x and y
 */
export const isMatch = (pos: Position) => (comp: Position): boolean => {
    return comp.x === pos.x && comp.y === pos.y;
};

/**
 * see if a position is present in the arrays for apples, obstacles, and snake
 */

export const isAppleSquare = (state: State, pos: Position): boolean => {
    return state.appleSquares.some(isMatch(pos));
};

export const isObstacleSquare = (state: State, pos: Position): boolean => {
    return state.obstacleSquares.some(isMatch(pos));
};

export const isSnakeSquare = (state: State, pos: Position): boolean => {
    return state.snakeSquares.some(isMatch(pos));
};

/**
 * game ends when snake hits itself, an obstacle, or the wall
 * checks whether the provided next position is deadly
 */
export const isDeadly = (state: State, pos: Position): boolean => {
    return (
        isOutOfBounds(pos) ||
        isSnakeSquare(state, pos) ||
        isObstacleSquare(state, pos)
    );
};

/**
 * find the next square that gets added to the snake
 * based on the current direction and the position of the head
 * aka the first element in the snake array
 */
export const getNextSquare = (state: State): Position => {
    return nextSquare(state.direction, state.snakeSquares[0]);
};

/**
 * check whether the game is paused rather than over
 */
export const isPaused = (state: State): boolean =>
    !state.isPlaying && !state.isDead;

/**
 * only provided for consistency with isPaused, since isDead can be accessed directly
 */
export const isDead = (state: State): boolean => state.isDead;
