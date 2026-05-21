import { GameState } from './engine/GameState.js';
import { CanvasRenderer } from './renderer/CanvasRenderer.js';
import { KeyboardHandler, ACTION_TYPES } from './input/KeyboardHandler.js';
import { TouchHandler } from './input/TouchHandler.js';
import { STATES } from './config.js';
import { isValid, saveCode, isAuthenticated } from './auth.js';

const canvas = document.getElementById('game-canvas');

const gameState = new GameState();
const renderer = new CanvasRenderer(canvas);
const keyboard = new KeyboardHandler();
const touch = new TouchHandler();

keyboard._getGameState = () => gameState.getState();
keyboard._getAuthState = () => gameState.authenticated;

// --- Login code buffer ---
let loginCode = '';

// --- Auth: check ?code= in URL or existing localStorage (sync — checksum-based) ---
const params = new URLSearchParams(window.location.search);
const codeFromUrl = params.get('code');
if (codeFromUrl) {
  if (isValid(codeFromUrl)) {
    saveCode(codeFromUrl);
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }
}

gameState.authenticated = isAuthenticated();

function handleAction(action) {
  switch (action.type) {
    case ACTION_TYPES.DIRECTION:
    case 'DIRECTION': {
      const playerIdx = (action.player || 1) - 1;
      const snakes = gameState.getSnakes();
      if (snakes[playerIdx] && snakes[playerIdx].alive) {
        snakes[playerIdx].setDirection(action.direction);
      }
      break;
    }
    case ACTION_TYPES.START_1P:
    case 'START_1P':
      if (!gameState.authenticated) break;
      gameState.init1P();
      break;
    case ACTION_TYPES.START_2P:
    case 'START_2P':
      if (!gameState.authenticated) break;
      gameState.init2P();
      break;
    case ACTION_TYPES.PAUSE:
    case 'PAUSE':
      gameState.togglePause();
      break;
    case ACTION_TYPES.RESTART:
    case 'RESTART':
      if (!gameState.authenticated) break;
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
    case ACTION_TYPES.LOGIN:
    case 'LOGIN': {
      if (isValid(loginCode)) {
        saveCode(loginCode);
        gameState.authenticated = true;
        loginCode = '';
      }
      break;
    }
    case ACTION_TYPES.LOGIN_CHAR:
    case 'LOGIN_CHAR':
      if (loginCode.length < 12) loginCode += action.char;
      gameState.loginCode = loginCode;
      break;
    case ACTION_TYPES.LOGIN_BACKSPACE:
    case 'LOGIN_BACKSPACE':
      loginCode = loginCode.slice(0, -1);
      gameState.loginCode = loginCode;
      break;
  }
}

keyboard.onAction(handleAction);
touch.onAction(handleAction);
keyboard.setup();
touch.setup();

// --- Mobile UI: login input ---
const loginInput = document.getElementById('login-input');
const loginSubmit = document.getElementById('login-submit');

function updateMobileUI() {
  const state = gameState.getState();
  const auth = gameState.authenticated;

  if (!auth && state === STATES.MENU) {
    // Login screen: show code input
    loginInput.style.display = 'block';
    loginSubmit.style.display = 'block';
  } else {
    loginInput.style.display = 'none';
    loginSubmit.style.display = 'none';
  }
}

// Tap on code area in canvas → focus the hidden input to open keyboard
const _origTouchAction = handleAction;
handleAction = function(action) {
  if (action.type === 'PAUSE' && gameState.getState() === STATES.MENU && !gameState.authenticated) {
    loginInput.focus();
    return;
  }
  _origTouchAction(action);
};

loginInput.addEventListener('input', () => {
  loginCode = loginInput.value.toUpperCase().replace(/[^A-Z2-9-]/g, '');
  gameState.loginCode = loginCode;
});
loginInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    _origTouchAction({ type: 'LOGIN' });
  }
});
loginSubmit.addEventListener('click', () => {
  _origTouchAction({ type: 'LOGIN' });
});

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
  touch.setState(state);
  updateMobileUI();

  if (state === STATES.PLAYING_1P || state === STATES.PLAYING_2P) {
    accumulator += deltaTime;

    while (accumulator >= gameState.getDelay()) {
      gameState.tick([]);
      accumulator -= gameState.getDelay();
    }
  }

  renderer.render(gameState);
requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
