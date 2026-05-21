import { GRID_SIZE } from '../config.js';
import { SKINS } from '../config.js';

export function drawSnake(ctx, snake, skin) {
  const palette = skin || SKINS[0];
  const dead = !snake.alive;
  const headColor = dead ? darken(palette.headColor, -40) : palette.headColor;
  const bodyColor = dead ? darken(palette.bodyColor, -40) : palette.bodyColor;

  for (let i = 0; i < snake.segments.length; i++) {
    const seg = snake.segments[i];
    ctx.fillStyle = i === 0 ? headColor : bodyColor;
    ctx.fillRect(seg.x, seg.y, GRID_SIZE, GRID_SIZE);
  }
}

function darken(hex, amount) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v + amount));
  const rr = clamp(r).toString(16).padStart(2, '0');
  const gg = clamp(g).toString(16).padStart(2, '0');
  const bb = clamp(b).toString(16).padStart(2, '0');
  return `#${rr}${gg}${bb}`;
}
