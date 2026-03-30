[🇧🇷 Leia em Português](README.md)

# 🦀 Mangue Run

A browser-based 2D side-scrolling platformer built with **React 19** and a fully custom **Canvas game engine** written from scratch in vanilla JavaScript. Inspired by the mangue beat culture and the people of Pernambuco, Brazil.

Jump over gaps, stomp enemies, and reach the flag at the end of each level.

---

## 📸 Preview

> Run the project locally and open your browser to see it in action.

---

## 🕹️ Gameplay

- **Move** left and right across a 6000px wide scrolling world
- **Jump** on platforms and avoid falling into gaps
- **Stomp enemies** by jumping on their heads to defeat them
- **Reach the flag** at the end of the level to win
- You have **3 lives** — touching an enemy from the side resets your position and costs one life
- After losing all lives, a **Game Over** screen appears with the option to retry
- A brief **invincibility window** (1.5 seconds) protects you after taking damage
- **3 levels** — each unlocked by completing the previous one, progress saved in `localStorage`

---

## 🎮 Controls

### Keyboard

| Action      | Keys                        |
|-------------|-----------------------------|
| Move Left   | `←` Arrow / `A`             |
| Move Right  | `→` Arrow / `D`             |
| Jump        | `↑` Arrow / `W` / `Space`   |

### Mobile / Touch

An on-screen **D-Pad** is rendered at the bottom of the screen:

- `◀` / `▶` — move left / right
- `▲` — jump

---

## 🛠️ Tech Stack

| Layer         | Technology                         |
|---------------|------------------------------------|
| UI Framework  | React 19                           |
| Rendering     | HTML5 Canvas API                   |
| Build Tool    | Vite 8                             |
| Language      | JavaScript (ESM)                   |
| Styling       | Inline styles / CSS-in-JS          |
| Physics       | Custom AABB engine (from scratch)  |
| Audio         | Web Audio API (procedural, no files) |

No external game libraries are used. The entire game engine is hand-written.

---

## 📁 Project Structure

```
src/
├── App.jsx                        # Root component — wires game, HUD, and D-Pad
├── main.jsx                       # React entry point
│
├── components/
│   ├── GameCanvas.jsx             # Mounts canvas and manages Game lifecycle
│   ├── DPad.jsx                   # Touch/mobile directional pad overlay
│   └── HUD.jsx                    # Lives display, Game Over, and Win overlays
│
├── screens/
│   └── MenuScreen.jsx             # Main menu with level select and credits
│
├── hooks/
│   ├── useGameState.js            # React state: lives, game status, transitions
│   └── useLayout.js               # Responsive layout and orientation management
│
└── game/                          # Pure JS game engine (zero React dependencies)
    ├── Game.js                    # Main game class — world setup, update/render loop
    ├── LevelManager.js            # Level loader and entity builder
    │
    ├── engine/
    │   ├── GameLoop.js            # requestAnimationFrame loop with delta-time
    │   ├── Camera.js              # Smooth-follow camera with shake and world clamping
    │   ├── InputManager.js        # Keyboard bindings + programmatic press/release
    │   ├── ParticleSystem.js      # Dust, pop, and damage flash particle effects
    │   └── AudioManager.js        # Procedural 8-bit sound via Web Audio API
    │
    ├── entities/
    │   ├── Player.js              # Player movement, collision resolution, rendering
    │   ├── Enemy.js               # Patrol AI, stomp detection, animated rendering
    │   ├── Platform.js            # Static platform with bounds and canvas rendering
    │   └── AnimationController.js # State machine: idle / run / jump / fall
    │
    ├── levels/
    │   ├── level1.js              # Praia do Pina — introductory beach level
    │   ├── level2.js              # Capibaribe — mangrove river level
    │   └── level3.js              # Olinda Alta — historic hills level
    │
    ├── parallax/
    │   ├── parallaxBeach.js       # Beach parallax layers (clouds, sea, waves)
    │   ├── parallaxMangrove.js    # Mangrove parallax layers (fog, trees, river)
    │   └── parallaxOlinda.js      # Olinda parallax layers (sunset clouds, colonial buildings)
    │
    └── physics/
        ├── PhysicsBody.js         # Velocity, gravity integration, AABB bounds
        └── AABB.js                # Axis-aligned bounding box collision resolver
```

