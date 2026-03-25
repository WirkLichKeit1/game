export function DPad({ gameRef }) {
    const press = (key) => gameRef.current?.input.press(key);
    const release = (key) => gameRef.current?.input.release(key);

    const btn = {
        width: 68,
        height: 68,
        borderRadius: 14,
        background: "rgba(255,255,255,0.12)",
        border: "2px solid rgba(255,255,255,0.25)",
        color: "#fff",
        fontSize: 26,
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