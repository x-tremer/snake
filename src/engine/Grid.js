import { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';

export const Grid = {
  GRID_SIZE,

  isOccupied(x, y, snakes, obstacles = []) {
    for (const snake of snakes) {
      for (const seg of snake.segments) {
        if (seg.x === x && seg.y === y) return true;
      }
    }
    for (const obs of obstacles) {
      if (obs.x === x && obs.y === y) return true;
    }
    return false;
  },

  snapToGrid(value) {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  },

  isOutOfBounds(x, y, width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
    const padding = 10;
    return (
      x < padding ||
      x > width - padding - GRID_SIZE ||
      y < padding ||
      y > height - padding - GRID_SIZE
    );
  },

  randomFreeCell(snakes, obstacles, width = CANVAS_WIDTH, height = CANVAS_HEIGHT) {
    const padding = 10;
    const cols = Math.floor((width - padding * 2) / GRID_SIZE);
    const rows = Math.floor((height - padding * 2) / GRID_SIZE);

    let attempts = 0;
    const maxAttempts = cols * rows * 2;

    while (attempts < maxAttempts) {
      const gx = Math.floor(Math.random() * cols);
      const gy = Math.floor(Math.random() * rows);
      const x = padding + gx * GRID_SIZE;
      const y = padding + gy * GRID_SIZE;

      if (!this.isOccupied(x, y, snakes, obstacles)) {
        return { x, y };
      }
      attempts++;
    }

    // Fallback: scan systematically
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = padding + c * GRID_SIZE;
        const y = padding + r * GRID_SIZE;
        if (!this.isOccupied(x, y, snakes, obstacles)) {
          return { x, y };
        }
      }
    }

    return null;
  },
};
