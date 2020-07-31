export interface Position {
  x: number;
  y: number;
}

export interface Square {
  x: number;
  y: number;
  isSnake?: boolean;
  isObstacle?: boolean;
  isApple?: boolean;
}

export enum Direction {
  UP,
  LEFT,
  DOWN,
  RIGHT
}

export interface Snake {
  direction: Direction;
  squares: Position[];
}

export interface State {
  //direction that the snake is pointed
  direction: Direction;
  snakeSquares: Position[];
  appleSquares: Position[];
  obstacleSquares: Position[];
  //speed is the number of ms between each move
  //should get faster as the game elapses
  speed: number;
  //number of apples eaten
  score: number;
  isDead: boolean;
  isFull: boolean;
  //handle pause
  isPlaying: boolean;
  needsGrow: number;
}
