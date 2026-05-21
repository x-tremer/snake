import { GRID_SIZE, DIRECTIONS } from '../config.js';

const DIR_OPPOSITES = {
  [DIRECTIONS.UP]: DIRECTIONS.DOWN,
  [DIRECTIONS.DOWN]: DIRECTIONS.UP,
  [DIRECTIONS.LEFT]: DIRECTIONS.RIGHT,
  [DIRECTIONS.RIGHT]: DIRECTIONS.LEFT,
};

const DIR_DELTAS = {
  [DIRECTIONS.UP]: { x: 0, y: -GRID_SIZE },
  [DIRECTIONS.DOWN]: { x: 0, y: GRID_SIZE },
  [DIRECTIONS.LEFT]: { x: -GRID_SIZE, y: 0 },
  [DIRECTIONS.RIGHT]: { x: GRID_SIZE, y: 0 },
};

export class Snake {
  constructor(skinIndex, startX, startY, initialDirection = DIRECTIONS.RIGHT) {
    this.skinIndex = skinIndex;
    this.direction = initialDirection.toUpperCase();
    this.pendingGrowth = 0;
    this.alive = true;

    // Create 3 segments: head at startX, then 2 behind in opposite direction
    const opposite = DIR_OPPOSITES[this.direction];
    const delta = DIR_DELTAS[opposite];

    this.segments = [
      { x: startX, y: startY },
      { x: startX + delta.x, y: startY + delta.y },
      { x: startX + delta.x * 2, y: startY + delta.y * 2 },
    ];
  }

  setDirection(newDir) {
    const upper = newDir.toUpperCase();
    if (DIR_OPPOSITES[this.direction] === upper) {
      return; // Block 180° reverse
    }
    this.direction = upper;
  }

  move() {
    if (!this.alive) return null;

    const delta = DIR_DELTAS[this.direction];
    const newHead = {
      x: this.segments[0].x + delta.x,
      y: this.segments[0].y + delta.y,
    };

    this.segments.unshift(newHead);

    if (this.pendingGrowth > 0) {
      this.pendingGrowth--;
      return null; // Grew; no tail removed
    }

    return this.segments.pop(); // Removed tail
  }

  grow(amount = 1) {
    this.pendingGrowth += amount;
  }

  headPosition() {
    return { ...this.segments[0] };
  }

  checkSelfCollision() {
    const head = this.segments[0];
    for (let i = 1; i < this.segments.length; i++) {
      if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
        return true;
      }
    }
    return false;
  }

  occupiesAll() {
    return this.segments.map((seg) => ({ ...seg }));
  }
}
