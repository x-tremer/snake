# Exploration: Snake Game Migration (Python → HTML5 Canvas)

## Executive Summary

After analyzing all 7 Python files, the Snake project is a collection of **overlapping procedural scripts** built with Python's `turtle` module over Tkinter. The most mature version (`spy`) includes the richest feature set: 1P/2P local, skins/food/map customization, obstacles per level, score/record persistence, and an online stub. The network versions (`py` and `py s`) contain working TCP servers with JSON protocols and AI fallback, plus a turtle-based client. The minimal version (`python`) has duplicate code appended. The codebase has **no modules, no OOP, no tests, and Spanish identifiers throughout**. Migration to HTML5 Canvas + JS + PWA + Capacitor is viable because the game logic is simple and grid-based, but every non-trivial concern must be rebuilt from scratch.

---

## 1. Core Game Mechanics (which file has it, or "none")

| Feature | `spy` | `python snake.py` | `python snak.py` | `python` | `py` | `py s` | `snake python` | Notes |
|---------|-------|-------------------|-------------------|----------|------|--------|---------------|-------|
| Grid-based movement (20px cells) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (grid coords) | All versions use 20px cells except `py` (grid units). |
| Snake growth on eating | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Standard across all. |
| Direction control (arrows / WASD) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | Server files have no UI input; client handles it. |
| Self-collision detection | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | `python` (minimal) lacks self-collision. |
| Border collision detection | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Standard across all. |
| Speed/delay management | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `delay` or `TICK` value; decreases per level. |
| Pause/resume | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | `python` and server files have no pause. |

---

## 2. Game Modes

| Mode | `spy` | `python snake.py` | `python snak.py` | `python` | `py` | `py s` | `snake python` |
|------|-------|-------------------|-------------------|----------|------|--------|---------------|
| Single player | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Two players (local) | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Player vs AI | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ (via server AI) |
| Online multiplayer (stub/partial) | stub | none | none | none | partial | partial | partial |

**Notes:**
- `spy` has an **online stub screen** only ("Próximamente") with no actual network code.
- `py` and `py s` are server files; they support 1P vs AI or 2P over TCP.
- `snake python` is a **client** that connects to `py` server.

---

## 3. Progression & Difficulty

| Feature | `spy` | `python snake.py` | `python snak.py` | `python` | `py` | `py s` | `snake python` |
|---------|-------|-------------------|-------------------|----------|------|--------|---------------|
| Score tracking | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Record/high-score persistence (record.txt) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Level progression (every N points) | ✅ (8 pts) | ✅ (5 pts) | ✅ (5 pts) | ❌ | ❌ | ❌ | ❌ |
| Speed increase per level | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Obstacles per level | ✅ (map-based + extra at L≥3) | ✅ (L2, L3, L4+) | ✅ (L2, L3, L4+) | ❌ | ❌ | ❌ | ❌ |

**Notes:**
- `spy` has the most elaborate obstacle system: map patterns (Columnas, Cruz, Fortaleza) plus extra rows at level ≥3 on non-classic maps.
- `python snake.py` and `python snak.py` have simpler per-level obstacle patterns.
- Server versions have no levels, obstacles, or score persistence.

---

## 4. Visual Features

| Feature | `spy` | `python snake.py` | `python snak.py` | `python` | `py` | `py s` | `snake python` |
|---------|-------|-------------------|-------------------|----------|------|--------|---------------|
| Skins (head/body colors) | ✅ (4 skins) | ✅ (4 skins) | ✅ (4 skins) | ❌ | ❌ | ❌ | ❌ |
| Animated background particles | ✅ (30) | ✅ (25) | ✅ (30) | ❌ | ❌ | ❌ | ❌ |
| Food visual (apple + leaf) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Multi-map support (Clásico, Columnas, Cruz, Fortaleza) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Scoreboard/UI text rendering | ✅ | ✅ | ✅ | ✅ (basic) | ❌ | ❌ | ✅ (basic) |

**Skin palette (present in `spy`, `python snake.py`, `python snak.py`):**
1. Clásica — cabeza `lime`, cuerpo `green`
2. Azul — cabeza `deepskyblue`, cuerpo `blue`
3. Fuego — cabeza `orange`, cuerpo `red`
4. Morada — cabeza `violet`, cuerpo `purple`

---

## 5. Food System

| Feature | `spy` | `python snake.py` | `python snak.py` | `python` | `py` | `py s` | `snake python` |
|---------|-------|-------------------|-------------------|----------|------|--------|---------------|
| Basic food (1 point) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Food types with multipliers | ✅ (3 foods) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Food placement avoiding occupied cells | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | — (server renders) |

