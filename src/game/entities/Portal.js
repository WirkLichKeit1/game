// Portal — entidade de transição entre zonas
//
// Estados:
//   hidden  → invisível, sem trigger (portal sky antes de ser descoberto)
//   visible → aparece gradualmente (descoberto mas ainda não ativo)
//   active  → funcional, player pode atravessar

export class Portal {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.width = config.width ?? 60;
        this.height = config.height ?? 100;
        this.targetZone = config.targetZone;
        this.hidden = config.hidden ?? false;
        this.isCaveHole = config.isCaveHole ?? false; // buraco no chão, visual diferente

        // Ponto de spawn na zona destino
        this.spawnInTarget = config.spawnInTarget ?? { x: 100, y: 420 };

        // Raio para revelar portal invisível
        this.discoveryRadius = config.discoveryRadius ?? 120;

        // Estado e alpha de render
        this.state = this.hidden ? "hidden" : "active";
        this.alpha = this.hidden ? 0 : 1;
        this.timer = 0;

        // Cores por tipo
        this.color = config.color ?? "#8040ff";
        this.glowColor = config.glowColor ?? "#c090ff";
        this.caveColor = config.caveColor ?? "#0a0a0e";
    }

    // Estado
    get isActive() {
        return this.state === "active";
    }

    get bounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
        };
    }

    // Chamado pelo Game quando o player passa perto (só para hidden)
    tryReveal(playerX, playerY) {
        if (this.state !== "hidden") return;

        const cx = this.x + this.width  / 2;
        const cy = this.y + this.height / 2;
        const dist = Math.sqrt((playerX - cx) ** 2 + (playerY - cy) ** 2);

        if (dist <= this.discoveryRadius) {
            this.state = "visible";
        }
    }

    // Update
    update(delta) {
        this.timer += delta;

        if (this.state === "visible") {
            // Fade-in até ficar ativo
            this.alpha = Math.min(1, this.alpha + delta * 1.5);
            if (this.alpha >= 1) this.state = "active";
        } else if (this.state === "active") {
            this.alpha = 1;
        } else {
            this.alpha = 0;
        }
    }

    // Verifica se o player colidiu com o trigger
    checkTrigger(playerBody) {
        if (!this.isActive) return false;

        const p = playerBody;
        const b = this.bounds;
        return !(p.x + p.width  <= b.left  ||
                 p.x             >= b.right ||
                 p.y + p.height  <= b.top   ||
                 p.y             >= b.bottom);
    }

    // Render
    render(ctx) {
        if (this.state === "hidden") return;

        if (this.isCaveHole) {
            this._renderCaveHole(ctx);
        } else {
            this._renderPortal(ctx);
        }
    }

    _renderPortal(ctx) {
        const cx = this.x + this.width  / 2;
        const cy = this.y + this.height / 2;
        const rx = this.width  / 2;
        const ry = this.height / 2;

        ctx.save();
        ctx.globalAlpha = this.alpha;

        // Brilho externo pulsante
        const pulse = 0.3 + Math.sin(this.timer * 3) * 0.15;
        ctx.globalAlpha = this.alpha * pulse;
        ctx.fillStyle = this.glowColor;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx + 12, ry + 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Corpo do portal (elipse)
        ctx.globalAlpha = this.alpha * 0.85;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();

        // Borda
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.glowColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Partículas de shimmer (pontos girando)
        const count = 6;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + this.timer * 1.5;
            const px = cx + Math.cos(angle) * (rx + 6);
            const py = cy + Math.sin(angle) * (ry + 6);
            ctx.globalAlpha = this.alpha * (0.5 + Math.sin(this.timer * 4 + i) * 0.4);
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Seta indicativa no centro
        ctx.globalAlpha = this.alpha * 0.9;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const arrow = this.targetZone === "mid" ? "↩" : this.targetZone === "sky" ? "↑" : "↓";
        ctx.fillText(arrow, cx, cy);

        ctx.restore();
    }

    _renderCaveHole(ctx) {
        const x = this.x;
        const y = this.y;
        const w = this.width;

        ctx.save();
        ctx.globalAlpha = this.alpha;

        // Abertura escura no chão
        ctx.fillStyle = this.caveColor;
        ctx.fillRect(x, y, w, 20);

        // Bordas de pedra
        ctx.fillStyle = "#3a2e1a";
        ctx.fillRect(x - 4, y - 6, 10, 10);
        ctx.fillRect(x + w - 6, y - 6, 10, 10);
        ctx.fillRect(x + w * 0.3, y - 8, 12, 10);
        ctx.fillRect(x + w * 0.6, y - 5, 8, 8);

        // Brilho de profundidade (gradiente simulado com rects)
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(x, y + 6, w, 14);

        // Pulsação sutil de luz laranja vinda de baixo (lava)
        const lavaPulse = 0.08 + Math.sin(this.timer * 2.5) * 0.05;
        ctx.globalAlpha = this.alpha * lavaPulse;
        ctx.fillStyle = "#ff4010";
        ctx.fillRect(x + 4, y + 10, w - 8, 8);

        // Seta indicativa
        ctx.globalAlpha = this.alpha * (0.6 + Math.sin(this.timer * 3) * 0.3);
        ctx.fillStyle = "#ff8040";
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("↓", x + w / 2, y - 16);

        ctx.restore();
    }
}