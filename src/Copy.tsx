import React, { useState, useEffect, useCallback } from "react";
import "./styles.css";

const COLUMNS = 10;
const ROWS = 10;
const SQUARE_SIZE = 40;
const INITIAL_SPEED = 500;
const SPEED_UP_EVERY = 2500;
const GROW_EVERY = 2500;

interface Position {
  x: number;
  y: number;
}

interface Square {
  x: number;
  y: number;
  isSnake?: boolean;
  isObstacle?: boolean;
}

enum Direction {
  UP,
  LEFT,
  DOWN,
  RIGHT
}

interface Snake {
  direction: Direction;
  squares: Square[];
}

interface SnakeState {
  snake: Snake;
  grid?: Square[][];
}

export default function App() {
  //direction that the snake is pointed
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  //speed is the number of ms between each move
  //should get faster as the game elapses
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);

  //score is the number of apples picked up
  const [score, setScore] = useState<number>(0);

  /**
   * start out with the snake in the center facing up
   */
  const [snakeSquares, setSnakeSquares] = useState<Position[]>(() => {
    const x = Math.floor(COLUMNS) / 2;
    const y = Math.floor(ROWS) / 2;
    return [{ x, y }, { x, y: y + 1 }];
  });

  //game over state
  const [isDead, setIsDead] = useState(false);

  const getKeyDirection = (e: KeyboardEvent): Direction | null => {
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 37: //left
        return Direction.LEFT;
      case 38: //up
        return Direction.UP;
      case 39: //right
        return Direction.RIGHT;
      case 40: //down
        return Direction.DOWN;
      default:
        return null;
    }
  };

  const randomSquare = (): Position => {
    return {
      x: Math.floor(COLUMNS * Math.random()),
      y: Math.floor(COLUMNS * Math.random())
    };
  };

  const nextSquare = (dir: Direction, head: Position): Position => {
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

  const isSnakePosition = useCallback(
    (next: Position): boolean => {
      return (
        snakeSquares.findIndex(pos => pos.x === next.x && pos.y === next.y) !==
        -1
      );
    },
    [snakeSquares]
  );

  const snakeMove = useCallback(
    (grow: boolean = false): void => {
      const head = snakeSquares[0];
      const next = nextSquare(direction, head);

      if (grow) {
        //add to front but don't drop off end
        setSnakeSquares([next, ...snakeSquares]);
      } else {
        //add to front and remove last
        setSnakeSquares([
          next,
          ...snakeSquares.slice(0, snakeSquares.length - 1)
        ]);
      }

      //game ends when snake hits itself or the wall
      const isDeath =
        isSnakePosition(next) ||
        next.x >= COLUMNS ||
        next.x < 0 ||
        next.y >= ROWS ||
        next.y < 0;

      if (isDeath) {
        setIsDead(true);
      }

      //console.log({ head, next, isDeath });
    },
    [snakeSquares, isSnakePosition, direction]
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log(e);
      const dir = getKeyDirection(e);
      //do nothing if other key pressed
      if (dir !== null) {
        setDirection(dir);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    //console.log("keydown added");
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  //requestAnimationFrame?
  useEffect(() => {
    const handler = () => {
      //when to grow??
      //want to grow every x moves, but don't want to double move if defining the x with a separate timeout
      //so use a random chance as a quick hack
      const random = Math.random();
      const grow = random < INITIAL_SPEED / GROW_EVERY;
      snakeMove(grow);
    };
    const timeout = setTimeout(handler, speed);
    return () => {
      clearTimeout(timeout);
    };
  }, [speed, snakeMove]);

  //effect to increase the speed
  useEffect(() => {
    const handler = () => {
      setSpeed(speed => speed * 1.1);
    };
    const timeout = setTimeout(handler, SPEED_UP_EVERY);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="App">
      {isDead && <div>YOU DIED</div>}
      {[...new Array(ROWS)].map((_, y) => (
        <div
          key={y}
          style={{
            display: "flex"
          }}
        >
          {[...new Array(COLUMNS)].map((_, x) => (
            <Square key={x} isSnake={isSnakePosition({ x, y })} />
          ))}
        </div>
      ))}
    </div>
  );
}

export const Square = ({ isSnake }: { isSnake: boolean }) => {
  return (
    <div
      style={{
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        backgroundColor: isSnake ? "black" : "lightgray"
      }}
    />
  );
};
