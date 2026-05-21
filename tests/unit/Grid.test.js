import { describe, it, expect } from 'vitest';
import { Grid } from '../../src/engine/Grid.js';

describe('Grid', () => {
  it('reports occupied when snake or obstacle is present', () => {
    const snakes = [{ segments: [{ x: 100, y: 100 }] }];
    const obstacles = [{ x: 200, y: 200 }];
    expect(Grid.isOccupied(100, 100, snakes, obstacles)).toBe(true);
    expect(Grid.isOccupied(200, 200, snakes, obstacles)).toBe(true);
    expect(Grid.isOccupied(300, 300, snakes, obstacles)).toBe(false);
  });

  it('snapToGrid rounds to nearest cell', () => {
    expect(Grid.snapToGrid(95)).toBe(100);
    expect(Grid.snapToGrid(104)).toBe(100);
    expect(Grid.snapToGrid(105)).toBe(100);
    expect(Grid.snapToGrid(115)).toBe(120);
  });

  it('isOutOfBounds detects outside play area with padding', () => {
    // Within bounds (padding=10, canvas=600, GRID_SIZE=20)
    expect(Grid.isOutOfBounds(10, 10)).toBe(false);
    expect(Grid.isOutOfBounds(100, 100)).toBe(false);
    // Too close to edge
    expect(Grid.isOutOfBounds(0, 10)).toBe(true);
    expect(Grid.isOutOfBounds(10, 0)).toBe(true);
    // 600-10-20 = 570 max before out of bounds
    expect(Grid.isOutOfBounds(570, 10)).toBe(true);
    expect(Grid.isOutOfBounds(580, 580)).toBe(true);
  });

  it('randomFreeCell returns an unoccupied position', () => {
    const snakes = [{ segments: [{ x: 10, y: 10 }] }];
    const obstacles = [{ x: 30, y: 30 }];
    const cell = Grid.randomFreeCell(snakes, obstacles, 100, 100);
    expect(cell).not.toBeNull();
    expect(Grid.isOccupied(cell.x, cell.y, snakes, obstacles)).toBe(false);
  });
});
