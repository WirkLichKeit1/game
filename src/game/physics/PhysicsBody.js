const GRAVITY = 1800;

export class PhysicsBody {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
    }

    update(delta) {
        if (!this.onGround) this.vy += GRAVITY * delta;
        this.x += this.vx * delta;
        this.y += this.vy * delta;
    }

    get bounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
        };
    }
}