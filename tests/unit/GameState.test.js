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

  // --- 2P Tests ---

  it('init2P creates 2 snakes and sets mode=2', () => {
    gs.init2P();
    expect(gs.getState()).toBe(STATES.PLAYING_2P);
    expect(gs.getMode()).toBe(2);
    expect(gs.getSnakes().length).toBe(2);
    expect(gs.getScore()).toBe(0);
    expect(gs.getScore2()).toBe(0);
  });

  it('2P: P1 hitting border gives P2 win', () => {
    gs.init2P();
    gs._pendingActions = [];
    // Force P1 head to near-right border
    gs.snakes[0].segments[0] = { x: 570, y: 300 };
    gs.snakes[0].direction = 'RIGHT';
    const result = gs.tick([]);
    expect(result).not.toBeNull();
    expect(gs.getState()).toBe(STATES.GAME_OVER);
    expect(gs.getWinner()).toBe('p2');
  });

  it('2P: P2 hitting border gives P1 win', () => {
    gs.init2P();
    gs._pendingActions = [];
    // Force P2 head to near-left border (P2 goes left)
    gs.snakes[1].segments[0] = { x: 10, y: 300 };
    gs.snakes[1].direction = 'LEFT';
    const result = gs.tick([]);
    expect(result).not.toBeNull();
    expect(gs.getState()).toBe(STATES.GAME_OVER);
    expect(gs.getWinner()).toBe('p1');
  });

  it('2P: head-to-head collision gives draw', () => {
    gs.init2P();
    gs._pendingActions = [];
    // Both heads moving toward the same cell → both land at (300,300)
    gs.snakes[0].segments = [
      { x: 280, y: 300 },
      { x: 260, y: 300 },
      { x: 240, y: 300 },
    ];
    gs.snakes[0].direction = 'RIGHT';

    gs.snakes[1].segments = [
      { x: 320, y: 300 },
      { x: 340, y: 300 },
      { x: 360, y: 300 },
    ];
    gs.snakes[1].direction = 'LEFT';

    // After move: P1 head at (300,300), P2 head at (300,300) → both same cell
    const result = gs.tick([]);
    expect(result).not.toBeNull();
    expect(result.type).toBe('headToHead');
    expect(gs.getState()).toBe(STATES.GAME_OVER);
    expect(gs.getWinner()).toBe('draw');
  });

  it('2P: opponent body collision detected', () => {
    gs.init2P();
    gs._pendingActions = [];
    // P2 has body segment at (340,300). P1 head moves to (340,300) → hits P2 body.
    gs.snakes[0].segments = [
      { x: 320, y: 300 },
      { x: 300, y: 300 },
      { x: 280, y: 300 },
    ];
    gs.snakes[0].direction = 'RIGHT';

    gs.snakes[1].segments = [
      { x: 360, y: 300 },
      { x: 340, y: 300 },
      { x: 320, y: 300 },
    ];
    gs.snakes[1].direction = 'RIGHT';

    // After move: P1 head at (340,300), P2 segments: [(380,300), (360,300), (340,300)]
    // P1 head hits P2 segments[2] = (340,300) — body collision, P2 wins
    const result = gs.tick([]);
    expect(result).not.toBeNull();
    expect(result.type).toBe('opponent');
    expect(gs.getState()).toBe(STATES.GAME_OVER);
    expect(gs.getWinner()).toBe('p2');
  });

  it('2P: food eaten increments correct score', () => {
    gs.init2P();
    gs._pendingActions = [];
    // Place food where P2 will be after moving left
    const p2Head = gs.snakes[1].headPosition();
    const futureP2Head = { x: p2Head.x - 20, y: p2Head.y };
    gs.food._position = futureP2Head;
    gs.food._value = 1;
    gs.tick([]);
    expect(gs.getScore()).toBe(0);
    expect(gs.getScore2()).toBe(1);
  });

  it('2P: levels from combined score', () => {
    gs.init2P();
    gs._pendingActions = [];
    gs.score = 3;
    gs.score2 = 1; // combined = 4
    const p2Head = gs.snakes[1].headPosition();
    const futureP2Head = { x: p2Head.x - 20, y: p2Head.y };
    gs.food._position = futureP2Head;
    gs.food._value = 1;
    gs.tick([]);
    // Combined score reached 5 = level 2
    expect(gs.getLevel()).toBe(2);
  });
});
