export class GameLoop {
    constructor(updateFn, renderFn) {
        this.update = updateFn;
        this.render = renderFn;
        this.lastTime = 0;
        this.running = false;
        this.rafId = null;
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.lastTime = 0;
        this.rafId = requestAnimationFrame((t) => this.loop(t));
    }

    stop() {
        this.running = false;
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;
    }

    loop(timestamp) {
        if (!this.running) return;

        // Se lastTime for 0 (primeiro frame após start), delta = 0 para evitar salto
        const delta = this.lastTime === 0
            ? 0
            : Math.min((timestamp - this.lastTime) / 1000, 0.05);
        
        this.lastTime = timestamp;

        this.update(delta);
        this.render();

        this.rafId = requestAnimationFrame((t) => this.loop(t));
    }
}