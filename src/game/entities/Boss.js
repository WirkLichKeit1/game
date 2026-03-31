import { PhysicsBody } from "../physics/PhysicsBody";
import { Projectile } from "./Projectile.js";

export class Boss {
    constructor(x, y, theme = {}) {
        this.body = new PhysicsBody(x, y, 80, 90);
        this.maxHp = 300;
        this.hp = this.maxHp;
        this.alive = true;
        this.defeated = false;

        // Cores temáticas
        this.colorBody = theme.bossBody || "#8b0000";
        this.colorHead = theme.bossHead || "#a52a2a";
        this.colorEye = theme.bossEye || "#ff4500";
        this.theme = theme;

        // Comportamento
        this.phase = 1; // 1, 2, 3 (fica mais rápido e agressivo)
        this.timer = 0;
        this.facing = 1;

        // Patrulha
        this.patrolLeft = x - 200;
        this.patrolRight = x + 200;
        this.speed = 80;

        // Ataques
        this.attackTimer = 0;
        this.attackCooldown = 2.5;
        this.projectiles = [];
        this.isAttacking = false;
        this.attackAnimTimer = 0;

        // Pulo especial
        this.jumpTimer = 0;
        this.jumpCooldown = 4;
        this.jumpCharging = false;
        this.chargeTimer = 0;

        // Animação
        this.breatheTimer = 0;
        this.legAngle = 0;

        // Invencibilidade após hit
        this.invincibleTimer = 0;
        this.flashTimer = 0;
    }

    takeDamage(damage = 50) {
        if (this.invincibleTimer > 0 || !this.alive) return false;

        this.hp = Math.max(0, this.hp - damage);
        this.invincibleTimer = 0.5;

        // Troca de fase baseado no HP
        if (this.hp <= this.maxHp * 0.66 && this.phase === 1) {
            this.phase = 2;
            this.speed = 120;
            this.attackCooldown = 1.8;
        } else if (this.hp <= this.maxHp * 0.33 && this.phase === 2) {
            this.phase = 3;
            this.speed = 150;
            this.attackCooldown = 1.2;
        }

        if (this.hp === 0) {
            this.alive = false;
            this.defeated = true;
        }

        return true;
    }

