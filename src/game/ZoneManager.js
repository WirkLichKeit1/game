import { zoneMid }  from "./zones/zoneMid.js";
import { zoneSky }  from "./zones/zoneSky.js";
import { zoneCave } from "./zones/zoneCave.js";
import { Platform }  from "./entities/Platform.js";
import { Enemy }     from "./entities/Enemy.js";
import { Flag }      from "./entities/Flag.js";
import { Boss }      from "./entities/Boss.js";
import { parallaxBeach }    from "./parallax/parallaxBeach.js";
import { parallaxMangrove } from "./parallax/parallaxMangrove.js";

const ZONE_DATA = { mid: zoneMid, sky: zoneSky, cave: zoneCave };

const PARALLAX = {
    mid:  parallaxBeach,
    sky:  null, // parallax próprio do céu — definido inline abaixo
    cave: parallaxMangrove,
};

export class ZoneManager {
    constructor(viewWidth = 800, viewHeight = 560) {
        this.viewWidth  = viewWidth;
        this.viewHeight = viewHeight;

        // Zona ativa atual
        this.activeId = "mid";

        // Onde o player vai retornar em cada zona lateral (X na zona mid)
        // Preenchido quando o player entra numa zona lateral
        this.returnX = { sky: 900, cave: 1980 };

        // Constrói as 3 zonas
        this._zones = {};
        for (const id of ["mid", "sky", "cave"]) {
            this._zones[id] = this._buildZone(id);
        }
    }

    // Zona ativa

    get active() {
        return this._zones[this.activeId];
    }

    get data() {
        return ZONE_DATA[this.activeId];
    }

    // Atalhos usados pelo Game
    get platforms()   { return this.active.platforms; }
    get enemies()     { return this.active.enemies; }
    get flags()       { return this.active.flags; }
    get boss()        { return this.activeId === "mid" ? this.active.boss : null; }
    get theme()       { return this.data.theme; }
    get parallax()    { return this.active.parallax; }
    get worldWidth()  { return this.data.worldWidth; }
    get worldHeight() { return this.data.worldHeight; }
    get playerStart() { return this.data.playerStart; }

    // Troca de zona

    /**
     * Troca para uma zona.
     * @param {string} zoneId  - "mid" | "sky" | "cave"
     * @param {number} returnX - X na zona mid de onde o player veio (só para laterais)
     * @returns {{ spawnX, spawnY }} ponto de spawn do player na nova zona
     */
    switchTo(zoneId, returnX) {
        const prevId = this.activeId;

        // Guarda o X de retorno se estiver saindo da mid
        if (prevId === "mid" && zoneId !== "mid" && returnX !== undefined) {
            this.returnX[zoneId] = returnX;
        }

        this.activeId = zoneId;
        const zoneData = ZONE_DATA[zoneId];

        // Determina ponto de spawn
        let spawnX, spawnY;

        if (zoneId === "mid") {
            // Voltando para mid: usa o X de retorno guardado
            spawnX = this.returnX[prevId] ?? zoneData.playerStart.x;
            spawnY = zoneData.playerStart.y;
        } else {
            // Entrando numa zona lateral: sempre começa do spawn padrão
            const portalSpawn = prevId === "mid"
                ? this._getPortalSpawn(prevId, zoneId)
                : null;
            spawnX = portalSpawn?.x ?? zoneData.playerStart.x;
            spawnY = portalSpawn?.y ?? zoneData.playerStart.y;
        }

        return { spawnX, spawnY };
    }

    _getPortalSpawn(fromZone, toZone) {
        const data = ZONE_DATA[fromZone];
        if (toZone === "sky")  return data.portalSky?.spawnInTarget;
        if (toZone === "cave") return data.portalCave?.spawnInTarget;
        return null;
    }

    // Verificações de estado

    /** Todos os inimigos da zona ativa estão mortos? */
    allEnemiesDefeated() {
        return this.active.enemies.length > 0 &&
               this.active.enemies.every(e => !e.alive);
    }

