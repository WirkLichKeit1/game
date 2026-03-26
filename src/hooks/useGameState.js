import { useState, useCallback } from "react";

export function useGameState() {
    const [lives, setLives] = useState(3);
    const [gameStatus, setGameStatus] = useState("playing"); // playing | dead | win

    const loseLife = useCallback(() => {
        setLives((prev) => {
            if (prev <= 1) {
                setGameStatus("dead");
                return 0;
            }
            return prev - 1;
        });
    }, []);

    const win = useCallback(() => setGameStatus("win"), []);

    const reset = useCallback(() => {
        setLives(3);
        setGameStatus("playing");
    }, []);

    return { lives, gameStatus, loseLife, win, reset };
}