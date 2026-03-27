import { useState } from "react";

const PHASES = [
    { id: 1, label: "Fase 1", sublabel: "O Início", unlocked: true },
    { id: 2, label: "Fase 2", sublabel: "Em breve", unlocked: false },
    { id: 3, label: "Fase 3", sublabel: "Em breve", unlocked: false },
];

export function MenuScreen({ onPlay, onCredits }) {
    const [selectedPhase, setSelectedPhase] = useState(1);
    const [showCredits, setShowCredits] = useState(false);

    if (showCredits) {
        return (
            <div style={styles.root}>
                <Background />
                <div style={styles.card}>
                    <p style={styles.cardTitle}>Sobre</p>
                    <p style={styles.creditText}>
                        <strong>Lario</strong> é um jogo de plataforma muito top.
                    </p>
                    <p style={styles.creditText}>
                        Inspirado nas vozes da minha cabeça.
                    </p>
                    <p style={{ ...styles.creditText, marginTop: 24, opacity: 0.5, fontSize: 13 }}>
                        v0.1
                    </p>
                    <button
                        style={styles.btnSecondary}
                        onClick={() => setShowCredits(false)}
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.root}>
            <Background />

            <div style={styles.content}>
                {/* Logo */}
                <div style={styles.logoWrap}>
                    <span style={styles.logoAccent}>🍄</span>
                    <h1 style={styles.title}>Lario</h1>
                    <p style={styles.subtitle}>Made in PE</p>
                </div>

                {/* Seleção de fase */}
                <div style={styles.phaseRow}>
                    {PHASES.map((phase) => (
                        <button
                            key={phase.id}
                            style={{
                                ...styles.phaseBtn,
                                ...(selectedPhase === phase.id && phase.unlocked
                                    ? styles.phaseBtnActive
                                    : {}),
                                ...(phase.unlocked ? {} : styles.phaseBtnLocked),
                            }}
                            onClick={() => phase.unlocked && setSelectedPhase(phase.id)}
                            disabled={!phase.unlocked}
                        >
                            <span style={styles.phaseNum}>{phase.unlocked ? phase.id : "🔒"}</span>
                            <span style={styles.phaseName}>{phase.label}</span>
                            <span style={styles.phaseSub}>{phase.sublabel}</span>
                        </button>
                    ))}
                </div>

                {/* Botão principal */}
                <button
                    style={styles.btnPlay}
                    onClick={() => onPlay(selectedPhase)}
                >
                    Jogar
                </button>

                {/* Créditos */}
                <button
                    style={styles.btnSecondary}
                    onClick={() => setShowCredits(true)}
                >
                    Sobre o jogo
                </button>
            </div>
        </div>
    );
}

/* Fundo animado com círculos suaves */
function Background() {
    return (
        <div style={styles.bg} aria-hidden="true">
            <div style={{ ...styles.circle, width: 320, height: 320, top: -80, right: -60, opacity: 0.07 }} />
            <div style={{ ...styles.circle, width: 200, height: 200, bottom: 60, left: -40, opacity: 0.05 }} />
            <div style={{ ...styles.circle, width: 120, height: 120, top: "40%", left: "10%", opacity: 0.04 }} />
        </div>
    );
}

const ACCENT = "#F2A61D";
const ACCENT2 = "#E05C1A";
const BG = "#0E0E16";
const SURFACE = "rgba(255,255,255,0.05)";
const BORDER = "rgba(255,255,255,0.1)";
const TEXT = "#F0EDE8";
const MUTED = "rgba(240,237,232,0.45)";

const styles = {
    root: {
        position: "fixed",
        inset: 0,
        background: BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        overflow: "hidden",
    },
    bg: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
    },
    circle: {
        position: "absolute",
        borderRadius: "50%",
        background: ACCENT,
    },
    content: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        padding: "40px 24px",
        width: "100%",
        maxWidth: 420,
    },
    logoWrap: {
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
    },
    logoAccent: {
        fontSize: 52,
        lineHeight: 1,
        filter: "drop-shadow(0 0 16px rgba(242,166,29,0.5))",
    },
    title: {
        margin: 0,
        fontSize: 44,
        fontWeight: "bold",
        lineHeight: 1.1,
        textAlign: "center",
        color: TEXT,
        letterSpacing: "-0.5px",
        textShadow: `0 0 40px rgba(242,166,29,0.3)`,
    },
    subtitle: {
        margin: 0,
        fontSize: 13,
        color: MUTED,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontFamily: "monospace",
    },

    /* Fases */
    phaseRow: {
        display: "flex",
        gap: 12,
        width: "100%",
    },
    phaseBtn: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "14px 8px",
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        color: TEXT,
        cursor: "pointer",
        transition: "all 0.18s ease",
        fontFamily: "inherit",
    },
    phaseBtnActive: {
        background: `rgba(242,166,29,0.12)`,
        border: `1.5px solid ${ACCENT}`,
        boxShadow: `0 0 20px rgba(242,166,29,0.15)`,
    },
    phaseBtnLocked: {
        opacity: 0.35,
        cursor: "not-allowed",
    },
    phaseNum: {
        fontSize: 22,
        fontWeight: "bold",
        color: ACCENT,
        lineHeight: 1,
    },
    phaseName: {
        fontSize: 13,
        fontWeight: "bold",
        color: TEXT,
    },
    phaseSub: {
        fontSize: 11,
        color: MUTED,
        fontFamily: "monospace",
    },

    /* Botões */
    btnPlay: {
        width: "100%",
        padding: "18px 0",
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT2} 100%)`,
        border: "none",
        borderRadius: 14,
        color: "#0E0E16",
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "inherit",
        cursor: "pointer",
        letterSpacing: "0.04em",
        boxShadow: `0 4px 24px rgba(242,166,29,0.3)`,
    },
    btnSecondary: {
        background: "none",
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        color: MUTED,
        fontSize: 14,
        fontFamily: "inherit",
        cursor: "pointer",
        padding: "10px 24px",
    },

    /* Card de créditos */
    card: {
        position: "relative",
        zIndex: 1,
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        padding: "40px 32px",
        width: "100%",
        maxWidth: 380,
        margin: "0 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
    },
    cardTitle: {
        margin: 0,
        fontSize: 22,
        fontWeight: "bold",
        color: TEXT,
        fontFamily: "inherit",
    },
    creditText: {
        margin: 0,
        fontSize: 15,
        color: MUTED,
        textAlign: "center",
        lineHeight: 1.6,
        fontFamily: "inherit",
    },
};