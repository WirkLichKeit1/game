export class Camera {
    constructor(worldWidth, worldHeight, viewWidth, viewHeight) {
        this.x = 0;
        this.y = 0;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
    }

    follow(target, delta) {
        // Posição ideal: centraliza o target na tela
        const idealX = target.x + target.width / 2 - this.viewWidth / 2;
        const idealY = target.y + target.height / 2 - this.viewHeight / 2;

        // Lerp - câmera segue suavemente, não teleporta
        const speed = 0;
        this.x += (idealX - this.x) * speed * delta;
        this.y += (idealY - this.y) * speed * delta;

        // Limites - câmera não sai do mundo
        this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.viewWidth));
        this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.viewHeight));
    }

    // Aplica o offset da câmera no ctx antes de renderizar
    begin(ctx) {
        ctx.save();
        ctx.translate(-Math.round(this.x), -Math.round(this.y));
    }

    // Restaura o ctx depois de renderizar o mundo
    end(ctx) {
        ctx.restore();
    }
}