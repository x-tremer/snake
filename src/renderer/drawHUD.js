import { CANVAS_WIDTH, SKINS, MAPS } from '../config.js';

export function drawHUD(ctx, gameState) {
  const score = gameState.getScore();
  const record = gameState.getRecord();
  const level = gameState.getLevel();
  const skin = SKINS[gameState.currentSkin] || SKINS[0];
  const map = MAPS[gameState.currentMap] || MAPS[0];

  ctx.font = 'bold 14px Arial, sans-serif';
  ctx.textBaseline = 'top';

  let text;
  if (gameState.getMode() === 2) {
    const score2 = gameState.getScore2();
    text = `P1: ${score}  P2: ${score2}  Record: ${record}  Level: ${level}`;
  } else {
    text = `Score: ${score}  Record: ${record}  Level: ${level}  Skin: ${skin.name}  Map: ${map.name}`;
  }

  ctx.textAlign = 'center';

  // Subtle background bar
  const barWidth = ctx.measureText(text).width + 24;
  const barHeight = 22;
  const barX = CANVAS_WIDTH / 2 - barWidth / 2;
  const barY = 10;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(barX, barY, barWidth, barHeight);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, CANVAS_WIDTH / 2, barY + 4);
}
