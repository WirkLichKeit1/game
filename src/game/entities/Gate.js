// Gate — portal para a próxima fase
// Estados:
//   locked  → grades fechadas, bloqueia fisicamente o player
//   charged → 3 bandeiras coletadas, pulsa com energia, ainda bloqueia
//   open    → boss derrotado, animação de abertura, player passa

export class Gate {
    constructor(x, y, theme = {}) {
        this.x      = x;
        this.y      = y;
        this.width  = 24;
        this.height = 200;

        this.state = "locked"; // "locked" | "charged" | "open"
        this.timer = 0;

        // Animação de abertura
        this.openProgress = 0; // 0→1 quando abrindo
        this.opening      = false;

        // Cores
        this.colorLocked  = "#445566";
        this.colorCharged = "#9060ff";
        this.colorGlow    = "#c090ff";
        this.colorOpen    = "#40ff80";
        this.theme        = theme;

        // Partículas de energia (geradas no render)
        this.particles = [];
    }

    // ─── Estado ────────────────────────────────────────────────────────────────

    charge() {
        if (this.state === "locked") {
            this.state = "charged";
        }
    }

    open() {
        if (this.state === "charged") {
            this.state   = "open";
            this.opening = true;
        }
    }

    get isBlocking() {
        // Bloqueia o player fisicamente enquanto não estiver aberto
        return this.state !== "open" || this.openProgress < 1;
    }

    // AABB de colisão — encolhe horizontalmente conforme abre
    get bounds() {
        const shrink = this.state === "open"
            ? this.openProgress * (this.width / 2)
            : 0;
        return {
            left:   this.x + shrink,
            right:  this.x + this.width - shrink,
            top:    this.y,
            bottom: this.y + this.height,
        };
    }

    // ─── Update ────────────────────────────────────────────────────────────────

    update(delta) {
        this.timer += delta;

        if (this.opening) {
            this.openProgress = Math.min(1, this.openProgress + delta * 1.2);
            if (this.openProgress >= 1) this.opening = false;
        }

        // Partículas de energia quando charged
        if (this.state === "charged" && Math.random() < 0.3) {
            this.particles.push({
                x:    this.x + this.width / 2 + (Math.random() - 0.5) * 40,
                y:    this.y + Math.random() * this.height,
                vy:   -(60 + Math.random() * 80),
                life: 0.5 + Math.random() * 0.4,
                max:  0.9,
                size: 2 + Math.random() * 3,
            });
        }

        for (const p of this.particles) {
            p.life -= delta;
            p.y    += p.vy * delta;
        }
        this.particles = this.particles.filter(p => p.life > 0);
    }

    // ─── Colisão com player ────────────────────────────────────────────────────

    resolveCollision(playerBody) {
        if (!this.isBlocking) return false;

        const b  = this.bounds;
        const pb = playerBody;

        // Sem sobreposição
        if (pb.x + pb.width  <= b.left  ||
            pb.x             >= b.right ||
            pb.y + pb.height <= b.top   ||
            pb.y             >= b.bottom) return false;

        // Empurra o player para fora pelo lado mais próximo
        const overlapLeft  = (pb.x + pb.width) - b.left;
        const overlapRight = b.right - pb.x;

        if (overlapLeft < overlapRight) {
            playerBody.x  = b.left - pb.width;
        } else {
            playerBody.x  = b.right;
        }
        playerBody.vx = 0;
        return true;
    }

    // ─── Render ────────────────────────────────────────────────────────────────

    render(ctx) {
        const { x, y, width, height } = this;
        const cx = x + width / 2;

        ctx.save();

        if (this.state === "open" && this.openProgress >= 1) {
            // Totalmente aberto — só um resquício de brilho
            ctx.globalAlpha = 0.2;
            ctx.fillStyle   = this.colorOpen;
            ctx.fillRect(x, y, width, height);
            ctx.restore();
            return;
        }

        // ── Arco superior ──
        const arcRadius = 52;
        ctx.strokeStyle = this.state === "charged" ? this.colorCharged : this.colorLocked;
        ctx.lineWidth   = 3;

        if (this.state === "charged") {
            const pulse = 0.6 + Math.sin(this.timer * 4) * 0.4;
            ctx.shadowColor = this.colorGlow;
            ctx.shadowBlur  = 12 * pulse;
        }

        ctx.beginPath();
        ctx.arc(cx, y, arcRadius, Math.PI, 0);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // ── Pilares laterais ──
        const pW = 10;
        const color = this.state === "charged" ? this.colorCharged : this.colorLocked;

        // Aplicar encolhimento da abertura
        const shrink = this.openProgress * (height * 0.5);
        const drawH  = height - shrink;

        ctx.fillStyle = color;
        // Pilar esquerdo
        ctx.fillRect(x, y, pW, drawH);
        // Pilar direito
        ctx.fillRect(x + width - pW, y, pW, drawH);

        // ── Grades horizontais (locked/charged) ──
        if (this.state !== "open" || this.openProgress < 0.5) {
            const alpha = this.state === "open"
                ? 1 - this.openProgress * 2
                : 1;
            ctx.globalAlpha = alpha;

            const barCount = 5;
            const innerX   = x + pW;
            const innerW   = width - pW * 2;
            ctx.fillStyle  = color;

            for (let i = 0; i < barCount; i++) {
                const barY = y + (drawH / (barCount + 1)) * (i + 1) - 3;
                ctx.fillRect(innerX, barY, innerW, 6);
            }
            ctx.globalAlpha = 1;
        }

        // ── Orbe central (charged) ──
        if (this.state === "charged") {
            const orbPulse  = 0.7 + Math.sin(this.timer * 5) * 0.3;
            const orbRadius = 14 * orbPulse;
            const orbY      = y + height * 0.4;

            ctx.save();
            ctx.globalAlpha = 0.85;
            ctx.fillStyle   = this.colorGlow;
            ctx.shadowColor = this.colorGlow;
            ctx.shadowBlur  = 20;
            ctx.beginPath();
            ctx.arc(cx, orbY, orbRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle   = "#fff";
            ctx.shadowBlur  = 0;
            ctx.beginPath();
            ctx.arc(cx, orbY, orbRadius * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // ── Efeito de abertura ──
        if (this.state === "open" && this.openProgress < 1) {
            const flashAlpha = (1 - this.openProgress) * 0.7;
            ctx.globalAlpha  = flashAlpha;
            ctx.fillStyle    = this.colorOpen;
            ctx.fillRect(x - 20, y, width + 40, height);
            ctx.globalAlpha  = 1;
        }

        // ── Partículas ──
        for (const p of this.particles) {
            const a = p.life / p.max;
            ctx.globalAlpha = a * 0.8;
            ctx.fillStyle   = this.colorGlow;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;

        // ── Label de status ──
        ctx.font      = "bold 10px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = this.state === "charged" ? this.colorGlow
                      : this.state === "open"    ? this.colorOpen
                      : "rgba(255,255,255,0.35)";
        const label = this.state === "locked"  ? "LOCKED"
                    : this.state === "charged" ? "CHARGED"
                    : "OPEN";
        ctx.fillText(label, cx, y - 12);

        ctx.restore();
    }
}