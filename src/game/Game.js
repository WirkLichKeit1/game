import { resolveAABB }  from "./physics/AABB.js";
import { GameLoop }     from "./engine/GameLoop.js";
import { InputManager } from "./engine/InputManager";
import { Camera }       from "./engine/Camera.js";
import { Player }       from "./entities/Player.js";
import { LevelManager } from "./LevelManager.js";

export class Game {
    constructor(canvas, callbacks, levelId = 1) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.callbacks = callbacks;
        this.input = new InputManager();

        this.levelManager = new LevelManager(levelId);
        this._applyLevel();

        this.loop = new GameLoop(
            (delta) => this.update(delta),
            ()      => this.render()
        );
    }

    // Carrega dados do level atual para as propriedades do jogo
    _applyLevel() {
        const lm = this.levelManager;
        this.platforms = lm.platforms;
        this.enemies = lm.enemies;
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
    }

    // Reinicia a fase (mantem ou troca o level)
    reset(callbacks, levelId) {
        this.callbacks = callbacks;
        if (levelId !== undefined) {
            this.levelManager.load(levelId);
        }
        this._applyLevel();
    }

    start() { this.loop.start(); }
    stop() { this.loop.stop(); }
    
    destroy() {
        this.loop.stop();
        this.input.destroy();
    }

    update(delta) {
        this.player.update(delta, this.input, this.platforms, this.WORLD_WIDTH);
        this.camera.follow(this.player.body, delta);

        for (const enemy of this.enemies) {
            enemy.update(delta, this.platforms);
        }

        if (this.invincible > 0) this.invincible -= delta;

        this._checkEnemyCollisions();
        this._checkFall();
        this._checkWin();
    }

    _checkEnemyCollisions() {
        if (this.invincible > 0) return;

        for (const enemy of this.enemies) {
            if (!enemy.alive) continue;
            const col = resolveAABB(this.player.body, enemy.body);
            if (!col) continue;

            if (col.axis === "y" && col.direction === "bottom" && this.player.body.vy > 0) {
                enemy.alive = false;
                this.player.body.vy = -500;
            } else {
                this.invincible = 1.5;
                const start = this.levelManager.playerStart;
                this.player.body.x = start.x;
                this.player.body.y = start.y;
                this.player.body.vx = 0;
                this.player.body.vy = 0;
                this.callbacks.onLoseLife();
            }
        }
    }

    _checkFall() {
        if (this.player.body.y > this.WORLD_HEIGHT + 100) {
            const start = this.levelManager.playerStart;
            this.player.body.x = start.x;
            this.player.body.y = start.y;
            this.player.body.vx = 0;
            this.player.body.vy = 0;
            this.callbacks.onLoseLife();
        }
    }

    _checkWin() {
        if (this.player.body.x >= this.flagX) {
            this.callbacks.onWin();
        }
    }

    render() {
        const { ctx, canvas, theme } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fundo com gradiente de ceu tematico
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, theme.sky);
        grad.addColorStop(0.7, theme.skyBottom ?? theme.sky);
        grad.addColorStop(1, theme.ground);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this._renderParallax(ctx);

        // Água / vão entre plataformas (fundo do abismo)
        if (theme.water) {
            ctx.fillStyle = theme.water;
            ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
            if (theme.waterSheen) {
                ctx.fillStyle = theme.waterSheen;
                ctx.fillRect(0, canvas.height - 82, canvas.width, 4);
            }
        }

        this.camera.begin(ctx);

        for (const platform of this.platforms) {
            platform.render(ctx);
        }

        this._renderFlag(ctx);

        for (const enemy of this.enemies) {
            enemy.render(ctx);
        }

        if (this.invincible <= 0 || Math.floor(this.invincible * 8) % 2 === 0) {
            this.player.render(ctx);
        }

        this.camera.end(ctx);

        // Nome da fase no canto superior direito
        this._renderLevelName(ctx);
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
}