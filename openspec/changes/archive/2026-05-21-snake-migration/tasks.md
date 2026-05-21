# Tasks: Snake Migration (HTML5 Canvas)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1,500 additions + ~2,400 deletions |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Scaffold + Core Engine / PR 2: Single-Player / PR 3: 2P + Tests / PR 4: PWA + Mobile + Polish |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Project scaffold + core engine + renderer + keyboard | PR 1 | Base branch `main` |
| 2 | Single-player (food, score, levels, obstacles, skins, record, menus) | PR 2 | Targets branch `snake-migration-pr1` |
| 3 | Two-player local mode + unit & Playwright tests | PR 3 | Targets branch `snake-migration-pr2` |
| 4 | PWA + Capacitor + touch + responsive + polish | PR 4 | Targets branch `snake-migration-pr3` |

---

## Phase 1: Project Scaffold + Core Engine

- [x] **T001** — Scaffold project structure, Vite + Vitest + Playwright configs, `.gitignore`, `package.json`. Delete 7 legacy `.py` files.
  Files: `package.json`, `vite.config.js`, `.gitignore`, `src/`, `tests/`, `public/`, `assets/`.
  Acceptance: `npm install` passes; `npm run dev` starts; legacy files gone.
  Depends: none.

- [x] **T002** — Create constants module (`GRID_SIZE`, `CANVAS`, skins, maps, food types).
  Files: `src/config.js`.
  Acceptance: importable config; values match spec.
  Depends: T001.

- [x] **T003** — Create Grid module (`isOccupied`, `snapToGrid`, `isOutOfBounds`, `randomFreeCell`).
  Files: `src/engine/Grid.js`.
  Acceptance: unit tests for all methods pass.
  Depends: T002.

- [x] **T004** — Create Snake module (segments array, direction lock, `move`, `grow`, self-collision check).
  Files: `src/engine/Snake.js`.
  Acceptance: reverse blocked; self-collision detected; movement grid-aligned.
  Depends: T002.

- [x] **T005** — Create GameState module (state machine: `menu`/`playing`/`paused`/`gameOver`, `tick`, collision resolution, 1P spawn).
  Files: `src/engine/GameState.js`.
  Acceptance: transitions per spec; snake spawns center length 3 moving right.
  Depends: T003, T004.

- [x] **T006** — Create CanvasRenderer and bootstrap `main.js` (canvas creation, `requestAnimationFrame` loop with fixed-tick accumulator).
  Files: `src/renderer/CanvasRenderer.js`, `src/main.js`.
  Acceptance: dark background renders; loop runs; pauses on tab hide.
  Depends: T001, T005.

- [x] **T007** — Create KeyboardHandler (key→action mapping, state-gated; arrows, Enter, P, M, K, 1, 2).
  Files: `src/input/KeyboardHandler.js`.
  Acceptance: arrows steer; P toggles pause; Enter starts from menu.
  Depends: T005, T006.

## Phase 2: Single-Player Mode

- [x] **T008** — Create Food module (position, type config, spawn on unoccupied cell, eat detection).
  Files: `src/engine/Food.js`.
  Acceptance: food avoids occupied; eating increments score and grows snake.
  Depends: T003, T005.

- [x] **T009** — Create Obstacles module (4 map presets + level-based extra generation).
  Files: `src/engine/Obstacles.js`.
  Acceptance: maps load per spec; collision triggers `gameOver`.
  Depends: T003.

- [x] **T010** — Implement level progression + speed ramp (every 5 pts; delay formula `max(0.05, 0.12 - (level-1)*0.01)`).
  Files: `src/engine/GameState.js`.
  Acceptance: level increases; delay clamps at min; obstacles update.
  Depends: T008, T009.

- [x] **T011** — Create skin-aware snake renderer and food renderer (colored segments, distinct head, food circle + leaf accent).
  Files: `src/renderer/drawSnake.js`, `src/renderer/drawFood.js`.
  Acceptance: 4 palettes render correctly; food types visually distinct.
  Depends: T006, T008.

- [x] **T012** — Create HUD renderer (score, record, level, skin name overlay).
  Files: `src/renderer/drawHUD.js`.
  Acceptance: HUD shows accurate data during play.
  Depends: T010.

