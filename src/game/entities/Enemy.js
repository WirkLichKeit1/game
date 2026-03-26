import { PhysicsBody } from "../physics/PhysicsBody.js";
import { resolveAABB } from "../physics/AABB.js";

const SPEED = 100;

export class Enemy {
    constructor(x, y, patrolLeft, patrolRight) {
        this.body = new PhysicsBody(x, y, 36, 36);
        this.patrolLeft = patrolLeft;
        this.patrolRight = patrolRight;
        this.facing = 1;
        this.alive = true;
        this.legAngle = 0;
        this.timer = 0;
    }

    update(delta, platforms) {
        if (!this.alive) return;

        this.timer += delta;
        this.legAngle = Math.sin(this.timer * 14) * 0.35;

        this.body.vx = this.facing * SPEED;
        this.body.update(delta);
        this.body.onGround = false;

        for (const platform of platforms) {
            const collision = resolveAABB(this.body, platform);
            if (!collision) continue;

            if (collision.axis === "y" && collision.direction === "bottom") {
                this.body.y -= collision.overlap;
                this.body.vy = 0;
                this.body.onGround = true;
            } else if (collision.axis === "x") {
                this.facing *= -1;
            }
        }

        // Inverte ao chegar no limite da patrulha
        if (this.body.x <= this.patrolLeft) {
            this.body.x = this.patrolLeft;
            this.facing = 1;
        }
        if (this.body.x + this.body.width >= this.patrolRight) {
            this.body.x = this.patrolRight - this.body.width;
            this.facing = -1;
        }
    }

    render(ctx) {
        if (!this.alive) return;

        const { x, y, width, height } = this.body;
        const cx = x + width / 2;
        const cy = y + height;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(this.facing, 1);

        // Pernas
        this._drawLeg(ctx, -8, 0, this.legAngle, height);
        this._drawLeg(ctx, 8, 0, -this.legAngle, height);

        // Corpo
        ctx.fillStyle = "#c0392b";
        ctx.fillRect(-width / 2, -height, width, height * 0.65);

        // Cabeça
        ctx.fillStyle = "#e74c3c";
        const hs = width * 0.75;
        ctx.fillRect(-hs / 2, -height - hs * 0.6, hs, hs * 0.75);

        // Olhos bravos
        ctx.fillStyle = "#fff";
        ctx.fillRect(4, -height - hs * 0.45, 6, 6);
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(6, -height - hs * 0.38, 3, 3);

        // Sobrancelha brava
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(3, -height - hs * 0.52, 8, 2);

        ctx.restore();
    }

    _drawLeg(ctx, offsetX, offsetY, angle, height) {
        ctx.save();
        ctx.translate(offsetX, offsetY - height * 0.35);
        ctx.rotate(angle);
        ctx.fillStyle = "#922b21";
        ctx.fillRect(-4, 0, 8, height * 0.42);
        ctx.restore();
    }
}