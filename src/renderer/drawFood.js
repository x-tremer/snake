import { FOOD_TYPES, GRID_SIZE } from '../config.js';

/** Map each food type to its configured color. */
const TYPE_COLORS = {
  NORMAL: FOOD_TYPES.NORMAL.color,
  BONUS: FOOD_TYPES.BONUS.color,
  SPEED: FOOD_TYPES.SPEED.color,
};

/** Base radius in pixels. */
const BASE_RADIUS = GRID_SIZE / 2 - 1;

export function drawFood(ctx, food, time = 0) {
  const pos = food.position || food;
  const type = food.type || 'NORMAL';
  const centerX = pos.x + GRID_SIZE / 2;
  const centerY = pos.y + GRID_SIZE / 2;

  const baseR = type === 'BONUS' ? BASE_RADIUS + 2 : BASE_RADIUS;
  const radius = type === 'SPEED' ? baseR + Math.sin(time) * 2 : baseR;

  // Food body
  ctx.beginPath();
  ctx.arc(centerX, centerY, Math.max(2, radius), 0, Math.PI * 2);
  ctx.fillStyle = TYPE_COLORS[type] || TYPE_COLORS.NORMAL;
  ctx.fill();
  ctx.closePath();

  // Small leaf accent
  ctx.beginPath();
  ctx.ellipse(centerX - 2, centerY - radius - 2, 3, 2, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#00ff00';
  ctx.fill();
  ctx.closePath();
}
