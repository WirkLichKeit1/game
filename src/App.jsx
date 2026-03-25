import { useRef } from "react";
import { GameCanvas } from "./components/GameCanvas.jsx";
import { DPad } from "./components/DPad.jsx";


export default function App() {
    const gameRef = useRef(null);
    
    return (
        <div style={{
            background: "#000",
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        }}>
            <GameCanvas gameRef={gameRef} />
            <DPad gameRef={gameRef} />
        </div>
    );
}