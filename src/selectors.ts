import { State, Position, Square, Direction } from "./types";
import { WIDTH, HEIGHT } from "./constants";
import { nextSquare, allSquares } from "./util";

export const emptySquares = (state: State): Position[] => {
  return allSquares().filter(
    pos =>
      !isAppleSquare(state, pos) &&
      !isObstacleSquare(state, pos) &&
      !isSnakeSquare(state, pos)
  );
};

const isMatch = (pos: Position) => (comp: Position): boolean => {
  return comp.x === pos.x && comp.y === pos.y;
};

const containsSquare = (array: Position[], pos: Position): boolean => {
  return array.some(isMatch(pos));
};

export const isAppleSquare = (state: State, pos: Position): boolean => {
  return containsSquare(state.appleSquares, pos);
};

//return the index of the matched apple so that it can be replaced
//what about apple expiration?
export const appleIndex = (state: State, pos: Position): number => {
  return state.appleSquares.findIndex(isMatch(pos));
};

export const isObstacleSquare = (state: State, pos: Position): boolean => {
  return containsSquare(state.obstacleSquares, pos);
};

export const isSnakeSquare = (state: State, pos: Position): boolean => {
  return containsSquare(state.snakeSquares, pos);
};

export const isDeath = (state: State, pos: Position): boolean => {
  //game ends when snake hits itself or the wall
  //minor point -- should it really be a death if it is the last position of the snake??
  return (
    isSnakeSquare(state, pos) ||
    isObstacleSquare(state, pos) ||
    pos.x >= WIDTH ||
    pos.x < 0 ||
    pos.y >= HEIGHT ||
    pos.y < 0
  );
};

export const getNextSquare = (state: State): Position => {
  //look at the head aka the first position of the snake
  return nextSquare(state.direction, state.snakeSquares[0]);
};

export const randomAvailable = (state: State, next: Position): Position => {
  //make sure the next square isn't the one we are moving into
  const empty = emptySquares(state).filter(sq => !isMatch(next)(sq));
  return empty[Math.floor(Math.random() * empty.length)];
};

export const squareProps = (state: State, pos: Position): Square => {
  return {
    ...pos,
    isApple: isAppleSquare(state, pos),
    isObstacle: isObstacleSquare(state, pos),
    isSnake: isSnakeSquare(state, pos)
  };
};
