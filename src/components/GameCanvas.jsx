import { useEffect, useRef } from "react";
import { Game } from "../game/Game.js";

export function GameCanvas({ gameRef, onLoseLife, onWin, paused, levelId = 1, layout }) {
    const canvasRef = useRef(null);
    const { canvas: c } = layout;

    // Remonta o Game sempre que o levelId mudar
    useEffect(() => {
        const canvasEl = canvasRef.current;
        const game = new Game(canvasEl, { onLoseLife, onWin }, levelId);
        gameRef.current = game;
        game.start();
        
        return () => {
            game.destroy();
            if (gameRef.current === game) gameRef.current = null;
        }; 
    }, [levelId]);

    useEffect(() => {
        const game = gameRef.current;
        if (!game) return;
        if (paused) game.stop();
        else game.start();
    }, [paused]);

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <canvas
                ref={canvasRef}
                width={c.logicalW}
                height={c.logicalH}
                style={{
                    display: "block",
                    width: c.displayW,
                    height: c.displayH,
                    imageRendering: "pixelated",
                    touchAction: "none"
                }}
            />
        </div>
    );
}