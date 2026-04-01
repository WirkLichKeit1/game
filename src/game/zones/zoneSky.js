// ZONA CÉU — Acima das nuvens
// Inimigos: shooters apenas
// Bandeira: aparece quando todos os shooters forem eliminados
// Plataformas: alpha baixo à distância, sobem para 1 quando player se aproxima

export const zoneSky = {
    id: "sky",
    name: "ACIMA DAS NUVENS",
    worldWidth: 5000,
    worldHeight: 560,

    playerStart: { x: 100, y: 420 },

    theme: {
        sky:             "#0a1628",   // azul muito escuro (acima das nuvens, noite/altitude)
        skyBottom:       "#1a3a6e",   // azul profundo
        ground:          "#c8d8f0",   // "nuvem" como chão
        groundTop:       "#dce8f8",
        platform:        "#b0c4e0",   // plataformas de nuvem/gelo
        platformTop:     "#d0e4f8",
        water:           "#0a1628",   // sem água — fundo é o vazio do céu
        waterSheen:      "#1a2a50",
        enemy:           "#e8a020",   // atirador dourado
        enemyHead:       "#c88010",
        flag:            "#40c8ff",   // bandeira azul celeste
        projectile:      "#ffe060",
        projectileTrail: "#ffa020",
        parallaxSky:     "#0d1f3c",
    },

    // Plataformas discretas — o player precisa explorar para achar o caminho
    // Algumas ficam semi-transparentes (controlado no render pelo ZoneManager)
    platforms: [
        // Chegada (portal vindo da praia)
        { x: 0,    y: 480, w: 300,  h: 20, opacity: 1.0 },   // plataforma de chegada, sempre visível

        // Caminho inicial — espaçado mas encontrável
        { x: 360,  y: 440, w: 100,  h: 16, opacity: 0.2 },
        { x: 520,  y: 390, w: 100,  h: 16, opacity: 0.2 },
        { x: 680,  y: 350, w: 120,  h: 16, opacity: 0.2 },
        { x: 860,  y: 400, w: 100,  h: 16, opacity: 0.2 },

        // Seção 1 — zig-zag
        { x: 1020, y: 350, w: 120,  h: 16, opacity: 0.2 },
        { x: 1200, y: 300, w: 100,  h: 16, opacity: 0.2 },
        { x: 1360, y: 360, w: 100,  h: 16, opacity: 0.2 },
        { x: 1520, y: 420, w: 120,  h: 16, opacity: 0.2 },
        { x: 1700, y: 370, w: 100,  h: 16, opacity: 0.2 },

        // Seção 2 — subida longa
        { x: 1860, y: 320, w: 100,  h: 16, opacity: 0.2 },
        { x: 2020, y: 270, w: 120,  h: 16, opacity: 0.2 },
        { x: 2200, y: 230, w: 100,  h: 16, opacity: 0.2 },
        { x: 2380, y: 280, w: 100,  h: 16, opacity: 0.2 },
        { x: 2540, y: 340, w: 120,  h: 16, opacity: 0.2 },

        // Seção 3 — trecho difícil (gaps maiores)
        { x: 2760, y: 290, w: 90,   h: 16, opacity: 0.2 },
        { x: 2940, y: 240, w: 90,   h: 16, opacity: 0.2 },
        { x: 3120, y: 300, w: 90,   h: 16, opacity: 0.2 },
        { x: 3300, y: 360, w: 100,  h: 16, opacity: 0.2 },
        { x: 3480, y: 310, w: 100,  h: 16, opacity: 0.2 },

        // Área final — bandeira aparece aqui
        { x: 3700, y: 380, w: 200,  h: 16, opacity: 0.2 },
        { x: 3960, y: 420, w: 300,  h: 20, opacity: 1.0 }, // plataforma final, sempre visível

        // Portal de retorno (perto do início, sempre visível após entrar)
        { x: 50,   y: 440, w: 60,   h: 10, opacity: 0.0 }, // base do portal (invisible helper)
    ],

    enemies: [
        // Shooters distribuídos — cada um em sua plataforma
        { x: 400,  y: 390, type: "shooter", left: 370,  right: 450,  speed: 40, shootCooldown: 2.5, detectionRange: 350 },
        { x: 550,  y: 340, type: "shooter", left: 530,  right: 610,  speed: 40, shootCooldown: 2.5, detectionRange: 350 },
        { x: 720,  y: 300, type: "shooter", left: 690,  right: 770,  speed: 40, shootCooldown: 2.2, detectionRange: 380 },
        { x: 890,  y: 350, type: "shooter", left: 870,  right: 950,  speed: 40, shootCooldown: 2.5, detectionRange: 350 },
        { x: 1060, y: 300, type: "shooter", left: 1030, right: 1130, speed: 40, shootCooldown: 2.2, detectionRange: 380 },
        { x: 1230, y: 250, type: "shooter", left: 1210, right: 1290, speed: 40, shootCooldown: 2.0, detectionRange: 400 },
        { x: 1400, y: 310, type: "shooter", left: 1370, right: 1450, speed: 40, shootCooldown: 2.2, detectionRange: 380 },
        { x: 1560, y: 370, type: "shooter", left: 1530, right: 1610, speed: 40, shootCooldown: 2.5, detectionRange: 350 },
        { x: 1730, y: 320, type: "shooter", left: 1710, right: 1790, speed: 40, shootCooldown: 2.2, detectionRange: 380 },
        { x: 1900, y: 270, type: "shooter", left: 1870, right: 1950, speed: 40, shootCooldown: 2.0, detectionRange: 400 },
        { x: 2060, y: 220, type: "shooter", left: 2030, right: 2110, speed: 40, shootCooldown: 2.0, detectionRange: 400 },
        { x: 2240, y: 180, type: "shooter", left: 2210, right: 2290, speed: 40, shootCooldown: 1.8, detectionRange: 420 },
        { x: 2420, y: 230, type: "shooter", left: 2390, right: 2470, speed: 40, shootCooldown: 2.0, detectionRange: 400 },
        { x: 2580, y: 290, type: "shooter", left: 2550, right: 2630, speed: 40, shootCooldown: 2.2, detectionRange: 380 },
        { x: 2800, y: 240, type: "shooter", left: 2770, right: 2840, speed: 40, shootCooldown: 2.0, detectionRange: 400 },
        { x: 2980, y: 190, type: "shooter", left: 2950, right: 3020, speed: 40, shootCooldown: 1.8, detectionRange: 420 },
        { x: 3160, y: 250, type: "shooter", left: 3130, right: 3200, speed: 40, shootCooldown: 2.0, detectionRange: 400 },
        { x: 3340, y: 310, type: "shooter", left: 3310, right: 3390, speed: 40, shootCooldown: 2.2, detectionRange: 380 },
        { x: 3520, y: 260, type: "shooter", left: 3490, right: 3570, speed: 40, shootCooldown: 2.0, detectionRange: 400 },
        { x: 3750, y: 330, type: "shooter", left: 3710, right: 3890, speed: 40, shootCooldown: 1.8, detectionRange: 420 },
    ],

    // Bandeira aparece aqui quando todos os inimigos forem mortos
    flagPosition: { x: 3980, y: 340 },

    // Portal de retorno para mid — sempre ativo, aparece ao entrar na zona
    portalReturn: {
        x: 20,
        y: 380,
        width: 60,
        height: 100,
        targetZone: "mid",
        // returnX é preenchido dinamicamente pelo ZoneManager quando player entra
    },
};