**Food types in `spy`:**
1. Manzana — `red`/`green`, 1 punto
2. Banana — `yellow`/`gold`, 2 puntos
3. Uva — `purple`/`violet`, 3 puntos

---

## 6. Input System

| Feature | `spy` | `python snake.py` | `python snak.py` | `python` | notes |
|---------|-------|-------------------|-------------------|----------|-------|
| Arrow keys (P1) | ✅ | ✅ | ✅ | ✅ | Standard. |
| WASD (P2) | ✅ | ❌ | ✅ | ✅ | Only 2P-enabled versions. |
| Menu keys (Enter, P, K, M, Q, 1, 2) | ✅ | ✅ (Enter, K, P, M, Q) | ✅ (Enter, 1, 2, K, P, M, Q) | ✅ (1, 2, Q) | `spy` has the richest menu. |
| State-dependent input (only in correct game state) | ✅ | ✅ | ✅ | ❌ | Controls only active during play. |

---

## 7. Network/Online Features

### `py` (server, 317 lines)
- **TCP server** on port 5055; JSON newline-delimited protocol over raw sockets.
- **State machine**: `waiting` → `playing` → `gameover`.
- **Player slots**: `p1` and `p2`; auto-assign on connect.
- **AI fallback**: If `p2` slot empty for 5 seconds, AI takes over.
- **Synchronization**: Server-authoritative state broadcast every 0.03s; client sends `{"type": "input", "direction": ...}`.
- **Collision logic**: Server-side; grid-based; body is list of `[x, y]` lists.
- **No level/progression/score persistence.**

### `py s` (server, 479 lines)
- **TCP server** on port 5555; same JSON-over-socket protocol.
- **Continuous coordinate system** (not discrete grid), uses `STEP=20` px.
- **Player object**: `make_player()` with `x`, `y`, `dir`, `body[]`, `score`, `alive`, `is_ai`.
- **Game loop**: ticker at `TICK_RATE=12` steps/sec.
- **Auto-start**: configurable `WAIT_SECONDS_BEFORE_START=3`; `AUTO_START_WITH_ONE_PLAYER` and `USE_AI_IF_NO_SECOND_PLAYER` flags.
- **Synchronization**: broadcast state after every tick; client sends `{"type": "dir", ...}` or `{"type": "restart"}`.
- **Collision logic**: server-side with `out_of_bounds`, `collide_with_body`, `head_collision`, `food_collision`.
- **No level/progression/score persistence.**

### `snake python` (client, 186 lines)
- **Connects to `py` server** (not `py s`; ports differ).
- **Turtle rendering**: draws grid squares (`CELL=20`), borders, and text.
- **Input**: arrow keys → `UP/DOWN/LEFT/RIGHT`; `r` for restart.
- **State rendering**: receives full `state` object; renders both players and food.
- **No self-play or local mode** — purely a network client.

---

## 8. Cross-Cutting Concerns

### State Machine
| File | States |
|------|--------|
| `spy` | `menu`, `jugando1`, `jugando2`, `pausa`, `gameover1`, `gameover2`, `online` |
| `python snake.py` | `menu`, `jugando`, `pausa`, `gameover` |
| `python snak.py` | `menu`, `jugando1`, `jugando2`, `pausa`, `gameover1`, `gameover2` |
| `python` | `menu`, `game` |
| `py` / `py s` | `waiting`, `playing`, `gameover` |

### Record Persistence Format
- **File**: `record.txt`
- **Format**: single line, plain integer as string.
- **Files that use it**: `spy`, `python snake.py`, `python snak.py`.
- Server versions do **not** persist anything.

### Grid Alignment Logic
- Most files: `x = round(x / 20) * 20` and same for `y`.
- `py`: discrete grid coordinates (`1..ANCHO-2`, `1..ALTO-2`), no pixel alignment needed.
- `py s`: continuous pixel coordinates, but still snaps food and players to `STEP=20` grid.

### Random Position Generation (avoiding occupied cells)
- `spy`: `posicion_libre()` collects all occupied positions (heads, segments, obstacles) and retries until free.
- `python snake.py`: does **not** avoid occupied cells — food can spawn inside the snake.
- `python snak.py`: uses same `posicion_libre()` as `spy`.
- `python`: does **not** avoid occupied cells.
- Server files: `random_food()` or `random_grid_position()` checks occupied sets before returning.

---

## 9. Quality Assessment per File

