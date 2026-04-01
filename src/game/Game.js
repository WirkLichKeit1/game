import { resolveAABB }   from "./physics/AABB.js";
import { GameLoop }       from "./engine/GameLoop.js";
import { InputManager }   from "./engine/InputManager";
import { Camera }         from "./engine/Camera.js";
import { Player }         from "./entities/Player.js";
import { ZoneManager }    from "./ZoneManager.js";
import { ParticleSystem } from "./engine/ParticleSystem.js";
import { AudioManager }   from "./engine/AudioManager.js";

const FADE_DURATION = 0.35;

export class Game {
    constructor(canvas, callbacks, levelId = 1) {
        this.canvas    = canvas;
        this.ctx       = canvas.getContext("2d");
        this.callbacks = callbacks;

        this.input     = new InputManager();
        this.particles = new ParticleSystem();
        this.audio     = new AudioManager();

        this.zoneManager = new ZoneManager(canvas.width, canvas.height);

        this._initFromZone();

        this.loop = new GameLoop(
            (delta) => this.update(delta),
            ()      => this.render()
        );

        this._wasOnGround   = false;
        this.messages       = [];
        this.bossDefeated   = false;
        this.bossActive     = false;
        this.bossSpawned    = false;
        this._transition    = null;
        this._portalCooldown = 0; // evita re-trigger imediato apos transicao
    }

    _initFromZone(spawnX, spawnY) {
        const zm = this.zoneManager;
        const sx = spawnX ?? zm.playerStart.x;
        const sy = spawnY ?? zm.playerStart.y;

        this.player     = new Player(sx, sy);
        this.invincible = 0;
        this.camera     = new Camera(zm.worldWidth, zm.worldHeight, this.canvas.width, this.canvas.height);
        this.particles.clear();
        this._wasOnGround = false;

        const { total } = zm.getFlagProgress();
        if (this.callbacks.setFlagTotal) this.callbacks.setFlagTotal(total);
    }

    reset(callbacks, levelId) {
        this.callbacks = { ...this.callbacks, ...callbacks };
        this.zoneManager.resetAll();
        this._initFromZone();
        this.bossActive   = false;
        this.bossDefeated = false;
        this.bossSpawned  = false;
        this.messages        = [];
        this._transition     = null;
        this._portalCooldown = 0;
    }

    start()   { this.loop.start(); }
    stop()    { this.loop.stop(); }
    destroy() {
        this.loop.stop();
        this.input.destroy();
        this.audio.destroy();
    }

    // ─── Transição ──────────────────────────────────────────────────────────────

    _startTransition(targetZone, playerReturnX) {
        if (this._transition) return;
        this._transition = {
            phase: "fade-out",
            alpha: 0,
            targetZone,
            playerReturnX,
        };
    }

    _updateTransition(delta) {
        const t = this._transition;
        if (!t) return;

        if (t.phase === "fade-out") {
            t.alpha = Math.min(1, t.alpha + delta / FADE_DURATION);
            if (t.alpha >= 1) {
                const { spawnX, spawnY } = this.zoneManager.switchTo(t.targetZone, t.playerReturnX);

                this.player.body.x  = spawnX;
                this.player.body.y  = spawnY;
                this.player.body.vx = 0;
                this.player.body.vy = 0;
                // Limpa projéteis ao trocar de zona
                this.player.projectiles = [];

                this.camera = new Camera(
                    this.zoneManager.worldWidth,
                    this.zoneManager.worldHeight,
                    this.canvas.width,
                    this.canvas.height
                );
                this.camera.x = Math.max(0, spawnX - this.canvas.width  / 2);
                this.camera.y = Math.max(0, spawnY - this.canvas.height / 2);
                this.particles.clear();
                t.phase = "fade-in";
            }
        } else {
            t.alpha = Math.max(0, t.alpha - delta / FADE_DURATION);
            if (t.alpha <= 0) {
                this._transition    = null;
                this._portalCooldown = 1.0; // 1s de graca apos chegar numa zona
            }
        }
    }

    // ─── Update ─────────────────────────────────────────────────────────────────

