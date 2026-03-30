export function DPad({ gameRef, isLandscape }) {
    const press = (key) => gameRef.current?.input.press(key);
    const release = (key) => gameRef.current?.input.release(key);

    const btn = {
        width: 72,
        height: 72,
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

    const Btn = ({ label, action }) => (
        <div
            style={btn}
            onPointerDown={() => press(action)}
            onPointerUp={() => release(action)}
            onPointerLeave={() => release(action)}
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
                    gap: 12,
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
                    pointerEvents: "all",
                    zIndex: 20,
                }}>
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
            <div style={{ display: "flex", gap: 14, pointerEvents: "all" }}>
                <Btn label="◀" action="left" />
                <Btn label="▶" action="right" />
            </div>
            <div style={{ pointerEvents: "All "}}>
                <Btn label="▲" action="jump"/>
            </div>
        </div>
    );
}