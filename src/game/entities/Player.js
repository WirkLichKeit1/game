import { PhysicsBody } from "../physics/PhysicsBody.js";
import { resolveAABB } from "../physics/AABB.js";
import { AnimationController } from "./AnimationController.js";

const MOVE_SPEED = 280;
const JUMP_FORCE = -850;

export class Player {
    constructor(x, y) {
        this.body = new PhysicsBody(x, y, 40, 50);
        this.facing = 1;
        this.anim = new AnimationController();
    }

    update(delta, input, platforms, worldWidth) {
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

        // Limites do mundo
        if (this.body.x < 0) this.body.x = 0;
        if (this.body.x + this.body.width > worldWidth) {
            this.body.x = worldWidth - this.body.width;
        }

        this.anim.update(delta, this.body);
    }

    render(ctx) {
        const { x, y, width, height } = this.body;
        const { squash, legAngle, state } = this.anim;

        // Centro do personagem - ponto de origem do squash
        const cx = x + width / 2;
        const cy = y + height;

        // Pernas: só o flip horizontal, sem squash
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(this.facing, 1);
        this._drawLeg(ctx, -10, legAngle, width, height);
        this._drawLeg(ctx, 10, -legAngle, width, height);
        ctx.restore();

        // Corpo e cabeça: flip + squash
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(this.facing, squash);

        // Corpo
        ctx.fillStyle = state === "jump" || state === "fall" ? "#5BA3F5" : "#4A90E2";
        ctx.fillRect(-width / 2, -height, width, height * 0.65);

        // Cabeça
        ctx.fillStyle = "#4A90E2";
        const headSize = width * 0.72;
        ctx.fillRect(-headSize / 2, -height - headSize * 0.6, headSize, headSize * 0.75);

        // Olho
        ctx.fillStyle = "#fff";
        ctx.fillRect(6, -height - headSize * 0.4, 7, 7);
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(8, -height - headSize * 0.35, 4, 4);

        ctx.restore();
    }

    // offsetX: posição horizontal da perna em relação ao centro
    // angle: ângulo de rotação
    // height: altura do player (para calcular o comprimento da perna)
    _drawLeg(ctx, offsetX, angle, height) {
        ctx.save();
        ctx.translate(offsetX, -height * 0.35);
        ctx.rotate(angle);
        ctx.fillStyle = "#3a7bd5";
        ctx.fillRect(-5, 0, 10, height * 0.42);
        ctx.restore();
    }
}