    update(delta) {
        if (this._transition) {
            this._updateTransition(delta);
            return;
        }

        const zm     = this.zoneManager;
        const body   = this.player.body;
        const moving = Math.abs(body.vx) > 10;

        if (this._wasOnGround && !body.onGround && body.vy < 0) {
            this.particles.spawnDust(body.x + body.width / 2, body.y + body.height, zm.theme.platformTop ?? "#c4a882");
            this.audio.jump();
        }
        if (!this._wasOnGround && body.onGround && moving) {
            this.particles.spawnDust(body.x + body.width / 2, body.y + body.height, zm.theme.platformTop ?? "#c4a882");
        }
        this._wasOnGround = body.onGround;

        for (const platform of zm.platforms) {
            platform.updateOpacity(body.x + body.width / 2, body.y + body.height / 2);
        }

        this.player.update(delta, this.input, zm.platforms, zm.worldWidth);
        this.camera.follow(body, delta);
        this.particles.update(delta);

        const playerPos = { x: body.x + body.width / 2, y: body.y + body.height / 2 };

        if (this._portalCooldown > 0) this._portalCooldown -= delta;
        this._updatePortals(delta, body);

        for (const enemy of zm.enemies) {
            enemy.update(delta, zm.platforms, playerPos);
        }

        // Revela bandeira ao matar todos os inimigos da zona lateral
        if (zm.activeId !== "mid" && zm.allEnemiesDefeated()) {
            for (const flag of zm.active.flags) {
                if (flag.hidden) flag.reveal();
            }
        }

        // Bandeiras
        for (const flag of zm.active.flags) {
            flag.update(delta);
            if (!flag.collected && flag.checkCollection(body)) {
                flag.collect();
                this.audio.win();
                this.particles.spawnEnemyPop(flag.x + 25, flag.y + 80, zm.theme.flag);
                this.camera.shake(3, 0.2);
                if (this.callbacks.collectFlag) this.callbacks.collectFlag();

                const { collected, total } = zm.getFlagProgress();
                if (collected === total) this.showMessage("⚠️ GATE ATIVADO! ⚠️", 3);
            }
        }

        // Boss
        const boss = zm.activeId === "mid" ? zm.active.boss : null;
        if (boss && this.bossActive) {
            boss.update(delta, zm.platforms, playerPos);
            if (boss.defeated && !this.bossDefeated) {
                this.bossDefeated = true;
                this.showMessage("BOSS DERROTADO!", 3);
                this.audio.win();
                this.camera.shake(10, 0.5);
            }
        }

        if (this.invincible > 0) this.invincible -= delta;

        this._checkPlayerProjectileHits();
        this._checkEnemyCollisions();
        this._checkProjectileCollisions();
        this._checkBossCollision();
        this._checkFall();
        this._checkWin();

        for (const msg of this.messages) msg.timer -= delta;
        this.messages = this.messages.filter(m => m.timer > 0);
    }

    _updatePortals(delta, playerBody) {
        for (const portal of this.zoneManager.portals) {
            if (portal.state === "hidden") {
                portal.tryReveal(
                    playerBody.x + playerBody.width  / 2,
                    playerBody.y + playerBody.height / 2
                );
            }
            portal.update(delta);

            if (this._portalCooldown <= 0 && portal.checkTrigger(playerBody)) {
                const returnX = playerBody.x + playerBody.width / 2;
                this._startTransition(portal.targetZone, returnX);

                if (this.zoneManager.activeId === "mid") {
                    const destZone = this.zoneManager._zones[portal.targetZone];
                    for (const p of destZone.portals) {
                        if (p.targetZone === "mid") {
                            p.spawnInTarget = { x: returnX, y: 420 };
                        }
                    }
                }
                break;
            }
        }
    }

    // ─── Projéteis do player atingem inimigos / boss ─────────────────────────────

    _checkPlayerProjectileHits() {
        const zm = this.zoneManager;

        for (const proj of this.player.getProjectiles()) {
            if (!proj.alive) continue;
            const pb = proj.bounds;

            // Verifica inimigos
            for (const enemy of zm.enemies) {
                if (!enemy.alive) continue;
                const eb = enemy.body.bounds;

                const hit = !(pb.right  <= eb.left  ||
                              pb.left   >= eb.right ||
                              pb.bottom <= eb.top   ||
                              pb.top    >= eb.bottom);

                if (hit) {
                    proj.alive  = false;
                    enemy.alive = false;
                    this.particles.spawnEnemyPop(
                        enemy.body.x + enemy.body.width  / 2,
                        enemy.body.y + enemy.body.height / 2,
                        enemy.colorBody
                    );
                    this.camera.shake(3, 0.1);
                    this.audio.enemyDie();
                    break;
                }
            }

            if (!proj.alive) continue;

            // Verifica boss
            const boss = zm.activeId === "mid" ? zm.active.boss : null;
            if (boss && this.bossActive && !boss.defeated) {
                const bb = boss.body.bounds;
                const hitBoss = !(pb.right  <= bb.left  ||
                                  pb.left   >= bb.right ||
                                  pb.bottom <= bb.top   ||
                                  pb.top    >= bb.bottom);

                if (hitBoss) {
                    proj.alive = false;
                    const damaged = boss.takeDamage(25); // menos dano que pular em cima
                    if (damaged) {
                        this.particles.spawnEnemyPop(
                            boss.body.x + boss.body.width  / 2,
                            boss.body.y + boss.body.height / 2,
                            zm.theme.bossBody
                        );
                        this.camera.shake(3, 0.15);
                        this.audio.enemyDie();
                    }
                }
            }
        }
    }