---

## ⚙️ Architecture

### Engine Decoupling

The game engine is fully decoupled from React. `Game.js` is a plain JavaScript class instantiated inside a `useEffect` in `GameCanvas.jsx`. React only manages UI state (lives, game status) via callbacks passed down at construction time.

```
React (UI state)
    └── GameCanvas.jsx
            └── Game.js ──► GameLoop (rAF)
                                ├── update(delta)
                                │       ├── Player.update()
                                │       ├── Enemy.update()
                                │       ├── Camera.follow()
                                │       ├── ParticleSystem.update()
                                │       └── collision checks
                                └── render()
                                        ├── sky gradient
                                        ├── _renderParallax()
                                        ├── Camera.begin()
                                        ├── Platform.render()
                                        ├── _renderFlag()
                                        ├── Enemy.render()
                                        ├── Player.render()
                                        ├── ParticleSystem.render()
                                        ├── Camera.end()
                                        └── _renderLevelName()
```

### Physics

Collision detection uses **AABB (Axis-Aligned Bounding Box)** with minimum-overlap resolution. The engine determines which axis has the least penetration and resolves along that axis, correctly distinguishing top/bottom and left/right hits.

### Camera

The camera uses **linear interpolation (lerp)** to smoothly follow the player. It is clamped to the world boundaries so the background never shows beyond the edges. A screen-shake system with configurable magnitude and duration adds juice to impacts.

### Animation

`AnimationController` is a lightweight state machine that drives squash-and-stretch scaling and procedural leg swing animation based on the player's velocity and ground state.

### Audio

All sounds are generated at runtime using the **Web Audio API** — no audio files are bundled. The `AudioManager` lazy-initializes an `AudioContext` on first user interaction to comply with browser autoplay policies.

---

## 🔬 Complete API Reference

---

### `Game` — `src/game/Game.js`

The main game class. Owns all subsystems and drives the update/render loop.

#### `constructor(canvas, callbacks, levelId = 1)`

| Parameter   | Type       | Description                                           |
|-------------|------------|-------------------------------------------------------|
| `canvas`    | `HTMLCanvasElement` | The target canvas element                    |
| `callbacks` | `{ onLoseLife: Function, onWin: Function }` | Callbacks into React state |
| `levelId`   | `number`   | Level to load on instantiation (default: `1`)         |

Creates all subsystems: `InputManager`, `ParticleSystem`, `AudioManager`, `LevelManager`, `GameLoop`, and `Camera`. Calls `_applyLevel()` internally.

#### `_applyLevel()`

Reads data from `LevelManager` and populates the game's working properties: `platforms`, `enemies`, `flagX`, `theme`, `parallax`, `WORLD_WIDTH`, `WORLD_HEIGHT`. Creates a fresh `Player`, resets `invincible` timer, creates a new `Camera`, and clears the `ParticleSystem`.

#### `reset(callbacks, levelId?)`

Resets the game state, optionally changing to a new level. Replaces `callbacks`, calls `LevelManager.load()` if a new `levelId` is given, and re-runs `_applyLevel()`.

#### `start()`

Starts the `GameLoop` (begins the `requestAnimationFrame` loop).

#### `stop()`

Stops the `GameLoop` without destroying the game instance.

#### `destroy()`

Stops the loop, destroys `InputManager` keyboard listeners, and closes the `AudioContext`.

#### `update(delta)`

Main update tick called every frame. Responsibilities:
- Triggers dust particles on jump takeoff and landing.
- Updates `Player`, `Camera`, `ParticleSystem`, and all `Enemy` instances.
- Decrements the `invincible` timer.
- Calls `_checkEnemyCollisions()`, `_checkFall()`, `_checkWin()`.