    update(delta, platforms, playerPos) {
        if (this.defeated) return;
        if (!this.alive) return;

        this.timer += delta;
        this.breatheTimer += delta;
        this.legAngle = Math.sin(this.timer * 10) * 0.4;

        if (this.invincibleTimer > 0) {
            this.invincibleTimer -= delta;
            this.flashTimer += delta * 20;
        }

        // Movimento de patrulha
        if (!this.jumpCharging) {
            this.body.vx = this.facing * this.speed;
        } else {
            this.body.vx = 0;
        }

        // Atualiza física
        this.body.update(delta);
        this.body.onGround = false;


        // Colisão com plataformas (simplificado, boss sempre no chão)
        for (const platform of platforms) {
            const overlap = this._checkPlatformCollision(platform);
            if (overlap) {
                this.body.y -= overlap;
                this.body.vy = 0;
                this.body.onGround = true;
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

        // Vira na direção do player
        if (playerPos && Math.abs(playerPos.x - this.body.x) > 50) {
            this.facing = playerPos.x > this.body.x ? 1 : -1;
        }

        // Sistema se ataques
        this.attackTimer += delta;
        if (this.attackTimer >= this.attackCooldown && playerPos) {
            this.performAttack(playerPos);
            this.attackTimer = 0;
        }

        // Pulo slam (fase 2+)
        if (this.phase >= 2) {
            this.jumpTimer += delta;
            if (this.jumpTimer >= this.jumpCooldown && this.body.onGround && !this.jumpCharging) {
                this.jumpCharging = true;
                this.chargeTimer = 0;
            }

            if (this.jumpCharging) {
                this.chargeTimer += delta;
                if (this.chargeTimer >= 0.6) {
                    this.body.vy = -750;
                    this.jumpCharging = false;
                    this.jumpTimer = 0;
                }
            }
        }

        // Atualiza projéteis
        for (const proj of this.projectiles) {
            proj.update(delta, this.patrolRight + 500, 1000);
        }
        this.projectiles = this.projectiles.filter(p => p.alive);

        // Animação de ataque
        if (this.isAttacking) {
            this.attackAnimTimer += delta * 8;
            if (this.attackAnimTimer >= 1) {
                this.isAttacking = false;
                this.attackAnimTimer = 0;
            }
        }
    }

    _checkPlatformCollision(platform) {
        const b = this.body.bounds;
        const p = platform.bounds;

        if (b.right <= p.left || b.left >= p.right || b.bottom <= p.top || b.top >= p.bottom) {
            return 0;
        }

        const overlapY = b.bottom - p.top;
        if (overlapY > 0 && overlapY < 20 && this.body.vy >= 0) {
            return overlapY;
        }
        return 0;
    }

    performAttack(playerPos) {
        this.isAttacking = true;
        this.attackAnimTimer = 0;

        const centerX = this.body.x + this.body.width / 2;
        const centerY = this.body.y + this.body.height / 2;

        if (this.phase === 1) {
            // Fase 1: atira um projétil reto
            this.shootSingle(centerX, centerY, playerPos);
        } else if (this.phase === 2) {
            // Fase 2: atira três projéteis em leque
            this.shootSpread(centerX, centerY, playerPos);
        } else {
            // Fase 3: atira cinco projéteis em padrão circular
            this.shootCircle(centerX, centerY);
        }
    }

    shootSingle(x, y, playerPos) {
        const dx = playerPos.x - x;
        const dy = playerPos.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = 300;

        const proj = new Projectile(x - 6, y - 6, (dx/dist) * speed, (dy/dist) * speed, this.theme);
        this.projectiles.push(proj);
    }

    shootSpread(x, y, playerPos) {
        const dx = playerPos.x - x;
        const dy = playerPos.y - y;
        const baseAngle = Math.atan2(dy, dx);
        const speed = 320;

        for (let i = -1; i <= 1; i++) {
            const angle = baseAngle + (i * 0.3);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const proj = new Projectile(x - 6, y - 6, vx, vy, this.theme);
            this.projectiles.push(proj);
        }
    }

    shootCircle(x, y) {
        const speed = 280;
        const count = 5;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + this.timer;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const proj = new Projectile(x - 6, y - 6, vx, vy, this.theme);
            this.projectiles.push(proj);
        }
    }

    render(ctx) {
        if (this.defeated) return;

        // Piscar quando invencível
        if (this.invincibleTimer > 0 && Math.floor(this.flashTimer) % 2 === 0) {
            return;
        }

        const { x, y, width, height } = this.body;
        const cx = x + width / 2;
        const cy = y + height;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(this.facing, 1);

        // Efeito de carregamento do pulo
        if (this.jumpCharging) {
            const chargeProgress = this.chargeTimer / 0.6;
            ctx.save();
            ctx.globalAlpha = 0.3 + chargeProgress * 0.4;
            ctx.fillStyle = this.colorEye;
            ctx.beginPath();
            ctx.arc(0, -height / 2, 40 * chargeProgress, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Escala de respiração
        const breathe = 1 + Math.sin(this.breatheTimer * 3) * 0.05;
        const attackScale = this.isAttacking ? 1 + Math.sin(this.attackAnimTimer * Math.PI) * 0.2 : 1;
        ctx.scale(breathe * attackScale, breathe * attackScale);

        // Pernas
        this._drawLeg(ctx, -16, 0, this.legAngle, height);
        this._drawLeg(ctx, 16, 0, -this.legAngle, height);

        // Corpo
        ctx.fillStyle = this.colorBody;
        ctx.fillRect(-width / 2, -height, width, height * 0.7);

        // Padrão de armadura
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(-width/2 + 5, -height + 10 + i * 15, width - 10, 8);
        }

        // Cabeça
        ctx.fillStyle = this.colorHead;
        const hs = width * 0.85;
        ctx.fillRect(-hs / 2, -height - hs * 0.7, hs, hs * 0.85);

        // Olhos brilhantes
        ctx.fillStyle = this.colorEye;
        const eyeGlow = 8 + Math.sin(this.breatheTimer * 4) * 2;
        ctx.shadowColor = this.colorEye;
        ctx.shadowBlur = eyeGlow;
        ctx.fillRect(10, -height - hs * 0.5, 12, 12);
        ctx.shadowBlur = 0;

        // Pupila
        ctx.fillStyle = "#fff";
        ctx.fillRect(13, -height - hs * 0.45, 6, 6);

        // Chifre (fase 2+)
        if (this.phase >= 2) {
            ctx.fillStyle = "#4a0000";
            ctx.beginPath();
            ctx.moveTo(-hs / 2 + 5, -height - hs * 0.7);
            ctx.lineTo(-hs / 2 - 5, -height - hs * 0.9);
            ctx.lineTo(-hs / 2 + 10, -height - hs * 0.75);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(hs / 2 - 5, -height - hs * 0.7);
            ctx.lineTo(hs / 2 + 5, -height - hs * 0.9);
            ctx.lineTo(hs / 2 - 10, -height - hs * 0.75);
            ctx.fill();
        }

        ctx.restore();

        // Barra de HP do boss
        this.renderHealthBar(ctx);

        // Projéteis
        for (const proj of this.projectiles) {
            proj.render(ctx);
        }
    }

    renderHealthBar(ctx) {
        const barWidth = 120;
        const barHeight = 10;
        const barX = this.body.x - this.body.width / 2 - barWidth / 2;
        const barY = this.body.y - 25;

        ctx.save();

        // Fundo da barra
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);

        // Barra vermelha (HP perdido)
        ctx.fillStyle = "#3a0000";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Barra de HP atual
        const hpPercent = this.hp / this.maxHp;
        const currentWidth = barWidth * hpPercent;

        // Cor baseada no HP
        let hpColor;
        if (hpPercent > 0.66) hpColor = "#ff6b6b";
        else if (hpPercent > 0.33) hpColor = "#ff9e3d";
        else hpColor = "#ffd93d";

        ctx.fillStyle = hpColor;
        ctx.fillRect(barX, barY, currentWidth, barHeight);

        // Brilho
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(barX, barY, currentWidth, barHeight / 2);

        // Texto de HP
        ctx.fillStyle = "#fff";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeText(`BOSS ${Math.ceil(this.hp)}/${this.maxHp}`, barX + barWidth / 2, barY - 4);
        ctx.fillText(`BOSS ${Math.ceil(this.hp)}/${this.maxHp}`, barX + barWidth / 2, barY - 4);

        // Indicador de fase
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = this.phase === 3 ? "#ff4444" : this.phase === 2 ? "#ffaa44" : "#fff";
        ctx.fillText(`FASE ${this.phase}`, barX + barWidth / 2, barY + barHeight + 11);

        ctx.restore();
    }

    _drawLeg(ctx, offsetX, offsetY, angle, height) {
        ctx.save();
        ctx.translate(offsetX, offsetY - height * 0.3);
        ctx.rotate(angle);
        ctx.fillStyle = "#5a0000";
        ctx.fillRect(-8, 0, 16, height * 0.45);
        ctx.restore();
    }

    getProjectiles() {
        return this.projectiles.filter(p => p.alive);
    }
}