    /** Todas as bandeiras globais coletadas? (mid + sky + cave) */
    allFlagsCollected() {
        return ["mid", "sky", "cave"].every(id => {
            const zone = this._zones[id];
            return zone.flags.length === 0 || zone.flags.every(f => f.collected);
        });
    }

    /** Contagem global de bandeiras */
    getFlagProgress() {
        let collected = 0;
        let total = 0;
        for (const id of ["mid", "sky", "cave"]) {
            const zone = this._zones[id];
            total     += zone.flags.length;
            collected += zone.flags.filter(f => f.collected).length;
        }
        return { collected, total };
    }

    // Construção de zona

    _buildZone(id) {
        const data = ZONE_DATA[id];

        const platforms = data.platforms.map(p =>
            new Platform(p.x, p.y, p.w, p.h, data.theme, p.opacity ?? 1.0)
        );

        const enemies = (data.enemies ?? []).map(e => {
            const config = {
                patrolLeft:     e.left,
                patrolRight:    e.right,
                speed:          e.speed          ?? 100,
                jumpCooldown:   e.jumpCooldown    ?? 2,
                jumpForce:      e.jumpForce       ?? -600,
                shootCooldown:  e.shootCooldown   ?? 2.5,
                detectionRange: e.detectionRange  ?? 300,
                colorBody:      data.theme.enemy,
                colorHead:      data.theme.enemyHead,
                theme:          data.theme,
            };
            return new Enemy(e.x, e.y, e.type || "patrol", config);
        });

        // Bandeira da zona lateral — começa oculta, aparece quando todos os inimigos morrem
        const flags = [];
        if (data.flagPosition && id !== "mid") {
            const flag = new Flag(data.flagPosition.x, data.flagPosition.y, id, data.theme);
            flag.hidden = true; // começa escondida
            flags.push(flag);
        }

        // Boss (só na mid)
        let boss = null;
        if (id === "mid" && data.boss) {
            boss = new Boss(data.boss.x, data.boss.y, data.theme);
        }

        // Parallax
        const buildParallax = PARALLAX[id];
        const parallax = buildParallax
            ? buildParallax(this.viewWidth)
            : this._buildSkyParallax(this.viewWidth);

        return { platforms, enemies, flags, boss, parallax };
    }

    // Parallax inline para o céu (sem arquivo próprio ainda)
    _buildSkyParallax(W) {
        return [
            {
                speed: 0.05,
                alpha: 0.4,
                draw(ctx, tx, H) {
                    // Estrelas/pontos de luz no céu profundo
                    const stars = [
                        { x: 80,  y: H * 0.15, r: 2 },
                        { x: 200, y: H * 0.08, r: 1 },
                        { x: 340, y: H * 0.20, r: 2 },
                        { x: 480, y: H * 0.10, r: 1 },
                        { x: 620, y: H * 0.18, r: 2 },
                        { x: 720, y: H * 0.06, r: 1 },
                    ];
                    ctx.fillStyle = "#a0c8ff";
                    for (const s of stars) {
                        ctx.beginPath();
                        ctx.arc(tx + s.x, s.y, s.r, 0, Math.PI * 2);
                        ctx.fill();
                    }
                },
            },
            {
                speed: 0.15,
                alpha: 0.25,
                draw(ctx, tx, H) {
                    // Nuvens silhueta
                    const clouds = [
                        { x: 50,  y: H * 0.65, w: 160, h: 24 },
                        { x: 300, y: H * 0.72, w: 120, h: 18 },
                        { x: 550, y: H * 0.68, w: 180, h: 28 },
                        { x: 750, y: H * 0.74, w: 100, h: 16 },
                    ];
                    ctx.fillStyle = "#2040a0";
                    for (const c of clouds) {
                        ctx.fillRect(tx + c.x, c.y, c.w, c.h);
                    }
                },
            },
        ];
    }

    // Reseta uma zona (útil para restart)
    resetZone(id) {
        this._zones[id] = this._buildZone(id);
    }

    resetAll() {
        for (const id of ["mid", "sky", "cave"]) {
            this.resetZone(id);
        }
        this.activeId = "mid";
    }
}