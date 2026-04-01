export class Platform {
    constructor(x, y, width, height, theme = {}, opacity = 1.0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colorBody = theme.platform ?? "#5a8a5a";
        this.colorTop = theme.platformTop ?? "#7bc47b";

        // Opacidade base (definida no design da zona)
        // A opacidade real é calculada dinamicamente pelo Game quando
        // o player se aproxima (plataformas ocultas do céu)
        this.baseOpacity = opacity;
        this.currentOpacity = opacity; // atualizado pelo Game a cada frame
    }

    get bounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
        };
    }

    /**
     * Atualiza a opacidade baseada na distância do player.
     * Só tem efeito em plataformas com baseOpacity < 1.
     */
    updateOpacity(playerX, playerY, revealRadius = 160) {
        if (this.baseOpacity >= 1.0) return; // Plataforma sempre visível, sem cálculo

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const dx = playerX - cx;
        const dy = playerY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Interpolação: baseOpacity quando longw, 1.0 quando dentro do raio
        const t = Math.max(0, Math.min(1, 1 - (dist - revealRadius * 0.5) / revealRadius));
        this.currentOpacity = this.baseOpacity + (1.0 - this.baseOpacity) * t;
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.currentOpacity;
        
        // Corpo da plataforma
        ctx.fillStyle = this.colorBody;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Topo
        ctx.fillStyle = this.colorTop;
        ctx.fillRect(this.x, this.y, this.width, 6);

        ctx.restore();
    }
}