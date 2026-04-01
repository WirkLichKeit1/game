export function DPad({ gameRef, isLandscape }) {
    const press = (key) => gameRef.current?.input.press(key);
    const release = (key) => gameRef.current?.input.release(key);

    const btnBase = {
        width: 68,
        height: 68,
        borderRadius: 14,
        background: "rgba(255,255,255,0.12)",
        border: "2px solid rgba(255,255,255,0.22)",
        color: "#fff",
        fontSize: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: "pointer",
    };

    const shootBtn = {
        ...btnBase,
        background: "rgba(64,255,200,0.15)",
        border: "2px solid rgba(64,255,200,0.4)",
        color: "#40ffcc",
        fontSize: 22,
    };

    const Btn = ({ label, action, style }) => (
        <div
            style={style ?? btnBase}
            onPointerDown={(e) => { e.preventDefault(); press(action); }}
            onPointerUp={(e) => { e.preventDefault(); release(action); }}
            onPointerLeave={(e) => { e.preventDefault(); release(action); }}
            onPointerCancel={(e) => { e.preventDefault(); release(action); }}
        >
            {label}
        </div>
    );

    if (isLandscape) {
        // Landscape: ◀ ▶ no canto inferior esquerdo, ▲ no canto inferior direito
        return (
            <>
                <div style={{
                    position: "fixed",
                    bottom: 24,
                    left: 24,
                    display: "flex",
                    gap: 10,
                    pointerEvents: "all",
                    zIndex: 20,
                }}>
                    <Btn label="◀" action="left" />
                    <Btn label="▶" action="right" />
                </div>
                <div style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    display: "flex",
                    gap: 10,
                    pointerEvents: "all",
                    zIndex: 20,
                }}>
                    <Btn label="●" action="shoot" style={shootBtn} />
                    <Btn label="▲" action="jump" />
                </div>
            </>
        );
    }

    // Portrait: layout padrão (centralizado embaixo)
    return (
        <div style={{
            position: "fixed",
            bottom: 32,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "0 28px",
            pointerEvents: "none",
            zIndex: 20,
        }}>
            <div style={{ display: "flex", gap: 10, pointerEvents: "all" }}>
                <Btn label="◀" action="left" />
                <Btn label="▶" action="right" />
            </div>
            <div style={{ display: "flex", gap: 10, pointerEvents: "all" }}>
                <Btn label="●" action="shoot" style={shootBtn} />
                <Btn label="▲" action="jump"/>
            </div>
        </div>
    );
}