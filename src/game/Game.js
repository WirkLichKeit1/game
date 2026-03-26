import { GameLoop } from "./engine/GameLoop.js";
import { InputManager } from "./engine/InputManager";
import { Player } from "./entities/Player.js";
import { Platform } from "./entities/Platform.js";

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.input = new InputManager();
        this.player = new Player(100, 300);

        // Fase de teste - plataforma em alturas diferentes
        this.platforms = [
            new Platform(0,   520, 800, 40),  // chão
            new Platform(150, 390, 160, 18),  // plataforma baixa
            new Platform(400, 300, 180, 18),  // plataforma média
            new Platform(220, 210, 140, 18),  // plataforma alta
            new Platform(560, 200, 160, 18),  // plataforma alta direita
        ];
        
        this.loop = new GameLoop(
            (delta) => this.update(delta),
            () => this.render()
        );
    }

    start() { this.loop.start(); }
    stop() { this.loop.stop(); }

    update(delta) {
        this.player.update(delta, this.input, this.platforms);
    }

    render() {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const platform of this.platforms) {
            platform.render(ctx);
        }

        this.player.render(ctx);
    }
}