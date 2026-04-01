export class Flag {
    constructor(x, y, id, theme = {}) {
        this.x = x;
        this.y = y;
        this.id = id; // Identificador único da bandeira
        this.collected = false;
        this.hidden = false; // se true, não aparece nem colide até ser revelada
        this.color = theme.flag || "#f1c40f";
        this.poleColor = "#888";

        // Animação de flutuação
        this.floatTimer = Math.random() * Math.PI * 2;
        this.floatSpeed = 2;
        this.floatAmount = 6;

        // Animação de revelação (fade-in quando hidden passa a false)
        this.revealAlpha = 1.0; // 0->1 quando revelada
        this.revealing = false;

        // Área de coleta (hitbox maior que visual)
        this.hitbox = {
            x: x - 10,
            y: y - 10,
            width: 60,
            height: 170
        };
    }

    reveal() {
        if (!this.hidden) return;
        this.hidden = false;
        this.revealing = true;
        this.revealAlpha = 0;
    }

    update(delta) {
        if (this.collected) return;
        this.floatTimer += delta * this.floatSpeed;

        if (this.revealing) {
            this.revealAlpha = Math.min(1, this.revealAlpha + delta * 2);
            if (this.revealAlpha >= 1) this.revealing = false;
        }
    }

    checkCollection(playerBody) {
        if (this.collected || this.hidden) return false;

        const px = playerBody.x;
        const py = playerBody.y;
        const pw = playerBody.width;
        const ph = playerBody.height;

        return !(px + pw < this.hitbox.x ||
                 px > this.hitbox.x + this.hitbox.width ||
                 py + ph < this.hitbox.y ||
                 py > this.hitbox.y + this.hitbox.height);
    }

    collect() {
        this.collected = true;
    }

    render(ctx) {
        if (this.collected || this.hidden) return;

        const floatOffset = Math.sin(this.floatTimer) * this.floatAmount;
        const baseY = this.y + floatOffset;

        ctx.save();
        ctx.globalAlpha = this.revealAlpha;

        // Brilho de fundo se não coletada
        ctx.globalAlpha = this.revealAlpha * (0.15 + Math.sin(this.floatTimer * 2) * 0.1);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + 25, baseY + 80, 35, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = this.globalAlpha;

        // Poste
        ctx.fillStyle = this.poleColor;
        ctx.fillRect(this.x, baseY, 6, 160);

        // Bandeira triangular
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + 6, baseY);
        ctx.lineTo(this.x + 46, baseY + 20);
        ctx.lineTo(this.x + 6, baseY + 40);
        ctx.fill();

        // Destaque na bandeira
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath();
        ctx.moveTo(this.x - 6, baseY);
        ctx.lineTo(this.x + 26, baseY + 10);
        ctx.lineTo(this.x + 6, baseY + 15);
        ctx.fill();

        // Número da bandeira
        ctx.fillStyle = "#1a1a2e";
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.fillText(this.id, this.x + 23, baseY + 25);

        ctx.restore();
    }
}