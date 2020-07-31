import { WIDTH, HEIGHT, SQUARE_SIZE } from "./constants";
import { State, Position } from "./types";
import React from "react";

export interface Props {
  state: State;
  onPressRestart(): void;
}
/**
 * can loop through and render every square
 * but can also just render a background and
 * use absolute positioning to place elements on top of it
 */
export const Board = ({ state, onPressRestart }: Props) => {
  return (
    <div>
      {state.isDead && <div>YOU DIED</div>}
      {state.isDead && <button onClick={onPressRestart}>New Game</button>}
      <div>Score: {state.score}</div>
      <div
        style={{
          position: "relative",
          backgroundColor: "black",
          width: WIDTH * SQUARE_SIZE,
          height: HEIGHT * SQUARE_SIZE
        }}
      >
        {state.appleSquares.map(pos => AppleSquare({ pos }))}
        {state.obstacleSquares.map(pos => (
          <Square key={getKey("obstacle", pos)} color={"yellow"} {...pos} />
        ))}
        {state.snakeSquares.map(pos => (
          <Square key={getKey("snake", pos)} color={"white"} {...pos} />
        ))}
      </div>
    </div>
  );
};

const AppleSquare = ({ pos }: { pos: Position }) => (
  <Square {...pos} key={getKey("apple", pos)} color="red" />
);

const getKey = (prefix: string, pos: Position): string => {
  return `${prefix}_${pos.x}_${pos.y}`;
};

export const Square = ({ x, y, color }: Position & { color: string }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: y * SQUARE_SIZE,
        left: x * SQUARE_SIZE,
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        backgroundColor: color
      }}
    />
  );
};

export default Board;
