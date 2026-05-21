# single-player Specification

## Purpose
Single-player mode: spawn, food, scoring, levels, obstacles, skins, record persistence, and HUD.

## Requirements

### Requirement: Snake Spawn
The snake SHALL spawn at grid center, length 3, moving right by default.

### Requirement: Food Spawn
Food MUST spawn at a random unoccupied grid position. Eating food SHALL increment score and grow snake by 1 segment.

#### Scenario: Eating food grows snake and respawns food
- **GIVEN** snake at (200, 100) moving toward food at (220, 100)
- **WHEN** snake head reaches (220, 100)
- **THEN** score increases by food value; snake length increases by 1; new food spawns at an unoccupied cell

### Requirement: Food Types
The game SHALL support: Regular (1pt), Bonus (2pt), Speed food (3pt). Each type MUST be visually distinct by color/shape.

### Requirement: Level Progression
Every 5 points SHALL advance the level. Speed SHALL increase per level: `delay = max(0.05, 0.12 - (level-1) * 0.01)`.

### Requirement: Obstacles
Obstacles SHALL appear starting level 2 using patterns: columns, cross, fortress (per map). Collision with obstacle MUST trigger game over.

### Requirement: Game Over Conditions
Border collision, self-collision, and obstacle collision SHALL transition state to `gameOver`.

### Requirement: HUD
The HUD SHALL display: score, record (from localStorage key "snake-record"), level, and active skin name.

### Requirement: Record Persistence
The record SHALL be read from localStorage key "snake-record" on load. When score exceeds record, it SHALL be written. SHALL survive page refresh.

### Requirement: Menu Flow
The main menu SHALL offer: Start (1P), 2 Players, Skins, Map select. Game-over screen SHALL show score, record, and replay/return options.

### Requirement: Pause/Resume
P key SHALL toggle pause. An overlay SHALL be shown during pause.
