import { GameLoop } from "./engine/GameLoop.js";
import { InputManager } from "./engine/InputManager";
import { Camera } from "./engine/Camera.js";
import { Player } from "./entities/Player.js";
import { Platform } from "./entities/Platform.js";

const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 560;

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.input = new InputManager();

        this.camera = new Camera(WORLD_WIDTH, WORLD_HEIGHT, canvas.width, canvas.height);
        this.player = new Player(100, 400);

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
        
        this.loop = new GameLoop(
            (delta) => this.update(delta),
            () => this.render()
        );
    }

    start() { this.loop.start(); }
    stop() { this.loop.stop(); }

    update(delta) {
        this.player.update(delta, this.input, this.platforms, WORLD_WIDTH);
        this.camera.follow(this.player.body, delta);
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

        this.player.render(ctx);

        this.camera.end(ctx);
    }
}