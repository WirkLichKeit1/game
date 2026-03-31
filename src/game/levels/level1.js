// FASE 1 EXPANDIDA - Praia do Pina
// Mapa 12000px com 3 caminhos distintos e boss final
// Caminho Superior (escondido): bandeira 1
// Caminho Médio (principal): bandeira 2  
// Caminho Inferior (subterrâneo): bandeira 3
// Todas as 3 bandeiras necessárias para enfrentar o boss

export const level1 = {
    id: 1,
    name: "PRAIA DO PINA",
    worldWidth: 12000,
    worldHeight: 560,
    isBossLevel: true,

    theme: {
        sky:        "#1a3a5c",
        skyBottom:  "#2d6080",
        ground:     "#c4a882",
        groundTop:  "#d4b896",
        platform:   "#b89660",
        platformTop:"#c8a870",
        water:      "#1e5878",
        waterSheen: "#2a6888",
        enemy:      "#e05030",
        enemyHead:  "#c04020",
        flag:       "#f5c518",
        projectile: "#ff7f50",
        projectileTrail: "#ffa07a",
        bossBody: "#8b4513",
        bossHead: "#a0522d",
        bossEye: "#ff4500",
    },

    // Chão base em 3 níveis
    platforms: [
        // ══════ INÍCIO ══════
        { x: 0, y: 500, w: 800, h: 60 },

        // ══════ BIFURCAÇÃO (x: 800-1200) ══════
        // Entrada para 3 caminhos
        { x: 850, y: 500, w: 350, h: 60 },

        // Indicadores de caminho (plataformas que levam pra cima/meio/baixo)
        // SUPERIOR: plataformas que sobem
        { x: 1000, y: 450, w: 100, h: 20 },
        { x: 1120, y: 400, w: 100, h: 20 },
        { x: 1240, y: 350, w: 100, h: 20 },
        { x: 1360, y: 300, w: 120, h: 20 },

        // MÉDIO: continua reto
        { x: 1250, y: 500, w: 400, h: 60 },

        // INFERIOR: buraco que leva pra baixo com plataformas
        // (nada aqui, o player cai e encontra plataformas embaixo)

        // ══════ CAMINHO SUPERIOR (x: 1400-4000) ══════
        // Passagem estreita no topo
        { x: 1480, y: 280, w: 200, h: 20 },
        { x: 1720, y: 260, w: 180, h: 20 },
        { x: 1940, y: 240, w: 200, h: 20 },
        { x: 2180, y: 220, w: 180, h: 20 },
        { x: 2400, y: 200, w: 200, h: 20 },
        { x: 2640, y: 220, w: 180, h: 20 },
        { x: 2860, y: 240, w: 200, h: 20 },
        { x: 3100, y: 260, w: 180, h: 20 },
        { x: 3320, y: 280, w: 200, h: 20 },
        { x: 3560, y: 300, w: 180, h: 20 },
        { x: 3780, y: 320, w: 200, h: 20 },
        // Bandeira 1 ao final do caminho superior
        { x: 4020, y: 340, w: 200, h: 20 },
        // Descida de volta
        { x: 4260, y: 380, w: 150, h: 20 },
        { x: 4440, y: 420, w: 150, h: 20 },
        { x: 4620, y: 460, w: 150, h: 20 },

        // ══════ CAMINHO MÉDIO (x: 1650-4600) ══════
        // Caminho principal no meio
        { x: 1700, y: 500, w: 350, h: 60 },
        { x: 2100, y: 500, w: 300, h: 60 },
        { x: 2450, y: 500, w: 350, h: 60 },
        { x: 2850, y: 500, w: 300, h: 60 },
        { x: 3200, y: 500, w: 350, h: 60 },
        { x: 3600, y: 500, w: 300, h: 60 },
        { x: 3950, y: 500, w: 350, h: 60 },
        { x: 4350, y: 500, w: 300, h: 60 },
        // Bandeira 2 no meio do caminho
        { x: 4700, y: 500, w: 200, h: 60 },

        // ══════ CAMINHO INFERIOR (x: 1400-4500) ══════
        // Área "subterrânea" mais abaixo
        { x: 1400, y: 540, w: 300, h: 20 }, // Primeira plataforma após queda
        { x: 1750, y: 540, w: 280, h: 20 },
        { x: 2080, y: 540, w: 300, h: 20 },
        { x: 2430, y: 540, w: 280, h: 20 },
        { x: 2760, y: 540, w: 300, h: 20 },
        { x: 3110, y: 540, w: 280, h: 20 },
        { x: 3440, y: 540, w: 300, h: 20 },
        { x: 3790, y: 540, w: 280, h: 20 },
        { x: 4120, y: 540, w: 300, h: 20 },
        // Bandeira 3 no caminho inferior
        { x: 4470, y: 540, w: 200, h: 20 },
        // Subida de volta
        { x: 4700, y: 520, w: 150, h: 20 },
        { x: 4870, y: 500, w: 150, h: 20 },

        // ══════ REUNIFICAÇÃO (x: 4800-5500) ══════
        // Todos os caminhos convergem aqui
        { x: 5000, y: 500, w: 500, h: 60 },

        // ══════ TRANSIÇÃO PARA BOSS (x: 5500-8000) ══════
        // Caminho até área do boss - mais desafiador
        { x: 5550, y: 500, w: 300, h: 60 },
        { x: 5900, y: 480, w: 250, h: 60 },
        { x: 6200, y: 460, w: 300, h: 60 },
        { x: 6550, y: 440, w: 250, h: 60 },
        { x: 6850, y: 420, w: 300, h: 60 },
        { x: 7200, y: 440, w: 250, h: 60 },
        { x: 7500, y: 460, w: 300, h: 60 },
        { x: 7850, y: 480, w: 250, h: 60 },
        { x: 8150, y: 500, w: 350, h: 60 },

        // ══════ ARENA DO BOSS (x: 8500-11500) ══════
        // Plataforma grande do boss com algumas plataformas flutuantes
        { x: 8550, y: 500, w: 2900, h: 60 }, // Chão principal

        // Plataformas para fugir dos ataques do boss
        { x: 9000, y: 400, w: 200, h: 20 },
        { x: 9400, y: 350, w: 200, h: 20 },
        { x: 9800, y: 400, w: 200, h: 20 },
        { x: 10200, y: 350, w: 200, h: 20 },
        { x: 10600, y: 400, w: 200, h: 20 },
        { x: 11000, y: 350, w: 200, h: 20 },

        // ══════ FINAL (x: 11500-12000) ══════
        // Bandeira final após derrotar boss
        { x: 11500, y: 500, w: 500, h: 60 },
    ],

    // Inimigos distribuídos pelos caminhos
    enemies: [
        // Início - patrol básico
        { x: 300, y: 450, type: "patrol", left: 100, right: 700, speed: 100 },
        { x: 600, y: 450, type: "patrol", left: 100, right: 700, speed: 100 },

        // Caminho Superior - jumpers (mais difícil)
        { x: 1500, y: 230, type: "jumper", left: 1490, right: 1670, speed: 90, jumpCooldown: 1.8 },
        { x: 1850, y: 210, type: "jumper", left: 1730, right: 1900, speed: 90, jumpCooldown: 2 },
        { x: 2200, y: 170, type: "shooter", left: 2190, right: 2380, speed: 70, shootCooldown: 2 },
        { x: 2500, y: 150, type: "jumper", left: 2410, right: 2590, speed: 90, jumpCooldown: 1.8 },
        { x: 2750, y: 190, type: "shooter", left: 2650, right: 2850, speed: 70, shootCooldown: 2.2 },
        { x: 3000, y: 210, type: "jumper", left: 2870, right: 3090, speed: 90, jumpCooldown: 2 },
        { x: 3400, y: 230, type: "shooter", left: 3330, right: 3540, speed: 70, shootCooldown: 2 },
        { x: 3650, y: 250, type: "jumper", left: 3570, right: 3730, speed: 90, jumpCooldown: 1.8 },

        // Caminho Médio - mix de tipos
        { x: 1800, y: 450, type: "patrol", left: 1710, right: 2040, speed: 110 },
        { x: 2200, y: 450, type: "shooter", left: 2110, right: 2390, speed: 80, shootCooldown: 2.5 },
        { x: 2600, y: 450, type: "patrol", left: 2460, right: 2790, speed: 110 },
        { x: 2950, y: 450, type: "jumper", left: 2860, right: 3140, speed: 95, jumpCooldown: 2.2 },
        { x: 3350, y: 450, type: "shooter", left: 3210, right: 3540, speed: 80, shootCooldown: 2.3 },
        { x: 3750, y: 450, type: "patrol", left: 3610, right: 3890, speed: 110 },
        { x: 4100, y: 450, type: "jumper", left: 3960, right: 4290, speed: 95, jumpCooldown: 2 },
        { x: 4450, y: 450, type: "shooter", left: 4360, right: 4640, speed: 80, shootCooldown: 2.5 },

        // Caminho Inferior - patrol rápidos
        { x: 1550, y: 490, type: "patrol", left: 1410, right: 1690, speed: 130 },
        { x: 1900, y: 490, type: "patrol", left: 1760, right: 2020, speed: 130 },
        { x: 2250, y: 490, type: "patrol", left: 2090, right: 2370, speed: 130 },
        { x: 2600, y: 490, type: "patrol", left: 2440, right: 2700, speed: 130 },
        { x: 2950, y: 490, type: "patrol", left: 2770, right: 3050, speed: 130 },
        { x: 3300, y: 490, type: "patrol", left: 3120, right: 3380, speed: 130 },
        { x: 3650, y: 490, type: "patrol", left: 3450, right: 3730, speed: 130 },
        { x: 4000, y: 490, type: "patrol", left: 3800, right: 4110, speed: 130 },
        { x: 4300, y: 490, type: "patrol", left: 4130, right: 4410, speed: 130 },

        // Caminho ao boss - mais difícil
        { x: 5700, y: 450, type: "shooter", left: 5560, right: 5840, speed: 85, shootCooldown: 2 },
        { x: 6050, y: 430, type: "jumper", left: 5910, right: 6140, speed: 100, jumpCooldown: 1.8 },
        { x: 6400, y: 410, type: "shooter", left: 6210, right: 6490, speed: 85, shootCooldown: 1.8 },
        { x: 6750, y: 390, type: "jumper", left: 6560, right: 6840, speed: 100, jumpCooldown: 2 },
        { x: 7050, y: 370, type: "shooter", left: 6860, right: 7140, speed: 85, shootCooldown: 1.8 },
        { x: 7400, y: 390, type: "jumper", left: 7210, right: 7490, speed: 100, jumpCooldown: 1.8 },
        { x: 7700, y: 410, type: "shooter", left: 7510, right: 7790, speed: 85, shootCooldown: 2 },
        { x: 8000, y: 430, type: "jumper", left: 7860, right: 8140, speed: 100, jumpCooldown: 2 },
    ],

    // Bandeiras coletáveis
    flags: [
        { id: 1, x: 4050, y: 280 },  // Fim do caminho superior
        { id: 2, x: 4730, y: 440 },  // Fim do caminho médio
        { id: 3, x: 4500, y: 180 },  // Fim do caminho inferior
    ],

    // Boss aparece após coletar todas as bandeiras
    boss: {
        x: 10000,
        y: 410,
    },

    playerStart: { x: 100, y: 420 },
    flagX: 11750, // Bandeira final após boss
};