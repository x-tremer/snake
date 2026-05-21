import { CANVAS_WIDTH, CANVAS_HEIGHT, SKINS, MAPS } from '../config.js';

export function drawMenu(ctx, gameState) {
  // Semi-transparent overlay so particles show through
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
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

  if (!gameState.authenticated) {
    ctx.fillText('Write your code and press Enter', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

    // Show what the user is typing, with blinking cursor
    const typed = gameState.loginCode || '';
    const cursor = (Math.floor(Date.now() / 500) % 2 === 0) ? '|' : '';
    ctx.font = 'bold 24px monospace';
    const display = typed + cursor;
    if (typed.length > 0) {
      ctx.fillStyle = '#00ff00';
    } else {
      ctx.fillStyle = '#444444';
    }
    ctx.fillText(display || 'SNAKE-___', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);

    // Show error if last attempt failed
    if (gameState.loginError) {
      ctx.font = '14px Arial, sans-serif';
      ctx.fillStyle = '#ff4444';
      ctx.fillText('Invalid code. Try again.', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 45);
    }
  } else {
    ctx.fillText('Press ENTER to play (1 Player)', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
    ctx.fillText('Press 2 for 2 Players', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 35);

    ctx.fillStyle = skin.headColor;
    ctx.fillText(`K - Change Skin: ${skin.name}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(`M - Change Map: ${map.name}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15);
  }

  ctx.fillStyle = '#aaaaaa';
  ctx.fillText(`Current Record: ${gameState.getRecord()}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
}
