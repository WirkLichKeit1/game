// ZONA MÉDIA — Praia do Pina
// Inimigos: patrol apenas
// Contém: portal sky (invisível), buraco cave (visível), Gate no final

export const zoneMid = {
    id: "mid",
    name: "PRAIA DO PINA",
    worldWidth: 8000,
    worldHeight: 560,

    playerStart: { x: 100, y: 420 },

    theme: {
        sky:             "#1a3a5c",
        skyBottom:       "#2d6080",
        ground:          "#c4a882",
        groundTop:       "#d4b896",
        platform:        "#b89660",
        platformTop:     "#c8a870",
        water:           "#1e5878",
        waterSheen:      "#2a6888",
        enemy:           "#e05030",
        enemyHead:       "#c04020",
        flag:            "#f5c518",
        projectile:      "#ff7f50",
        projectileTrail: "#ffa07a",
        bossBody:        "#8b4513",
        bossHead:        "#a0522d",
        bossEye:         "#ff4500",
    },

    platforms: [
        // Início
        { x: 0,    y: 500, w: 600,  h: 60 },

        // Portal sky escondido por volta de x=500 (acima, plataformas que sobem)
        { x: 620,  y: 500, w: 300,  h: 60 },
        { x: 650,  y: 420, w: 100,  h: 20 },
        { x: 760,  y: 340, w: 100,  h: 20 },
        { x: 870,  y: 260, w: 120,  h: 20 }, // topo — portal sky fica aqui

        // Caminho principal após portal sky
        { x: 1020, y: 500, w: 400,  h: 60 },
        { x: 1480, y: 500, w: 400,  h: 60 },

        // Buraco cave entre x=1880 e x=2080 (sem plataforma = buraco)
        { x: 2080, y: 500, w: 400,  h: 60 },
        { x: 2540, y: 500, w: 400,  h: 60 },
        { x: 3000, y: 500, w: 400,  h: 60 },
        { x: 3460, y: 500, w: 400,  h: 60 },
        { x: 3920, y: 500, w: 400,  h: 60 },
        { x: 4380, y: 500, w: 400,  h: 60 },
        { x: 4840, y: 500, w: 400,  h: 60 },

        // Plataformas flutuantes para variedade
        { x: 1200, y: 380, w: 120,  h: 20 },
        { x: 1600, y: 350, w: 120,  h: 20 },
        { x: 2200, y: 380, w: 120,  h: 20 },
        { x: 2700, y: 350, w: 120,  h: 20 },
        { x: 3100, y: 380, w: 120,  h: 20 },
        { x: 3600, y: 350, w: 120,  h: 20 },
        { x: 4100, y: 380, w: 120,  h: 20 },
        { x: 4600, y: 350, w: 120,  h: 20 },

        // Área do Gate (final)
        { x: 5300, y: 500, w: 2700, h: 60 },
        { x: 5500, y: 380, w: 150,  h: 20 },
        { x: 5800, y: 340, w: 150,  h: 20 },
        { x: 6100, y: 380, w: 150,  h: 20 },
    ],

    enemies: [
        // Patrol distribuídos pelo caminho principal
        { x: 200,  y: 450, type: "patrol", left: 50,   right: 580,  speed: 100 },
        { x: 700,  y: 450, type: "patrol", left: 630,  right: 900,  speed: 110 },
        { x: 1100, y: 450, type: "patrol", left: 1030, right: 1430, speed: 100 },
        { x: 1300, y: 330, type: "patrol", left: 1210, right: 1300, speed: 90  },
        { x: 1600, y: 450, type: "patrol", left: 1490, right: 1850, speed: 110 },
        { x: 1700, y: 300, type: "patrol", left: 1610, right: 1700, speed: 90  },
        { x: 2200, y: 450, type: "patrol", left: 2090, right: 2490, speed: 100 },
        { x: 2300, y: 330, type: "patrol", left: 2210, right: 2300, speed: 90  },
        { x: 2650, y: 450, type: "patrol", left: 2550, right: 2950, speed: 110 },
        { x: 2800, y: 300, type: "patrol", left: 2710, right: 2800, speed: 90  },
        { x: 3100, y: 450, type: "patrol", left: 3010, right: 3410, speed: 100 },
        { x: 3200, y: 330, type: "patrol", left: 3110, right: 3200, speed: 90  },
        { x: 3550, y: 450, type: "patrol", left: 3470, right: 3870, speed: 110 },
        { x: 3700, y: 300, type: "patrol", left: 3610, right: 3700, speed: 90  },
        { x: 4000, y: 450, type: "patrol", left: 3930, right: 4330, speed: 100 },
        { x: 4200, y: 330, type: "patrol", left: 4110, right: 4200, speed: 90  },
        { x: 4450, y: 450, type: "patrol", left: 4390, right: 4790, speed: 110 },
        { x: 4700, y: 300, type: "patrol", left: 4610, right: 4700, speed: 90  },
        // Guardas antes do Gate
        { x: 5400, y: 450, type: "patrol", left: 5310, right: 5700, speed: 120 },
        { x: 5700, y: 450, type: "patrol", left: 5510, right: 5900, speed: 120 },
    ],

    // Portal para zona sky — invisível, aparece quando player passa pela área
    portalSky: {
        x: 870,       // alinhado com a plataforma do topo
        y: 200,       // acima da plataforma (y:260)
        width: 60,
        height: 80,
        targetZone: "sky",
        spawnInTarget: { x: 100, y: 420 }, // onde o player aparece no céu
        discoveryRadius: 120,              // raio para revelar o portal
        hidden: true,                      // começa invisível
    },

    // Buraco para zona cave — visível no chão
    portalCave: {
        x: 1880,      // gap entre plataformas (1480+400=1880, próximo começa em 2080)
        y: 560,       // topo do buraco
        width: 200,
        height: 80,   // profundidade do trigger
        targetZone: "cave",
        spawnInTarget: { x: 100, y: 300 },
        hidden: false,                     // sempre visível como abertura escura
    },

    // Gate no final — bloqueia acesso à fase 2
    gate: {
        x: 7600,
        y: 360,
        width: 60,
        height: 200,
    },

    // Boss spawna em frente ao gate quando player se aproxima
    boss: {
        x: 7200,
        y: 410,
        triggerX: 7000, // player passa desse X com gate charged → spawn
    },
};