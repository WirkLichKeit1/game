export class Camera {
    constructor(worldWidth, worldHeight, viewWidth, viewHeight) {
        this.x = 0;
        this.y = 0;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;

        // Screen shake
        this._shakeTimer = 0;
        this._shakeMagnitude = 0;
        this._shakeOffsetX = 0;
        this._shakeOffsetY = 0;
    }

    // Dispara um shake - magnitude em pixels, duration em segundos
    shake(magnitude = 6, duration = 0.3) {
        this._shakeMagnitude = magnitude;
        this._shakeTimer = duration;
    }

    follow(target, delta) {
        // Posição ideal: centraliza o target na tela
        const idealX = target.x + target.width / 2 - this.viewWidth / 2;
        const idealY = target.y + target.height / 2 - this.viewHeight / 2;

        // Lerp - câmera segue suavemente, não teleporta
        const speed = 8;
        this.x += (idealX - this.x) * speed * delta;
        this.y += (idealY - this.y) * speed * delta;

        // Limites - câmera não sai do mundo
        this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.viewWidth));
        this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.viewHeight));

        // Atualiza shake
        if (this._shakeTimer > 0) {
            this._shakeTimer -= delta;
            const progress = this._shakeTimer > 0
                ? this._shakeTimer / 0.3 // normaliza 0->1
                : 0;
            const m = this._shakeMagnitude * progress;
            this._shakeOffsetX = (Math.random() * 2 - 1) * m;
            this._shakeOffsetY = (Math.random() * 2 - 1) * m;
        } else {
            this._shakeOffsetX = 0;
            this._shakeOffsetY = 0;
        }
    }

    // Aplica o offset da câmera no ctx antes de renderizar
    begin(ctx) {
        ctx.save();
        ctx.translate(
            -Math.round(this.x) + Math.round(this._shakeOffsetX),
            -Math.round(this.y) + Math.round(this._shakeOffsetY)
        );
    }

    // Restaura o ctx depois de renderizar o mundo
    end(ctx) {
        ctx.restore();
    }
}