export function HUD({ lives, gameStatus, onRestart, onMenu, onNext, hasNext }) {

    if (gameStatus === "dead") {
        return (
            <div style={overlay("#c0392b18")}>
                <p style={{ color:"#e74c3c", fontSize:32, fontWeight:"bold", margin:0, fontFamily:FONT }}>
                    GAME OVER
                </p>
                <div style={btnRow}>
                    <Btn color="#888"    onClick={onMenu}>    MENU      </Btn>
                    <Btn color="#e74c3c" onClick={onRestart}> REINICIAR </Btn>
                </div>
            </div>
        );
    }

    if (gameStatus === "win") {
        return (
            <div style={overlay("#27ae6018")}>
                <p style={{ color:"#2ecc71", fontSize:32, fontWeight:"bold", margin:0, fontFamily:FONT }}>
                    FASE CONCLUÍDA!
                </p>
                <p style={{ color:"rgba(46,204,113,0.6)", fontSize:12, margin:"4px 0 0", fontFamily:FONT, letterSpacing:"0.15em" }}>
                    {hasNext ? "PRÓXIMA FASE DESBLOQUEADA" : "MAIS FASES EM BREVE! 🦀"}
                </p>
                <div style={btnRow}>
                    <Btn color="#888"    onClick={onMenu}>    MENU      </Btn>
                    <Btn color="#2ecc71" onClick={onRestart}> REINICIAR </Btn>
                    {hasNext && (
                        <Btn color="#f5c518" onClick={onNext}> PRÓXIMA ▸ </Btn>
                    )}
                </div>
            </div>
        );
    }

    // HUD de jogo — vidas + botão menu
    return (
        <div style={{
            position:"fixed", top:16, left:16,
            display:"flex", alignItems:"center", gap:8,
        }}>
            {[0,1,2].map(i => (
                <span key={i} style={{ fontSize:22, opacity: i < lives ? 1 : 0.2 }}>♥️</span>
            ))}
            <button style={menuBtn} onClick={onMenu}>☰</button>
        </div>
    );
}

/* ── Sub-componentes ── */
const FONT = "'Courier New', Courier, monospace";

function Btn({ color, onClick, children }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding:"11px 22px",
                background:"transparent",
                border:`1px solid ${color}`,
                color,
                fontSize:13,
                borderRadius:0,
                cursor:"pointer",
                fontFamily:FONT,
                letterSpacing:"0.12em",
            }}
        >
            {children}
        </button>
    );
}

const overlay = bg => ({
    position:"fixed", inset:0,
    background:bg,
    display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center",
    gap:24,
    fontFamily:FONT,
});

const btnRow = {
    display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center",
};

const menuBtn = {
    marginLeft:6,
    background:"rgba(255,255,255,0.08)",
    border:"1px solid rgba(255,255,255,0.15)",
    borderRadius:0,
    color:"rgba(255,255,255,0.5)",
    fontSize:16,
    padding:"4px 10px",
    cursor:"pointer",
};