export class InputManager {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            jump: false,
            shoot: false,
        };
        this._onKeyDown = null;
        this._onKeyUp = null;
        this._bindKeyboard();
    }

    _bindKeyboard() {
        const map = {
            ArrowLeft: "left",
            KeyA: "left",
            ArrowRight: "right",
            KeyD: "right",
            ArrowUp: "jump",
            KeyW: "jump",
            Space: "jump",
            KeyZ: "shoot",
            KeyX: "shoot",
        };

        this._onKeyDown = (e) => {
            if (map[e.code]) {
                e.preventDefault();
                this.keys[map[e.code]] = true;
            }
        };

        this._onKeyUp = (e) => {
            if (map[e.code]) this.keys[map[e.code]] = false;
        }

        window.addEventListener("keydown", this._onKeyDown);
        window.addEventListener("keyup", this._onKeyUp);
    }

    destroy() {
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
    }

    // chamado pelos botões do D-pad
    press(key) { if (key in this.keys) this.keys[key] = true; }
    release(key) { if (key in this.keys) this.keys[key] = false; }
}