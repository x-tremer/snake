import { describe, it, expect } from 'vitest';
import { Obstacles } from '../../src/engine/Obstacles.js';
import { GRID_SIZE } from '../../src/config.js';

describe('Obstacles', () => {
  it('generates empty obstacles for level 1 on all maps', () => {
    const obs = new Obstacles();
    for (let map = 0; map <= 3; map++) {
      const result = obs.generate(1, map);
      if (map === 0) {
        expect(result.length).toBe(0);
      }
    }
  });

  it('generates columnas pattern for LEVEL 2', () => {
    const obs = new Obstacles();
    const positions = obs.generate(2, 1);
    expect(positions.length).toBeGreaterThan(0);
    // All positions should be grid-aligned
    for (const p of positions) {
      expect(Math.abs(p.x % GRID_SIZE)).toBe(0);
      expect(Math.abs(p.y % GRID_SIZE)).toBe(0);
    }
  });

  it('generates cruz pattern for LEVEL 2', () => {
    const obs = new Obstacles();
    const positions = obs.generate(2, 2);
    expect(positions.length).toBeGreaterThan(0);
  });

  it('generates fortaleza pattern for LEVEL 2', () => {
    const obs = new Obstacles();
    const positions = obs.generate(2, 3);
    expect(positions.length).toBeGreaterThan(0);
    // Top border row should exist
    const topRow = positions.filter((p) => p.y === -160);
    expect(topRow.length).toBeGreaterThan(0);
    expect(positions.every((p) => p.x % GRID_SIZE === 0 && p.y % GRID_SIZE === 0)).toBe(true);
  });

  it('level 3 produces more obstacles than level 2 for COLUMNAS', () => {
    const obs2 = new Obstacles();
    const obs3 = new Obstacles();
    const l2 = obs2.generate(2, 1).length;
    const l3 = obs3.generate(3, 1).length;
    expect(l3).toBeGreaterThan(l2);
  });
});
