import { CANVAS_WIDTH, CANVAS_HEIGHT, SKINS, MAPS } from '../config.js';

export function drawMenu(ctx, gameState) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Subtle gray border/frame
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20);

  // Title
  ctx.fillStyle = '#00ff00';
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SNAKE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 120);

  const skin = SKINS[gameState.currentSkin] || SKINS[0];
  const map = MAPS[gameState.currentMap] || MAPS[0];

  ctx.font = '16px Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Press ENTER to play (1 Player)', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
  ctx.fillText('Press 2 for 2 Players', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 35);

  ctx.fillStyle = skin.headColor;
  ctx.fillText(`K - Change Skin: ${skin.name}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(`M - Change Map: ${map.name}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15);

  ctx.fillStyle = '#aaaaaa';
  ctx.fillText(`Current Record: ${gameState.getRecord()}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
}
