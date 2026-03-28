// Carrega os dados de uma fase e constrói as entidades do jogo

import { level1 } from "./levels/level1.js";
import { level2 } from "./levels/level2.js";
import { level3 } from "./levels/level3.js";
import { Platform } from "./entities/Platform.js";
import { Enemy } from "./entities/Enemy.js";
import { parallaxBeach } from "./parallax/parallaxBeach.js";
import { parallaxMangrove } from "./parallax/parallaxMangrove.js";
import { parallaxOlinda } from "./parallax/parallaxOlinda.js";

const LEVELS = { 1: level1, 2: level2, 3: level3 };

const PARALLAX = {
    1: parallaxBeach,
    2: parallaxMangrove,
    3: parallaxOlinda,
};

export class LevelManager {
    constructor(levelId = 1) {
        this.load(levelId);
    }

    load(levelId, viewWidth = 800) {
        const data = LEVELS[levelId] ?? LEVELS[1];
        this.data      = data;
        this.theme     = data.theme;
        this.worldWidth  = data.worldWidth;
        this.worldHeight = data.worldHeight;
        this.flagX       = data.flagX;
        this.playerStart = data.playerStart;

        // Constrói plataformas a partir dos dados crus
        this.platforms = data.platforms.map(
            (p) => new Platform(p.x, p.y, p.w, p.h, data.theme)
        );

        // Constrói inimigos - level3 tem speed customizada por inimigo
        this.enemies = data.enemies.map(
            (e) => new Enemy(e.x, e.y, e.left, e.right, e.speed ?? 100, data.theme)
        );

        const buildParallax = PARALLAX[levelId];
        this.parallax = buildParallax ? buildParallax(viewWidth) : [];
    }
}