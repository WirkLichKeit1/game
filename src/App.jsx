import { useRef, useCallback } from "react";
import { GameCanvas } from "./components/GameCanvas.jsx";
import { DPad } from "./components/DPad.jsx";
import { HUD } from "./components/HUD.jsx";
import { MenuScreen } from "./screens/MenuScreen.jsx";
import { useGameState } from "./hooks/useGameState.js";
import { useLayout } from "./hooks/useLayout";

export default function App() {
    const gameRef = useRef(null);
    const layout = useLayout();

    const {
        lives, hp, flags, gameStatus, currentLevel, maxUnlocked, hasNext, takeDamage, loseLife, collectFlag, setFlagTotal, win, play, restart, goToMenu,
    } = useGameState();

    const callbacks = {
        onLoseLife: loseLife,
        onWin: win,
        takeDamage,
        collectFlag,
        setFlagTotal,
    };

    const handlePlay = useCallback((levelId) => {
        play(levelId);
    }, [play]);

    const handleRestart = useCallback(() => {
        restart();
        // Reset síncrono
        gameRef.current?.reset({
            onLoseLife: loseLife,
            onWin: win,
            takeDamage,
            collectFlag,
            setFlagTotal,
        }, currentLevel);
    }, [restart, loseLife, win, takeDamage, collectFlag, setFlagTotal, currentLevel]);

    const handleNext = useCallback(() => {
        play(currentLevel + 1);
        // GameCanvas vai remontar automaticamente pelo novo levelId
    }, [play, currentLevel]);

    if (gameStatus === "menu") {
        return (
            <MenuScreen
                onPlay={handlePlay}
                maxUnlocked={maxUnlocked}
                layout={layout}
            />
        );
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
                callbacks={callbacks}
                paused={gameStatus !== "playing"}
                levelId={currentLevel}
                layout={layout}
            />
            <HUD
                lives={lives}
                hp={hp}
                flags={flags}
                gameStatus={gameStatus}
                onRestart={handleRestart}
                onMenu={goToMenu}
                onNext={handleNext}
                hasNext={hasNext}
                isLandscape={layout.isLandscape}
            />
            {gameStatus === "playing" && (
                <DPad gameRef={gameRef} isLandscape={layout.isLandscape} />
            )}
        </div>
    );
}