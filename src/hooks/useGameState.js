import { useState, useCallback } from "react";

const SAVE_KEY = "manguerun_unlocked";
const MAX_LEVEL = 3;

function loadUnlocked() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) return Number(saved);
    } catch (_) {}
    return 1;
}

function saveUnlocked(n) {
    try {
        localStorage.setItem(SAVE_KEY, String(n));
    } catch (_) {}
}

export function useGameState() {
    const [lives, setLives] = useState(3);
    const [gameStatus, setGameStatus] = useState("menu"); // menu | playing | dead | win
    const [currentLevel, setCurrentLevel] = useState(1);
    const [maxUnlocked, setMaxUnlocked] = useState(loadUnlocked);

    const loseLife = useCallback(() => {
        setLives((prev) => {
            if (prev <= 1) {
                setGameStatus("dead");
                return 0;
            }
            return prev - 1;
        });
    }, []);

    const win = useCallback(() => {
        // Desbloqueia a próxima fase e persiste
        setMaxUnlocked(prev => {
            const next = Math.min(currentLevel + 1, MAX_LEVEL);
            const updated = Math.max(prev, next);
            saveUnlocked(updated);
            return updated;
        });
        setGameStatus("win");
    }, [currentLevel]);

    const play = useCallback((levelId) => {
        setCurrentLevel(levelId);
        setLives(3);
        setGameStatus("playing");
    }, []);

    const restart = useCallback(() => {
        setLives(3);
        setGameStatus("playing");
    }, []);

    const goToMenu = useCallback(() => {
        setLives(3);
        setGameStatus("menu");
    }, []);

    const hasNext = currentLevel < MAX_LEVEL;

    return {
        lives,
        gameStatus,
        currentLevel,
        maxUnlocked,
        hasNext,
        loseLife,
        win,
        play,
        restart,
        goToMenu
    };
}