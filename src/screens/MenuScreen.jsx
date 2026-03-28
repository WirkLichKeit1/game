import { useState, useEffect } from "react";

const PHASE_DATA = [
    { id: 1, label: "FASE 1", sublabel: "PRAIA DO PINA" },
    { id: 2, label: "FASE 2", sublabel: "CAPIBARIBE"    },
    { id: 3, label: "FASE 3", sublabel: "OLINDA ALTA"   },
];

export function MenuScreen({ onPlay, maxUnlocked }) {
    const [selectedPhase, setSelectedPhase] = useState(1);
    const [showCredits,   setShowCredits]   = useState(false);
    const [blink,         setBlink]         = useState(true);
    const [stars] = useState(() =>
        Array.from({ length: 36 }, () => ({
            x:     Math.random() * 100,
            y:     Math.random() * 60,
            size:  Math.random() < 0.25 ? 2 : 1,
            speed: 1.8 + Math.random() * 2.4,
            delay: Math.random() * 4,
        }))
    );

    useEffect(() => {
        const t = setInterval(() => setBlink(b => !b), 600);
        return () => clearInterval(t);
    }, []);

    if (showCredits) {
        return (
            <div style={s.root}>
                <BgScene stars={stars} />
                <div style={s.creditsBox}>
                    <span style={s.creditsEye}>🦀</span>
                    <p style={s.creditsHeading}>MANGUE RUN</p>
                    <p style={s.creditsBody}>
                        {"Um jogo de plataforma feito\ncom React e Canvas puro.\n\nInspirado no mangue beat e\nno povo de Pernambuco."}
                    </p>
                    <p style={{ ...s.creditsBody, marginTop: 16, opacity: 0.45 }}>
                        v0.1 — feito no Replit
                    </p>
                    <button style={s.smallBtn} onClick={() => setShowCredits(false)}>
                        [ VOLTAR ]
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={s.root}>
            <BgScene stars={stars} />
            <div style={s.scanlines} />

            <div style={s.layout}>

                <div style={s.logoBox}>
                    <div style={s.logoIcon}>🦀</div>
                    <p style={s.logoSub}>P E R N A M B U C O</p>
                    <h1 style={s.title}>MANGUE<br/>RUN</h1>
                    <p style={s.logoSub}>── plataforma retrô ──</p>
                </div>

                <div style={s.section}>
                    <p style={s.label}>— SELECIONE A FASE —</p>
                    <div style={s.phaseRow}>
                        {PHASE_DATA.map(ph => {
                            const unlocked = ph.id <= maxUnlocked;
                            const active   = selectedPhase === ph.id && unlocked;
                            return (
                                <button
                                    key={ph.id}
                                    style={{
                                        ...s.phaseBtn,
                                        ...(active   ? s.phaseBtnOn  : {}),
                                        ...(!unlocked ? s.phaseBtnOff : {}),
                                    }}
                                    onClick={() => unlocked && setSelectedPhase(ph.id)}
                                    disabled={!unlocked}
                                >
                                    {active && <span style={s.arrow}>▸</span>}
                                    <span style={s.phaseNum}>
                                        {unlocked ? ph.id : "🔒"}
                                    </span>
                                    <span style={s.phaseName}>{ph.label}</span>
                                    <span style={{ ...s.phaseLoc, color: unlocked ? C.muted : C.locked }}>
                                        {unlocked ? ph.sublabel : "??????"}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <button style={s.playBtn} onClick={() => onPlay(selectedPhase)}>
                    {blink ? "▸  JOGAR  ◂" : "   JOGAR   "}
                </button>

                <div style={s.footer}>
                    <button style={s.ghostBtn} onClick={() => setShowCredits(true)}>SOBRE</button>
                    <span style={s.dot}>•</span>
                    <span style={s.hiScore}>HI  00000</span>
                </div>

                <p style={{ ...s.coin, opacity: blink ? 0.55 : 0.18 }}>
                    INSERT COIN
                </p>
            </div>
        </div>
    );
}

/* ─── Cena de fundo ─── */
function BgScene({ stars }) {
    const palms = [6, 20, 38, 58, 74, 88];
    return (
        <div style={s.bgWrap}>
            <style>{`
                @keyframes twinkle {
                    0%,100% { opacity:.15 }
                    50%     { opacity:.7  }
                }
            `}</style>
            <div style={s.sky} />
            <div style={s.moon} />
            {stars.map((st, i) => (
                <div key={i} style={{
                    position: "absolute",
                    left: `${st.x}%`, top: `${st.y}%`,
                    width: st.size, height: st.size,
                    background: "#c8d8e8",
                    animation: `twinkle ${st.speed}s ease-in-out infinite`,
                    animationDelay: `${st.delay}s`,
                }}/>
            ))}
            <div style={s.water} />
            <div style={s.waterSheen} />
            <div style={s.ground} />
            <div style={s.groundLine} />
            {palms.map((left, i) => <Palm key={i} left={left} />)}
        </div>
    );
}

function Palm({ left }) {
    return (
        <div style={{ position:"absolute", bottom:36, left:`${left}%`, display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ display:"flex", gap:2 }}>
                <div style={{ width:6, height:6,  background:C.leaf, transform:"rotate(-30deg)" }}/>
                <div style={{ width:6, height:10, background:C.leaf }}/>
                <div style={{ width:6, height:6,  background:C.leaf, transform:"rotate(30deg)"  }}/>
            </div>
            <div style={{ width:4, height:28, background:C.trunk }}/>
        </div>
    );
}

const C = {
    sky1:"#0d1b2a", sky2:"#162840", sky3:"#1e3a30",
    water:"#0e2233", wave:"#16304a",
    ground:"#1a2e18", gline:"#2a4828",
    leaf:"#2d5c30", trunk:"#3a2a18", moon:"#c8d4bc",
    text:"#c8d8c0", muted:"#6a8878", locked:"#3a4a40",
    accent:"#7ab890", border:"#3a5848",
};

const FONT = "'Courier New', Courier, monospace";

const s = {
    root:{ position:"fixed", inset:0, background:C.sky1, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT, overflow:"hidden", userSelect:"none", WebkitUserSelect:"none" },
    bgWrap:{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" },
    sky:{ position:"absolute", inset:0, background:`linear-gradient(180deg,${C.sky1} 0%,${C.sky2} 55%,${C.sky3} 100%)` },
    moon:{ position:"absolute", top:"9%", right:"14%", width:18, height:18, background:C.moon, opacity:0.6 },
    water:{ position:"absolute", bottom:36, left:0, right:0, height:52, background:C.water },
    waterSheen:{ position:"absolute", bottom:72, left:0, right:0, height:3, background:C.wave, opacity:0.5 },
    ground:{ position:"absolute", bottom:0, left:0, right:0, height:38, background:C.ground },
    groundLine:{ position:"absolute", bottom:36, left:0, right:0, height:2, background:C.gline },
    scanlines:{ position:"absolute", inset:0, pointerEvents:"none", zIndex:10, background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)" },
    layout:{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:18, padding:"24px 20px 18px", width:"100%", maxWidth:380 },
    logoBox:{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"18px 28px 14px", border:`1px solid ${C.border}`, background:"rgba(10,20,15,0.55)", width:"100%", boxSizing:"border-box" },
    logoIcon:{ fontSize:28, lineHeight:1, marginBottom:2 },
    logoSub:{ margin:0, fontSize:9, color:C.muted, letterSpacing:"0.22em", fontFamily:FONT },
    title:{ margin:"6px 0 4px", fontSize:40, fontWeight:"bold", lineHeight:1.1, textAlign:"center", letterSpacing:"0.08em", color:C.text, textShadow:"1px 1px 0 #000", fontFamily:FONT },
    section:{ width:"100%" },
    label:{ margin:"0 0 8px", fontSize:10, color:C.muted, letterSpacing:"0.18em", textAlign:"center", fontFamily:FONT },
    phaseRow:{ display:"flex", gap:8, width:"100%" },
    phaseBtn:{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"10px 4px", background:"rgba(10,20,15,0.5)", border:`1px solid ${C.border}`, color:C.text, cursor:"pointer", fontFamily:FONT, position:"relative" },
    phaseBtnOn:{ border:`1px solid ${C.accent}`, background:"rgba(122,184,144,0.07)" },
    phaseBtnOff:{ opacity:0.35, cursor:"not-allowed" },
    arrow:{ position:"absolute", top:8, left:5, fontSize:9, color:C.accent },
    phaseNum:{ fontSize:18, fontWeight:"bold", color:C.accent, lineHeight:1 },
    phaseName:{ fontSize:11, color:C.text, letterSpacing:"0.08em" },
    phaseLoc:{ fontSize:8, letterSpacing:"0.1em" },
    playBtn:{ width:"100%", padding:"15px 0", background:"rgba(10,20,15,0.6)", border:`1px solid ${C.accent}`, color:C.accent, fontSize:20, fontWeight:"bold", fontFamily:FONT, cursor:"pointer", letterSpacing:"0.12em" },
    footer:{ display:"flex", alignItems:"center", gap:10, fontFamily:FONT },
    ghostBtn:{ background:"none", border:"none", color:C.muted, fontSize:10, fontFamily:FONT, cursor:"pointer", letterSpacing:"0.12em", padding:0 },
    dot:{ color:C.border, fontSize:10 },
    hiScore:{ color:C.muted, fontSize:10, letterSpacing:"0.1em" },
    coin:{ margin:0, fontSize:9, color:C.muted, letterSpacing:"0.22em", fontFamily:FONT },
    creditsBox:{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:10, padding:"32px 28px", border:`1px solid ${C.border}`, background:"rgba(8,16,12,0.82)", width:"100%", maxWidth:340, margin:"0 20px", boxSizing:"border-box" },
    creditsEye:{ fontSize:24 },
    creditsHeading:{ margin:0, fontSize:15, fontWeight:"bold", color:C.text, letterSpacing:"0.15em", fontFamily:FONT },
    creditsBody:{ margin:0, fontSize:11, color:C.muted, textAlign:"center", lineHeight:1.9, whiteSpace:"pre-line", letterSpacing:"0.05em", fontFamily:FONT },
    smallBtn:{ marginTop:12, background:"none", border:`1px solid ${C.border}`, color:C.muted, fontSize:11, fontFamily:FONT, cursor:"pointer", padding:"8px 20px", letterSpacing:"0.1em" },
};