# [🇧🇷 Leia em Português](README.md)

# 🎮 Platformer Game

A browser-based 2D side-scrolling platformer built with **React** and a custom **Canvas game engine** written from scratch in vanilla JavaScript. Jump over gaps, stomp enemies, and reach the flag at the end of the level.

---

## 📸 Preview

> Run the project locally and open your browser to see it in action.

---

## 🕹️ Gameplay

- **Move** left and right across a 3000px wide scrolling world
- **Jump** on platforms and avoid falling into gaps
- **Stomp enemies** by jumping on their heads to defeat them
- **Reach the flag** at the end of the level to win
- You have **3 lives** — touching an enemy from the side resets your position and costs one life
- After losing all lives, a **Game Over** screen appears with the option to retry
- A brief **invincibility window** (1.5 seconds) protects you after taking damage

---

## 🎮 Controls

### Keyboard

| Action     | Keys                          |
|------------|-------------------------------|
| Move Left  | `←` Arrow / `A`               |
| Move Right | `→` Arrow / `D`               |
| Jump       | `↑` Arrow / `W` / `Space`     |

### Mobile / Touch

An on-screen **D-Pad** is rendered at the bottom of the screen:

- `◀` / `▶` — move left / right
- `▲` — jump

---

## 🛠️ Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| UI Framework  | React 19                          |
| Rendering     | HTML5 Canvas API                  |
| Build Tool    | Vite 8                            |
| Language      | JavaScript (ESM)                  |
| Styling       | Inline styles / CSS-in-JS         |
| Physics       | Custom AABB engine (from scratch) |

No external game libraries are used. The entire game engine is hand-written.

---

## 📁 Project Structure

```
src/
├── App.jsx                  # Root component — wires game, HUD, and D-Pad
├── main.jsx                 # React entry point
│
├── components/
│   ├── GameCanvas.jsx       # Mounts the canvas and manages the Game lifecycle
│   ├── DPad.jsx             # Touch/mobile directional pad overlay
│   └── HUD.jsx              # Lives display, Game Over and Win overlays
│
├── hooks/
│   └── useGameState.js      # React state: lives, game status, transitions
│
└── game/                    # Pure JS game engine (no React)
    ├── Game.js              # Main game class — world setup, update/render loop
    │
    ├── engine/
    │   ├── GameLoop.js      # requestAnimationFrame loop with delta-time
    │   ├── Camera.js        # Smooth-follow camera with world bounds clamping
    │   └── InputManager.js  # Keyboard bindings + programmatic press/release
    │
    ├── entities/
    │   ├── Player.js        # Player movement, collision resolution, rendering
    │   ├── Enemy.js         # Patrol AI, stomp detection, animated rendering
    │   ├── Platform.js      # Static platform with bounds and canvas rendering
    │   └── AnimationController.js  # State machine: idle / run / jump / fall
    │
    └── physics/
        ├── PhysicsBody.js   # Velocity, gravity integration, AABB bounds
        └── AABB.js          # Axis-aligned bounding box collision resolver
```

---

## ⚙️ Architecture

### Game Engine

The engine is fully decoupled from React. `Game.js` is a plain JavaScript class instantiated inside a `useEffect` in `GameCanvas.jsx`. React only manages UI state (lives, game status) via callbacks passed down at construction time.

```
React (UI state)
    └── GameCanvas.jsx
            └── Game.js  ──► GameLoop (rAF)
                                 ├── update(delta)
                                 │       ├── Player.update()
                                 │       ├── Enemy.update()
                                 │       ├── Camera.follow()
                                 │       └── collision checks
                                 └── render()
                                         ├── Camera.begin()
                                         ├── Platform.render()
                                         ├── Enemy.render()
                                         ├── Player.render()
                                         └── Camera.end()
```

### Physics

Collision detection uses **AABB (Axis-Aligned Bounding Box)** with minimum-overlap resolution. The engine determines which axis has the least penetration and resolves along that axis, correctly distinguishing top/bottom and left/right hits.

### Camera

The camera uses **linear interpolation (lerp)** to smoothly follow the player. It is clamped to the world boundaries so the background never shows beyond the edges.

### Animation

`AnimationController` is a lightweight state machine that drives squash-and-stretch scaling and procedural leg swing animation based on the player's velocity and ground state.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-folder>

# Install dependencies
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

The output will be in the `dist/` folder, ready to be served statically.

### Preview Production Build

```bash
npm run preview
```

---

## 🗺️ Level Design

The world is **3000px wide** with a fixed height of **560px**. It features:

- **5 ground sections** separated by gaps that require jumping
- **16 floating platforms** at varying heights creating multi-level paths
- **6 enemies** with defined patrol zones across the level
- A **flag** at x=2900 marking the finish line

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source.