import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../../src/engine/GameState.js';
import { STATES } from '../../src/config.js';

describe('GameState', () => {
  let gs;

  beforeEach(() => {
    gs = new GameState();
  });

  it('starts in MENU state', () => {
    expect(gs.getState()).toBe(STATES.MENU);
  });

  it('transitions to PLAYING_1P on init1P', () => {
    gs.init1P();
    expect(gs.getState()).toBe(STATES.PLAYING_1P);
    expect(gs.getSnakes().length).toBe(1);
    expect(gs.getScore()).toBe(0);
  });

  it('processes tick and collisions', () => {
    gs.init1P();
    gs._pendingActions = [];
    const result = gs.tick([]);
    expect(result).toBeNull();
  });

  it('detects border collision in tick', () => {
    gs.init1P();
    gs._pendingActions = [];
    // Force snake head to near-right border
    gs.snakes[0].segments[0] = { x: 570, y: 300 };
    gs.snakes[0].direction = 'RIGHT';
    const result = gs.tick([]);
    expect(result).not.toBeNull();
    expect(result.type).toBe('border');
    expect(gs.getState()).toBe(STATES.GAME_OVER);
  });

  it('increments score and level on food eaten', () => {
    gs.init1P();
    gs._pendingActions = [];
    const snake = gs.snakes[0];
    // Place food where head will be after next move (going right)
    const futureHead = { x: snake.headPosition().x + 20, y: snake.headPosition().y };
    gs.food._position = futureHead;
    gs.food._value = 1;
    gs.tick([]);
    expect(gs.getScore()).toBe(1);
    expect(gs.getLevel()).toBe(1);
  });

  it('progresses level after enough points', () => {
    gs.init1P();
    gs._pendingActions = [];
    gs.score = 9; // just under 2nd level threshold (5 pts per level)
    const futureHead = { x: gs.snakes[0].headPosition().x + 20, y: gs.snakes[0].headPosition().y };
    gs.food._position = futureHead;
    gs.food._value = 3;
    gs.tick([]);
    expect(gs.getScore()).toBe(12);
    expect(gs.getLevel()).toBe(3);
    expect(gs.getDelay()).toBeLessThan(120);
  });
});
