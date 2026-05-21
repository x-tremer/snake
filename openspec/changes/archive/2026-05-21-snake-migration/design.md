# Design: Snake Migration (HTML5 Canvas)

## Technical Approach

Green-field rebuild of the 711-line `spy` game onto Canvas 2D + ES Modules. Every non-trivial concern is re-architected as independent modules (no global state). The game loop runs on `requestAnimationFrame` with a fixed-tick accumulator for deterministic movement. Rendering is fully procedural — no sprites, no WebGL.

## Architecture Overview

```
main.js ──bootstraps──▶ GameState (state machine)
                   ├──▶ CanvasRenderer (draw loop)
                   └──▶ InputHandler (keyboard + touch)
                        │
    GameState owns ─────▶ Snake(1..2), Food, Obstacles, Grid
                        │
    Renderer delegates ─▶ drawSnake, drawFood, drawHUD, drawMenu, particles
```

Entry: `main.js` creates the `<canvas>`, instantiates engine+renderer+input, starts `requestAnimationFrame`.

## Architecture Decisions

| Decision | Alternatives | Chosen | Rationale |
|----------|-------------|--------|-----------|
| Game loop timing | `setInterval`, delta-time | Fixed-tick accumulator with `requestAnimationFrame` | Deterministic gameplay; rAF pauses when tab hidden |
| Rendering | WebGL, DOM+CSS, Canvas 2D | Canvas 2D | Rectangles and circles are trivial in 2D; WebGL is overkill |
| State management | Redux, zustand, plain object | Plain object owned by GameState | Single game instance, no UI framework; no store needed |
| Input pipeline | Event bus, callback registry | Direct action queue per-frame | Only 3 consumers; no pub/sub overhead justified |
| Obstacle placement | Per-level config, procedural | Map type + level multiplier | Mirrors spy: map defines base pattern; level≥3 adds extra rows |
| Food types | Class hierarchy, type enum | Config-driven type field | 3 types with color+value differences only; no subclass needed |

## Data Flow (per frame)

```
InputHandler.processEvents() → actions[]
GameState.update(actions[], fixedDelta)
  ├─ Snake.move() ×2
  ├─ Grid.checkCollisions(snakes, obstacles)
  ├─ Food.checkEaten(snakeHeads) → respawn, grow, score
  ├─ subir_nivel() → update level, delay, obstacles
  └─ state transitions (death → GAME_OVER)
CanvasRenderer.render(gameState)
  ├─ clearCanvas() → drawParticles() → drawObstacles()
  ├─ drawFood() → drawSnake(p1) → drawSnake(p2)
  └─ drawHUD() → drawOverlay() if paused/gameover/menu
```

## File Change Map

| File | Action | Summary |
|------|--------|---------|
| `src/main.js` | Create | Bootstrap canvas, wire modules, start loop |
| `src/engine/GameState.js` | Create | State machine, tick(), collision resolution, leveling |
| `src/engine/Snake.js` | Create | Segments array, direction lock, move/grow/self-collision |
| `src/engine/Grid.js` | Create | Static: isOccupied, snapToGrid, isOutOfBounds, randomFreeCell |
| `src/engine/Food.js` | Create | Position, type, spawn on unoccupied cell |
| `src/engine/Obstacles.js` | Create | Map presets + level-based generation |
| `src/renderer/CanvasRenderer.js` | Create | Main render loop, delegates to specializers |
| `src/renderer/drawSnake.js` | Create | Skin-aware segment drawing |
| `src/renderer/drawFood.js` | Create | Colored circle + leaf accent |
| `src/renderer/drawHUD.js` | Create | Score/record/level/skin/map overlay |
| `src/renderer/drawMenu.js` | Create | Menu screens (1P, 2P, skins, maps, food select) |
| `src/renderer/particles.js` | Create | 30 background dots moving upward |
| `src/input/KeyboardHandler.js` | Create | Key → action mapping, state-gated |
| `src/input/TouchHandler.js` | Create | Swipe detection + on-screen d-pad |
| `src/config.js` | Create | GRID_SIZE=20, CANVAS=600×600, INITIAL_DELAY=120ms, MIN_DELAY=50ms, skins[], maps[], foodTypes[] |
| `src/storage.js` | Create | localStorage wrapper for record |
| `public/index.html` | Create | Minimal HTML, `<canvas>`, service worker registration |
| `public/manifest.json` | Create | PWA manifest (name, icons, display:standalone) |
| Legacy 7 `.py` files | Delete | After feature extraction complete |

## Tkinter → Canvas Mapping

| Tkinter/turtle | Canvas 2D |
|----------------|-----------|
| `turtle.Turtle()` objects | JS objects with `{x,y}` properties |
| `goto(x,y)` | `ctx.fillRect(x,y, CELL, CELL)` |
| Color names (lime, deepskyblue) | Same hex/CSS colors in `ctx.fillStyle` |
| `turtle.Screen().tracer(0)` + `update()` | `requestAnimationFrame` with explicit render call |
| `time.sleep(delay)` | Fixed-tick accumulator: accumulate time, step when threshold met |
| `turtle.onkeypress()` | `document.addEventListener('keydown')` |
| `turtle.distance(other) < 15` | AABB or Manhattan grid-distance collision |

## State Machine

```
MENU ──(1)──▶ PLAYING_1P ──(death)──▶ GAME_OVER ──(Enter)──▶ PLAYING_1P
  │               │                        │──(M)──▶ MENU
  │──(2)──▶ PLAYING_2P ──(death)──▶ GAME_OVER ──(Enter)──▶ PLAYING_2P
  │               │                        │──(M)──▶ MENU
  │──(K,J,C)──▶ MENU (cycle skin/map/food, stays in MENU)
  │
  PLAYING_1P/2P ──(P)──▶ PAUSED ──(P)──▶ PLAYING_1P/2P
```

## PWA + Capacitor

- Service worker: cache-first for app shell (HTML, JS, manifest, icons)
- `manifest.json`: 192px and 512px icons, `display: standalone`, `theme_color: #000000`
- Capacitor: wraps `dist/` into native WebView; touch input via JavaScript events, no native bridge needed
- Build: `vite build` → `npx cap sync` → `npx cap open ios|android`

## Open Questions

- [ ] Icon assets (192px, 512px) need to be designed or sourced
- [ ] Swipe sensitivity threshold for touch input — test on real devices during Phase 1
