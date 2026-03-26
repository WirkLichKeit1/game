export class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get bounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
        };
    }

    render(ctx) {
        // Corpo da plataforma
        ctx.fillStyle = "#5a8a5a";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Topo mais claro para dar sensação de profundidade
        ctx.fillStyle = "#7bc47b";
        ctx.fillRect(this.x, this.y, this.width, 6);
    }
}