import { STATES } from '../config.js';

export const ACTION_TYPES = {
  DIRECTION: 'DIRECTION',
  START_1P: 'START_1P',
  START_2P: 'START_2P',
  PAUSE: 'PAUSE',
  RESTART: 'RESTART',
  MENU: 'MENU',
  CYCLE_SKIN: 'CYCLE_SKIN',
  CYCLE_MAP: 'CYCLE_MAP',
};

const KEY_MAP = {
  ArrowUp: { type: ACTION_TYPES.DIRECTION, direction: 'UP', player: 1 },
  ArrowDown: { type: ACTION_TYPES.DIRECTION, direction: 'DOWN', player: 1 },
  ArrowLeft: { type: ACTION_TYPES.DIRECTION, direction: 'LEFT', player: 1 },
  ArrowRight: { type: ACTION_TYPES.DIRECTION, direction: 'RIGHT', player: 1 },
  w: { type: ACTION_TYPES.DIRECTION, direction: 'UP', player: 2 },
  W: { type: ACTION_TYPES.DIRECTION, direction: 'UP', player: 2 },
  s: { type: ACTION_TYPES.DIRECTION, direction: 'DOWN', player: 2 },
  S: { type: ACTION_TYPES.DIRECTION, direction: 'DOWN', player: 2 },
  a: { type: ACTION_TYPES.DIRECTION, direction: 'LEFT', player: 2 },
  A: { type: ACTION_TYPES.DIRECTION, direction: 'LEFT', player: 2 },
  d: { type: ACTION_TYPES.DIRECTION, direction: 'RIGHT', player: 2 },
  D: { type: ACTION_TYPES.DIRECTION, direction: 'RIGHT', player: 2 },
  Enter: { type: ACTION_TYPES.RESTART },
  p: { type: ACTION_TYPES.PAUSE },
  P: { type: ACTION_TYPES.PAUSE },
  m: { type: ACTION_TYPES.MENU },
  M: { type: ACTION_TYPES.MENU },
  k: { type: ACTION_TYPES.CYCLE_SKIN },
  K: { type: ACTION_TYPES.CYCLE_SKIN },
  '1': { type: ACTION_TYPES.START_1P },
  '2': { type: ACTION_TYPES.START_2P },
};

export class KeyboardHandler {
  constructor() {
    this.callbacks = [];
    this._boundKeydown = this._onKeydown.bind(this);
  }

  setup() {
    window.addEventListener('keydown', this._boundKeydown);
  }

  teardown() {
    window.removeEventListener('keydown', this._boundKeydown);
  }

  onAction(callback) {
    this.callbacks.push(callback);
  }

  _onKeydown(event) {
    const mapped = KEY_MAP[event.key];
    if (!mapped) return;

    // Prevent default on game keys
    if (
      event.key.startsWith('Arrow') ||
      ['Enter', 'p', 'P', 'm', 'M', 'k', 'K', '1', '2', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(event.key)
    ) {
      event.preventDefault();
    }

    const currentState = this._getGameState ? this._getGameState() : null;

    // State-gated direction inputs
    if (mapped.type === ACTION_TYPES.DIRECTION) {
      const isPlaying = currentState && (currentState === STATES.PLAYING_1P || currentState === STATES.PLAYING_2P);
      if (!isPlaying) return;
      // P2 directions only in 2P mode
      if (mapped.player === 2 && currentState !== STATES.PLAYING_2P) return;
    }

    // Pause only in playing states
    if (mapped.type === ACTION_TYPES.PAUSE) {
      const isPlaying = currentState && (currentState === STATES.PLAYING_1P || currentState === STATES.PLAYING_2P || currentState === STATES.PAUSED);
      if (!isPlaying) return;
    }

    // Menu-return only from GAME_OVER
    if (mapped.type === ACTION_TYPES.MENU && currentState !== STATES.GAME_OVER) {
      return;
    }

    // Skin cycling only in MENU
    if (mapped.type === ACTION_TYPES.CYCLE_SKIN && currentState !== STATES.MENU) {
      return;
    }

    // 1/2 start from MENU or GAME_OVER
    if (
      (mapped.type === ACTION_TYPES.START_1P || mapped.type === ACTION_TYPES.START_2P) &&
      currentState && currentState !== STATES.MENU && currentState !== STATES.GAME_OVER
    ) {
      return;
    }

    // Restart (Enter) from MENU or GAME_OVER
    if (mapped.type === ACTION_TYPES.RESTART) {
      if (currentState && currentState !== STATES.MENU && currentState !== STATES.GAME_OVER) {
        // Allow Enter as pause during play? No, that's P. Enter from menu/gameover only for now.
        return;
      }
    }

    for (const cb of this.callbacks) {
      cb(mapped);
    }
  }
}