    // ─── Colisões ───────────────────────────────────────────────────────────────

    _checkEnemyCollisions() {
        if (this.invincible > 0) return;
        for (const enemy of this.zoneManager.enemies) {
            if (!enemy.alive) continue;
            const col = resolveAABB(this.player.body, enemy.body);
            if (!col) continue;

            const eCX = enemy.body.x + enemy.body.width  / 2;
            const eCY = enemy.body.y + enemy.body.height / 2;

            if (col.axis === "y" && col.direction === "bottom" && this.player.body.vy > 0) {
                enemy.alive = false;
                this.player.body.vy = -500;
                this.particles.spawnEnemyPop(eCX, eCY, enemy.colorBody);
                this.camera.shake(4, 0.15);
                this.audio.enemyDie();
            } else {
                this._playerTakeDamage(25);
            }
        }
    }

    _checkProjectileCollisions() {
        if (this.invincible > 0) return;
        const zm = this.zoneManager;

        for (const enemy of zm.enemies) {
            for (const proj of enemy.getProjectiles()) {
                if (!proj.alive) continue;
                if (resolveAABB(this.player.body, proj.body)) {
                    proj.alive = false;
                    this._playerTakeDamage(15);
                }
            }
        }

        const boss = zm.activeId === "mid" ? zm.active.boss : null;
        if (boss && this.bossActive) {
            for (const proj of boss.getProjectiles()) {
                if (!proj.alive) continue;
                if (resolveAABB(this.player.body, proj.body)) {
                    proj.alive = false;
                    this._playerTakeDamage(20);
                }
            }
        }
    }

    _checkBossCollision() {
        const zm   = this.zoneManager;
        const boss = zm.activeId === "mid" ? zm.active.boss : null;
        if (!boss || !this.bossActive || boss.defeated) return;
        if (this.invincible > 0) return;

        const col = resolveAABB(this.player.body, boss.body);
        if (!col) return;

        if (col.axis === "y" && col.direction === "bottom" && this.player.body.vy > 0) {
            const damaged = boss.takeDamage(50);
            if (damaged) {
                this.player.body.vy = -600;
                this.audio.enemyDie();
                this.camera.shake(6, 0.25);
                this.particles.spawnEnemyPop(
                    boss.body.x + boss.body.width  / 2,
                    boss.body.y + boss.body.height / 2,
                    zm.theme.bossBody
                );
            }
        } else {
            this._playerTakeDamage(30);
        }
    }

    _playerTakeDamage(damage) {
        this.invincible = 1.5;
        this.particles.spawnDamageFlash(
            this.player.body.x + this.player.body.width  / 2,
            this.player.body.y + this.player.body.height / 2
        );
        this.camera.shake(8, 0.35);
        this.audio.damage();

        const start = this.zoneManager.playerStart;
        this.player.body.x  = start.x;
        this.player.body.y  = start.y;
        this.player.body.vx = 0;
        this.player.body.vy = 0;

        if (this.callbacks.takeDamage) this.callbacks.takeDamage(damage);
    }

    _checkFall() {
        if (this._transition) return;
        if (this.player.body.y > this.zoneManager.worldHeight + 100) {
            this.camera.shake(6, 0.25);
            this.audio.damage();
            const start = this.zoneManager.playerStart;
            this.player.body.x  = start.x;
            this.player.body.y  = start.y;
            this.player.body.vx = 0;
            this.player.body.vy = 0;
            if (this.callbacks.onLoseLife) this.callbacks.onLoseLife();
        }
    }

