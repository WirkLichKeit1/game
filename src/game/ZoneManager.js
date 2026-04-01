import { zoneMid }  from "./zones/zoneMid.js";
import { zoneSky }  from "./zones/zoneSky.js";
import { zoneCave } from "./zones/zoneCave.js";
import { Platform }  from "./entities/Platform.js";
import { Enemy }     from "./entities/Enemy.js";
import { Flag }      from "./entities/Flag.js";
import { Boss }      from "./entities/Boss.js";
import { Portal }    from "./entities/Portal.js";
import { parallaxBeach }    from "./parallax/parallaxBeach.js";
import { parallaxMangrove } from "./parallax/parallaxMangrove.js";

const ZONE_DATA = { mid: zoneMid, sky: zoneSky, cave: zoneCave };

const PARALLAX = {
    mid:  parallaxBeach,
    sky:  null,
    cave: parallaxMangrove,
};

export class ZoneManager {
    constructor(viewWidth = 800, viewHeight = 560) {
        this.viewWidth  = viewWidth;
        this.viewHeight = viewHeight;
        this.activeId   = "mid";

        // X de retorno na zona mid quando o player veio de uma lateral
        this.returnX = { sky: 900, cave: 1980 };

        this._zones = {};
        for (const id of ["mid", "sky", "cave"]) {
            this._zones[id] = this._buildZone(id);
        }
    }

    // ─── Zona ativa ────────────────────────────────────────────────────────────

    get active()      { return this._zones[this.activeId]; }
    get data()        { return ZONE_DATA[this.activeId]; }

    get platforms()   { return this.active.platforms; }
    get enemies()     { return this.active.enemies; }
    get flags()       { return this.active.flags; }
    get portals()     { return this.active.portals; }
    get boss()        { return this.activeId === "mid" ? this.active.boss : null; }
    get theme()       { return this.data.theme; }
    get parallax()    { return this.active.parallax; }
    get worldWidth()  { return this.data.worldWidth; }
    get worldHeight() { return this.data.worldHeight; }
    get playerStart() { return this.data.playerStart; }

    // ─── Troca de zona ─────────────────────────────────────────────────────────

    /**
     * Troca para outra zona.
     * @param {string} zoneId   - zona destino
     * @param {number} returnX  - X atual do player na mid (guardado para retorno)
     * @returns {{ spawnX, spawnY }}
     */
    switchTo(zoneId, returnX) {
        const prevId = this.activeId;

        // Guarda X de retorno ao sair da mid
        if (prevId === "mid" && zoneId !== "mid" && returnX !== undefined) {
            this.returnX[zoneId] = returnX;

            // Atualiza o X de retorno no portal de retorno da zona destino
            const destZone = this._zones[zoneId];
            for (const portal of destZone.portals) {
                if (portal.targetZone === "mid") {
                    portal._returnX = returnX;
                }
            }
        }

        this.activeId = zoneId;

        let spawnX, spawnY;

        if (zoneId === "mid") {
            let rawX = this.returnX[prevId] ?? ZONE_DATA["mid"].playerStart.x;

            // Ao voltar da cave, empurra o spawn para DEPOIS do buraco
            // para o player nao cair de volta nele imediatamente
            if (prevId === "cave") {
                const hole = ZONE_DATA["mid"].portalCave;
                if (hole && rawX >= hole.x && rawX <= hole.x + hole.width) {
                    rawX = hole.x + hole.width + 60;
                }
            }

            spawnX = rawX;
            spawnY = ZONE_DATA["mid"].playerStart.y;
        } else {
            // Entra numa lateral: spawn fixo da zona
            const spawn = this._getPortalSpawn(prevId, zoneId);
            spawnX = spawn?.x ?? ZONE_DATA[zoneId].playerStart.x;
            spawnY = spawn?.y ?? ZONE_DATA[zoneId].playerStart.y;
        }

        return { spawnX, spawnY };
    }

    _getPortalSpawn(fromZone, toZone) {
        const data = ZONE_DATA[fromZone];
        if (toZone === "sky")  return data.portalSky?.spawnInTarget;
        if (toZone === "cave") return data.portalCave?.spawnInTarget;
        return null;
    }

    // ─── Verificações ──────────────────────────────────────────────────────────

