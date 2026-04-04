import { PhysicsBody } from "../physics/PhysicsBody";
import { Projectile }  from "./Projectile.js";

export class Boss {
    constructor(x, y, theme = {}) {
        this.body    = new PhysicsBody(x, y, 80, 90);
        this.maxHp   = 300;
        this.hp      = this.maxHp;
        this.alive   = true;
        this.defeated = false;

        // Cores
        this.colorBody = theme.bossBody || "#8b0000";
        this.colorHead = theme.bossHead || "#a52a2a";
        this.colorEye  = theme.bossEye  || "#ff4500";
        this.theme     = theme;

        // ── Spawn dramático ──────────────────────────────────────────
        this.spawning      = false;  // true durante a animação de entrada
        this.spawnProgress = 0;      // 0→1
        this.spawnDuration = 1.6;    // segundos para surgir completamente
        this.roarEmitted   = false;  // dispara evento ao completar spawn

        // ── Comportamento ────────────────────────────────────────────
        this.phase  = 1;
        this.timer  = 0;
        this.facing = 1;

        this.patrolLeft  = x - 200;
        this.patrolRight = x + 200;
        this.speed       = 80;

        // Ataques
        this.attackTimer    = 0;
        this.attackCooldown = 2.5;
        this.projectiles    = [];
        this.isAttacking    = false;
        this.attackAnimTimer = 0;

        // Pulo slam
        this.jumpTimer    = 0;
        this.jumpCooldown = 4;
        this.jumpCharging = false;
        this.chargeTimer  = 0;

        // Animação
        this.breatheTimer = 0;
        this.legAngle     = 0;

        // Invencibilidade após hit
        this.invincibleTimer = 0;
        this.flashTimer      = 0;
    }

    // ─── Spawn ─────────────────────────────────────────────────────────────────

    startSpawn() {
        this.spawning      = true;
        this.spawnProgress = 0;
        this.roarEmitted   = false;
    }

    get isSpawning() {
        return this.spawning;
    }

    // ─── Dano ──────────────────────────────────────────────────────────────────

    takeDamage(damage = 50) {
        // Invencível durante spawn e após hit
        if (this.spawning || this.invincibleTimer > 0 || !this.alive) return false;

        this.hp = Math.max(0, this.hp - damage);
        this.invincibleTimer = 0.5;

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
            this.alive    = false;
            this.defeated = true;
        }

