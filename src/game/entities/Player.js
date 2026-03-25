import { PhysicsBody } from "../physics/PhysicsBody.js";

const MOVE_SPEED = 280;
const JUMP_FORCE = -650;
const GROUND_Y = 500;

export class Player {
    constructor(x, y) {
        this.body = new PhysicsBody(x, y, 40, 50);
        this.facing = 1;
    }

    update(delta, input) {
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

        // chão temporário
        if (this.body.y + this.body.height >= GROUND_Y) {
            this.body.y = GROUND_Y - this.body.height;
            this.body.vy = 0;
            this.body.onGround = true;
        }

        if (this.body.x < 0) this.body.x = 0;
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