    allEnemiesDefeated() {
        return this.active.enemies.length > 0 &&
               this.active.enemies.every(e => !e.alive);
    }

    allFlagsCollected() {
        return ["sky", "cave"].every(id => {
            const zone = this._zones[id];
            return zone.flags.length === 0 || zone.flags.every(f => f.collected);
        });
    }

    getFlagProgress() {
        let collected = 0, total = 0;
        for (const id of ["sky", "cave"]) {
            const zone = this._zones[id];
            total     += zone.flags.length;
            collected += zone.flags.filter(f => f.collected).length;
        }
        return { collected, total };
    }

    // ─── Build ─────────────────────────────────────────────────────────────────

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

        // Bandeiras — só nas laterais, começam escondidas
        const flags = [];
        if (data.flagPosition && id !== "mid") {
            const flag = new Flag(data.flagPosition.x, data.flagPosition.y, id, data.theme);
            flag.hidden = true;
            flags.push(flag);
        }

        // Boss (só na mid)
        let boss = null;
        if (id === "mid" && data.boss) {
            boss = new Boss(data.boss.x, data.boss.y, data.theme);
        }

        // Portais
        const portals = this._buildPortals(id, data);

        const buildParallax = PARALLAX[id];
        const parallax = buildParallax
            ? buildParallax(this.viewWidth)
            : this._buildSkyParallax(this.viewWidth);

        return { platforms, enemies, flags, boss, portals, parallax };
    }

    _buildPortals(id, data) {
        const portals = [];

        if (id === "mid") {
            // Portal sky — invisível, aparece quando player se aproxima
            if (data.portalSky) {
                const ps = data.portalSky;
                portals.push(new Portal({
                    x: ps.x, y: ps.y,
                    width: ps.width, height: ps.height,
                    targetZone: "sky",
                    spawnInTarget: ps.spawnInTarget,
                    discoveryRadius: ps.discoveryRadius ?? 120,
                    hidden: true,
                    color:     "#4040ff",
                    glowColor: "#8080ff",
                }));
            }

            // Buraco cave — sempre visível, visual de abertura no chão
            if (data.portalCave) {
                const pc = data.portalCave;
                portals.push(new Portal({
                    x: pc.x, y: pc.y,
                    width: pc.width, height: pc.height,
                    targetZone: "cave",
                    spawnInTarget: pc.spawnInTarget,
                    hidden: false,
                    isCaveHole: true,
                }));
            }
        } else {
            // Zonas laterais: portal de retorno para mid, sempre ativo
            if (data.portalReturn) {
                const pr = data.portalReturn;
                portals.push(new Portal({
                    x: pr.x, y: pr.y,
                    width: pr.width ?? 60, height: pr.height ?? 100,
                    targetZone: "mid",
                    spawnInTarget: { x: this.returnX[id], y: 420 },
                    hidden: false,
                    color:     "#40c040",
                    glowColor: "#80ff80",
                }));
            }
        }

        return portals;
    }

    _buildSkyParallax(W) {
        return [
            {
                speed: 0.05,
                alpha: 0.4,
                draw(ctx, tx, H) {
                    const stars = [
                        { x: 80,  y: H * 0.15, r: 2 }, { x: 200, y: H * 0.08, r: 1 },
                        { x: 340, y: H * 0.20, r: 2 }, { x: 480, y: H * 0.10, r: 1 },
                        { x: 620, y: H * 0.18, r: 2 }, { x: 720, y: H * 0.06, r: 1 },
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
                    const clouds = [
                        { x: 50,  y: H * 0.65, w: 160, h: 24 },
                        { x: 300, y: H * 0.72, w: 120, h: 18 },
                        { x: 550, y: H * 0.68, w: 180, h: 28 },
                        { x: 750, y: H * 0.74, w: 100, h: 16 },
                    ];
                    ctx.fillStyle = "#2040a0";
                    for (const c of clouds) ctx.fillRect(tx + c.x, c.y, c.w, c.h);
                },
            },
        ];
    }

    resetZone(id) { this._zones[id] = this._buildZone(id); }

    resetAll() {
        for (const id of ["mid", "sky", "cave"]) this.resetZone(id);
        this.activeId = "mid";
    }
}