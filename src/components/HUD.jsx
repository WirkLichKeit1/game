export function HUD({ lives, hp, flags, gameStatus, onRestart, onMenu, onNext, hasNext, isLandscape }) {

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

    // HUD de jogo — tudo no topo, longe do D-Pad
    return (
        <>
            {/* Painel superior esquerdo — Vidas + HP */}
            <div style={{
                position:"fixed", top:12, left:12,
                display:"flex", flexDirection:"column", gap:6,
                background:"rgba(0,0,0,0.7)",
                padding:"10px 14px",
                borderRadius:4,
                border:"1px solid rgba(255,255,255,0.15)",
                zIndex:30,
            }}>
                {/* Corações */}
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    {[0,1,2].map(i => (
                        <span key={i} style={{
                            fontSize:20,
                            opacity: i < lives ? 1 : 0.2,
                            filter: i < lives ? "none" : "grayscale(100%)",
                        }}>
                            ♥️
                        </span>
                    ))}
                </div>

                {/* Barra de HP */}
                <div style={{
                    width:150,
                    height:18,
                    background:"rgba(0,0,0,0.5)",
                    border:"1px solid rgba(255,255,255,0.2)",
                    borderRadius:2,
                    overflow:"hidden",
                    position:"relative",
                }}>
                    <div style={{
                        position:"absolute",
                        top:0, left:0, bottom:0,
                        width:`${hp}%`,
                        background: hp > 66
                            ? "linear-gradient(90deg, #4ade80 0%, #22c55e 100%)"
                            : hp > 33
                                ? "linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)"
                                : "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)",
                        transition:"width 0.3s ease, background 0.3s ease",
                    }} />
                    <div style={{
                        position:"absolute",
                        top:0, left:0, right:0,
                        height:"40%",
                        background:"rgba(255,255,255,0.2)",
                    }} />
                    <div style={{
                        position:"absolute",
                        inset:0,
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        color:"#fff",
                        fontSize:11,
                        fontWeight:"bold",
                        fontFamily:FONT,
                        textShadow:"1px 1px 2px rgba(0,0,0,0.8)",
                    }}>
                        HP {hp}/100
                    </div>
                </div>
            </div>

            {/* Painel superior direito — Bandeiras + botão Menu */}
            <div style={{
                position:"fixed", top:12, right:12,
                display:"flex", alignItems:"center", gap:8,
                zIndex:30,
            }}>
                {/* Bandeiras */}
                {flags.total > 0 && (
                    <div style={{
                        display:"flex", alignItems:"center", gap:10,
                        background:"rgba(0,0,0,0.7)",
                        padding:"10px 16px",
                        borderRadius:4,
                        border:"1px solid rgba(255,255,255,0.15)",
                    }}>
                        <span style={{ fontSize:22 }}>🚩</span>
                        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                            <span style={{
                                color:"#f5c518",
                                fontSize:14,
                                fontWeight:"bold",
                                fontFamily:FONT,
                            }}>
                                {flags.collected}/{flags.total}
                            </span>
                            <span style={{
                                color:"rgba(255,255,255,0.6)",
                                fontSize:9,
                                fontFamily:FONT,
                                letterSpacing:"0.08em",
                            }}>
                                {flags.collected === flags.total ? "COMPLETO!" : "BANDEIRAS"}
                            </span>
                        </div>
                    </div>
                )}

                {/* Botão Menu — sempre no topo, nunca sobre o D-Pad */}
                <button style={menuBtn} onClick={onMenu}>
                    ☰
                </button>
            </div>
        </>
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
    zIndex:50,
});

const btnRow = {
    display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center",
};

const menuBtn = {
    background:"rgba(0,0,0,0.7)",
    border:"1px solid rgba(255,255,255,0.15)",
    borderRadius:4,
    color:"rgba(255,255,255,0.8)",
    fontSize:16,
    padding:"8px 12px",
    cursor:"pointer",
    fontFamily:FONT,
};