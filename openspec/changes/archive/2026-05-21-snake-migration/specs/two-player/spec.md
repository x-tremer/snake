# two-player Specification

## Purpose
Local two-player mode with independent controls, shared food, collision rules, and win/lose/draw.

## Requirements

### Requirement: Two-Player Spawn
P1 SHALL spawn at grid left-center; P2 SHALL spawn at grid right-center. Both snakes SHALL start length 3 moving toward center.

### Requirement: Independent Controls
P1 SHALL use Arrow keys. P2 SHALL use WASD keys. Both SHALL respect direction lock (no reverse).

### Requirement: Shared Food
A single food SHALL spawn at a random unoccupied position. Both snakes compete for the same food.

### Requirement: Collision Rules
The following SHALL trigger game over for the colliding snake: border, self, obstacle, opponent's body. Head-to-head collision SHALL result in draw.

#### Scenario: Head-to-head results in draw
- **GIVEN** P1 at (200, 100) moving down; P2 at (200, 120) moving up
- **WHEN** both heads move to (200, 110) on the same tick
- **THEN** both snakes die; result is draw

### Requirement: Win/Lose/Draw Detection
When one snake dies, the other SHALL be declared winner. When both die on the same tick, result SHALL be draw. Both scores SHALL be displayed in HUD.
