import { GameState } from './engine/GameState.js';
import { CanvasRenderer } from './renderer/CanvasRenderer.js';
import { KeyboardHandler, ACTION_TYPES } from './input/KeyboardHandler.js';
import { TouchHandler } from './input/TouchHandler.js';
import { STATES } from './config.js';

const canvas = document.getElementById('game-canvas');

const gameState = new GameState();
const renderer = new CanvasRenderer(canvas);
const keyboard = new KeyboardHandler();
const touch = new TouchHandler();

keyboard._getGameState = () => gameState.getState();

function handleAction(action) {
  switch (action.type) {
    case ACTION_TYPES.DIRECTION:
    case 'DIRECTION':
      gameState._pendingActions = gameState._pendingActions || [];
      gameState._pendingActions.push(action);
      break;
    case ACTION_TYPES.START_1P:
    case 'START_1P':
      gameState.init1P();
      break;
    case ACTION_TYPES.START_2P:
    case 'START_2P':
      gameState.init2P();
      break;
    case ACTION_TYPES.PAUSE:
    case 'PAUSE':
      gameState.togglePause();
      break;
    case ACTION_TYPES.RESTART:
    case 'RESTART':
      if (gameState.getState() === STATES.GAME_OVER) {
        gameState.restart();
      } else if (gameState.getState() === STATES.MENU) {
        gameState.init1P();
      }
      break;
    case ACTION_TYPES.MENU:
    case 'MENU':
      gameState.transitionMenu();
      break;
    case ACTION_TYPES.CYCLE_SKIN:
    case 'CYCLE_SKIN':
      gameState.cycleSkin();
      break;
    case ACTION_TYPES.CYCLE_MAP:
    case 'CYCLE_MAP':
      gameState.cycleMap();
      break;
  }
}

keyboard.onAction(handleAction);
touch.onAction(handleAction);
keyboard.setup();
touch.setup();

// Responsive canvas sizing
function resizeCanvas() {
  const maxW = window.innerWidth;
  const maxH = window.innerHeight;
  const aspect = 1; // square canvas (600/600)

  let w, h;
  if (maxW / maxH > aspect) {
    h = Math.min(maxH * 0.95, 600);
    w = h * aspect;
  } else {
    w = Math.min(maxW * 0.95, 600);
    h = w / aspect;
  }

  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 100));
resizeCanvas();

// PWA install prompt handler
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Could show a custom install button here; for now, browser handles it
});

// Expose for E2E testing
if (typeof window !== 'undefined') {
  window.gameState = gameState;
}

// Fixed-tick game loop
let lastTime = 0;
let accumulator = 0;

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  const state = gameState.getState();

  if (state === STATES.PLAYING_1P || state === STATES.PLAYING_2P) {
    accumulator += deltaTime;

    const actions = gameState._pendingActions || [];
    gameState._pendingActions = [];

    // Keep only the LAST direction action — prevents stale keystrokes from
    // queueing a now-invalid direction (e.g. ↑ then ↓ would process ↑ first
    // and block ↓ as a reverse, when the user clearly wanted ↓).
    const lastDir = {};
    for (const a of actions) {
      lastDir[a.player || 1] = a;
    }
    const filtered = Object.values(lastDir);

    while (accumulator >= gameState.getDelay()) {
      gameState.tick(filtered);
      filtered.length = 0;
      accumulator -= gameState.getDelay();
    }
  }

  renderer.render(gameState);
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
