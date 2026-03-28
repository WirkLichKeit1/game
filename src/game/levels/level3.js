// FASE 3 — Olinda Alta
// Cenário das ladeiras históricas: paralelepípedos, casarões, fim de tarde
// Dificuldade: difícil — plataformas pequenas, saltos precisos, muitos inimigos rápidos

export const level3 = {
    id: 3,
    name: "OLINDA ALTA",
    worldWidth: 6000,
    worldHeight: 560,

    theme: {
        sky:        "#2a1a0e",   // céu de fim de tarde quente
        skyBottom:  "#5a2e10",   // laranja escuro no horizonte
        ground:     "#5a4a38",   // paralelepípedo
        groundTop:  "#6a5a48",   // pedra mais clara
        platform:   "#7a5a40",   // pedra colonial
        platformTop:"#8a6a50",
        water:      "#1a0e08",   // sombra das ladeiras
        waterSheen: "#2a1a10",
        enemy:      "#c04878",   // frevo — pink/magenta vibrante
        enemyHead:  "#a03060",
        flag:       "#f0a020",   // bandeira de Olinda
    },

    // Ladeiras — plataformas em degraus ascendentes e descendentes
    // Buracos são "vãos" entre casarões — mais estreitos e mais frequentes
    platforms: [
        // Chão em blocos de paralelepípedo — muitos vãos
        { x: 0,    y: 500, w: 420,  h: 60 },
        { x: 500,  y: 500, w: 340,  h: 60 },
        { x: 940,  y: 480, w: 300,  h: 80 },   // sobe um pouco
        { x: 1340, y: 460, w: 340,  h: 100 },  // sobe mais
        { x: 1800, y: 440, w: 300,  h: 120 },
        { x: 2220, y: 420, w: 360,  h: 140 },  // pico da ladeira
        { x: 2720, y: 440, w: 300,  h: 120 },  // começa a descer
        { x: 3140, y: 460, w: 340,  h: 100 },
        { x: 3600, y: 480, w: 300,  h: 80 },
        { x: 4040, y: 500, w: 380,  h: 60 },
        { x: 4560, y: 480, w: 320,  h: 80 },
        { x: 5000, y: 460, w: 340,  h: 100 },
        { x: 5480, y: 500, w: 520,  h: 60 },

        // Sacadas e muros dos casarões — plataformas pequenas e precisas
        { x: 80,   y: 380, w: 90,  h: 18 },
        { x: 240,  y: 300, w: 80,  h: 18 },
        { x: 370,  y: 380, w: 70,  h: 18 },

        { x: 520,  y: 370, w: 80,  h: 18 },
        { x: 680,  y: 270, w: 90,  h: 18 },
        { x: 840,  y: 360, w: 70,  h: 18 },

        { x: 960,  y: 340, w: 80,  h: 18 },
        { x: 1120, y: 240, w: 90,  h: 18 },
        { x: 1280, y: 330, w: 70,  h: 18 },

        { x: 1360, y: 330, w: 80,  h: 18 },
        { x: 1540, y: 230, w: 100, h: 18 },
        { x: 1730, y: 310, w: 70,  h: 18 },

        { x: 1820, y: 300, w: 80,  h: 18 },
        { x: 2000, y: 200, w: 100, h: 18 },
        { x: 2160, y: 300, w: 80,  h: 18 },

        { x: 2240, y: 280, w: 90,  h: 18 },
        { x: 2430, y: 190, w: 100, h: 18 },
        { x: 2630, y: 280, w: 80,  h: 18 },

        { x: 2740, y: 300, w: 80,  h: 18 },
        { x: 2930, y: 210, w: 90,  h: 18 },
        { x: 3100, y: 300, w: 70,  h: 18 },

        { x: 3160, y: 330, w: 80,  h: 18 },
        { x: 3360, y: 230, w: 90,  h: 18 },
        { x: 3550, y: 330, w: 70,  h: 18 },

        { x: 3620, y: 350, w: 80,  h: 18 },
        { x: 3810, y: 250, w: 90,  h: 18 },
        { x: 4000, y: 360, w: 70,  h: 18 },

        { x: 4060, y: 370, w: 80,  h: 18 },
        { x: 4260, y: 260, w: 90,  h: 18 },
        { x: 4450, y: 360, w: 70,  h: 18 },

        { x: 4580, y: 340, w: 80,  h: 18 },
        { x: 4780, y: 240, w: 90,  h: 18 },
        { x: 4960, y: 330, w: 70,  h: 18 },

        { x: 5020, y: 310, w: 80,  h: 18 },
        { x: 5220, y: 210, w: 90,  h: 18 },
        { x: 5420, y: 310, w: 70,  h: 18 },
    ],

    // Inimigos — foliões do frevo (rápidos e numerosos)
    enemies: [
        { x: 100,  y: 450, left: 10,   right: 400,  speed: 120 },
        { x: 260,  y: 250, left: 250,  right: 310,  speed: 130 },
        { x: 530,  y: 450, left: 510,  right: 820,  speed: 125 },
        { x: 710,  y: 220, left: 690,  right: 760,  speed: 140 },
        { x: 970,  y: 430, left: 950,  right: 1220, speed: 130 },
        { x: 1150, y: 190, left: 1130, right: 1200, speed: 145 },
        { x: 1370, y: 410, left: 1350, right: 1680, speed: 135 },
        { x: 1570, y: 180, left: 1550, right: 1620, speed: 150 },
        { x: 1830, y: 390, left: 1810, right: 2090, speed: 140 },
        { x: 2030, y: 150, left: 2010, right: 2080, speed: 155 },
        { x: 2250, y: 370, left: 2230, right: 2590, speed: 145 },
        { x: 2460, y: 140, left: 2440, right: 2510, speed: 160 },
        { x: 2750, y: 390, left: 2730, right: 3000, speed: 140 },
        { x: 2960, y: 160, left: 2940, right: 3010, speed: 155 },
        { x: 3170, y: 410, left: 3150, right: 3470, speed: 135 },
        { x: 3390, y: 180, left: 3370, right: 3440, speed: 150 },
        { x: 3630, y: 430, left: 3610, right: 3880, speed: 130 },
        { x: 3840, y: 200, left: 3820, right: 3890, speed: 145 },
        { x: 4070, y: 450, left: 4050, right: 4420, speed: 135 },
        { x: 4290, y: 210, left: 4270, right: 4340, speed: 150 },
        { x: 4590, y: 430, left: 4570, right: 4840, speed: 140 },
        { x: 4810, y: 190, left: 4790, right: 4850, speed: 155 },
        { x: 5030, y: 410, left: 5010, right: 5300, speed: 145 },
        { x: 5250, y: 160, left: 5230, right: 5300, speed: 160 },
        { x: 5500, y: 450, left: 5490, right: 5980, speed: 150 },
    ],

    playerStart: { x: 80, y: 420 },
    flagX: 5880,
};