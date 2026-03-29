export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    // Pó ao aterrissar / pular - pequenas partículas que se dispersam
    spawnDust(x, y, color = "#c4a882") {
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                type: "dust",
                x, y,
                vx: (Math.random() - 0.5) * 80,
                vy: -Math.random() * 60 -20,
                life: 0.35 + Math.random() * 0.2,
                maxLife: 0.35 + Math.random() * 0.2,
                size: 3 + Math.random() * 4,
                color,
            });
        }
    }

    // Inimigo estoura - partículas maiores que explodem para fora
    spawnEnemyPop(x, y, color = "#c0392b") {
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 / 10) * i;
            const speed = 120 + Math.random() * 100;

            this.particles.push({
                type: "pop",
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 80,
                life: 0.4 + Math.random() * 0.2,
                maxLife: 0.4 + Math.random() * 0.2,
                size: 4 + Math.random() * 5,
                color,
            });
        }
    }

    // Flash de dano - círculo branco que expande e desaparece
    spawnDamageFlash(x, y) {
        this.particles.push({
            type: "flash",
            x, y,
            vx: 0, vy: 0,
            life: 0.25,
            maxLife: 0.25,
            size: 20,
            color: "#ffffff",
        });
    }

    update(delta) {
        for (const p of this.particles) {
            p.life -= delta;
            p.x += p.vx * delta;
            p.y += p.vy * delta;

            // Gravidade leve nas partículas de pó e pop
            if (p.type !== "flash") p.vy += 200 * delta;
        }
        // Remove partículas mortas
        this.particles = this.particles.filter(p => p.life > 0);
    }

    render(ctx) {
        for (const p of this.particles) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.save();
            ctx.globalAlpha = alpha;

            if (p.type === "flash") {
                // Círculo que expande
                const radius = p.size * (1 - alpha) * 3 + 8;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            } else {
                // Quadrado pixel para dust e pop
                const size = p.size * alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
            }

            ctx.restore();
        }
    }

    clear() {
        this.particles = [];
    }
}