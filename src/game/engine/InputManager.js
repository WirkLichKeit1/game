export class InputManager {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            jump: false,
        };
        this._bindKeyboard();
    }

    _bindKeyboard() {
        const map = {
            ArrowLeft: "left", KeyA: "left",
            ArrowRight: "right", keyD: "right",
            ArrowUp: "jump", keyW: "jump", Space: "jump",
        };

        window.addEventListener("keydown", (e) => {
            if (map[e.code]) this.keys[map[e.code]] = true;
        });
        window.addEventListener("keyup", (e) => {
            if (map[e.code]) this.keys[map[e.code]] = false;
        });
    }

    // chamado pelos botões do D-pad
    press(key) { if (key in this.keys) this.keys[key] = true; }
    release(key) { if (key in this.keys) this.keys[key] = false; }
}