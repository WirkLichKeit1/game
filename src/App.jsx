import { useRef, useCallback } from "react";
import { GameCanvas } from "./components/GameCanvas.jsx";
import { DPad } from "./components/DPad.jsx";
import { HUD } from "./components/HUD.jsx";
import { MenuScreen } from "./screens/MenuScreen.jsx";
import { useGameState } from "./hooks/useGameState.js";


export default function App() {
    const gameRef = useRef(null);

    const {
        lives, gameStatus, currentLevel, maxUnlocked, hasNext, loseLife, win, play, restart, goToMenu,
    } = useGameState();

    // Inicia ou reinicia o engine com o level correto
    const startEngine = useCallback((levelId) => {
        setTimeout(() => {
            gameRef.current?.reset({ onLoseLife: loseLife, onWin: win }, levelId);
        }, 50);
    }, [loseLife, win]);

    const handlePlay = useCallback((levelId) => {
        play(levelId);
        startEngine(levelId);
    }, [play, startEngine]);

    const handleRestart = useCallback(() => {
        restart();
        startEngine(currentLevel);
    }, [restart, startEngine, currentLevel]);

    const handleNext = useCallback(() => {
        const next = currentLevel + 1;
        play(next);
        startEngine(next);
    }, [play, startEngine, currentLevel]);

    if (gameStatus === "menu") {
        return <MenuScreen onPlay={handlePlay} maxUnlocked={maxUnlocked} />;
    }
    
    return (
        <div style={{
            background: "#000",
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        }}>
            <GameCanvas
                gameRef={gameRef}
                onLoseLife={loseLife}
                onWin={win}
                paused={gameStatus !== "playing"}
                levelId={currentLevel}
            />
            <HUD
                lives={lives}
                gameStatus={gameStatus}
                onRestart={handleRestart}
                onMenu={goToMenu}
                onNext={handleNext}
                hasNext={hasNext}
            />
            {gameStatus === "playing" && <DPad gameRef={gameRef} />}
        </div>
    );
}