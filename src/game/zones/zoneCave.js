// ZONA CAVERNA — Subterrâneo
// Inimigos: jumpers apenas
// Bandeira: aparece quando todos os jumpers forem eliminados
// Entrada: cair pelo buraco da zona mid (x=1880–2080)

export const zoneCave = {
    id: "cave",
    name: "CAVERNAS DO PINA",
    worldWidth: 5000,
    worldHeight: 560,

    playerStart: { x: 100, y: 200 }, // cai de cima, spawn mais alto

    theme: {
        sky:             "#0a0a0e",   // teto da caverna — quase preto
        skyBottom:       "#12100a",   // pedra escura
        ground:          "#2a2018",   // pedra/terra
        groundTop:       "#3a3020",   // pedra mais clara
        platform:        "#3a2e1a",   // rocha
        platformTop:     "#4a3e2a",   // rocha iluminada
        water:           "#0a0808",   // lava/água escura no fundo
        waterSheen:      "#3a1008",   // brilho de lava
        enemy:           "#20b070",   // jumper verde bioluminescente
        enemyHead:       "#18804a",
        flag:            "#ff6030",   // bandeira laranja/lava
        projectile:      "#40ff80",
        projectileTrail: "#20a050",
        lava:            "#c83010",   // cor da lava no fundo
        lavaGlow:        "#ff5020",
        stalactite:      "#2a2010",   // estalactites
    },

    platforms: [
        // Chegada (cai do buraco da praia)
        { x: 0,    y: 240, w: 300,  h: 20 }, // primeira plataforma — player cai aqui
        { x: 0,    y: 500, w: 300,  h: 60 }, // chão embaixo da chegada

        // Caminho principal — plataformas irregulares, buracos grandes
        { x: 360,  y: 480, w: 200,  h: 20 },
        { x: 360,  y: 280, w: 120,  h: 16 }, // nível superior
        { x: 640,  y: 440, w: 180,  h: 20 },
        { x: 640,  y: 240, w: 100,  h: 16 },
        { x: 880,  y: 480, w: 200,  h: 20 },
        { x: 880,  y: 300, w: 120,  h: 16 },

        // Seção 1 — dois níveis com jumpers em ambos
        { x: 1140, y: 460, w: 180,  h: 20 },
        { x: 1140, y: 260, w: 100,  h: 16 },
        { x: 1380, y: 480, w: 200,  h: 20 },
        { x: 1380, y: 280, w: 120,  h: 16 },
        { x: 1640, y: 440, w: 180,  h: 20 },
        { x: 1640, y: 240, w: 100,  h: 16 },

        // Seção 2 — passagem baixa (teto de pedra implícito)
        { x: 1880, y: 480, w: 220,  h: 20 },
        { x: 1880, y: 300, w: 140,  h: 16 },
        { x: 2160, y: 460, w: 200,  h: 20 },
        { x: 2160, y: 260, w: 120,  h: 16 },
        { x: 2420, y: 480, w: 200,  h: 20 },
        { x: 2420, y: 300, w: 120,  h: 16 },

        // Seção 3 — trecho difícil, gaps maiores
        { x: 2680, y: 460, w: 160,  h: 20 },
        { x: 2900, y: 420, w: 140,  h: 20 },
        { x: 3100, y: 460, w: 160,  h: 20 },
        { x: 3320, y: 420, w: 140,  h: 20 },
        { x: 3520, y: 460, w: 180,  h: 20 },
        { x: 3520, y: 260, w: 120,  h: 16 },

        // Área final — bandeira aparece aqui
        { x: 3760, y: 460, w: 180,  h: 20 },
        { x: 4000, y: 480, w: 300,  h: 60 }, // plataforma final sólida
        { x: 4000, y: 280, w: 120,  h: 16 },

        // Chão da caverna (fundo com lava)
        { x: 0,    y: 540, w: 5000, h: 20 }, // chão de lava (visual)
    ],

    enemies: [
        // Jumpers nos dois níveis — imprevisíveis
        { x: 80,   y: 190, type: "jumper", left: 10,   right: 290,  speed: 100, jumpCooldown: 2.0, jumpForce: -580 },
        { x: 400,  y: 430, type: "jumper", left: 370,  right: 530,  speed: 110, jumpCooldown: 1.8, jumpForce: -600 },
        { x: 400,  y: 230, type: "jumper", left: 370,  right: 450,  speed: 100, jumpCooldown: 2.2, jumpForce: -560 },
        { x: 660,  y: 390, type: "jumper", left: 650,  right: 810,  speed: 110, jumpCooldown: 1.8, jumpForce: -600 },
        { x: 660,  y: 190, type: "jumper", left: 650,  right: 730,  speed: 100, jumpCooldown: 2.0, jumpForce: -580 },
        { x: 920,  y: 430, type: "jumper", left: 890,  right: 1080, speed: 115, jumpCooldown: 1.8, jumpForce: -620 },
        { x: 920,  y: 250, type: "jumper", left: 890,  right: 990,  speed: 100, jumpCooldown: 2.2, jumpForce: -560 },
        { x: 1180, y: 410, type: "jumper", left: 1150, right: 1360, speed: 110, jumpCooldown: 1.8, jumpForce: -600 },
        { x: 1180, y: 210, type: "jumper", left: 1150, right: 1230, speed: 100, jumpCooldown: 2.0, jumpForce: -580 },
        { x: 1420, y: 430, type: "jumper", left: 1390, right: 1620, speed: 115, jumpCooldown: 1.8, jumpForce: -620 },
        { x: 1420, y: 230, type: "jumper", left: 1390, right: 1490, speed: 105, jumpCooldown: 2.0, jumpForce: -590 },
        { x: 1680, y: 390, type: "jumper", left: 1650, right: 1830, speed: 110, jumpCooldown: 1.8, jumpForce: -600 },
        { x: 1680, y: 190, type: "jumper", left: 1650, right: 1730, speed: 100, jumpCooldown: 2.2, jumpForce: -560 },
        { x: 1920, y: 430, type: "jumper", left: 1890, right: 2100, speed: 115, jumpCooldown: 1.6, jumpForce: -620 },
        { x: 1920, y: 250, type: "jumper", left: 1890, right: 2010, speed: 105, jumpCooldown: 2.0, jumpForce: -590 },
        { x: 2200, y: 410, type: "jumper", left: 2170, right: 2360, speed: 120, jumpCooldown: 1.6, jumpForce: -640 },
        { x: 2200, y: 210, type: "jumper", left: 2170, right: 2270, speed: 105, jumpCooldown: 2.0, jumpForce: -590 },
        { x: 2460, y: 430, type: "jumper", left: 2430, right: 2620, speed: 120, jumpCooldown: 1.6, jumpForce: -640 },
        { x: 2460, y: 250, type: "jumper", left: 2430, right: 2530, speed: 105, jumpCooldown: 2.0, jumpForce: -590 },
        { x: 2720, y: 410, type: "jumper", left: 2690, right: 2840, speed: 120, jumpCooldown: 1.6, jumpForce: -640 },
        { x: 2940, y: 370, type: "jumper", left: 2910, right: 3040, speed: 125, jumpCooldown: 1.6, jumpForce: -650 },
        { x: 3140, y: 410, type: "jumper", left: 3110, right: 3270, speed: 120, jumpCooldown: 1.6, jumpForce: -640 },
        { x: 3360, y: 370, type: "jumper", left: 3330, right: 3460, speed: 125, jumpCooldown: 1.6, jumpForce: -650 },
        { x: 3560, y: 410, type: "jumper", left: 3530, right: 3700, speed: 120, jumpCooldown: 1.6, jumpForce: -640 },
        { x: 3560, y: 210, type: "jumper", left: 3530, right: 3630, speed: 110, jumpCooldown: 2.0, jumpForce: -590 },
        { x: 3800, y: 410, type: "jumper", left: 3770, right: 4000, speed: 125, jumpCooldown: 1.6, jumpForce: -650 },
        { x: 4040, y: 430, type: "jumper", left: 4010, right: 4280, speed: 130, jumpCooldown: 1.4, jumpForce: -660 },
        { x: 4040, y: 230, type: "jumper", left: 4010, right: 4110, speed: 110, jumpCooldown: 2.0, jumpForce: -590 },
    ],

    // Bandeira aparece aqui quando todos os jumpers forem eliminados
    flagPosition: { x: 4060, y: 300 },

    // Portal de retorno para mid — sempre ativo
    portalReturn: {
        x: 20,
        y: 140,
        width: 60,
        height: 100,
        targetZone: "mid",
        // returnX preenchido dinamicamente
    },
};