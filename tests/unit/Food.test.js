import { describe, it, expect } from 'vitest';
import { Food } from '../../src/engine/Food.js';

describe('Food', () => {
  it('spawns at a position avoiding occupied cells', () => {
    const food = new Food();
    const snakes = [{ segments: [{ x: 100, y: 100 }] }];
    const obstacles = [{ x: 120, y: 120 }];
    food.spawn(snakes, obstacles, 600, 600);
    const pos = food.position;
    expect(pos.x).not.toBe(100);
    expect(pos.y).not.toBe(100);
    expect(pos.x).not.toBe(120);
    expect(pos.y).not.toBe(120);
  });

  it('checkEaten returns snake index when head is within distance', () => {
    const food = new Food();
    food._position = { x: 100, y: 100 };
    const heads = [{ x: 100, y: 100 }];
    expect(food.checkEaten(heads)).toBe(0);
  });

  it('checkEaten returns -1 when head is far', () => {
    const food = new Food();
    food._position = { x: 100, y: 100 };
    const heads = [{ x: 500, y: 500 }];
    expect(food.checkEaten(heads)).toBe(-1);
  });

  it('random type distribution within range', () => {
    const counts = { NORMAL: 0, BONUS: 0, SPEED: 0 };
    for (let i = 0; i < 1000; i++) {
      const food = new Food();
      food.spawn([], [], 600, 600);
      counts[food.type]++;
    }
    // Expect roughly 80% NORMAL
    expect(counts.NORMAL).toBeGreaterThan(700);
    expect(counts.BONUS).toBeGreaterThan(100);
    expect(counts.SPEED).toBeLessThan(100);
    expect(counts.NORMAL + counts.BONUS + counts.SPEED).toBe(1000);
  });
});
