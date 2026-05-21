# Spec: Snake HTML5 Migration

## ADDED Requirements

### game-engine

| Req | RFC 2119 | Summary |
|---|---|---|
| Grid System | SHALL | 20px cells; entity positions grid-aligned. |
| Movement Dir Lock | MUST NOT | Reverse direction; blocked input ignored. |
| Collision Detection | SHALL | Detect border, self, obstacle collisions. |
| Game Loop | SHALL | Configurable tick; delay = max(0.05, 0.12 - (level-1)*0.01). |
| State Machine | SHALL | menu, playing, paused, gameOver. Guarded transitions. |
| Canvas Rendering | SHALL | Dark bg + starfield; colored snake squares w/ distinct head; food circles; gray obstacles; HUD overlay. |
| Keyboard Input | SHALL | Arrow, Enter, P, M, K, 1, 2. State-gated. |
| Repo Cleanup | SHALL | Delete 7 Python files; .gitignore; npm scripts. |

#### Scenarios

**Scenario: Grid-aligned movement**
- **GIVEN** snake head at (100, 80)
- **WHEN** snake moves right by one cell
- **THEN** new head position is (120, 80)

**Scenario: Reverse blocked**
- **GIVEN** snake moving right
- **WHEN** input "left" received
- **THEN** ignored; snake continues right

**Scenario: Border collision → game over**
- **GIVEN** head at rightmost column
- **WHEN** moves right → state → gameOver

**Scenario: Self-collision → game over**
- **GIVEN** body at (200,100), (180,100), (160,100), (140,100), (120,100)
- **WHEN** head at (200,100) turns down, left, up → reaches (120,100)
- **THEN** state → gameOver

**Scenario: P toggles pause**
- **GIVEN** playing
- **WHEN** P → paused + overlay
- **WHEN** P again → playing

---

### single-player

| Req | RFC 2119 | Summary |
|---|---|---|
| Snake Spawn | SHALL | Center, length 3, moving right. |
| Food Spawn | MUST | Random unoccupied cell; eating: +score, +1 segment, respawn. |
| Food Types | SHALL | Regular (1pt), Bonus (2pt), Speed (3pt). Visually distinct. |
| Level Progression | SHALL | Every 5 pts → level up; delay = max(0.05, 0.12 - (level-1)*0.01). |
| Obstacles | SHALL | Level ≥ 2: columns, cross, fortress. Collision → gameOver. |
| Game Over | SHALL | Border, self, obstacle → gameOver. |
| HUD | SHALL | Score, record, level, skin name. |
| Record Persist | SHALL | localStorage "snake-record"; read on load, write when beaten. |
| Menu Flow | SHALL | Start/2P/Skins/Maps. Game-over: score/record/replay. |
| Pause/Resume | SHALL | P toggles; overlay. |

#### Scenarios

**Scenario: Eating food**
- **GIVEN** snake at (200,100) → food at (220,100)
- **WHEN** head reaches (220,100)
- **THEN** score +food value; snake +1; new food spawns unoccupied

---

### two-player

| Req | RFC 2119 | Summary |
|---|---|---|
| Spawn | SHALL | P1 left-center, P2 right-center, length 3 moving inward. |
| Controls | SHALL | P1: Arrow, P2: WASD. Direction lock per snake. |
| Shared Food | SHALL | Single food, random unoccupied. |
| Collision | SHALL | Border/self/obstacle/opponent-body → gameOver. Head-to-head → draw. |
| Win Detection | SHALL | One dies → other wins. Both same tick → draw. Both scores in HUD. |

#### Scenarios

**Scenario: Head-to-head draw**
- **GIVEN** P1 at (200,100)↓; P2 at (200,120)↑
- **WHEN** both reach (200,110) same tick
- **THEN** both die; draw

---

### pwa-packaging

| Req | RFC 2119 | Summary |
|---|---|---|
| Service Worker | SHALL | Cache static assets for offline. |
| Manifest | SHALL | name, icons 192+512, display: standalone, theme/bg color. |
| Install Prompt | SHALL | Show on eligible browsers; skip if installed. |
| Full-Screen | SHALL | display: standalone → no chrome. |

---

### mobile-packaging

| Req | RFC 2119 | Summary |
|---|---|---|
| Capacitor Configs | SHALL | iOS + Android; build scripts → .apk + .app. |
| Touch/Swipe | SHALL | Swipe gestures + on-screen D-pad fallback. |
| Responsive Canvas | SHALL | Fit viewport, maintain aspect ratio. |
| Splash + Status Bar | SHALL | Splash on launch; platform status bar config. |

#### Scenarios

**Scenario: Swipe changes direction**
- **GIVEN** playing on touch device
- **WHEN** swipe right → direction right (unless currently left)

---

### desktop-delivery

| Req | RFC 2119 | Summary |
|---|---|---|
| Project Scaffold | SHALL | Vite + dev/build/test/preview. src/, tests/, assets/, public/. |
| Testing | SHALL | Vitest (logic), Playwright (canvas smoke). |
| Skins | SHALL | 4 palettes (Clásica, Azul, Fuego, Morada). Persisted, HUD display. |
| Maps | SHALL | 4 presets (Clásico, Columnas, Cruz, Fortaleza). Obstacle layout per map. |
| Keyboard | SHALL | Arrow, WASD, Enter, P, M, K, 1, 2. |
| Record | SHALL | localStorage "snake-record". |

---

## REMOVED Requirements

| Requirement | Reason |
|---|---|
| Python/turtle rendering | Replaced by Canvas 2D. 7 legacy files deleted. |
| TCP socket networking | Incompatible with browser; deferred to WebSocket v2. |
| AI opponent | Deferred post-migration. |
| record.txt file persistence | Replaced by localStorage. |
