# Spec: Snake HTML5 Migration

## ADDED Requirements

### game-engine

| Requirement | RFC 2119 | Summary |
|---|---|---|
| Grid System | SHALL | 20px cells; entity positions grid-aligned. |
| Movement Direction Lock | MUST NOT | Reverse direction; blocked input ignored. |
| Collision Detection | SHALL | Detect border, self, and obstacle collisions. |
| Game Loop | SHALL | Configurable tick rate; delay = max(0.05, 0.12 - (level-1)*0.01). |
| State Machine | SHALL | States: menu, playing, paused, gameOver. Guarded transitions. |
| Canvas Rendering | SHALL | Dark background + starfield; snake squares with distinct head; food circles; gray obstacles; HUD overlay. |
| Keyboard Input | SHALL | Arrow keys, Enter, P, M, K, 1, 2. State-gated. |
| Repository Cleanup | SHALL | Delete 7 legacy Python files. .gitignore for Node/Vite. npm scripts (dev, build, test, preview). |

#### Scenarios

**Scenario: Grid-aligned movement**
- **GIVEN** snake head at (100, 80)
- **WHEN** snake moves right by one cell
- **THEN** new head position is (120, 80)

**Scenario: Reverse blocked**
- **GIVEN** snake moving right
- **WHEN** input "left" is received
- **THEN** input is ignored; snake continues right

**Scenario: Border collision triggers game over**
- **GIVEN** snake head at rightmost column
- **WHEN** snake moves right
- **THEN** state → gameOver

**Scenario: Self-collision triggers game over**
- **GIVEN** snake body occupies (200,100), (180,100), (160,100), (140,100), (120,100)
- **WHEN** snake at (200,100) turns down, left, up
- **THEN** head at (120,100) collides; state → gameOver

**Scenario: P toggles pause**
- **GIVEN** state is playing
- **WHEN** P pressed → state → paused, overlay shown
- **WHEN** P pressed again → state → playing

---

### single-player

| Requirement | RFC 2119 | Summary |
|---|---|---|
| Snake Spawn | SHALL | Center of grid, length 3, moving right. |
| Food Spawn | MUST | Random unoccupied cell. Eating grows snake +1 segment, respawns food. |
| Food Types | SHALL | Regular (1pt), Bonus (2pt), Speed (3pt). Visually distinct. |
| Level Progression | SHALL | Every 5 points → level up. |
| Speed Scaling | SHALL | delay = max(0.05, 0.12 - (level-1)*0.01). |
| Obstacles | SHALL | Appear at level ≥ 2: columns, cross, fortress. Collision → gameOver. |
| Game Over Conditions | SHALL | Border, self, obstacle → gameOver. |
| HUD | SHALL | Score, record, level, skin name. |
| Record Persistence | SHALL | localStorage key "snake-record". Read on load, write when beaten. |
| Menu Flow | SHALL | Start (1P), 2 Players, Skins, Maps. Game-over: score, record, replay/return. |
| Pause/Resume | SHALL | P toggles; overlay shown. |

#### Scenarios

**Scenario: Eating food grows snake**
- **GIVEN** snake at (200, 100) moving toward food at (220, 100)
- **WHEN** head reaches (220, 100)
- **THEN** score +food value; snake +1 segment; new food at unoccupied cell

---

### two-player

| Requirement | RFC 2119 | Summary |
|---|---|---|
| Spawn | SHALL | P1 left-center, P2 right-center; length 3 moving inward. |
| Controls | SHALL | P1: Arrow keys, P2: WASD. Direction lock applies to both. |
| Shared Food | SHALL | Single food at random unoccupied position. |
| Collision Rules | SHALL | Border, self, obstacle, opponent body → gameOver for collider. Head-to-head → draw. |
| Win/Lose/Draw | SHALL | One dies → other wins. Both same tick → draw. Both scores in HUD. |

#### Scenarios

**Scenario: Head-to-head draw**
- **GIVEN** P1 at (200, 100)→down; P2 at (200, 120)→up
- **WHEN** both reach (200, 110) same tick
- **THEN** both die; result is draw

---

### pwa-packaging

| Requirement | RFC 2119 | Summary |
|---|---|---|
| Service Worker | SHALL | Cache static assets for offline (index.html, JS, CSS, icons). |
| Web App Manifest | SHALL | name, short_name, 192px+512px icons, display: standalone, theme/background color. |
| Install Prompt | SHALL | Show on eligible browsers; skip if already installed. |
| Full-Screen | SHALL | display: standalone → no browser chrome. |

---

### mobile-packaging

| Requirement | RFC 2119 | Summary |
|---|---|---|
| Capacitor Configs | SHALL | iOS + Android platform configs. Build scripts → .apk + .app. |
| Touch/Swipe Input | SHALL | Swipe gestures for direction. On-screen D-pad fallback. |
| Responsive Canvas | SHALL | Resize to viewport, maintain aspect ratio, usable touch targets. |
| Splash + Status Bar | SHALL | Splash on launch; platform status bar config. |

#### Scenarios

**Scenario: Swipe changes direction**
- **GIVEN** playing on touch device
- **WHEN** user swipes right
- **THEN** direction → right (unless currently left)

---

### desktop-delivery

| Requirement | RFC 2119 | Summary |
|---|---|---|
| Project Scaffold | SHALL | Vite + npm scripts (dev, build, test, preview). src/, tests/, assets/, public/. |
| Testing | SHALL | Vitest for game logic. Playwright for canvas smoke tests. |
| Skins | SHALL | 4 palettes: Clásica (green/lime), Azul (blue/deepskyblue), Fuego (red/orange), Morada (purple/violet). Persisted. |
| Maps | SHALL | 4 presets: Clásico, Columnas, Cruz, Fortaleza. Obstacle layout per map. |
| Keyboard Input | SHALL | Arrow, WASD, Enter, P, M, K, 1, 2. |
| Record Persistence | SHALL | localStorage "snake-record". |

---

## REMOVED Requirements

| Requirement | Reason |
|---|---|
| Python/turtle rendering engine | Replaced by Canvas 2D rendering. All 7 legacy Python files deleted. |
| TCP socket networking (online multiplayer) | Incompatible with browser sandbox. Deferred to future WebSocket-based v2. |
| AI opponent logic | Deferred post-migration. Greedy pathfinding AI dropped from v1 scope. |
| File-based record persistence (record.txt) | Replaced by localStorage ("snake-record"). |
