import { describe, it, expect } from 'vitest';
import { Snake } from '../../src/engine/Snake.js';
import { DIRECTIONS, GRID_SIZE } from '../../src/config.js';

describe('Snake', () => {
  it('initializes with 3 segments and correct direction', () => {
    const snake = new Snake(0, 100, 100, 'RIGHT');
    expect(snake.segments.length).toBe(3);
    expect(snake.segments[0]).toEqual({ x: 100, y: 100 });
    expect(snake.direction).toBe('RIGHT');
    expect(snake.alive).toBe(true);
  });

  it('changes direction via setDirection', () => {
    const snake = new Snake(0, 0, 0, 'RIGHT');
    snake.setDirection('UP');
    expect(snake.direction).toBe('UP');
  });

  it('blocks reverse direction', () => {
    const snake = new Snake(0, 0, 0, 'RIGHT');
    snake.setDirection('LEFT');
    expect(snake.direction).toBe('RIGHT');

    snake.setDirection('UP');
    snake.setDirection('DOWN');
    expect(snake.direction).toBe('UP');
  });

  it('move shifts head and pops tail', () => {
    const snake = new Snake(0, 100, 100, 'RIGHT');
    const tail = snake.move();
    expect(snake.segments[0]).toEqual({ x: 100 + GRID_SIZE, y: 100 });
    expect(snake.segments.length).toBe(3);
    expect(tail).toEqual({ x: 100 - GRID_SIZE * 2, y: 100 });
  });

  it('move returns null when pending growth is active', () => {
    const snake = new Snake(0, 100, 100, 'RIGHT');
    snake.grow(1);
    const tail = snake.move();
    expect(tail).toBeNull();
    expect(snake.segments.length).toBe(4);
    expect(snake.pendingGrowth).toBe(0);
  });

  it('detects self-collision', () => {
    const snake = new Snake(0, 0, 0, 'RIGHT');
    // Manually set body so head overlaps with a body segment
    snake.segments = [
      { x: 0, y: 0 },   // head
      { x: 20, y: 0 },
      { x: 20, y: 20 },
      { x: 0, y: 20 },
      { x: 0, y: 0 },   // overlapping segment
    ];
    expect(snake.checkSelfCollision()).toBe(true);
  });

  it('reports head position', () => {
    const snake = new Snake(0, 60, 80, 'RIGHT');
    expect(snake.headPosition()).toEqual({ x: 60, y: 80 });
    snake.move();
    expect(snake.headPosition()).toEqual({ x: 60 + GRID_SIZE, y: 80 });
  });
});