    _checkWin() {
        if (this.zoneManager.activeId !== "mid") return;
        const boss   = this.zoneManager.active.boss;
        const bossOk = !this.bossSpawned || (boss && boss.defeated);
        if (this.player.body.x >= 7600 && bossOk) {
            this.audio.win();
            if (this.callbacks.onWin) this.callbacks.onWin(1);
        }
    }

    showMessage(text, duration = 2) {
        this.messages.push({ text, timer: duration });
    }

    // ─── Render ─────────────────────────────────────────────────────────────────

    render() {
        const { ctx, canvas } = this;
        const zm    = this.zoneManager;
        const theme = zm.theme;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0,   theme.sky);
        grad.addColorStop(0.7, theme.skyBottom ?? theme.sky);
        grad.addColorStop(1,   theme.ground);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this._renderParallax(ctx);

        if (theme.water) {
            ctx.fillStyle = theme.water;
            ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
            if (theme.waterSheen) {
                ctx.fillStyle = theme.waterSheen;
                ctx.fillRect(0, canvas.height - 82, canvas.width, 4);
            }
        }

        this.camera.begin(ctx);

        for (const platform of zm.platforms) platform.render(ctx);
        for (const portal   of zm.portals)   portal.render(ctx);
        for (const flag     of zm.active.flags) flag.render(ctx);

        if (zm.activeId === "mid") this._renderGatePlaceholder(ctx);

        for (const enemy of zm.enemies) enemy.render(ctx);

        const boss = zm.activeId === "mid" ? zm.active.boss : null;
        if (boss && this.bossActive) boss.render(ctx);

        if (this.invincible <= 0 || Math.floor(this.invincible * 8) % 2 === 0) {
            this.player.render(ctx);
        }

        this.particles.render(ctx);
        this.camera.end(ctx);

        this._renderZoneName(ctx);
        this._renderMessages(ctx);

        // Overlay de fade
        if (this._transition && this._transition.alpha > 0) {
            ctx.save();
            ctx.globalAlpha = this._transition.alpha;
            ctx.fillStyle   = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
    }

    _renderParallax(ctx) {
        const W  = this.canvas.width;
        const H  = this.canvas.height;
        const cx = this.camera.x;
        for (const layer of this.zoneManager.parallax) {
            const ox = (cx * layer.speed) % W;
            ctx.save();
            ctx.globalAlpha = layer.alpha ?? 1;
            for (let tile = -1; tile <= 1; tile++) layer.draw(ctx, -ox + tile * W, H);
            ctx.restore();
        }
    }

    _renderGatePlaceholder(ctx) {
        const gateX = 7600;
        const { collected, total } = this.zoneManager.getFlagProgress();
        const charged = total > 0 && collected === total;

        ctx.fillStyle = charged ? "#a060ff" : "#555";
        ctx.fillRect(gateX, 360, 8, 200);
        ctx.strokeStyle = charged ? "#c090ff" : "#666";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(gateX + 4, 360, 60, Math.PI, 0);
        ctx.stroke();

        if (charged) {
            const pulse = 0.4 + Math.sin(Date.now() / 300) * 0.3;
            ctx.save();
            ctx.globalAlpha = pulse;
            ctx.strokeStyle = "#e0b0ff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(gateX + 4, 360, 64, Math.PI, 0);
            ctx.stroke();
            ctx.restore();
        }
    }

    _renderZoneName(ctx) {
        ctx.save();
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.textAlign = "right";
        ctx.fillText(this.zoneManager.data.name, this.canvas.width - 16, 28);
        ctx.restore();
    }

    _renderMessages(ctx) {
        if (this.messages.length === 0) return;
        ctx.save();
        ctx.font = "bold 20px 'Courier New', monospace";
        ctx.textAlign = "center";

        let y = this.canvas.height / 2 - 100;
        for (const msg of this.messages) {
            const alpha = Math.min(1, msg.timer / 0.5);
            ctx.globalAlpha = alpha;
            const tw = ctx.measureText(msg.text).width;
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(this.canvas.width / 2 - tw / 2 - 20, y - 20, tw + 40, 40);
            ctx.strokeStyle = "#000";
            ctx.lineWidth   = 4;
            ctx.strokeText(msg.text, this.canvas.width / 2, y + 5);
            ctx.fillStyle = "#f5c518";
            ctx.fillText(msg.text, this.canvas.width / 2, y + 5);
            y += 50;
        }
        ctx.restore();
    }
}