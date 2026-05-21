import { DIRECTIONS, STATES } from '../config.js';
import { MENU_BUTTONS, GAMEOVER_BUTTONS } from '../renderer/drawMenu.js';

/**
 * TouchHandler + Mouse click — unified input for desktop and mobile.
 * Canvas-drawn buttons detected by coordinate hit-test.
 * Swipe only during PLAYING states.
 */
export class TouchHandler {
  constructor() {
    this.callbacks = [];
    this._startX = 0;
    this._startY = 0;
    this._startTime = 0;
    this._swipeThreshold = 25;
    this._dpad = null;
    this._currentState = null;
    this._canvas = null;
    this._setupDpad();
  }

  setup() {
    this._canvas = document.getElementById('game-canvas');
    if (!this._canvas) return;

    // Touch
    this._canvas.addEventListener('touchstart', this._onStart.bind(this), { passive: false });
    this._canvas.addEventListener('touchend', this._onEnd.bind(this), { passive: false });
    this._canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    // Mouse (desktop)
    this._canvas.addEventListener('mousedown', this._onStart.bind(this));
    this._canvas.addEventListener('mouseup', this._onEnd.bind(this));
  }

  setState(s) { this._currentState = s; this._updateDpad(); }
  onAction(cb) { this.callbacks.push(cb); }
  _emit(a) { for (const cb of this.callbacks) cb(a); }

  /** Client coords → canvas coords */
  _toCanvas(cx, cy) {
    if (!this._canvas) return { x: 0, y: 0 };
    const r = this._canvas.getBoundingClientRect();
    return {
      x: (cx - r.left) * (600 / r.width),
      y: (cy - r.top) * (600 / r.height),
    };
  }

  /** Hit-test a button list */
  _hitTest(cx, cy, buttons) {
    const p = this._toCanvas(cx, cy);
    for (const b of buttons) {
      if (p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) {
        return b;
      }
    }
    return null;
  }

  _onStart(e) {
    e.preventDefault();
    const t = e.touches ? e.touches[0] : e;
    if (!t) return;
    this._startX = t.clientX;
    this._startY = t.clientY;
    this._startTime = Date.now();
  }

  _onEnd(e) {
    e.preventDefault();
    const t = e.changedTouches ? e.changedTouches[0] : e;
    if (!t) return;
    const dx = t.clientX - this._startX;
    const dy = t.clientY - this._startY;
    const dt = Date.now() - this._startTime;
    const s = this._currentState;

    // --- Click / fast tap ---
    const isClick = dt < 400 && Math.abs(dx) < 20 && Math.abs(dy) < 20;
    const isTap = dt < 300 && Math.abs(dx) < 20 && Math.abs(dy) < 20;

    // Menu buttons (click → action)
    if (s === STATES.MENU && isClick) {
      const b = this._hitTest(t.clientX, t.clientY, MENU_BUTTONS);
      if (b) { this._emit({ type: b.action }); return; }
      // Tap on login code area
      this._emit({ type: 'FOCUS_LOGIN' });
      return;
    }

    // Game-over buttons
    if (s === STATES.GAME_OVER && isClick) {
      const b = this._hitTest(t.clientX, t.clientY, GAMEOVER_BUTTONS);
      if (b) { this._emit({ type: b.action }); return; }
      return;
    }

    // Pause overlay: tap anywhere → unpause
    if (s === STATES.PAUSED && isTap) {
      this._emit({ type: 'PAUSE' });
      return;
    }

    // Playing: fast tap → pause
    if ((s === STATES.PLAYING_1P || s === STATES.PLAYING_2P) && isTap) {
      this._emit({ type: 'PAUSE' });
      return;
    }

    // Swipe (only during play)
    if (s !== STATES.PLAYING_1P && s !== STATES.PLAYING_2P) return;
    if (Math.abs(dx) < this._swipeThreshold && Math.abs(dy) < this._swipeThreshold) return;

    const dir = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT)
      : (dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP);

    this._emit({ type: 'DIRECTION', direction: dir, player: 1 });
  }

  // --- D-pad (outside canvas, no overlap) ---
  _setupDpad() {
    this._dpad = document.getElementById('dpad');
    if (!this._dpad) {
      // Create D-pad container if not in HTML
      const d = document.createElement('div');
      d.id = 'dpad';
      d.style.display = 'none';
      d.innerHTML = `▼ ▲ ◄ ► ⏯`.replace(/(.)/g, (ch, i) => {
        const actions = { '▲': 'UP', '▼': 'DOWN', '◄': 'LEFT', '►': 'RIGHT', '⏯': 'PAUSE' };
        const dir = actions[ch] || '';
        return `<button data-action="${dir}" style="width:64px;height:64px;border:2px solid rgba(255,255,255,0.3);border-radius:14px;background:rgba(255,255,255,0.08);color:#ccc;font-size:26px;margin:4px;cursor:pointer;user-select:none">${ch}</button>`;
      });
      document.getElementById('app-shell')?.appendChild(d);
      this._dpad = d;
    }

    this._dpad?.querySelectorAll('button[data-action]').forEach(b => {
      b.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        const a = b.dataset.action;
        if (!a) return;
        this._emit(a === 'PAUSE' ? { type: 'PAUSE' } : { type: 'DIRECTION', direction: a, player: 1 });
      });
    });
  }

  _updateDpad() {
    if (!this._dpad) return;
    const playing = this._currentState === STATES.PLAYING_1P || this._currentState === STATES.PLAYING_2P;
    this._dpad.style.display = playing ? 'flex' : 'none';
  }
}
