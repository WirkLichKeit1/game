export class Flag {
    constructor(x, y, id, theme = {}) {
        this.x = x;
        this.y = y;
        this.id = id; // Identificador único da bandeira
        this.collected = false;
        this.color = theme.flag || "#f1c40f";
        this.poleColor = "#888";

        // Animação de flutuação
        this.floatTimer = Math.random() * Math.PI * 2;
        this.floatSpeed = 2;
        this.floatAmount = 6;

        // Área de coleta (hitbox maior que visual)
        this.hitbox = {
            x: x - 10,
            y: y - 10,
            width: 60,
            height: 170
        };
    }

    update(delta) {
        if (this.collected) return;
        this.floatTimer += delta * this.floatSpeed;
    }

    checkCollection(playerBody) {
        if (this.collected) return false;

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
        if (this.collected) return;

        const floatOffset = Math.sin(this.floatTimer) * this.floatAmount;
        const baseY = this.y + floatOffset;

        ctx.save();

        // Brilho de fundo se não coletada
        ctx.globalAlpha = 0.15 + Math.sin(this.floatTimer * 2) * 0.1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + 25, baseY + 80, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

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