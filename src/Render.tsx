import {HEIGHT, SQUARE_SIZE, WIDTH} from "./constants";
import {Position, SquareType, State} from "./types";
import React, {useState} from "react";
import {isDead, isPaused} from "./state/selectors";

export interface Props {
    state: State;

    togglePause(): void;

    start(): void;
}

/**
 * can loop through and render every square
 * but can also just render a background and
 * use absolute positioning to place elements on top of it
 */
export const Game = ({state, ...props}: Props) => {
    return (
        <div className="container">
            <div className="header center-contents">
                <h1>Snek Game</h1>
                <Instructions/>
            </div>
            <div className="board-wrapper">
                <div className="scores">
                    <div>Best Score: {state.topScore}</div>
                    <div>Current Score: {state.score}</div>
                </div>
                <div
                    className="board"
                    style={{
                        width: WIDTH * SQUARE_SIZE,
                        height: HEIGHT * SQUARE_SIZE
                    }}
                >
                    {state.appleSquares.map(pos => (
                        <Square pos={pos} type="apple"/>
                    ))}
                    {state.obstacleSquares.map(pos => (
                        <Square pos={pos} type="obstacle"/>
                    ))}
                    {state.snakeSquares.map(pos => (
                        <Square pos={pos} type="snake"/>
                    ))}

                    <Banner state={state} {...props} />
                </div>
            </div>
        </div>
    );
};

/**
 * show overlay banner on game over or game paused
 */
const Banner = ({state, togglePause, start}: Props) => {
    if (!(isDead(state) || isPaused(state))) {
        return null;
    }
    return (
        <div className="banner-wrapper center-contents">
            <div className="banner">
                {isDead(state) && (
                    <div className="center-contents">
                        <h2>Game Over</h2>
                        <div>Score: {state.score}</div>
                        {state.score > state.topScore ? (
                            <div>New Best!</div>
                        ) : (
                            <div>Your Best: {state.topScore}</div>
                        )}
                        <button onClick={() => start()}>Play Again</button>
                    </div>
                )}
                {isPaused(state) && (
                    <div className="center-contents">
                        <h2>Paused</h2>
                        <div>
                            Press <Key>P</Key> or <Key>spacebar</Key> or click button to
                            resume
                        </div>
                        <button onClick={() => togglePause()}>Resume</button>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * instructions appear when "show instructions" button is hovered
 */
const Instructions = () => {
    const [isHover, setIsHover] = useState(false);

    return (
        <>
            <button
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                Show Instructions
            </button>
            {isHover && (
                <ul className="instructions">
                    <li>
                        use <Key>arrow keys</Key> to move
                    </li>
                    <li>
                        press <Key>P</Key> or <Key>spacebar</Key> to pause
                    </li>
                    <li>
                        collect apples <div className="apple iSquare"/>
                    </li>
                    <li>
                        avoid obstacles <div className="obstacle iSquare"/> and walls
                    </li>
                </ul>
            )}
        </>
    );
};

/** apply special inline stying to key names */
const Key = ({children}: { children: string }) => (
    <span className="keyName">{children}</span>
);

interface SquareProps {
    pos: Position;
    type: SquareType;
}

const Square = ({type, pos}: SquareProps) => (
    <div
        key={`${type}_${pos.x}_${pos.y}`}
        className={`square ${type}`}
        //position: absolute and background color come from CSS
        style={{
            top: pos.y * SQUARE_SIZE,
            left: pos.x * SQUARE_SIZE,
            width: SQUARE_SIZE,
            height: SQUARE_SIZE
        }}
    />
);

export default Game;