#### `_checkEnemyCollisions()`

Skipped if `invincible > 0`. Iterates all living enemies and runs `resolveAABB` against the player. If the collision axis is `y` and direction is `bottom` with positive `vy` → stomp kill (enemy dies, player bounces, particles, camera shake). Otherwise → player takes damage (invincibility granted, damage flash, camera shake, player repositioned to spawn, `onLoseLife` called).

#### `_checkFall()`

If `player.body.y > WORLD_HEIGHT + 100`, the player fell into a pit. Repositions to spawn point, triggers camera shake and damage sound, calls `onLoseLife`.

#### `_checkWin()`

If `player.body.x >= flagX`, the level is complete. Plays win sound and calls `onWin(levelId)`.

#### `render()`

Full render pipeline per frame:
1. Clear canvas.
2. Draw sky gradient using `theme.sky` / `theme.skyBottom` / `theme.ground`.
3. Call `_renderParallax()`.
4. Draw water strip at canvas bottom (if `theme.water` defined).
5. `Camera.begin()` — apply camera transform.
6. Render all `Platform` instances.
7. Call `_renderFlag()`.
8. Render all `Enemy` instances (skip dead ones internally).
9. Render `Player` (with invincibility flicker at 8Hz).
10. Render `ParticleSystem`.
11. `Camera.end()` — restore transform.
12. Call `_renderLevelName()`.

#### `_renderParallax(ctx)`

Iterates `this.parallax` layers. For each layer, calculates horizontal offset based on `camera.x * layer.speed`, tiles the layer across the viewport, and applies `layer.alpha` via `globalAlpha`.

#### `_renderFlag(ctx)`

Draws the level end flag: a grey pole at `flagX` + a triangular flag using `theme.flag` color.

#### `_renderLevelName(ctx)`

Renders the level name (`LevelManager.data.name`) in the top-right corner using a semi-transparent monospace font.

---

### `LevelManager` — `src/game/LevelManager.js`

Loads level data and constructs game entities from raw JSON-like configuration objects.

#### `constructor(levelId = 1)`

Calls `load(levelId)` immediately.

#### `load(levelId, viewWidth = 800)`

Resolves the level data object from the `LEVELS` registry (keys 1–3). Populates:
- `data`, `theme`, `worldWidth`, `worldHeight`, `flagX`, `playerStart`
- `platforms` — array of `Platform` instances built from `data.platforms`
- `enemies` — array of `Enemy` instances built from `data.enemies` (respects per-enemy `speed` if present)
- `parallax` — calls the appropriate parallax factory function

---

### `GameLoop` — `src/game/engine/GameLoop.js`

Manages the `requestAnimationFrame` loop with consistent delta-time.

#### `constructor(updateFn, renderFn)`

Stores references to the `update` and `render` functions.

#### `start()`

Sets `running = true` and kicks off the rAF loop.

#### `stop()`

Sets `running = false` and cancels the pending rAF via `cancelAnimationFrame`.

#### `loop(timestamp)`

Internal rAF callback. Computes `delta` in seconds (`max(dt / 1000, 0.05)` to prevent spiral-of-death on tab focus restore). Calls `update(delta)` then `render()`.

---

### `Camera` — `src/game/engine/Camera.js`

Smooth-follow camera with world clamping and screen shake.

#### `constructor(worldWidth, worldHeight, viewWidth, viewHeight)`

Initializes camera position to `(0, 0)` and stores world and view dimensions. Initializes shake state.

#### `shake(magnitude = 6, duration = 0.3)`

Triggers a screen-shake effect. `magnitude` is in pixels; `duration` is in seconds.

#### `follow(target, delta)`

Computes the ideal camera position to center `target` in the viewport. Applies lerp with `speed = 8`. Clamps result to world bounds. Updates shake offset: decays linearly over `_shakeTimer`, applies random offset within current magnitude.

