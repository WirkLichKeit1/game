// Sons gerados via Web Audio API

export class AudioManager {
    constructor() {
        this._ctx = null;
    }

    // Inicializa o AudioContext na primeira interação usuário
    _getCtx() {
        if (!this._ctx) {
            this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Retoma se suspenso (política de autoplay dos browsers)
        if (this._ctx.state === "suspended") this._ctx.resume();
        return this._ctx;
    }

    // Pulo: tom curto subindo de 180Hz -> 320Hz
    jump() {
        try {
            const ctx = this._getCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "square";
            osc.frequency.setValueAtTime(180, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.12);
        } catch (_) {}
    }

    // Dano: ruído branco curto e grave
    damage() {
        try {
            const ctx = this._getCtx();
            const bufferSize = ctx.sampleRate * 0.15;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1);
            }

            const source = ctx.createBufferSource();
            source.buffer = buffer;

            // Filtro passa-baixa para deixar o som mais grave
            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.value = 280;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.linearRampValueAtTime(0, ctx.currentTime + 0.15);

            source.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            source.start(ctx.currentTime);
        } catch (_) {}
    }

    // Matar inimigo: tom descendente 440Hz -> 220Hz
    enemyDie() {
        try {
            const ctx = this._getCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "sine";
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.22);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.22);
        } catch (_) {}
    }

    // Vitória: sequência de notas ascendentes
    win() {
        try {
            const ctx = this._getCtx();
            const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                const t = ctx.currentTime + i * 0.12;
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(0.2, t);
                gain.gain.linearRampToValueAtTime(0, t * 0.15);

                osc.start(t);
                osc.stop(t + 0.15);
            })
        } catch (_) {}
    }

    destroy() {
        if (this._ctx) {
            this._ctx.close();
            this._ctx = null;
        }
    }
}