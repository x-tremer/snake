# Proposal: Snake Migration (HTML5 Canvas)

## Intent

Migrate the existing Python/turtle Snake game to HTML5 Canvas, producing a single, distributable code base that runs on Windows, macOS, iOS, and Android via a PWA packaged with Capacitor. Reorganise the repository into a standard, modern project layout and rebuild all non-trivial game logic from scratch in JavaScript.

## Scope

### In Scope
- Core single-player Snake: grid movement, growth, collision, game states.
- Two-player local mode (split controls).
- Visual parity: skins (4 palettes), 4 maps, food types with multipliers, obstacle patterns per level.
- Progression: level system, speed ramp, score tracking, localStorage-based record persistence.
- Pause/resume, menu flow.
- Modern project scaffold: Vite, Vitest, PWA (service worker + manifest), Capacitor wrappers for mobile stores.
- Clean structure: `src/`, `tests/`, `assets/`, `docs/`.

### Out of Scope
- **Online multiplayer**. Existing TCP servers are incompatible with browser networking; a WebSocket relay would be a new project, not a migration.
- **AI opponent**. Present in some Python files but deferred; can be added after core delivery.
- **Sound/music**. Nice-to-have, not required for parity.
- **The 7 legacy Python files**. They are reference-only and will be deleted after feature extraction.

## Capabilities

### New Capabilities
- `game-engine`: Grid, movement, collision detection, tick loop, state machine.
- `single-player`: 1P mode with food, scoring, levels, obstacles, skins, record.
- `two-player`: Local 2P mode with independent inputs and win/lose handling.
- `pwa-packaging`: Service worker, web app manifest, offline assets, install prompt.
- `mobile-packaging`: Capacitor iOS/Android wrappers, touch/swipe input handling.
- `desktop-delivery`: PWA install from browser; Electron wrapper optional and future.

### Modified Capabilities
- None (this is a green-field replacement, not a partial refactor).

## Approach

- **Language**: JavaScript (ES Modules), initially vanilla. TypeScript may be adopted later if the team prefers; it is not a blocker for canvas API usage.
- **Tooling**: Vite for dev server and bundling (fast HMR, zero-config, native ESM). Vitest for unit tests of pure game logic. Playwright for canvas integration tests.
- **Rendering**: Canvas 2D API with procedural drawing. No sprites or WebGL needed for Snake.
- **Architecture**: MVC-like separation: `GameState` (logic) / `Renderer` (canvas draw) / `InputHandler` (keyboard + touch events) as independent ES modules.
- **Persistence**: `localStorage` replaces `record.txt`.
- **Legacy files**: Extract logic manually from `spy` (canonical); archive others for reference, then delete.

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Vanilla JS over TypeScript | Fewer build steps, faster migration. Type safety can be added incrementally without changing file structure. Override if team prefers TS from day one. |
| Vite over webpack | Faster cold start, native ESM, simpler config for a single-entry canvas app. |
| Canvas 2D over WebGL | Procedural rectangles and arcs are trivial in 2D; WebGL adds complexity with no visual gain for this game. |
| Capacitor over React Native | The UI is 100 % Canvas; bringing a React runtime is unnecessary overhead. Capacitor wraps vanilla HTML/JS directly. |
| No framework | The game is a tight render loop and state machine; frameworks add no value here. |

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/` | New | Engine, renderer, input handler, game modes, UI state machine. |
| `tests/` | New | Vitest unit tests for game logic; Playwright integration tests for canvas rendering and input. |
| `assets/` | New | `manifest.json`, icons, offline splash screen. |
| `docs/` | New | Architecture notes, control mappings, build instructions. |
| `public/` | New | PWA manifest, service worker registration, `index.html`. |
| `capacitor/` | New | Capacitor config and iOS/Android platform wrappers. |
| Legacy Python files (`spy`, `python snake.py`, etc.) | Removed | Reference only; delete after extraction. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Touch input is a new paradigm for a keyboard-first game. | High | Prototype swipe detection and on-screen directional pad early; iterate with real devices. |
| No existing tests → must establish testing from zero. | High | Write Vitest tests alongside the engine from Phase 1; never retrofit them later. |
| Canvas rendering fidelity vs turtle visuals. | Medium | Compare screenshots side-by-side; settle on a visual style guide before Phase 2. |
| Record persistence now uses localStorage (was file). | Low | Migration is trivial; just document the change for users. |
| Feature creep from scattered Python files. | Medium | Freeze the "preserve" matrix before specs; do not add deferred features during implementation. |

## Rollback Plan

1. All legacy Python files are committed to version control before deletion; a revert commit restores them instantly.
2. The new JS project lives in a dedicated branch until validation passes.
3. If Capacitor or PWA packaging fails, the game still runs as a plain static web site from `dist/`.

## Dependencies

- Vite (dev + build)
- Vitest + `@vitest/ui` (test runner)
- Playwright (canvas integration tests)
- Capacitor CLI + core packages (mobile wrapper)
- Node.js LTS

## Success Criteria

- [ ] `npm run dev` starts a playable single-player Snake in the browser.
- [ ] All single-player features from `spy` are present and functionally equivalent (skins, maps, food types, levels, obstacles, record).
- [ ] Two-player local mode runs without regression.
- [ ] `npm run build` produces a deployable static bundle that passes Lighthouse PWA audit.
- [ ] `npm run test` exits green (Vitest) and `npx playwright test` passes.
- [ ] Capacitor build produces runnable Android `.apk` and iOS `.app` from the same source.
- [ ] Legacy Python files are removed and no longer referenced.

## Migration Map

| Phase | Deliverable |
|-------|-------------|
| Phase 1 | Project scaffold + core engine (grid, movement, collision, game loop). |
| Phase 2 | Single-player mode: food, scoring, levels, obstacles, skins, record. |
| Phase 3 | Two-player local mode. |
| Phase 4 | PWA + mobile packaging (service worker, manifest, Capacitor). |
| Phase 5 | Polish: touch controls, responsive canvas sizing, UI refinements. |
