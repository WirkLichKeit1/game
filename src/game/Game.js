import { resolveAABB }  from "./physics/AABB.js";
import { GameLoop }     from "./engine/GameLoop.js";
import { InputManager } from "./engine/InputManager";
import { Camera }       from "./engine/Camera.js";
import { Player }       from "./entities/Player.js";
import { LevelManager } from "./LevelManager.js";
import { ParticleSystem } from "./engine/ParticleSystem.js";
import { AudioManager } from "./engine/AudioManager.js";

export class Game {
    constructor(canvas, callbacks, levelId = 1) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.callbacks = callbacks;
        this.input = new InputManager();
        this.particles = new ParticleSystem();
        this.audio = new AudioManager();

        this.levelManager = new LevelManager(levelId);
        this._applyLevel();

        this.loop = new GameLoop(
            (delta) => this.update(delta),
            ()      => this.render()
        );

        this._wasOnGround = false;

        // Mensagens temporárias na tela
        this.messages = [];
    }

    _applyLevel() {
        const lm = this.levelManager;
        this.platforms = lm.platforms;
        this.enemies = lm.enemies;
        this.flags = lm.flags;
        this.boss = lm.boss;
        this.bossActive = false; // Boss só aparece após coletar bandeiras
        this.flagX = lm.flagX;
        this.theme = lm.theme;
        this.parallax = lm.parallax;
        this.WORLD_WIDTH = lm.worldWidth;
        this.WORLD_HEIGHT = lm.worldHeight;

        this.player = new Player(lm.playerStart.x, lm.playerStart.y);
        this.invincible = 0;
        this.camera = new Camera(
            this.WORLD_WIDTH,
            this.WORLD_HEIGHT,
            this.canvas.width,
            this.canvas.height
        );
        this.particles.clear();
        this._wasOnGround = false;

        // Atualiza contador de bandeiras no callback
        if (this.callbacks.setFlagTotal) {
            this.callbacks.setFlagTotal(this.flags.length);
        }
    }

    reset(callbacks, levelId) {
        this.callbacks = { ...this.callbacks, ...callbacks };
        if (levelId !== undefined) {
            this.levelManager.load(levelId, this.canvas.width);
        }
        this._applyLevel();
        this.bossActive = false;
        this.messages = [];
    }

    start() { this.loop.start(); }
    stop() { this.loop.stop(); }
    destroy() {
        this.loop.stop();
        this.input.destroy();
        this.audio.destroy();
    }

    update(delta) {
        const body = this.player.body;
        const moving = Math.abs(body.vx) > 10;

        // Pó ao pular/aterrissar
        if (this._wasOnGround && !body.onGround && body.vy < 0) {
            this.particles.spawnDust(
                body.x + body.width / 2,
                body.y + body.height,
                this.theme.platformTop ?? "#c4a882"
            );
            this.audio.jump();
        }
        if (!this._wasOnGround && body.onGround && moving) {
            this.particles.spawnDust(
                body.x + body.width / 2,
                body.y + body.height,
                this.theme.platformTop ?? "#c4a882"
            );
        }
        this._wasOnGround = body.onGround;

        this.player.update(delta, this.input, this.platforms, this.WORLD_WIDTH);
        this.camera.follow(body, delta);
        this.particles.update(delta);

        // Atualiza inimigos complexos
        const playerPos = { x: body.x + body.width / 2, y: body.y + body.height / 2 };
        for (const enemy of this.enemies) {
            enemy.update(delta, this.platforms, playerPos);
        }

        // Atualiza bandeiras
        for (const flag of this.flags) {
            flag.update(delta);

            if (!flag.collected && flag.checkCollection(body)) {
                flag.collect();
                this.audio.win(); // Som de coleta
                this.particles.spawnEnemyPop(
                    flag.x + 25,
                    flag.y + 80,
                    this.theme.flag
                );
                this.camera.shake(3, 0.2);
                if (this.callbacks.collectFlag) {
                    this.callbacks.collectFlag();
                }

                // Verifica se coletou todas
                if (this.levelManager.allFlagsCollected() && this.boss && !this.bossActive) {
                    this.bossActive = true;
                    this.showMessage("⚠️ BOSS APARECEU! ⚠️", 3);
                }
            }
        }

        // Atualiza boss (se ativo)
        if (this.boss && this.bossActive) {
            this.boss.update(delta, this.platforms, playerPos);

            // Verifica se boss foi derrotado
            if (this.boss.defeated && !this.bossDefeated) {
                this.bossDefeated = true;
                this.showMessage("BOSS DERROTADO!", 3);
                this.audio.win();
                this.camera.shake(10, 0.5);
            }
        }

        if (this.invincible > 0) this.invincible -= delta;

        this._checkEnemyCollisions();
        this._checkProjectileCollisions();
        this._checkBossCollision();
        this._checkFall();
        this._checkWin();

        // Atualiza mensagens
        for (const msg of this.messages) {
            msg.timer -= delta;
        }
        this.messages = this.messages.filter(m => m.timer > 0);
    }

    _checkEnemyCollisions() {
        if (this.invincible > 0) return;

        for (const enemy of this.enemies) {
            if (!enemy.alive) continue;
            const col = resolveAABB(this.player.body, enemy.body);
            if (!col) continue;

            const eCX = enemy.body.x + enemy.body.width / 2;
            const eCY = enemy.body.y + enemy.body.height / 2;

            if (col.axis === "y" && col.direction === "bottom" && this.player.body.vy > 0) {
                // Pisou no inimigo
                enemy.alive = false;
                this.player.body.vy = -500;
                this.particles.spawnEnemyPop(eCX, eCY, enemy.colorBody);
                this.camera.shake(4, 0.15);
                this.audio.enemyDie();
            } else {
                // Tomou dano
                this._playerTakeDamage(25);
            }
        }
    }

    _checkProjectileCollisions() {
        if (this.invincible > 0) return;

        // Projéteis dos inimigos
        for (const enemy of this.enemies) {
            for (const proj of enemy.getProjectiles()) {
                if (!proj.alive) continue;

                const col = resolveAABB(this.player.body, proj.body);
                if (col) {
                    proj.alive = false;
                    this._playerTakeDamage(15);
                    this.particles.spawnDamageFlash(
                        this.player.body.x + this.player.body.width / 2,
                        this.player.body.y + this.player.body.height / 2
                    );
                }
            }
        }

        // Projéteis do boss
        if (this.boss && this.bossActive) {
            for (const proj of this.boss.getProjectiles()) {
                if (!proj.alive) continue;

                const col = resolveAABB(this.player.body, proj.body);
                if (col) {
                    proj.alive = false;
                    this._playerTakeDamage(20);
                    this.particles.spawnDamageFlash(
                        this.player.body.x + this.player.body.width / 2,
                        this.player.body.y + this.player.body.height / 2
                    );
                }
            }
        }
    }

    _checkBossCollision() {
        if (!this.boss || !this.bossActive || this.boss.defeated) return;
        if (this.invincible > 0) return;

        const col = resolveAABB(this.player.body, this.boss.body);
        if (!col) return;

        // Verifica se pulou em cima do boss
        if (col.axis === "y" && col.direction === "bottom" && this.player.body.vy > 0) {
            // Atacou o boss
            const damaged = this.boss.takeDamage(50);
            if (damaged) {
                this.player.body.vy = -600;
                this.audio.enemyDie();
                this.camera.shake(6, 0.25);
                this.particles.spawnEnemyPop(
                    this.boss.body.x + this.boss.body.width / 2,
                    this.boss.body.y + this.boss.body.height / 2,
                    this.theme.bossBody
                );
            }
        } else {
            // Tomou dano do boss (toque lateral)
            this._playerTakeDamage(30);
        }
    }

    _playerTakeDamage(damage) {
        this.invincible = 1.5;
        this.particles.spawnDamageFlash(
            this.player.body.x + this.player.body.width / 2,
            this.player.body.y + this.player.body.height / 2
        );
        this.camera.shake(8, 0.35);
        this.audio.damage();

        // Reposiciona player
        const start = this.levelManager.playerStart;
        this.player.body.x = start.x;
        this.player.body.y = start.y;
        this.player.body.vx = 0;
        this.player.body.vy = 0;

        if (this.callbacks.takeDamage) {
            this.callbacks.takeDamage(damage);
        }
    }

    _checkFall() {
        if (this.player.body.y > this.WORLD_HEIGHT + 100) {
            this.camera.shake(6, 0.25);
            this.audio.damage();
            const start = this.levelManager.playerStart;
            this.player.body.x = start.x;
            this.player.body.y = start.y;
            this.player.body.vx = 0;
            this.player.body.vy = 0;
            this.callbacks.loseLife();
        }
    }

    _checkWin() {
        // Só vence se derrotou o boss (se tiver) ou chegou na bandeira final
        const reachedFlag = this.player.body.x >= this.flagX;
        const bossCondition = !this.boss || (this.boss && this.boss.defeated);

        if (reachedFlag && bossCondition) {
            this.audio.win();
            this.callbacks.onWin(this.levelManager.data.id);
        }
    }

    showMessage(text, duration = 2) {
        this.messages.push({ text, timer: duration });
    }

    render() {
        const { ctx, canvas, theme } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Gradiente de céu
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, theme.sky);
        grad.addColorStop(0.7, theme.skyBottom ?? theme.sky);
        grad.addColorStop(1, theme.ground);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this._renderParallax(ctx);

        // Água
        if (theme.water) {
            ctx.fillStyle = theme.water;
            ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
            if (theme.waterSheen) {
                ctx.fillStyle = theme.waterSheen;
                ctx.fillRect(0, canvas.height - 82, canvas.width, 4);
            }
        }

        this.camera.begin(ctx);

        // Renderiza elementos do mundo
        for (const platform of this.platforms) {
            platform.render(ctx);
        }

        // Bandeiras
        for (const flag of this.flags) {
            flag.render(ctx);
        }

        this._renderFlag(ctx);

        // Inimigos
        for (const enemy of this.enemies) {
            enemy.render(ctx);
        }

        // Boss (se ativo)
        if (this.boss && this.bossActive) {
            this.boss.render(ctx);
        }

        // Player (pisca quando invencível)
        if (this.invincible <= 0 || Math.floor(this.invincible * 8) % 2 === 0) {
            this.player.render(ctx);
        }

        this.particles.render(ctx);

        this.camera.end(ctx);

        // Nome da fase
        this._renderLevelName(ctx);

        // Mensagens temporárias
        this._renderMessages(ctx);
    }

    _renderParallax(ctx) {
        const W = this.canvas.width;
        const H = this.canvas.height;
        const cx = this.camera.x;

        for (const layer of this.parallax) {
            const ox = (cx * layer.speed) % W;
            ctx.save();
            ctx.globalAlpha = layer.alpha ?? 1;
            for (let tile = -1; tile <= 1; tile++) {
                layer.draw(ctx, -ox + tile * W, H);
            }
            ctx.restore();
        }
    }

    _renderFlag(ctx) {
        ctx.fillStyle = "#888";
        ctx.fillRect(this.flagX, 360, 6, 160);

        ctx.fillStyle = this.theme.flag ?? "#f1c40f";
        ctx.beginPath();
        ctx.moveTo(this.flagX + 6,  360);
        ctx.lineTo(this.flagX + 46, 380);
        ctx.lineTo(this.flagX + 6,  400);
        ctx.fill();
    }

    _renderLevelName(ctx) {
        const name = this.levelManager.data.name;
        ctx.save();
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.textAlign = "right";
        ctx.fillText(name, this.canvas.width - 16, 28);
        ctx.restore();
    }

    _renderMessages(ctx) {
        if (this.messages.length === 0) return;

        ctx.save();
        ctx.font = "bold 20px 'Courier New', monospace";
        ctx.textAlign = "center";

        let y = this.canvas.height / 2 - 100;
        for (const msg of this.messages) {
            const alpha = Math.min(1, msg.timer / 0.5); // Fade in nos primeiros 0.5s
            ctx.globalAlpha = alpha;

            // Fundo
            const textWidth = ctx.measureText(msg.text).width;
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(
                this.canvas.width / 2 - textWidth / 2 - 20,
                y - 20,
                textWidth + 40,
                40
            );

            // Texto
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 4;
            ctx.strokeText(msg.text, this.canvas.width / 2, y + 5);
            ctx.fillStyle = "#f5c518";
            ctx.fillText(msg.text, this.canvas.width / 2, y + 5);

            y += 50;
        }
        ctx.restore();
    }
}