- [x] **T013** — Create Menu renderer (1P/2P selection, skin/map cycling).
  Files: `src/renderer/drawMenu.js`.
  Acceptance: screens render; selections update `config.js` values.
  Depends: T012.

- [x] **T014** — Create localStorage record persistence wrapper (`snake-record`).
  Files: `src/storage.js`.
  Acceptance: record loads on boot; writes when beaten.
  Depends: T001.

- [x] **T015** — Implement pause/resume overlay rendering.
  Files: `src/renderer/CanvasRenderer.js`.
  Acceptance: P toggles overlay and freezes game.
  Depends: T005, T007.

- [x] **T016** — Write Vitest unit tests for engine logic (Grid, Snake, Food, GameState, Obstacles).
  Files: `tests/unit/*.test.js`.
  Acceptance: `npm run test` passes.
  Depends: T003, T004, T005, T008, T009.

- [x] **T017** — Write Playwright smoke test (page loads, canvas visible, keyboard input triggers action).
  Files: `tests/e2e/canvas.spec.js`.
  Acceptance: `npx playwright test` passes.
  Depends: T006, T007.

## Phase 3: Two-Player Local Mode

- [x] **T018** — Extend Snake/GameState for 2P spawn (P1 left-center inward, P2 right-center inward) and dual collision.
  Files: `src/engine/GameState.js`, `src/engine/Snake.js`.
  Acceptance: both snakes spawn correctly; border/self/opponent-body collision ends game.
  Depends: T004, T005.

- [x] **T019** — Extend HUD and GameState for 2P (separate scores, win/draw detection, head-to-head draw handling).
  Files: `src/renderer/drawHUD.js`, `src/engine/GameState.js`.
  Acceptance: HUD shows both scores; simultaneous death = draw.
  Depends: T012, T018.

- [x] **T020** — Add WASD input mapping for Player 2 with independent direction lock.
  Files: `src/input/KeyboardHandler.js`.
  Acceptance: WASD controls P2; reverse blocked per snake.
  Depends: T007, T018.

## Phase 4: PWA + Mobile Packaging

- [x] **T021** — Create `public/index.html` with canvas element and minimal meta tags.
  Files: `public/index.html`.
  Acceptance: page loads; canvas element present.
  Depends: T001.

- [x] **T022** — Create service worker (cache-first static assets) and PWA manifest (name, 192/512 icons, `display: standalone`).
  Files: `public/sw.js`, `public/manifest.json`.
  Acceptance: Lighthouse PWA audit passes.
  Depends: T021.

- [x] **T023** — Add Capacitor config and platform wrappers (iOS/Android build scripts).
  Files: `capacitor.config.json`.
  Acceptance: `npx cap sync` completes without errors.
  Depends: T021.

- [x] **T024** — Add PWA assets (192px, 512px icons and splash screens) to `assets/`.
  Files: `assets/icons/*`, `assets/splash/*`.
  Acceptance: manifest references valid icon paths.
  Depends: T022.

- [x] **T025** — Implement install prompt and full-screen behavior handling.
  Files: `src/main.js` (or `src/pwa.js`).
  Acceptance: prompt shown on eligible browsers; `display: standalone` active.
  Depends: T022.

## Phase 5: Polish

- [x] **T026** — Create TouchHandler (swipe detection + on-screen D-pad fallback for touch devices).
  Files: `src/input/TouchHandler.js`.
  Acceptance: swipe changes direction; d-pad renders and works on touch.
  Depends: T007.

- [x] **T027** — Implement responsive canvas sizing (fit viewport, maintain aspect ratio, devicePixelRatio aware).
  Files: `src/main.js`, `src/renderer/CanvasRenderer.js`.
  Acceptance: canvas scales correctly on resize/orientation change.
  Depends: T006.

- [x] **T028** — Add background particle/starfield effect.
  Files: `src/renderer/particles.js`.
  Acceptance: subtle animated background visible behind game.
  Depends: T006.

- [x] **T029** — Final integration verification: manual playthrough covering 1P, 2P, pause, record persistence, level progression, all maps/skins/foods.
  Files: N/A.
  Acceptance: all spec scenarios pass; no console errors.
  Depends: all above.
