import { useEffect, useRef } from "react";
import { Game } from "../game/Game.js";

export function GameCanvas({ gameRef }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const game = new Game(canvas);
        gameRef.current = game;
        game.start();
        return () => game.stop();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={560}
            style={{ display: "block", width: "100%", touchAction: "none" }}
        />
    );
}