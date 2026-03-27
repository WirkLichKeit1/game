import { useRef, useCallback } from "react";
import { GameCanvas } from "./components/GameCanvas.jsx";
import { DPad } from "./components/DPad.jsx";
import { HUD } from "./components/HUD.jsx";
import { MenuScreen } from "./screens/MenuScreen.jsx";
import { useGameState } from "./hooks/useGameState.js";


export default function App() {
    const gameRef = useRef(null);
    const { lives, gameStatus, loseLife, win, reset, goToMenu } = useGameState();

    const handlePlay = useCallback((phase) => {
        reset(phase);
        // Pequeno delay para o canvas montar antes de iniciar
        setTimeout(() => {
            gameRef.current?.reset({ onLoseLife: loseLife, onWin: win });
        }, 50);
    }, [reset, loseLife, win]);

    const handleRestart = useCallback(() => {
        reset();
        gameRef.current?.reset({ onLoseLife: loseLife, onWin: win });
    }, [reset, loseLife, win]);

    if (gameStatus === "menu") {
        return <MenuScreen onPlay={handlePlay} />;
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
            />
            <HUD
                lives={lives}
                gameStatus={gameStatus}
                onRestart={handleRestart}
                onMenu={goToMenu}
            />
            {gameStatus === "playing" && <DPad gameRef={gameRef} />}
        </div>
    );
}