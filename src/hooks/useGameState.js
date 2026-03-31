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
    const [hp, setHp] = useState(100);
    const [gameStatus, setGameStatus] = useState("menu"); // menu | playing | dead | win
    const [currentLevel, setCurrentLevel] = useState(1);
    const [maxUnlocked, setMaxUnlocked] = useState(loadUnlocked);
    const [flags, setFlags] = useState({ collected: 0, total: 0 });

    const takeDamage = useCallback((damage = 25) => {
        setHp(prev => {
            const newHp = Math.max(0, prev - damage);
            if (newHp === 0) {
                // HP zerou, perde uma vida e reseta HP
                setLives(current => {
                    if (current <= 1) {
                        setGameStatus("dead");
                        return 0;
                    }
                    return current - 1;
                });
                return 100; // Reset HP
            }
            return newHp
        });
    }, []);

    const loseLife = useCallback(() => {
        // Morte instantânea (quedas, etc)
        setLives((prev) => {
            if (prev <= 1) {
                setGameStatus("dead");
                return 0;
            }
            return prev - 1;
        });
        setHp(100);
    }, []);

    const collectFlag = useCallback(() => {
        setFlags(prev => ({
            ...prev,
            collected: Math.min(prev.collected + 1, prev.total)
        }));
    }, []);

    const setFlagTotal = useCallback((total) => {
        setFlags({ collected: 0, total });
    }, []);

    const win = useCallback((levelId) => {
        // Desbloqueia a próxima fase e persiste
        setMaxUnlocked(prev => {
            const next = Math.min(levelId + 1, MAX_LEVEL);
            const updated = Math.max(prev, next);
            saveUnlocked(updated);
            return updated;
        });
        setGameStatus("win");
    }, []);

    const play = useCallback((levelId) => {
        setCurrentLevel(levelId);
        setLives(3);
        setHp(100);
        setFlags({ collected: 0, total: 0 });
        setGameStatus("playing");
    }, []);

    const restart = useCallback(() => {
        setLives(3);
        setHp(100);
        setFlags(prev => ({ collected: 0, total: prev.total }));
        setGameStatus("playing");
    }, []);

    const goToMenu = useCallback(() => {
        setLives(3);
        setHp(100);
        setFlags({ collected: 0, total: 0 });
        setGameStatus("menu");
    }, []);

    const hasNext = currentLevel < MAX_LEVEL;

    return {
        lives,
        hp,
        flags,
        gameStatus,
        currentLevel,
        maxUnlocked,
        hasNext,
        takeDamage,
        loseLife,
        collectFlag,
        setFlagTotal,
        win,
        play,
        restart,
        goToMenu
    };
}