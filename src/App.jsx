import { useRef, useCallback } from "react";
import { GameCanvas } from "./components/GameCanvas.jsx";
import { DPad } from "./components/DPad.jsx";
import { HUD } from "./components/HUD.jsx";
import { useGameState } from "./hooks/useGameState.js";


export default function App() {
    const gameRef = useRef(null);
    const { lives, gameStatus, loseLife, win, reset } = useGameState();

    const handleRestart = useCallback(() => {
        reset();
        gameRef.current?.reset({ onLoseLife: loseLife, onWin: win });
    }, [reset, loseLife, win]);
    
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
            <HUD lives={lives} gameStatus={gameStatus} onRestart={handleRestart} />
            {gameStatus === "playing" && <DPad gameRef={gameRef} />}
        </div>
    );
}