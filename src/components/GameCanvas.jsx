import { useEffect, useRef } from "react";
import { Game } from "../game/Game.js";

export function GameCanvas({ gameRef, onLoseLife, onWin, paused }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const game = new Game(canvas, { onLoseLife, onWin });
        gameRef.current = game;
        game.start();
        
        return () => {
            game.destroy();
            if (gameRef.current === game) gameRef.current = null;
        }; 
    }, []);

    useEffect(() => {
        const game = gameRef.current;
        if (!game) return;
        if (paused) game.stop();
        else game.start();
    }, [paused]);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={560}
            style={{ display: "block", width: "100%", touchAction: "none" }}
        />
    );
}