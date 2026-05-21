import { CANVAS_WIDTH, CANVAS_HEIGHT, SKINS, MAPS } from '../config.js';

// Button layouts for menu and game-over (canvas coords)
export const MENU_BUTTONS = [
  { x: 40,  y: 285, w: 250, h: 60, action: 'START_1P', label: '►  1 Player',    color: '#32cd32' },
  { x: 310, y: 285, w: 250, h: 60, action: 'START_2P', label: '►► 2 Players',   color: '#00bfff' },
  { x: 40,  y: 360, w: 250, h: 55, action: 'CYCLE_SKIN', label: '',              color: null },
  { x: 310, y: 360, w: 250, h: 55, action: 'CYCLE_MAP',  label: '',              color: null },
];

export const GAMEOVER_BUTTONS = [
  { x: 60,  y: 280, w: 230, h: 60, action: 'RESTART',      label: '↻  Retry',       color: '#32cd32' },
  { x: 310, y: 280, w: 230, h: 60, action: 'START_2P',     label: '►► 2 Players',  color: '#00bfff' },
  { x: 100, y: 360, w: 400, h: 55, action: 'MENU',         label: '←  Menu',       color: '#888888' },
];

export function drawMenu(ctx, gameState) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.strokeStyle = '#333333'; ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20);

  ctx.fillStyle = '#00ff00'; ctx.font = 'bold 34px Arial, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SNAKE', CANVAS_WIDTH / 2, 70);

  if (!gameState.authenticated) {
    drawLoginScreen(ctx, gameState);
  } else {
    drawMainMenu(ctx, gameState);
  }
}

function drawLoginScreen(ctx, gameState) {
  ctx.font = '14px Arial, sans-serif'; ctx.fillStyle = '#ffffff';
  ctx.fillText('Write code or scan QR', CANVAS_WIDTH / 2, 145);

  const typed = gameState.loginCode || '';
  const cursor = (Math.floor(Date.now() / 500) % 2 === 0) ? '|' : '';
  ctx.font = 'bold 28px monospace';
  ctx.fillStyle = typed.length ? '#00ff00' : '#444444';
  ctx.fillText((typed + cursor) || 'SNAKE-___', CANVAS_WIDTH / 2, 200);

  if (gameState.loginError) {
    ctx.font = '14px Arial, sans-serif'; ctx.fillStyle = '#ff4444';
    ctx.fillText('Invalid code', CANVAS_WIDTH / 2, 240);
  }
}

function drawMainMenu(ctx, gameState) {
  ctx.font = '14px Arial, sans-serif'; ctx.fillStyle = '#ffffff';
  ctx.fillText('Choose a mode', CANVAS_WIDTH / 2, 140);

  const skin = SKINS[gameState.currentSkin] || SKINS[0];
  const map = MAPS[gameState.currentMap] || MAPS[0];

  ctx.font = 'bold 14px Arial, sans-serif';
  ctx.fillStyle = skin.headColor;
  ctx.fillText(`Skin: ${skin.name}`, CANVAS_WIDTH / 2 - 130, 230);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Map: ${map.name}`, CANVAS_WIDTH / 2 + 130, 230);

  ctx.font = '14px Arial, sans-serif'; ctx.fillStyle = '#aaaaaa';
  ctx.fillText(`Record: ${gameState.getRecord()}`, CANVAS_WIDTH / 2, 260);

  for (const btn of MENU_BUTTONS) drawButton(ctx, btn, gameState);
}

export function drawGameOverButtons(ctx, gameState) {
  const buttons = GAMEOVER_BUTTONS.map((btn) => {
    if (btn.action === 'RESTART' && gameState.getMode() === 2) {
      return { ...btn, label: '↻  Rematch' };
    }
    return btn;
  });

  for (const btn of buttons) drawButton(ctx, btn, gameState);
}

function drawButton(ctx, btn, gameState) {
  const { x, y, w, h, action, color } = btn;
  const r = 12;

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, x, y, w, h, r); ctx.fill();
  ctx.strokeStyle = color ? `${color}66` : 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2; roundRect(ctx, x, y, w, h, r); ctx.stroke();

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = color || '#ffffff';

  if (action === 'CYCLE_SKIN') {
    const skin = SKINS[gameState.currentSkin] || SKINS[0];
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.fillText(`🎨  ${skin.name}`, x + w / 2, y + h / 2);
  } else if (action === 'CYCLE_MAP') {
    const map = MAPS[gameState.currentMap] || MAPS[0];
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.fillText(`🗺️  ${map.name}`, x + w / 2, y + h / 2);
  } else {
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillText(btn.label, x + w / 2, y + h / 2);
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
