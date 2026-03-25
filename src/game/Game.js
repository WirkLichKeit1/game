import { GameLoop } from "./engine/GameLoop.js";
import { InputManager } from "./engine/InputManager";
import { Player } from "./entities/Player.js";

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.input = new InputManager();
        this.player = new Player(100, 400);
        this.loop = new GameLoop(
            (delta) => this.update(delta),
            () => this.render()
        );
    }

    start() { this.loop.start(); }
    stop() { this.loop.stop(); }

    update(delta) {
        this.player.update(delta, this.input);
    }

    render() {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // chão temporário
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(0, 500, canvas.width, 20);

        this.player.render(ctx);
    }
}