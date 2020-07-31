import { Direction, Position } from "./types";
import { WIDTH, HEIGHT } from "./constants";

export const getKeyDirection = (e: KeyboardEvent): Direction | null => {
  console.log(e.key);
  switch (e.key) {
    case "ArrowLeft": //left
      return Direction.LEFT;
    case "ArrowUp": //up
      return Direction.UP;
    case "ArrowRight": //right
      return Direction.RIGHT;
    case "ArrowDown": //down
      return Direction.DOWN;
    default:
      return null;
  }
};

export const nextSquare = (dir: Direction, head: Position): Position => {
  const { x, y } = head;
  switch (dir) {
    case Direction.DOWN:
      return { x, y: y + 1 };
    case Direction.UP:
      return { x, y: y - 1 };
    case Direction.LEFT:
      return { x: x - 1, y };
    case Direction.RIGHT:
      return { x: x + 1, y };
  }
};

export const allSquares = (): Position[] => {
  const squares: Position[] = [];
  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      squares.push({ x, y });
    }
  }
  return squares;
};
