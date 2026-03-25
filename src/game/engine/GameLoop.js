export class GameLoop {
    constructor(updateFn, renderFn) {
        this.update = updateFn;
        this.render = renderFn;
        this.lastTime = 0;
        this.running = false;
        this.rafId = null;
    }

    start() {
        this.running = true;
        this.rafId = requestAnimationFrame((t) => this.loop(t));
    }

    stop() {
        this.running = false;
        if (this.rafId) cancelAnimationFrame(this.rafId);
    }

    loop(timestamp) {
        if (!this.running) return;

        // Delta em segundos - garante velocidade consistente em qualquer dispositivo
        const delta = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        this.update(delta);
        this.render();

        this.rafId = requestAnimationFrame((t) => this.loop(t));
    }
}