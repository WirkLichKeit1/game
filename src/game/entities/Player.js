import { PhysicsBody } from "../physics/PhysicsBody.js";
import { resolveAABB } from "../physics/AABB.js";

const MOVE_SPEED = 280;
const JUMP_FORCE = -850;

export class Player {
    constructor(x, y) {
        this.body = new PhysicsBody(x, y, 40, 50);
        this.facing = 1;
    }

    update(delta, input, platforms) {
        const { keys } = input;

        if (keys.left) {
            this.body.vx = -MOVE_SPEED;
            this.facing = -1;
        } else if (keys.right) {
            this.body.vx = MOVE_SPEED;
            this.facing = 1;
        } else {
            this.body.vx = 0;
        }

        if (keys.jump && this.body.onGround) {
            this.body.vy = JUMP_FORCE;
            this.body.onGround = false;
        }

        this.body.update(delta);
        this.body.onGround = false;

        // Resolve colisão com cada plataforma
        for (const platform of platforms) {
            const collision = resolveAABB(this.body, platform);
            if (!collision) continue;

            if (collision.axis === "y") {
                if (collision.direction === "bottom") {
                    this.body.y -= collision.overlap;
                    this.body.vy = 0;
                    this.body.onGround = true;
                } else {
                    this.body.y += collision.overlap;
                    this.body.vy = 0;
                }
            } else {
                if (collision.direction === "right") {
                    this.body.x -= collision.overlap;
                } else {
                    this.body.x += collision.overlap;
                }
                this.body.vx = 0;
            }
        }

        if (this.body.x < 0) this.body.x = 0;
        if (this.body.x + this.body.width > 800) this.body.x = 800 - this.body.width;
    }

    render(ctx) {
        const { x, y, width, height } = this.body;

        ctx.fillStyle = "#4A90E2";
        ctx.fillRect(x, y, width, height);

        // olhinho indicando direção
        ctx.fillStyle = "#fff";
        const eyeX = this.facing === 1 ? x + width - 12 : x + 6;
        ctx.fillRect(eyeX, y + 12, 8, 8);
    }
}