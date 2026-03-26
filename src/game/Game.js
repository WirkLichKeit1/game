import { resolveAABB } from "./physics/AABB.js";
import { GameLoop } from "./engine/GameLoop.js";
import { InputManager } from "./engine/InputManager";
import { Camera } from "./engine/Camera.js";
import { Player } from "./entities/Player.js";
import { Platform } from "./entities/Platform.js";
import { Enemy } from "./entities/Enemy.js";

const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 560;

export class Game {
    constructor(canvas, callbacks) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.callbacks = callbacks; // { onLoseLife, onWin }
        this.input = new InputManager();
        this.camera = new Camera(WORLD_WIDTH, WORLD_HEIGHT, canvas.width, canvas.height);
        this.player = new Player(100, 400);
        this.invincible = 0; // segundos de invencibilidade após tomar dano

        this.platforms = [
            // Chão em seções — com buracos pra desafiar o player
            new Platform(0,    520, 600,  40),
            new Platform(700,  520, 500,  40),
            new Platform(1300, 520, 400,  40),
            new Platform(1800, 520, 600,  40),
            new Platform(2500, 520, 500,  40),

            // Plataformas flutuantes
            new Platform(200,  390, 160, 18),
            new Platform(450,  300, 140, 18),
            new Platform(750,  380, 160, 18),
            new Platform(950,  280, 180, 18),
            new Platform(1150, 390, 140, 18),
            new Platform(1400, 350, 160, 18),
            new Platform(1600, 250, 180, 18),
            new Platform(1850, 380, 140, 18),
            new Platform(2050, 290, 140, 18),
            new Platform(2250, 390, 140, 18),
            new Platform(2250, 350, 180, 18),
            new Platform(2750, 250, 160, 18),
        ];

        this.enemies = [
            new Enemy(300,  470, 150,  580),
            new Enemy(800,  470, 700,  1180),
            new Enemy(1000, 230, 950,  1120),
            new Enemy(1400, 470, 1300, 1680),
            new Enemy(1900, 470, 1800, 2370),
            new Enemy(2600, 470, 2500, 2980),
        ];

        // Bandeira de vitória no fim do mundo
        this.flagX = 2900;
        
        this.loop = new GameLoop(
            (delta) => this.update(delta),
            () => this.render()
        );
    }

    reset(callbacks) {
        this.callbacks = callbacks;
        this.player = new Player(100, 400);
        this.invincible = 0;
        this.camera.x = 0;
        this.camera.y = 0;
        this.enemies.forEach((e) => (e.alive = true));
    }

    start() { this.loop.start(); }
    stop() { this.loop.stop(); }

    update(delta) {
        this.player.update(delta, this.input, this.platforms, WORLD_WIDTH);
        this.camera.follow(this.player.body, delta);

        for (const enemy of this.enemies) {
            enemy.update(delta, this.platforms);
        }

        if (this.invincible > 0) {
            this.invincible -= delta;
        }

        this._checkEnemyCollisions();
        this._checkFall();
        this._checkWin();
    }

    _checkEnemyCollisions() {
        if (this.invincible > 0) return;

        for (const enemy of this.enemies) {
            if (!enemy.alive) continue;
            const collision = resolveAABB(this.player.body, enemy.body);
            if (!collision) continue;

            // Pular em cima mata o inimigo
            if (collision.axis === "y" && collision.direction === "bottom" && this.player.body.vy > 0) {
                enemy.alive = false;
                this.player.body.vy = -500; // pequeno bounce
            } else {
                // Colidir de lado perde vida
                this.invincible = 1.5;
                this.player.body.x = 100;
                this.player.body.y = 400;
                this.player.body.vx = 0;
                this.player.body.vy = 0;
                this.callbacks.onLoseLife();
            }
        }
    }

    _checkFall() {
        if (this.player.body.y > WORLD_HEIGHT + 100) {
            this.player.body.x = 100;
            this.player.body.y = 400;
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
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fundo - fora do contexto da câmera (sempre fixo)
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Tudo dentro do begin/end é renderizado em world space
        this.camera.begin(ctx);

        for (const platform of this.platforms) {
            platform.render(ctx);
        }

        this._renderFlag(ctx);

        for (const enemy of this.enemies) {
            enemy.render(ctx);
        }

        // Pisca durante invencibilidade 
        if (this.invincible <= 0 || Math.floor(this.invincible * 8) % 2 === 0) {
            this.player.render(ctx);
        }

        this.camera.end(ctx);
    }

    _renderFlag(ctx) {
        // Mastro
        ctx.fillStyle = "#888";
        ctx.fillRect(this.flagX, 360, 6, 160);

        // Bandeira
        ctx.fillStyle = "#f1c40f";
        ctx.beginPath();
        ctx.moveTo(this.flagX + 6, 360);
        ctx.lineTo(this.flagX + 46, 380);
        ctx.lineTo(this.flagX + 6, 400);
        ctx.fill();
    }
}