#### `begin(ctx)`

Saves canvas state and applies `ctx.translate(-x + shakeOffsetX, -y + shakeOffsetY)` to shift the world into view.

#### `end(ctx)`

Restores canvas state to undo the camera transform.

---

### `InputManager` — `src/game/engine/InputManager.js`

Handles keyboard input and exposes a programmatic press/release API for the D-Pad.

#### `constructor()`

Initializes `keys = { left, right, jump }` all `false`. Calls `_bindKeyboard()`.

#### `_bindKeyboard()`

Attaches `keydown` / `keyup` listeners to `window`. Maps `ArrowLeft`, `KeyA` → `left`; `ArrowRight`, `KeyD` → `right`; `ArrowUp`, `KeyW`, `Space` → `jump`.

#### `destroy()`

Removes the `keydown` and `keyup` event listeners from `window`.

#### `press(key)`

Sets `keys[key] = true`. Called by D-Pad button `onPointerDown`.

#### `release(key)`

Sets `keys[key] = false`. Called by D-Pad button `onPointerUp` and `onPointerLeave`.

---

### `ParticleSystem` — `src/game/engine/ParticleSystem.js`

Manages all particle effects. Particles are plain objects stored in a flat array.

#### `constructor()`

Initializes `this.particles = []`.

#### `spawnDust(x, y, color)`

Spawns 6 small square particles for landing/takeoff dust. Each has randomized velocity (spread horizontally, upward burst), lifetime `0.35–0.55s`, and size `3–7px`.

#### `spawnEnemyPop(x, y, color)`

Spawns 10 particles in a radial burst pattern (evenly spaced angles). Each flies outward at `120–220px/s` with an upward bias, lifetime `0.4–0.6s`, size `4–9px`.

#### `spawnDamageFlash(x, y)`

Spawns a single expanding circle flash particle centered on the player. Starts at radius 20, expands as `alpha` decreases, lifetime `0.25s`.

#### `update(delta)`

Decrements `life` for all particles. Integrates `vx` / `vy` with `delta`. Applies light gravity (`200 px/s²`) to dust and pop particles. Removes dead particles (`life <= 0`).

#### `render(ctx)`

Iterates all particles. Applies `globalAlpha = life / maxLife`. Flash type: draws expanding circle. Dust/pop types: draws square scaled by `size * alpha`.

#### `clear()`

Empties the particles array. Called on level reset.

---

### `AudioManager` — `src/game/engine/AudioManager.js`

Generates all game sounds procedurally using the Web Audio API. No audio files required.

#### `constructor()`

Sets `this._ctx = null`. Context is lazy-initialized on first sound call.

#### `_getCtx()`

Returns (and resumes if suspended) the shared `AudioContext`. Creates one on first call. Handles browser autoplay policy by calling `resume()` when state is `"suspended"`.

#### `jump()`

Two ascending square-wave notes: `220→440 Hz` (60ms) then `440→660 Hz` (70ms). Simulates a classic 8-bit jump sound.

#### `damage()`

Bandpass-filtered white noise burst (180 Hz center) + a sawtooth oscillator sweeping `200→60 Hz`. Conveys impact and disorientation.

#### `enemyDie()`

Three-part sound: descending sine `600→200 Hz` (main thud), square squish `800→400 Hz` (delayed), ascending sine `300→500 Hz` (bounce). Creates a satisfying "stomp pop."

#### `win()`

Ascending C–E–G–C melody using square oscillators + sine harmony on the last two notes. Classic 8-bit fanfare.

#### `destroy()`

Closes and nullifies the `AudioContext` to free browser resources.

---

### `PhysicsBody` — `src/game/physics/PhysicsBody.js`

Represents a movable axis-aligned rectangle with velocity and gravity.

#### `constructor(x, y, width, height)`

Initializes position, dimensions, `vx = 0`, `vy = 0`, `onGround = false`.

#### `update(delta)`

