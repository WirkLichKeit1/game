import { PhysicsBody } from "../physics/PhysicsBody.js";
import { resolveAABB } from "../physics/AABB.js";
import { Projectile } from "./Projectile.js";

// TIPOS: patrol (padrão), jumper (pula periodicamente), shooter (atira projéteis)

export class Enemy {
    constructor(x, y, type, config = {}) {
        this.type = type; // "patrol" || "jumper" || "shooter"
        this.body = new PhysicsBody(x, y, 36, 36);
        // Configuração por tipo
        this.patrolLeft = config.patrolLeft ?? x - 100;
        this.patrolRight = config.patrolRight ?? x + 100;
        this.speed = config.speed ?? 100;
        this.facing = 1;
        this.alive = true;
        this.legAngle = 0;
        this.timer = 0;

        // Cores temáticas
        this.colorBody = config.colorBody ?? "#c0392b";
        this.colorHead = config.colorHead ?? "#e74c3c";
        this.theme = config.theme ?? {};

        // Comportamento específico por tipo
        this.jumpTimer = 0;
        this.jumpCooldown = config.jumpCooldown ?? 2; // segundos entre pulos
        this.jumpForce = config.jumpForce ?? -600;

        this.shootTimer = 0;
        this.shootCooldown = config.shootCooldown ?? 2.5;
        this.projectiles = [];
        this.detectionRange = config.detectionRange ?? 300;

        // Animação de ataque
        this.attackAnimTimer = 0;
        this.isAttacking = false;
    }

    update(delta, platforms, playerPos) {
        if (!this.alive) return;

        this.timer += delta;
        this.legAngle = Math.sin(this.timer * 14) * 0.35;

        // Comportamento específico
        switch (this.type) {
            case "jumper":
                this.updateJumper(delta);
                break;
            case "shooter":
                this.updateShooter(delta, playerPos);
                break;
            default:
                this.updatePatrol(delta);
        }

        this.body.update(delta);
        this.body.onGround = false;

        // Colisão com plataformas
        for (const platform of platforms) {
            const col = resolveAABB(this.body, platform);
            if (!col) continue;

            if (col.axis === "y" && col.direction === "bottom") {
                this.body.y -= col.overlap;
                this.body.vy = 0;
                this.body.onGround = true;
            } else if (col.axis === "x") {
                this.facing *= -1;
            }
        }

        // Limites de patrulha
        if (this.body.x <= this.patrolLeft) {
            this.body.x = this.patrolLeft;
            this.facing = 1;
        }
        if (this.body.x + this.body.width >= this.patrolRight) {
            this.body.x = this.patrolRight - this.body.width;
            this.facing = -1;
        }

        // Atualiza projéteis
        for (const proj of this.projectiles) {
            proj.update(delta, this.patrolRight + 500, 1000);
        }
        this.projectiles = this.projectiles.filter(p => p.alive);

        // Animação de ataque
        if (this.isAttacking) {
            this.attackAnimTimer += delta * 10;
            if (this.attackAnimTimer >= 1) {
                this.isAttacking = false;
                this.attackAnimTimer = 0;
            }
        }
    }

    updatePatrol(delta) {
        this.body.vx = this.facing * this.speed;
    }

    updateJumper(delta) {
        this.body.vx = this.facing * this.speed;

        this.jumpTimer += delta;
        if (this.jumpTimer >= this.jumpCooldown && this.body.onGround) {
            this.body.vy = this.jumpForce;
            this.jumpTimer = 0;
            this.body.onGround = false;
        }
    }

    updateShooter(delta, playerPos) {
        // Atirador se move mais devagar
        this.body.vx = this.facing * (this.speed * 0.5);

        if (!playerPos) return;

        const distX = playerPos.x - (this.body.x + this.body.width / 2);
        const distY = playerPos.y - (this.body.y + this.body.height / 2);
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Vira na direção do player se estiver no alcance
        if (Math.abs(distX) > 20) {
            this.facing = distX > 0 ? 1 : -1;
        }

        this.shootTimer += delta;
        if (this.shootTimer >= this.shootCooldown && distance < this.detectionRange) {
            this.shoot(playerPos);
            this.shootTimer = 0;
            this.isAttacking = true;
            this.attackAnimTimer = 0;
        }
    }

    shoot(playerPos) {
        const startX = this.body.x + this.body.width / 2;
        const startY = this.body.y + this.body.height / 2;

        // Calcula direção do player
        const dx = playerPos.x - startX;
        const dy = playerPos.y - startY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const speed = 350;
        const vx = (dx / dist) * speed;
        const vy = (dy / dist) * speed;

        const proj = new Projectile(startX - 6, startY - 6, vx, vy, this.theme);
        this.projectiles.push(proj);
    }

    render(ctx) {
        if (!this.alive) return;

        const { x, y, width, height } = this.body;
        const cx = x + width / 2;
        const cy = y + height;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(this.facing, 1);

        // Indicador de tipo acima da cabeça
        if (this.type === "jumper") {
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.font = "bold 12px monospace";
            ctx.textAlign = "center";
            ctx.fillText("↑", 0, -height - 18);
        } else if (this.type === "shooter") {
            ctx.fillStyle = "rgba(255,100,100,0.8)";
            ctx.font = "bold 12px monospace";
            ctx.textAlign = "center";
            ctx.fillText("◉", 0, -height - 18);
        }

        // Escala de ataque (incha ao atirar)
        const attackScale = this.isAttacking ? 1 + Math.sin(this.attackAnimTimer * Math.PI) * 0.15 : 1;
        ctx.scale(attackScale, attackScale);

        // Pernas
        this._drawLeg(ctx, -8, 0, this.legAngle, height);
        this._drawLeg(ctx, 8, 0, -this.legAngle, height);

        // Corpo
        ctx.fillStyle = this.colorBody;
        ctx.fillRect(-width / 2, -height, width, height * 0.65);

        // Cabeça
        ctx.fillStyle = this.colorHead;
        const hs = width * 0.75;
        ctx.fillRect(-hs / 2, -height - hs * 0.6, hs, hs * 0.75);

        // Olhos
        ctx.fillStyle = "#fff";
        ctx.fillRect(4, -height - hs * 0.45, 6, 6);
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(6, -height - hs * 0.38, 3, 3);

        // Sobrancelha
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(3, -height - hs * 0.52, 8, 2);

        ctx.restore();

        // Renderiza projéteis
        for (const proj of this.projectiles) {
            proj.render(ctx);
        }
    }

    _drawLeg(ctx, offsetX, offsetY, angle, height) {
        ctx.save();
        ctx.translate(offsetX, offsetY - height * 0.35);
        ctx.rotate(angle);
        ctx.fillStyle = "#922b21";
        ctx.fillRect(-4, 0, 8, height * 0.42);
        ctx.restore();
    }

    // Retorna todos os projéteis para verificação de colisão
    getProjectiles() {
        return this.projectiles.filter(p => p.alive);
    }
}