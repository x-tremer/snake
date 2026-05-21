import { DIRECTIONS, STATES } from '../config.js';

/**
 * TouchHandler — swipe detection + on-screen D-pad for mobile.
 * Swipe anywhere on canvas to steer. D-pad is a visible fallback.
 * Only shown during PLAYING states.
 */
export class TouchHandler {
  constructor() {
    this.callbacks = [];
    this._touchStartX = 0;
    this._touchStartY = 0;
    this._touchStartTime = 0;
    this._swipeThreshold = 25;
    this._dpad = null;
    this._currentState = null;
    this._setupDpad();
  }

  setup() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;

    canvas.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
    canvas.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  setState(state) {
    this._currentState = state;
    this._updateDpadVisibility();
  }

  onAction(callback) {
    this.callbacks.push(callback);
  }

  _emit(action) {
    for (const cb of this.callbacks) cb(action);
  }

  _onTouchStart(event) {
    event.preventDefault();
    if (!event.touches.length) return;
    const touch = event.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
    this._touchStartTime = Date.now();
  }

  _onTouchEnd(event) {
    event.preventDefault();
    if (!event.changedTouches.length) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - this._touchStartX;
    const dy = touch.clientY - this._touchStartY;
    const dt = Date.now() - this._touchStartTime;

    // Fast tap → pause toggle
    if (dt < 300 && Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      this._emit({ type: 'PAUSE' });
      return;
    }

    if (Math.abs(dx) < this._swipeThreshold && Math.abs(dy) < this._swipeThreshold) return;

    const direction = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT)
      : (dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP);

    this._emit({ type: 'DIRECTION', direction, player: 1 });
  }

  // --- D-pad ---

  _setupDpad() {
    const dpad = document.createElement('div');
    dpad.id = 'dpad';
    dpad.innerHTML = `
      <style>
        #dpad {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: none;
          z-index: 1000;
          width: 240px;
          height: 240px;
          touch-action: none;
          -webkit-tap-highlight-color: transparent;
        }
        #dpad button {
          position: absolute;
          width: 72px;
          height: 72px;
          border: 2px solid rgba(255,255,255,0.35);
          border-radius: 14px;
          background: rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.85);
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
          transition: background 0.1s;
        }
        #dpad button:active {
          background: rgba(50,205,50,0.35);
          border-color: rgba(50,205,50,0.6);
        }
        #dpad .btn-up    { left: 84px; top: 0; }
        #dpad .btn-left  { left: 0;    top: 84px; }
        #dpad .btn-right { left: 168px;top: 84px; }
        #dpad .btn-down  { left: 84px; top: 168px; }
        #dpad .btn-enter {
          left: 84px; top: 80px;
          width: 72px; height: 80px;
          border-radius: 40px;
          background: rgba(50,205,50,0.25);
          border-color: rgba(50,205,50,0.5);
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 1px;
          color: #32cd32;
        }
        #dpad .btn-enter:active {
          background: rgba(50,205,50,0.55);
        }
      </style>
      <button class="btn-up"    data-action="UP">▲</button>
      <button class="btn-left"  data-action="LEFT">◄</button>
      <button class="btn-enter" data-action="PAUSE">⏯</button>
      <button class="btn-right" data-action="RIGHT">►</button>
      <button class="btn-down"  data-action="DOWN">▼</button>
    `;
    document.body.appendChild(dpad);

    dpad.querySelectorAll('button').forEach(btn => {
      const action = btn.dataset.action;
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (action === 'PAUSE') {
          this._emit({ type: 'PAUSE' });
        } else {
          this._emit({ type: 'DIRECTION', direction: action, player: 1 });
        }
      });
    });

    this._dpad = dpad;
  }

  _updateDpadVisibility() {
    if (!this._dpad) return;
    const playing = this._currentState === STATES.PLAYING_1P || this._currentState === STATES.PLAYING_2P;
    this._dpad.style.display = playing ? 'block' : 'none';
  }
}
