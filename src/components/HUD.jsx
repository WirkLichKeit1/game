export function HUD({ lives, gameStatus, onRestart, onMenu }) {
    const heartStyle = (filled) => ({
        fontSize: 24,
        opacity: filled ? 1 : 0.25,
        marginRight: 4,
    });

    if (gameStatus === "dead") {
        return (
            <div style={overlayStyle("#c0392b22")}>
                <p style={{ color: "#e74c3c", fontSize: 36, fontWeight: "bold", margin: 0 }}>
                    Game Over
                </p>
                <button onClick={onRestart} style={btnStyle("#e74c3c")}>
                    Tentar novamente
                </button>
                <button onClick={onMenu} style={btnStyle("#888")}>
                    Menu
                </button>
            </div>
        );
    }

    if (gameStatus === "win") {
        return (
            <div style={overlayStyle("#27ae6022")}>
                <p style={{ color: "#2ecc71", fontSize: 36, fontWeight: "bold", margin: 0 }}>
                    Você venceu!
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={onRestart} style={btnStyle("#2ecc71")}>
                        Jogar novamente
                    </button>
                    <button onClick={onMenu} style={btnStyle("#888")}>
                        Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: "fixed",
            top: 16,
            left: 16,
            display: "flex",
            gap: 2,
        }}>
            {[0, 1, 2].map((i) => (
                <span key={i} style={heartStyle(i < lives)}>♥️</span>
            ))}
            <button
                onClick={onMenu}
                style={{
                    marginLeft: 8,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 12,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontFamily: "monospace",
                }}
            >
                ☰ Menu
            </button>
        </div>
    );
}

const overlayStyle = (bg) => ({
    position: "fixed",
    inset: 0,
    background: bg,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    fontFamily: "monospace",
});

const btnStyle = (color) => ({
    padding: "12px 32px",
    background: "transparent",
    border: `2px solid ${color}`,
    color: color,
    fontSize: 18,
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "monospace",
});