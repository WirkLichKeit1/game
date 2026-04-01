import { PhysicsBody } from "../physics/PhysicsBody.js";
import { resolveAABB } from "../physics/AABB.js";
import { AnimationController } from "./AnimationController.js";
import { PlayerProjectile } from "./PlayerProjectile.js";

const MOVE_SPEED = 280;
const JUMP_FORCE = -850;
const SHOOT_COOLDOWN = 0.35;

export class Player {
    constructor(x, y) {
        this.body = new PhysicsBody(x, y, 40, 50);
        this.facing = 1;
        this.anim = new AnimationController();
        
        this.projectiles = [];
        this._shootTimer = 0; // cooldown atual
        this._shootHeld = false; // evita tiro contínuo segurando o botão
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

        // Tiro - dispara ao pressionar
        if (this._shootTimer > 0) this._shootTimer -= delta;

        if (keys.shoot) {
            if (!this._shootHeld && this._shootTimer <= 0) {
                this._fire();
                this._shootTimer = SHOOT_COOLDOWN;
            }
            this._shootHeld = true;
        } else {
            this._shootHeld = false;
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

        // Atualiza projéteis
        for (const proj of this.projectiles) {
            proj.update(delta, worldWidth);
        }
        this.projectiles = this.projectiles.filter(p => p.alive);

        this.anim.update(delta, this.body);
    }

    _fire() {
        // Projétil sai do centro-lateral do player
        const x = this.facing > 0
            ? this.body.x + this.body.width
            : this.body.x - 14;
        const y = this.body.y + this.body.height * 0.38;

        this.projectiles.push(new PlayerProjectile(x, y, this.facing));
    }

    getProjectiles() {
        return this.projectiles;
    }

    render(ctx) {
        const { x, y, width, height } = this.body;
        const { squash, legAngle, state } = this.anim;

        // Centro do personagem - ponto de origem do squash
        const cx = x + width / 2;
        const cy = y + height;

        for (const proj of this.projectiles) proj.render(ctx);

        // Pernas: só o flip horizontal, sem squash
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(this.facing, squash);

        ctx.save();
        ctx.scale(1, 1 / squash)
        this._drawLeg(ctx, -10, 0, legAngle, height);
        this._drawLeg(ctx, 10, 0, -legAngle, height);
        ctx.restore();

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

        // Indicador de arma (pequeno cano na frente)
        ctx.fillStyle = "#2a5aaa";
        ctx.fillRect(width / 2 - 2, -height * 0.55, 10, 6);

        ctx.restore();
    }

    _drawLeg(ctx, offsetX, offsetY, angle, height) {
        ctx.save();
        ctx.translate(offsetX, offsetY -height * 0.35);
        ctx.rotate(angle);
        ctx.fillStyle = "#3a7bd5";
        ctx.fillRect(-5, 0, 10, height * 0.42);
        ctx.restore();
    }
}