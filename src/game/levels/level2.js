// FASE 2 - Capibaribe
// Cenário ribeirinho: rio escuro, mangue, barro, caizes
// Dificuldade: plataformas menores, buracos maiores, mais inimigos

export const level2 = {
    id: 2,
    name: "CAPIBARIBE",
    worldWidth: 6000,
    worldHeight: 560,

    theme: {
        sky:        "#0d1f18",   // noite no mangue
        skyBottom:  "#162e20",   // verde escuro
        ground:     "#3a2e1a",   // barro / lama
        groundTop:  "#4a3a22",   // barro mais claro
        platform:   "#2e3a20",   // raiz / madeira do mangue
        platformTop:"#3a4a28",
        water:      "#0a1e14",   // rio escuro
        waterSheen: "#122a1c",
        enemy:      "#5a8a30",   // lagarto verde
        enemyHead:  "#3a6820",
        flag:       "#d4a030",   // tocha/farol
    },

    // Chão mais fragmentado - ilhas de barro no rio
    platforms: [
        // Ilhas de barro (chão fragmentado - buracos maiores)
        { x: 0,    y: 500, w: 500,  h: 60 },
        { x: 620,  y: 500, w: 420,  h: 60 },
        { x: 1160, y: 500, w: 380,  h: 60 },
        { x: 1660, y: 500, w: 460,  h: 60 },
        { x: 2260, y: 500, w: 420,  h: 60 },
        { x: 2820, y: 500, w: 380,  h: 60 },
        { x: 3340, y: 500, w: 500,  h: 60 },
        { x: 3980, y: 500, w: 420,  h: 60 },
        { x: 4560, y: 500, w: 380,  h: 60 },
        { x: 5100, y: 500, w: 460,  h: 60 },
        { x: 5680, y: 500, w: 320,  h: 60 },

        // Raízes e troncos flutuando - plataformas menores e mais espaçadas
        { x: 100,  y: 390, w: 110, h: 18 },
        { x: 280,  y: 310, w: 100, h: 18 },
        { x: 440,  y: 400, w: 90,  h: 18 },

        { x: 650,  y: 380, w: 100, h: 18 },
        { x: 820,  y: 290, w: 110, h: 18 },
        { x: 990,  y: 380, w: 90,  h: 18 },

        { x: 1180, y: 370, w: 100, h: 18 },
        { x: 1360, y: 270, w: 120, h: 18 },
        { x: 1560, y: 370, w: 90,  h: 18 },

        { x: 1700, y: 380, w: 110, h: 18 },
        { x: 1900, y: 280, w: 100, h: 18 },
        { x: 2090, y: 380, w: 90,  h: 18 },

        { x: 2290, y: 360, w: 100, h: 18 },
        { x: 2470, y: 260, w: 110, h: 18 },
        { x: 2650, y: 360, w: 90,  h: 18 },

        { x: 2850, y: 370, w: 100, h: 18 },
        { x: 3040, y: 260, w: 120, h: 18 },
        { x: 3230, y: 370, w: 90,  h: 18 },

        { x: 3380, y: 360, w: 100, h: 18 },
        { x: 3570, y: 250, w: 110, h: 18 },
        { x: 3760, y: 360, w: 90,  h: 18 },

        { x: 4010, y: 370, w: 100, h: 18 },
        { x: 4200, y: 260, w: 110, h: 18 },
        { x: 4390, y: 360, w: 90,  h: 18 },

        { x: 4590, y: 360, w: 100, h: 18 },
        { x: 4780, y: 250, w: 120, h: 18 },
        { x: 4970, y: 360, w: 90,  h: 18 },

        { x: 5130, y: 370, w: 100, h: 18 },
        { x: 5330, y: 260, w: 110, h: 18 },
        { x: 5530, y: 360, w: 90,  h: 18 },
    ],

    // Inimigos - lagartos e cobras do mangue (mais numerosos)
    enemies: [
        { x: 150,  y: 450, left: 10,   right: 480  },
        { x: 320,  y: 260, left: 290,  right: 370  },
        { x: 670,  y: 450, left: 630,  right: 1060 },
        { x: 860,  y: 240, left: 830,  right: 920  },
        { x: 1200, y: 450, left: 1170, right: 1530 },
        { x: 1400, y: 220, left: 1370, right: 1460 },
        { x: 1720, y: 450, left: 1670, right: 2100 },
        { x: 1940, y: 230, left: 1910, right: 1980 },
        { x: 2310, y: 450, left: 2270, right: 2700 },
        { x: 2510, y: 210, left: 2480, right: 2550 },
        { x: 2870, y: 450, left: 2830, right: 3210 },
        { x: 3080, y: 210, left: 3050, right: 3130 },
        { x: 3400, y: 450, left: 3350, right: 3840 },
        { x: 3610, y: 200, left: 3580, right: 3650 },
        { x: 4030, y: 450, left: 3990, right: 4420 },
        { x: 4240, y: 210, left: 4210, right: 4280 },
        { x: 4610, y: 450, left: 4570, right: 4950 },
        { x: 4820, y: 200, left: 4790, right: 4870 },
        { x: 5150, y: 450, left: 5110, right: 5550 },
        { x: 5370, y: 210, left: 5340, right: 5420 },
    ],

    playerStart: { x: 80, y: 420 },
    flagX: 5870,
};