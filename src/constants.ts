/**
 * number of columns on the board
 */
export const WIDTH = 25;
/**
 * number of rows on the board
 */
export const HEIGHT = 25;
/**
 * squares on the snake at the start of the game
 */
export const INITIAL_LENGTH = 3;
/**
 * snake grows by this many squares for every apple that it eats
 */
export const GROW_PER_APPLE = 3;
/**
 * number of milliseconds between each move
 */
export const INITIAL_SPEED = 300;
/**
 * JS cannot execute multiple setTimeout/setInterval when they are called at the same time
 * so rather than defining a number of milliseconds here,
 * define the number of moves n such that the snake speeds up after n moves
 */
export const SPEED_UP_EVERY = 10;
/**
 * time between moves gets multiplied by this number
 */
export const SPEED_UP_RATIO = 0.95;
/**
 * a new obstacle appears after this many moves
 */
export const OBSTACLE_EVERY = 5;
/**
 * if equal to obstacle_every then there will be one obstacle on the board at a time
 * if greater, then the number of obstacles will increase over time
 * if less, there will sometimes be no obstacle
 */
export const OBSTACLE_EXPIRE = 6;
/**
 * stops propagation of obstacles beyond a certain amount
 */
export const MAX_OBSTACLES = 5;

/**
 * rather than passing a fixed square size, size everything based on the height of the screen
 */
const availableVh = 76; //based on cs vh from header and borders

export const SQUARE_SIZE = (window.innerHeight * availableVh) / 100 / HEIGHT;