| File | Lines | Features Present | Code Quality Issues | Redundancy Level |
|------|-------|------------------|---------------------|------------------|
| **`spy`** | 711 | All: 1P/2P, skins, food types, 4 maps, obstacles, levels, record, particles, pause, online stub | Heavy global state; `turtle` objects everywhere; no functions for common logic (e.g., collision repeated per file) | **High** — overlaps heavily with `python snake.py` and `python snak.py` |
| **`python snake.py`** | 455 | 1P only, skins, levels, obstacles, particles, pause, record | Same issues as `spy`; collision handling duplicated inside game loop | **High** — 80% overlap with `python snak.py` |
| **`python snak.py`** | 579 | 1P/2P, skins, levels, obstacles, particles, pause, record | Same structure as `spy` but less menu richness (no map/food selection) | **High** — nearly identical to `spy` minus food/map menus |
| **`python`** | 385 (of which 192 unique) | Solo vs AI, 2P local, basic movement/food | **Entire file duplicated at line 193** — identical code appended. No self-collision, no score, no record, no pause, no state guards on input | **Critical** — literal copy-paste duplication |
| **`py`** | 317 | Server: grid-based, JSON protocol, AI fallback, 1P/2P | Raw socket + threading; no error recovery; hardcoded board size | **N/A** — server-only; overlaps conceptually with `py s` |
| **`py s`** | 479 | Server: continuous, JSON protocol, AI fallback, 1P/2P, auto-start | More mature than `py`; configurable flags; clearer separation (`update_single_player_mode`, `update_two_player_mode`) | **N/A** — server-only; overlaps conceptually with `py` |
| **`snake python`** | 186 | Network client for `py` server; turtle rendering | Hardcoded IP/port; no reconnection logic; `to_screen` and `draw_square` tightly coupled to `CELL=20` | **N/A** — client-only |

---

## Feature Preservation vs Drop Matrix

| Feature | Preserve? | Rationale |
|---------|-----------|-----------|
| 1P single-player core | ✅ **Preserve** | Core experience; must be rock-solid. |
| 2P local mode | ✅ **Preserve** | Widely present; valuable on mobile/tablets (touch split-screen). |
| Player vs AI | ✅ **Preserve** | Already implemented in `python` and both servers; useful for practice. |
| Online multiplayer (real-time) | ⚠️ **Consider for v2** | Significant scope increase; P2P or relay server needed. Current stubs are non-functional. |
| Skins (4 palettes) | ✅ **Preserve** | Low cost to implement in Canvas; adds replayability. |
| Multi-map support (4 maps) | ✅ **Preserve** | `spy` has the richest content; different obstacle layouts add depth. |
| Food types with multipliers | ✅ **Preserve** | Unique to `spy`; adds strategic variety. |
| Animated background particles | ❌ **Drop** | `turtle`-specific visual noise; Canvas can replace with subtle CSS/canvas background instead. |
| Level progression + speed increase | ✅ **Preserve** | Core difficulty ramp; present in best versions. |
| Obstacles per level | ✅ **Preserve** | Core to difficulty; all obstacle patterns must be translated to Canvas. |
| Score / record persistence | ✅ **Preserve** | Use `localStorage` instead of `record.txt`. |
| Pause/resume | ✅ **Preserve** | Standard UX expectation on mobile. |
| Arrow + WASD controls | ⚠️ **Adapt** | Replace with touch/swipe on mobile; keep keyboard for desktop. |
| JSON-over-socket network protocol | ❌ **Drop and redesign** | Current servers are raw TCP; WebSocket needed for browser compatibility. |
| Spanish language UI | ✅ **Preserve / i18n-ready** | Keep Spanish as default; structure for future translations. |

---

## Risks

1. **Fragmented logic**: Features are spread across 7 files with no shared modules. Consolidation requires careful manual merging, not mechanical copying.
2. **`python` file corruption**: Contains exact duplicate code from line 193 onward. There is no "canonical" version of that file — trust none of it.
3. **No visual assets**: Everything is procedural `turtle` shapes. Canvas migration requires designing equivalent sprites or procedural drawing logic.
4. **Mobile input paradigm**: Touch/swipe is fundamentally different from keyboard. The game loop and input architecture must be redesigned for responsiveness and discoverability.
5. **Network multiplayer scope**: Real-time synchronization over the internet (not just LAN) requires a signaling server, WebSocket relay, or P2P. The current Python servers are LAN-only and do not interoperate with browsers.
6. **No tests anywhere**: Regression risk is high during migration. Manual QA will be required.
7. **AI quality**: The AI in `python` and `py`/`py s` is simplistic (greedy toward food). If AI is preserved, consider upgrading pathfinding.

---

## Recommended Next Phase

**Next recommended phase**: `sdd-propose`  
**Reasoning**: The exploration surface is now clear. We have a full feature inventory, quality assessment, and preservation matrix. The next step is to define a concrete **Proposal** with scope, approach, rollback plan, and feature parity commitments before writing specs.
