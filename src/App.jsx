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

    const handlePlay = useCallback((levelId) => {
        play(levelId);
    }, [play]);

    const handleRestart = useCallback(() => {
        restart();
        // Reinicia o engine sem trocar de fase
        setTimeout(() => {
            gameRef.current?.reset({ onLoseLife: loseLife, onWin: win }, currentLevel);
        }, 50)
    }, [restart, loseLife, win, currentLevel]);

    const handleNext = useCallback(() => {
        play(currentLevel + 1);
        // GameCanvas vai remontar automaticamente pelo novo levelId
    }, [play, currentLevel]);

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