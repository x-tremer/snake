# game-engine Specification

## Purpose
Core game engine: grid system, entity tracking, movement, collision, game loop, state machine, canvas rendering, and keyboard input.

## Requirements

### Requirement: Grid System
The game SHALL operate on a grid of 20px cells. Entity positions MUST be grid-aligned.

#### Scenario: Grid-aligned movement
- **GIVEN** a snake head at position (100, 80)
- **WHEN** the snake moves right by one cell
- **THEN** the new head position is (120, 80)

### Requirement: Movement with Direction Locks
The snake MUST NOT reverse direction. A direction change that would reverse is ignored.

#### Scenario: Reverse blocked
- **GIVEN** snake moving right
- **WHEN** input "left" is received
- **THEN** input is ignored; snake continues right

### Requirement: Collision Detection
The engine SHALL detect: border collision (head outside grid bounds), self-collision (head intersects body), and obstacle collision.

#### Scenario: Border collision triggers game over
- **GIVEN** snake head at rightmost column of a 600×400 grid
- **WHEN** snake moves right
- **THEN** game state transitions to `gameOver`

#### Scenario: Self-collision triggers game over
- **GIVEN** snake body occupies cells at (200, 100), (180, 100), (160, 100), (140, 100), (120, 100)
- **WHEN** snake at (200, 100) turns down, then left, then up
- **THEN** head at (120, 100) collides with body; state transitions to `gameOver`

### Requirement: Game Loop
The engine SHALL run a configurable tick loop. Tick delay SHALL decrease per level: `delay = max(0.05, 0.12 - (level-1) * 0.01)`.

### Requirement: State Machine
The engine SHALL manage states: `menu`, `playing`, `paused`, `gameOver`. Transitions MUST be explicit and guarded.

### Requirement: Canvas Rendering
The renderer SHALL draw: dark background with animated starfield, colored snake squares with distinct head, food as circles, obstacles as gray squares, HUD overlay with score/record/level/skin, and pause/game-over overlays.

### Requirement: Keyboard Input
The input handler SHALL map: Arrow keys (P1 movement), Enter (start/confirm), P (pause), M (menu), K (change skin), 1 (1P), 2 (2P). Inputs MUST be state-gated.

#### Scenario: P toggles pause
- **GIVEN** game state is `playing`
- **WHEN** P key is pressed
- **THEN** state transitions to `paused`; overlay appears
- **WHEN** P key is pressed again
- **THEN** state returns to `playing`

### Requirement: Repository Cleanup
All 7 legacy Python files SHALL be deleted. Repository SHALL include `.gitignore` for Node/Vite and have `npm scripts` (dev, build, test, preview).
