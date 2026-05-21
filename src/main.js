import { GameState } from './engine/GameState.js';
import { CanvasRenderer } from './renderer/CanvasRenderer.js';
import { KeyboardHandler, ACTION_TYPES } from './input/KeyboardHandler.js';
import { STATES } from './config.js';

const canvas = document.getElementById('game-canvas');

const gameState = new GameState();
const renderer = new CanvasRenderer(canvas);
const keyboard = new KeyboardHandler();

keyboard._getGameState = () => gameState.getState();

keyboard.onAction((action) => {
  switch (action.type) {
    case ACTION_TYPES.DIRECTION:
      // Queue direction actions for next tick
      gameState._pendingActions = gameState._pendingActions || [];
      gameState._pendingActions.push(action);
      break;
    case ACTION_TYPES.START_1P:
      gameState.init1P();
      break;
    case ACTION_TYPES.START_2P:
      gameState.init2P();
      break;
    case ACTION_TYPES.PAUSE:
      gameState.togglePause();
      break;
    case ACTION_TYPES.RESTART:
      if (gameState.getState() === STATES.GAME_OVER) {
        gameState.restart();
      } else if (gameState.getState() === STATES.MENU) {
        gameState.init1P();
      }
      break;
    case ACTION_TYPES.MENU:
      gameState.transitionMenu();
      break;
    case ACTION_TYPES.CYCLE_SKIN:
      gameState.cycleSkin();
      break;
    case ACTION_TYPES.CYCLE_MAP:
      gameState.cycleMap();
      break;
  }
});

keyboard.setup();

// Expose for E2E testing
if (typeof window !== 'undefined') {
  window.gameState = gameState;
}

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

    while (accumulator >= gameState.getDelay()) {
      gameState.tick(actions);
      actions.length = 0; // Consume actions after first tick
      accumulator -= gameState.getDelay();
    }
  }

  renderer.render(gameState);
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