Applies gravity (`1800 px/s²`) to `vy` when `!onGround`. Integrates velocity: `x += vx * delta`, `y += vy * delta`.

#### `get bounds`

Returns `{ left, right, top, bottom }` from current position and dimensions. Used by `resolveAABB`.

---

### `resolveAABB(moving, static_)` — `src/game/physics/AABB.js`

Pure function. Detects and classifies a collision between two objects that expose a `bounds` getter.

**Parameters:** `moving` (PhysicsBody), `static_` (PhysicsBody or Platform)

**Returns:** `null` if no collision, or `{ axis: "x"|"y", direction: "left"|"right"|"top"|"bottom", overlap: number }`.

**Algorithm:**
1. Early-out with separating-axis test.
2. Compute `overlapX` and `overlapY`.
3. Resolve along the axis with smaller penetration (minimum translation vector).
4. Classify direction from which side has less penetration.

---

### `Player` — `src/game/entities/Player.js`

The player character. Owns a `PhysicsBody` and an `AnimationController`.

#### `constructor(x, y)`

Creates `PhysicsBody(x, y, 40, 50)`, sets `facing = 1`, creates `AnimationController`.

#### `update(delta, input, platforms, worldWidth)`

- Reads `input.keys` to set `body.vx` (±280 px/s) and update `facing`.
- Applies jump force (`-850 px/s`) if `keys.jump && body.onGround`.
- Calls `body.update(delta)`.
- Resets `onGround = false`.
- Iterates `platforms`, calls `resolveAABB`, resolves position on collision:
  - Y-bottom: land on top, zero `vy`, set `onGround = true`.
  - Y-top: ceiling hit, zero `vy`, push down.
  - X: side push, zero `vx`.
- Clamps `body.x` to world boundaries.
- Calls `anim.update(delta, body)`.

#### `render(ctx)`

Draws the player using canvas 2D primitives (no sprites):
- Translates to foot-center, applies horizontal `facing` scale and vertical `squash` scale.
- Draws two procedural legs with `_drawLeg()`, rotated by `±legAngle`.
- Draws body rectangle (color shifts lighter when airborne).
- Draws head rectangle with eye and pupil.

#### `_drawLeg(ctx, offsetX, offsetY, angle, height)`

Draws a single leg segment. Translates to hip position, rotates by `angle`, draws a 8×(height×0.42) rectangle.

---

### `Enemy` — `src/game/entities/Enemy.js`

Patrol enemy with simple AI, physics, and animated rendering.

#### `constructor(x, y, patrolLeft, patrolRight, speed = 100, theme = {})`

Creates `PhysicsBody(x, y, 36, 36)`. Sets patrol bounds, speed, `facing = 1`, `alive = true`. Reads `theme.enemy` and `theme.enemyHead` for colors.

#### `update(delta, platforms)`

Returns immediately if `!alive`. Increments `timer`, updates `legAngle` via sine wave. Sets `body.vx = facing * speed`. Calls `body.update(delta)`. Resolves platform collisions (land on top, reverse on X hit). Reverses `facing` at patrol boundaries.

#### `render(ctx)`

Skips if `!alive`. Translates to foot-center, applies `facing` scale. Draws two legs via `_drawLeg()`. Draws body, head, white eyes, dark pupils, and angry eyebrows.

#### `_drawLeg(ctx, offsetX, offsetY, angle, height)`

Identical in structure to Player's leg drawing method.

---

### `Platform` — `src/game/entities/Platform.js`

Static, immovable rectangle that acts as ground or floating surface.

#### `constructor(x, y, width, height, theme = {})`

Stores position and dimensions. Reads `theme.platform` and `theme.platformTop` for body and top-strip colors.

#### `get bounds`

Returns `{ left, right, top, bottom }`. Required interface for `resolveAABB`.

#### `render(ctx)`

Draws the body rectangle with `colorBody`, then a 6px top strip with `colorTop` for a depth illusion.

