// FASE 1 - Praia do Pina
// Cenário de praia recifense: areia, mar, coqueiros, pôr do sol
// Dificuldade introdutória - plataformas largas, poucos inimigos, buracos simples

export const level1 = {
    id: 1,
    name: "PRAIA DO PINA",
    worldWidth: 6000,
    worldHeight: 560,

    theme: {
        sky:        "#1a3a5c",  // azul-noite do litoral
        skyBottom:  "#2d6080",  // horizonte
        ground:     "#c4a882",  // areia
        groundTop:  "#d4b896",  // areia mais clara no topo
        platform:   "#b89660",  // areia compacta / recife de pedra
        platformTop:"#c8a870",
        water:      "#1e5878",  // mar
        waterSheen: "#2a6888",
        enemy:      "#e05030",  // caranguejo laranja-avermelhado
        enemyHead:  "#c04020",
        flag:       "#f5c518",  // bandeirinha amarela de praia
    },

    // Chão em seções com buracos (água entre elas)
    platforms: [
        // Chão principal em faixas - com "ondas" entre elas
        { x: 0,    y: 500, w: 700,  h: 60 }, // início
        { x: 800,  y: 500, w: 600,  h: 60 },
        { x: 1500, y: 500, w: 500,  h: 60 },
        { x: 2100, y: 500, w: 700,  h: 60 },
        { x: 2900, y: 500, w: 600,  h: 60 },
        { x: 3600, y: 500, w: 550,  h: 60 },
        { x: 4250, y: 500, w: 700,  h: 60 },
        { x: 5050, y: 500, w: 500,  h: 60 },
        { x: 5650, y: 500, w: 350,  h: 60 }, // final

        // Plataformas flutuantes - pedras do recife
        { x: 180,  y: 400, w: 140, h: 18 },
        { x: 420,  y: 330, w: 120, h: 18 },
        { x: 620,  y: 420, w: 100, h: 18 },

        { x: 860,  y: 390, w: 130, h: 18 },
        { x: 1050, y: 300, w: 150, h: 18 },
        { x: 1250, y: 390, w: 100, h: 18 },

        { x: 1560, y: 380, w: 140, h: 18 },
        { x: 1750, y: 290, w: 160, h: 18 },
        { x: 1960, y: 390, w: 110, h: 18 },

        { x: 2160, y: 370, w: 130, h: 18 },
        { x: 2360, y: 280, w: 140, h: 18 },
        { x: 2560, y: 380, w: 120, h: 18 },
        { x: 2750, y: 300, w: 100, h: 18 },

        { x: 2960, y: 400, w: 130, h: 18 },
        { x: 3150, y: 310, w: 150, h: 18 },
        { x: 3380, y: 400, w: 110, h: 18 },

        { x: 3650, y: 390, w: 140, h: 18 },
        { x: 3850, y: 290, w: 160, h: 18 },
        { x: 4080, y: 380, w: 120, h: 18 },

        { x: 4310, y: 370, w: 130, h: 18 },
        { x: 4520, y: 270, w: 150, h: 18 },
        { x: 4730, y: 370, w: 120, h: 18 },
        { x: 4950, y: 290, w: 100, h: 18 },

        { x: 5100, y: 390, w: 140, h: 18 },
        { x: 5300, y: 300, w: 160, h: 18 },
        { x: 5500, y: 400, w: 110, h: 18 },
    ],

    // Inimigos - caranguejos patrulando a praia
    enemies: [
        { x: 300,  y: 450, left: 200,  right: 680  },
        { x: 900,  y: 450, left: 810,  right: 1380 },
        { x: 1100, y: 250, left: 1060, right: 1190 },
        { x: 1600, y: 450, left: 1510, right: 1980 },
        { x: 1800, y: 240, left: 1760, right: 1900 },
        { x: 2200, y: 450, left: 2110, right: 2780 },
        { x: 2400, y: 230, left: 2370, right: 2490 },
        { x: 3000, y: 450, left: 2910, right: 3480 },
        { x: 3200, y: 260, left: 3160, right: 3300 },
        { x: 3700, y: 450, left: 3610, right: 4130 },
        { x: 3900, y: 240, left: 3860, right: 4000 },
        { x: 4350, y: 450, left: 4260, right: 4930 },
        { x: 4550, y: 220, left: 4530, right: 4670 },
        { x: 5150, y: 450, left: 5060, right: 5530 },
        { x: 5350, y: 250, left: 5310, right: 5450 },
    ],

    playerStart: { x: 80, y: 420 },
    flagX: 5880,
};