// Projétil do player - sem gravidade, vai em linha reta

export class PlayerProjectile {
    constructor(x, y, facing) {
        this.x = x;
        this.y = y;
        this.width = 14;
        this.height = 8;
        this.vx = facing * 700; // velocidade alta
        this.vy = 0;
        this.alive = true;
        this.timer = 0;
        this.maxLife = 1.2;

        this.color = "#40ffcc";
        this.glowColor = "#00ffaa";
        
        this.trail = [];
    }

    get bounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
        };
    }

    update(delta, worldWidth) {
        if (!this.alive) return;

        this.timer += delta;
        if (this.timer >= this.maxLife) {
            this.alive = false;
            return;
        }

        // Trail
        this.trail.push({
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            life: 0.12
        });
        
        if (this.trail.length > 6) this.trail.shift();

        for (const t of this.trail) {
            t.life -= delta * 5;
        }

        this.trail = this.trail.filter(t => t.life > 0);

        this.x += this.vx * delta;
        // some ao sair do mundo
        if (this.x < -50 || this.x > worldWidth + 50) this.alive = false;
    }

    render(ctx) {
        if (!this.alive) return;

        // Trail
        for (const t of this.trail) {
            const a = t.life / 0.12;
            ctx.save();
            ctx.globalAlpha = a * 0.5;
            ctx.fillStyle = this.glowColor;
            ctx.fillRect(t.x - 3, t.y - 3, 6, 6);
            ctx.restore();
        }

        // Projétil - retângulo horizontal com brilho
        ctx.save();

        // Glow externo
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = this.glowColor;
        ctx.fillRect(this.x - 3, this.y - 3, this.width + 6, this.height + 6);

        // Corpo
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Brilho interno
        ctx.fillStyle = "#fff";
        ctx.fillRect(this.x + 2, this.y + 1, this.width - 6, 3);

        ctx.restore();
    }
}