---

### `AnimationController` — `src/game/entities/AnimationController.js`

Lightweight state machine for player visual animation.

#### `constructor()`

Initializes `state = "idle"`, `timer = 0`, `legAngle = 0`, `squash = 1`.

#### `update(delta, body)`

Increments `timer`. Determines state from physics:
- `!onGround && vy < 0` → `"jump"`
- `!onGround && vy >= 0` → `"fall"`
- `onGround && |vx| > 10` → `"run"`
- default → `"idle"`

Updates `legAngle`:
- Run: `sin(timer × 16) × 0.7`
- Jump: `0.35` (legs open)
- Fall: `-0.2` (legs tucked)
- Idle: `0`

Updates `squash` via lerp:
- Jump: target `0.85` (squish on takeoff)
- Fall: target `1.1` (stretch)
- Ground: target `1.0`

---

### Level Data Format — `src/game/levels/`

Each level is a plain ES module exporting an object with the following shape:

| Field         | Type       | Description                                              |
|---------------|------------|----------------------------------------------------------|
| `id`          | `number`   | Level identifier (1–3)                                   |
| `name`        | `string`   | Display name shown in HUD                                |
| `worldWidth`  | `number`   | Total horizontal extent in pixels                        |
| `worldHeight` | `number`   | Total vertical extent in pixels                          |
| `theme`       | `object`   | Color palette (see Theme Fields below)                   |
| `platforms`   | `Array<{x,y,w,h}>` | Raw platform descriptors                        |
| `enemies`     | `Array<{x,y,left,right,speed?}>` | Raw enemy descriptors             |
| `playerStart` | `{x, y}`   | Player spawn position                                    |
| `flagX`       | `number`   | X position of the finish flag                            |

#### Theme Fields

| Key            | Used By                  | Description                        |
|----------------|--------------------------|------------------------------------|
| `sky`          | `Game.render()`          | Sky gradient top color             |
| `skyBottom`    | `Game.render()`          | Sky gradient bottom color          |
| `ground`       | `Game.render()`          | Sky gradient base color            |
| `platform`     | `Platform`               | Platform body color                |
| `platformTop`  | `Platform`, `ParticleSystem` | Platform top strip + dust color |
| `water`        | `Game.render()`          | Water strip at canvas bottom       |
| `waterSheen`   | `Game.render()`          | Water highlight strip              |
| `enemy`        | `Enemy`                  | Enemy body color + pop particles   |
| `enemyHead`    | `Enemy`                  | Enemy head color                   |
| `flag`         | `Game._renderFlag()`     | Flag triangle color                |

---

### Parallax Layers — `src/game/parallax/`

Each parallax module exports a factory function `(viewWidth) => Layer[]`.

Each `Layer` object:

| Field    | Type       | Description                                              |
|----------|------------|----------------------------------------------------------|
| `speed`  | `number`   | Scroll multiplier relative to camera X (0 = static, 1 = with camera) |
| `alpha`  | `number`   | Global opacity for the layer                            |
| `draw`   | `(ctx, tx, H) => void` | Drawing function called per tile. `tx` is the X offset after parallax calculation; `H` is the canvas height. |

`Game._renderParallax()` tiles each layer three times (`-1`, `0`, `+1` viewport widths) to ensure seamless looping.

---

## 🪝 React Hooks Reference

### `useGameState` — `src/hooks/useGameState.js`

Manages all top-level game state in React.

| Return Value    | Type       | Description                                             |
|-----------------|------------|---------------------------------------------------------|
| `lives`         | `number`   | Current life count (0–3)                                |
| `gameStatus`    | `string`   | `"menu"` \| `"playing"` \| `"dead"` \| `"win"`          |
| `currentLevel`  | `number`   | Active level ID                                         |
| `maxUnlocked`   | `number`   | Highest level unlocked (persisted in `localStorage`)    |
| `hasNext`       | `boolean`  | Whether a next level exists beyond `currentLevel`       |
| `loseLife()`    | `Function` | Decrements lives; sets status `"dead"` at 0             |
| `win(levelId)`  | `Function` | Unlocks next level, saves to `localStorage`, sets `"win"` |
| `play(levelId)` | `Function` | Sets level, resets lives to 3, sets `"playing"`         |
| `restart()`     | `Function` | Resets lives to 3, sets `"playing"` on same level       |
| `goToMenu()`    | `Function` | Resets lives, sets `"menu"`                             |

