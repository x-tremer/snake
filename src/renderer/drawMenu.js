import { CANVAS_WIDTH, CANVAS_HEIGHT, SKINS, MAPS } from '../config.js';

// Button layout for menu (canvas coordinates)
export const MENU_BUTTONS = [
  { x: 40,  y: 280, w: 250, h: 60, action: 'START_1P', label: '►  1 Player',    color: '#32cd32' },
  { x: 310, y: 280, w: 250, h: 60, action: 'START_2P', label: '►► 2 Players',   color: '#00bfff' },
  { x: 40,  y: 355, w: 250, h: 55, action: 'CYCLE_SKIN', label: '🎨',           color: null },
  { x: 310, y: 355, w: 250, h: 55, action: 'CYCLE_MAP',  label: '🗺️',           color: null },
];

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
  ctx.font = 'bold 34px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SNAKE', CANVAS_WIDTH / 2, 80);

  const skin = SKINS[gameState.currentSkin] || SKINS[0];
  const map = MAPS[gameState.currentMap] || MAPS[0];

  if (!gameState.authenticated) {
    // --- Login screen ---
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Write your code and press Enter', CANVAS_WIDTH / 2, 150);

    // Code display
    const typed = gameState.loginCode || '';
    const cursor = (Math.floor(Date.now() / 500) % 2 === 0) ? '|' : '';
    ctx.font = 'bold 28px monospace';
    const display = typed + cursor;
    if (typed.length > 0) {
      ctx.fillStyle = '#00ff00';
    } else {
      ctx.fillStyle = '#444444';
    }
    ctx.fillText(display || 'SNAKE-___', CANVAS_WIDTH / 2, 200);

    // Error
    if (gameState.loginError) {
      ctx.font = '14px Arial, sans-serif';
      ctx.fillStyle = '#ff4444';
      ctx.fillText('Invalid code. Try again.', CANVAS_WIDTH / 2, 240);
    }

    // "Tap here to type" hint
    ctx.font = '12px Arial, sans-serif';
    ctx.fillStyle = '#555';
    ctx.fillText('Tap here to open keyboard', CANVAS_WIDTH / 2, 260);

  } else {
    // --- Authenticated menu ---
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Choose a mode:', CANVAS_WIDTH / 2, 150);

    // Current selections
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillStyle = skin.headColor;
    ctx.fillText(`Skin: ${skin.name}`, CANVAS_WIDTH / 2 - 130, 230);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Map: ${map.name}`, CANVAS_WIDTH / 2 + 130, 230);

    // Record
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(`Record: ${gameState.getRecord()}`, CANVAS_WIDTH / 2, 260);

    // Draw buttons
    for (const btn of MENU_BUTTONS) {
      drawButton(ctx, btn, gameState);
    }
  }
}

function drawButton(ctx, btn, gameState) {
  const { x, y, w, h, label, color, action } = btn;
  const radius = 12;

  // Button background
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, x, y, w, h, radius);
  ctx.fill();

  // Border
  ctx.strokeStyle = color ? `${color}66` : 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, radius);
  ctx.stroke();

  // Label — render emoji/skin name for Skin/Map
  if (action === 'CYCLE_SKIN') {
    const skin = SKINS[gameState.currentSkin] || SKINS[0];
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🎨  ${skin.name}`, x + w / 2, y + h / 2);
  } else if (action === 'CYCLE_MAP') {
    const map = MAPS[gameState.currentMap] || MAPS[0];
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🗺️  ${map.name}`, x + w / 2, y + h / 2);
  } else {
    ctx.fillStyle = color || '#ffffff';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + w / 2, y + h / 2);
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
