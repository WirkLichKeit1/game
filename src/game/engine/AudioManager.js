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

    // Pulo: duas notas rápidas subindo (estilo 8-bit)
    jump() {
        try {
            const ctx = this._getCtx();
            const t = ctx.currentTime;

            // Nota 1
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.type = "square";
            osc1.frequency.setValueAtTime(220, t);
            osc1.frequency.linearRampToValueAtTime(440, t + 0.06);
            gain1.gain.setValueAtTime(0.15, t);
            gain1.gain.linearRampToValueAtTime(0, t + 0.08);

            osc1.start(t);
            osc1.stop(t + 0.08);

            // Nota 2 (mais aguda, logo depois)
            const osc2 = ctx.createOscillator();
            const gain2 = createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = "square";
            osc2.frequency.setValueAtTime(440, t + 0.07);
            osc2.frequency.linearRampToValueAtTime(660, t + 0.14);
            gain2.gain.setValueAtTime(0.12, t + 0.07);
            gain2.gain.linearRampToValueAtTime(0, t + 0.16);
            osc2.start(t + 0.07);
            osc2.stop(t + 0.16);
        } catch (_) {}
    }

    // Dano: ruído branco curto e grave
    damage() {
        try {
            const ctx = this._getCtx();
            const t = ctx.currentTime;

            // Ruído branco filtrado
            const bufferSize = Math.floor(ctx.sampleRate * 0.2);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1);
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            // Filtro passa-baixa para deixar o som mais grave
            const filter = ctx.createBiquadFilter();
            
            filter.type = "bandpass";
            filter.frequency.value = 180;
            filter.Q.value = 0.8;

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.6, t);
            noiseGain.gain.linearRampToValueAtTime(0, t + 0.2);

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            
            noise.start(t);

            // Tom grave descendente junto
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(200, t);
            osc.frequency.exponentialRampToValueAtTime(60, t + 0.25);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.linearRampToValueAtTime(0, t + 0.25);
            osc.start(t);
            osc.stop(t + 0.25);
        } catch (_) {}
    }

    // Matar inimigo: "pop" com bounce
    enemyDie() {
        try {
            const ctx = this._getCtx();
            const t = ctx.currentTime;

            // Tom principal descendente
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(600, t);
            osc1.frequency.exponentialRampToValueAtTime(200, t + 0.15);
            gain1.gain.setValueAtTime(0.3, t);
            gain1.gain.linearRampToValueAtTime(0, t + 0.18);

            osc1.start(t);
            osc1.stop(t + 0.18);

            // "Squish" - tom agudo curto
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = "square";
            osc2.frequency.setValueAtTime(800, t + 0.05);
            osc2.frequency.linearRampToValueAtTime(400, t + 0.12);
            gain2.gain.setValueAtTime(0.12, t + 0.05);
            gain2.gain.linearRampToValueAtTime(0, t + 0.14);
            osc2.start(t + 0.05);
            osc2.stop(t + 0.14);

            // Bounce - notinha subindo no final
            const osc3 = ctx.createOscillator();
            const gain3 = ctx.createGain();
            osc3.connect(gain3);
            gain3.connect(ctx.destination);
            osc3.type = "sine";
            osc3.frequency.setValueAtTime(300, t + 0.16);
            osc3.frequency.linearRampToValueAtTime(500, t + 0.22);
            gain3.gain.setValueAtTime(0.18, t + 0.16);
            gain3.gain.linearRampToValueAtTime(0, t + 0.24);
            osc3.start(t + 0.16);
            osc3.stop(t + 0.24);
        } catch (_) {}
    }

    // Vitória: fanfarra 8-bit ascendente
    win() {
        try {
            const ctx = this._getCtx();
            const t = ctx.currentTime;

            // Melodia: C E G C (oitava acima) + acorde final
            const melody = [
                { freq: 523, start: 0, dur: 0.12 },
                { freq: 659, start: 0.13, dur: 0.12 },
                { freq: 784, start: 0.26, dur: 0.12 },
                { freq: 1047, start: 0.39, dur: 0.25 },
            ];
            
            melody.forEach(({ freq, start, dur }) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = "square";
                osc.frequency.setValueAtTime(freq, t + start);
                gain.gain.setValueAtTime(0.18, t + start);
                gain.gain.setValueAtTime(0.18, t + start + dur * 0.7);
                gain.gain.linearRampToValueAtTime(0, t + start + dur);

                osc.start(t + start);
                osc.stop(t + start + dur);
            });

            // Harmonia: quinta abaixo nas duas últimas notas
            const harmony = [
                { freq: 392, start: 0.26, dur: 0.2 },
                { freq: 523, start: 0.39, dur: 0.25 },
            ];

            harmony.forEach(({ freq, start, dur }) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, t + start);
                gain.gain.setValueAtTime(0.1, t + start);
                gain.gain.linearRampToValueAtTime(0, t + start + dur);
                osc.start(t + start);
                osc.stop(t + start + dur);
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