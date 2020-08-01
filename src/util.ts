import {Direction, Position} from "./types";
import {HEIGHT, WIDTH} from "./constants";

/**
 * helper functions which do not depend on state,
 * aside from passed in props
 */

export const getKeyDirection = (e: KeyboardEvent): Direction | null => {
    switch (e.key) {
        case "ArrowLeft":
            return Direction.LEFT;
        case "ArrowUp":
            return Direction.UP;
        case "ArrowRight":
            return Direction.RIGHT;
        case "ArrowDown":
            return Direction.DOWN;
        default:
            return null;
    }
};

export const nextSquare = (dir: Direction, head: Position): Position => {
    const {x, y} = head;
    switch (dir) {
        case Direction.DOWN:
            return {x, y: y + 1};
        case Direction.UP:
            return {x, y: y - 1};
        case Direction.LEFT:
            return {x: x - 1, y};
        case Direction.RIGHT:
            return {x: x + 1, y};
    }
};

export const allSquares = (): Position[] => {
    const squares: Position[] = [];
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            squares.push({x, y});
        }
    }
    return squares;
};

export const isOutOfBounds = (pos: Position): boolean => {
    return pos.x >= WIDTH || pos.x < 0 || pos.y >= HEIGHT || pos.y < 0;
};