        return true;
    }

    // ─── Update ────────────────────────────────────────────────────────────────

    update(delta, platforms, playerPos) {
        if (this.defeated) return;

        this.timer       += delta;
        this.breatheTimer += delta;

        // ── Animação de spawn ──
        if (this.spawning) {
            this.spawnProgress = Math.min(1, this.spawnProgress + delta / this.spawnDuration);
            this.legAngle      = Math.sin(this.timer * 10) * 0.4 * this.spawnProgress;

            if (this.spawnProgress >= 1 && !this.roarEmitted) {
                this.roarEmitted = true;
                this.spawning    = false;
                // Sinaliza para o Game que o roar aconteceu
                this._roar = true;
            }
            return; // não atualiza IA durante spawn
        }

        if (!this.alive) return;

        this.legAngle = Math.sin(this.timer * 10) * 0.4;

        if (this.invincibleTimer > 0) {
            this.invincibleTimer -= delta;
            this.flashTimer      += delta * 20;
        }

        // Patrulha
        if (!this.jumpCharging) {
            this.body.vx = this.facing * this.speed;
        } else {
            this.body.vx = 0;
        }

        this.body.update(delta);
        this.body.onGround = false;

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

        // Vira para o player
        if (playerPos && Math.abs(playerPos.x - this.body.x) > 50) {
            this.facing = playerPos.x > this.body.x ? 1 : -1;
        }

        // Ataques
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
                this.chargeTimer  = 0;
            }
            if (this.jumpCharging) {
                this.chargeTimer += delta;
                if (this.chargeTimer >= 0.6) {
                    this.body.vy      = -750;
                    this.jumpCharging = false;
                    this.jumpTimer    = 0;
                }
            }
        }

        for (const proj of this.projectiles) {
            proj.update(delta, this.patrolRight + 500, 1000);
        }
        this.projectiles = this.projectiles.filter(p => p.alive);

        if (this.isAttacking) {
            this.attackAnimTimer += delta * 8;
            if (this.attackAnimTimer >= 1) {
                this.isAttacking     = false;
                this.attackAnimTimer = 0;
            }
        }
    }

    _checkPlatformCollision(platform) {
        const b = this.body.bounds;
        const p = platform.bounds;
        if (b.right <= p.left || b.left >= p.right || b.bottom <= p.top || b.top >= p.bottom) return 0;
        const overlapY = b.bottom - p.top;
        if (overlapY > 0 && overlapY < 20 && this.body.vy >= 0) return overlapY;
        return 0;
    }

    performAttack(playerPos) {
        this.isAttacking     = true;
        this.attackAnimTimer = 0;

        const cx = this.body.x + this.body.width  / 2;
        const cy = this.body.y + this.body.height / 2;

        if (this.phase === 1)      this.shootSingle(cx, cy, playerPos);
        else if (this.phase === 2) this.shootSpread(cx, cy, playerPos);
        else                       this.shootCircle(cx, cy);
    }

    shootSingle(x, y, playerPos) {
        const dx = playerPos.x - x;
        const dy = playerPos.y - y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        this.projectiles.push(new Projectile(x - 6, y - 6, (dx/d)*300, (dy/d)*300, this.theme));
    }

    shootSpread(x, y, playerPos) {
        const base = Math.atan2(playerPos.y - y, playerPos.x - x);
        for (let i = -1; i <= 1; i++) {
            const angle = base + i * 0.3;
            this.projectiles.push(new Projectile(x - 6, y - 6, Math.cos(angle)*320, Math.sin(angle)*320, this.theme));
        }
    }

    shootCircle(x, y) {
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i + this.timer;
            this.projectiles.push(new Projectile(x - 6, y - 6, Math.cos(angle)*280, Math.sin(angle)*280, this.theme));
        }
    }

    getProjectiles() {
        return this.projectiles.filter(p => p.alive);
    }

    // ─── Render ────────────────────────────────────────────────────────────────

    render(ctx) {
        if (this.defeated) return;

        const { x, y, width, height } = this.body;
        const cx = x + width  / 2;
        const cy = y + height;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(this.facing, 1);

        if (this.spawning) {
            this._renderSpawn(ctx, width, height);
            ctx.restore();
            return;
        }

        // Pisca quando invencível
        if (this.invincibleTimer > 0 && Math.floor(this.flashTimer) % 2 === 0) {
            ctx.restore();
            return;
        }

        this._renderBody(ctx, width, height);
        ctx.restore();

        this.renderHealthBar(ctx);
        for (const proj of this.projectiles) proj.render(ctx);
    }

    _renderSpawn(ctx, width, height) {
        const p = this.spawnProgress;

        // Sobe do chão: começa enterrado, emerge gradualmente
        const offsetY  = (1 - p) * height;
        ctx.translate(0, offsetY);

        // Alpha cresce com o progresso
        ctx.globalAlpha = p;

        // Aura de spawn (círculo que encolhe)
        const auraRadius = (1 - p) * 80 + 20;
        ctx.save();
        ctx.globalAlpha = (1 - p) * 0.6;
        ctx.fillStyle   = this.colorEye;
        ctx.beginPath();
        ctx.arc(0, -height / 2, auraRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Escala cresce de 0.3 para 1
        const scale = 0.3 + p * 0.7;
        ctx.scale(scale, scale);

        ctx.globalAlpha = p;
        this._renderBody(ctx, width, height);
    }

    _renderBody(ctx, width, height) {
        const hs = width * 0.85;

        // Efeito de carregamento do pulo
        if (this.jumpCharging) {
            const cp = this.chargeTimer / 0.6;
            ctx.save();
            ctx.globalAlpha = 0.3 + cp * 0.4;
            ctx.fillStyle   = this.colorEye;
            ctx.beginPath();
            ctx.arc(0, -height / 2, 40 * cp, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        const breathe      = 1 + Math.sin(this.breatheTimer * 3) * 0.05;
        const attackScale  = this.isAttacking ? 1 + Math.sin(this.attackAnimTimer * Math.PI) * 0.2 : 1;
        ctx.scale(breathe * attackScale, breathe * attackScale);

        // Pernas
        this._drawLeg(ctx, -16, 0,  this.legAngle, height);
        this._drawLeg(ctx,  16, 0, -this.legAngle, height);

        // Corpo
        ctx.fillStyle = this.colorBody;
        ctx.fillRect(-width / 2, -height, width, height * 0.7);

        // Armadura
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(-width/2 + 5, -height + 10 + i * 15, width - 10, 8);
        }

        // Cabeça
        ctx.fillStyle = this.colorHead;
        ctx.fillRect(-hs / 2, -height - hs * 0.7, hs, hs * 0.85);

        // Olho
        ctx.fillStyle  = this.colorEye;
        ctx.shadowColor = this.colorEye;
        ctx.shadowBlur  = 8 + Math.sin(this.breatheTimer * 4) * 2;
        ctx.fillRect(10, -height - hs * 0.5, 12, 12);
        ctx.shadowBlur  = 0;
        ctx.fillStyle   = "#fff";
        ctx.fillRect(13, -height - hs * 0.45, 6, 6);

        // Chifres (fase 2+)
        if (this.phase >= 2) {
            ctx.fillStyle = "#4a0000";
            ctx.beginPath();
            ctx.moveTo(-hs/2 + 5, -height - hs*0.7);
            ctx.lineTo(-hs/2 - 5, -height - hs*0.9);
            ctx.lineTo(-hs/2 + 10, -height - hs*0.75);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(hs/2 - 5, -height - hs*0.7);
            ctx.lineTo(hs/2 + 5, -height - hs*0.9);
            ctx.lineTo(hs/2 - 10, -height - hs*0.75);
            ctx.fill();
        }
    }

    renderHealthBar(ctx) {
        const bW  = 120;
        const bH  = 10;
        // CORRIGIDO: centralizado sobre o boss
        const bX  = this.body.x + this.body.width / 2 - bW / 2;
        const bY  = this.body.y - 30;

        ctx.save();

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(bX - 2, bY - 2, bW + 4, bH + 4);

        ctx.fillStyle = "#3a0000";
        ctx.fillRect(bX, bY, bW, bH);

        const pct = this.hp / this.maxHp;
        const col = pct > 0.66 ? "#ff6b6b" : pct > 0.33 ? "#ff9e3d" : "#ffd93d";
        ctx.fillStyle = col;
        ctx.fillRect(bX, bY, bW * pct, bH);

        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(bX, bY, bW * pct, bH / 2);

        ctx.fillStyle  = "#fff";
        ctx.font       = "bold 8px monospace";
        ctx.textAlign  = "center";
        ctx.strokeStyle = "#000";
        ctx.lineWidth   = 2;
        const label = `BOSS ${Math.ceil(this.hp)}/${this.maxHp}`;
        ctx.strokeText(label, bX + bW/2, bY - 4);
        ctx.fillText(label,   bX + bW/2, bY - 4);

        ctx.font      = "bold 9px monospace";
        ctx.fillStyle = this.phase === 3 ? "#ff4444" : this.phase === 2 ? "#ffaa44" : "#fff";
        ctx.fillText(`FASE ${this.phase}`, bX + bW/2, bY + bH + 11);

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
}