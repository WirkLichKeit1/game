import { PhysicsBody } from "../physics/PhysicsBody";

export class Projectile {
    constructor(x, y, vx, vy, theme = {}) {
        this.body = new PhysicsBody(x, y, 12, 12);
        this.body.vx = vx;
        this.body.vy = vy;
        this.alive = true;
        this.timer = 0;
        this.maxLife = 4; // Desaparece após 4 segundos
        this.color = theme.projectile || "#ff6b6b";
        this.trailColor = theme.projectileTrail || "#ff9999";

        // Trail particles para efeito visual
        this.trail = [];
    }

    update(delta, worldWidth, worldHeight) {
        if (!this.alive) return;

        this.timer += delta;
        if (this.timer >= this.maxLife) {
            this.alive = false;
            return;
        }

        // Adiciona posição ao trail
        this.trail.push({
            x: this.body.x + this.body.width / 2,
            y: this.body.y + this.body.height / 2,
            life: 0.3,
        });
        if (this.trail.length > 0) this.trail.shift();

        // Atualiza trail
        for (const t of this.trail) {
            t.life -= delta * 2;
        }
        this.trail = this.trail.filter(t => t.life > 0);

        this.body.update(delta);

        // Desaparece se sair do mundo
        if (this.body.x < -50 || this.body.x > worldWidth + 50 || this.body.y < -50 || this.body.y > worldHeight + 50) {
            this.alive = false;
        }
    }

    render(ctx) {
        if (!this.alive) return;

        // Renderiza trail
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            const alpha = t.life / 0.3;
            const size = 6 * alpha;
            ctx.save();
            ctx.globalAlpha = alpha * 0.6;
            ctx.fillStyle = this.trailColor;
            ctx.fillRect(t.x - size / 2, t.y - size / 2, size, size);
            ctx.restore();
        }

        // Renderiza projétil
        ctx.save();
        ctx.translate(
            this.body.x + this.body.width / 2,
            this.body.y + this.body.height / 2
        );
        ctx.rotate(this.timer * 8); // Rotação contínua
        ctx.fillStyle = this.color;
        ctx.fillRect(-6, -6, 12, 12);
        // Brilho interno
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillRect(-3, -3, 6, 6);
        ctx.restore();
    }
}