Progress is persisted using the key `"manguerun_unlocked"` in `localStorage`.

---

### `useLayout` — `src/hooks/useLayout.js`

Computes responsive canvas dimensions and manages orientation preference.

| Return Value       | Type       | Description                                          |
|--------------------|------------|------------------------------------------------------|
| `mobile`           | `boolean`  | Detected via user-agent + viewport width ≤900px      |
| `orientation`      | `string`   | `"vertical"` or `"horizontal"` (persisted)           |
| `setOrientation`   | `Function` | Updates orientation and saves to `localStorage`      |
| `isLandscape`      | `boolean`  | `true` if desktop or mobile in landscape mode        |
| `canvas`           | `object`   | `{ logicalW, logicalH, displayW, displayH, offsetX, offsetY }` |

Canvas logical resolution is always **800×560**. Display size adapts:
- **Desktop**: letterbox 16:9, centered in the viewport.
- **Mobile landscape**: full window dimensions.
- **Mobile portrait**: full window width, height proportional to aspect ratio.

---

## 🧩 React Components Reference

### `App` — `src/App.jsx`

Root component. Owns `gameRef` (ref to the `Game` instance) and orchestrates state transitions between menu, gameplay, and overlays. Passes callbacks `onLoseLife` and `onWin` into `GameCanvas`. Renders `MenuScreen` when `gameStatus === "menu"`.

### `GameCanvas` — `src/components/GameCanvas.jsx`

Mounts a `<canvas>` element and manages the `Game` instance lifecycle. Re-creates the `Game` whenever `levelId` changes (via `useEffect` dependency). Calls `game.stop()` / `game.start()` when `paused` prop changes.

### `HUD` — `src/components/HUD.jsx`

Conditional overlay component:
- **Playing**: renders 3 heart icons (dimmed if lost) and a menu button.
- **Dead**: renders Game Over screen with `MENU` and `REINICIAR` buttons.
- **Win**: renders level complete screen with `MENU`, `REINICIAR`, and optionally `PRÓXIMA ▸`.

### `DPad` — `src/components/DPad.jsx`

Virtual directional pad for touch/mobile. Each button calls `gameRef.current.input.press(key)` on `pointerdown` and `input.release(key)` on `pointerup` / `pointerleave`. Layout differs between portrait (centered bottom bar) and landscape (left cluster + right jump button).

### `MenuScreen` — `src/screens/MenuScreen.jsx`

Full-screen animated menu. Features:
- Animated star field with CSS `@keyframes twinkle`.
- Pixel-art palm tree decorations (procedural JSX).
- Level selector with lock/unlock states.
- Mobile orientation toggle (portrait / landscape).
- Blinking `JOGAR` button.
- Credits overlay.

---

## 🗺️ Level Design

All three worlds are **6000px wide × 560px tall**.

| Level | Name         | Theme                        | Difficulty     |
|-------|--------------|------------------------------|----------------|
| 1     | Praia do Pina | Beach, ocean, sand          | Introductory   |
| 2     | Capibaribe   | Mangrove river, mud, night   | Medium         |
| 3     | Olinda Alta  | Colonial hillside, sunset    | Hard           |

Each level features:
- Multiple ground sections separated by gaps
- Floating platforms at varied heights
- Enemies with unique patrol zones
- A themed parallax background with 2–3 depth layers

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm

### Installation

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

Output goes to `dist/` — ready to be served statically.

### Preview Production Build

```bash
npm run preview
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source.