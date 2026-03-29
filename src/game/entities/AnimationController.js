export class AnimationController {
    constructor() {
        this.state = "idle";
        this.timer = 0;        // tempo acumulado no estado atual
        this.legAngle = 0;     // ângulo das pernas ao correr
        this.squash = 1;       // escala Y - squash & stretch
    }

    update(delta, body) {
        this.timer += delta;

        // Determina o estado baseado na física
        if (!body.onGround) {
            this.state = body.vy < 0 ? "jump" : "fall";
        } else if(Math.abs(body.vx) > 10) {
            this.state = "run";
        } else {
            this.state = "idle";
        }

        // Animação das pernas ao correr
        if (this.state === "run") {
            this.legAngle = Math.sin(this.timer * 16) * 0.7;
        } else if (this.state === "jump") {
            // Pernas levemente abertas no pulo
            this.legAngle = 0.35;
        } else if (this.state === "fall") {
            // Pernas levemente fechadas na queda
            this.legAngle = -0.2;
        } else {
            // Idle: volta para zero
            this.legAngle = 0;
        }

        // Squash ao aterrissar, stretch no pulo
        if (this.state === "jump") {
            this.squash += (0.85 - this.squash) * 0.2;
        } else if (this.state === "fall") {
            this.squash += (1.1 - this.squash) * 0.2;
        } else {
            this.squash += (1.0 - this.squash) * 0.3;
        }
    }
}