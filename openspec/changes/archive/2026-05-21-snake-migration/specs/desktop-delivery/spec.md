# desktop-delivery Specification

## Purpose
Desktop delivery via PWA install from browser. Canvas game with standard project scaffold.

## Requirements

### Requirement: Project Scaffold
The project SHALL use Vite for dev server and bundling with npm scripts: `dev`, `build`, `test`, `preview`. Directory structure SHALL be: `src/`, `tests/`, `assets/`, `public/`.

### Requirement: Testing
Vitest SHALL test game logic (grid, collision, state machine, scoring). Playwright SHALL provide canvas rendering smoke tests.

### Requirement: Skins System
Four skins SHALL be available: Clásica (green/lime), Azul (blue/deepskyblue), Fuego (red/orange), Morada (purple/violet). Active skin SHALL be displayed in HUD and persisted.

### Requirement: Maps System
Four map presets SHALL be available: Clásico (no obstacles), Columnas (vertical bars), Cruz (center cross), Fortaleza (border walls). Map selection SHALL change obstacle layout.

### Requirement: Keyboard Input
Arrow keys (P1), WASD (P2), Enter (start/confirm), P (pause), M (menu), K (change skin), 1 (1P), 2 (2P) SHALL be recognized.

### Requirement: Record Persistence
Score record SHALL be stored in localStorage key "snake-record".
