// Carrega os dados de uma fase e constrói as entidades do jogo

import { level1 } from "./levels/level1.js";
import { level2 } from "./levels/level2.js";
import { level3 } from "./levels/level3.js";
import { Platform } from "./entities/Platform.js";
import { Enemy } from "./entities/Enemy.js";
import { Flag } from "./entities/Flag.js";
import { Boss } from "./entities/Boss.js";
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
        this.isBossLevel = data.isBossLevel ?? false;

        // plataformas
        this.platforms = data.platforms.map(
            (p) => new Platform(p.x, p.y, p.w, p.h, data.theme)
        );

        // inimigos
        this.enemies = [];
        if (data.enemies) {
            for (const e of data.enemies) {
                const config = {
                    patrolLeft: e.left,
                    patrolRight: e.right,
                    speed: e.speed ?? 100,
                    jumpCooldown: e.jumpCooldown ?? 2,
                    jumpForce: e.jumpForce ?? -600,
                    shootCooldown: e.shootCooldown ?? 2.5,
                    detectionRange: e.detectionRange ?? 300,
                    colorBody: data.theme.enemy,
                    colorHead: data.theme.enemyHead,
                    theme: data.theme,
                };
                const enemy = new Enemy(e.x, e.y, e.type || "patrol", config);
                this.enemies.push(enemy);
            }
        }

        // Bandeiras coletáveis
        this.flags = [];
        if (data.flags) {
            for (const f of data.flags) {
                const flag = new Flag(f.x, f.y, f.id, data.theme);
                this.flags.push(flag);
            }
        }

        // Boss
        this.boss = null;
        if (data.boss) {
            this.boss = new Boss(data.boss.x, data.boss.y, data.theme);
            this.bossSpawned = false; // Controla quando o boss aparece
        }

        // Parallax
        const buildParallax = PARALLAX[levelId];
        this.parallax = buildParallax ? buildParallax(viewWidth) : [];
    }

    // Verifica se todas as bandeiras foram coletadas
    allFlagsCollected() {
        return this.flags.length > 0 && this.flags.every(f => f.collected);
    }

    // Retorna número de bandeiras coletadas
    getFlagProgress() {
        const collected = this.flags.filter(f => f.collected).length;
        return { collected, total: this.flags.length };
    }
}