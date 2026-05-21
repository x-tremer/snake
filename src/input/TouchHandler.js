import { STATES, DIRECTIONS } from '../config.js';

/**
 * TouchHandler — swipe detection + on-screen D-pad for mobile devices.
 * Emits the same action types as KeyboardHandler so GameState needs no changes.
 */
export class TouchHandler {
  constructor() {
    this.callbacks = [];
    this._touchStartX = 0;
    this._touchStartY = 0;
    this._touchStartTime = 0;
    this._swipeThreshold = 30; // pixels minimum for swipe
    this._dpadVisible = false;
    this._dpadButtons = [];
    this._setupDpad();
  }

  setup() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;

    canvas.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
    canvas.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    // Show d-pad only on touch-capable devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      this._showDpad();
    }
  }

  onAction(callback) {
    this.callbacks.push(callback);
  }

  _emit(action) {
    for (const cb of this.callbacks) {
      cb(action);
    }
  }

  _onTouchStart(event) {
    event.preventDefault();
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

    // Fast tap (< 300ms, small movement) → pause toggle
    if (dt < 300 && Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      this._emit({ type: 'PAUSE' });
      return;
    }

    // Swipe detection: dominant axis wins
    if (Math.abs(dx) < this._swipeThreshold && Math.abs(dy) < this._swipeThreshold) {
      return; // too small, ignore
    }

    let direction;
    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
    } else {
      direction = dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
    }

    this._emit({ type: 'DIRECTION', direction, player: 1 });
  }

  // --- On-screen D-pad ---
  _setupDpad() {
    const container = document.createElement('div');
    container.id = 'dpad';
    container.style.cssText = `
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
      display: none; z-index: 100;
      touch-action: none; -webkit-tap-highlight-color: transparent;
    `;
    document.body.appendChild(container);

    const directions = [
      { label: '▲', dir: DIRECTIONS.UP, x: 70, y: 10 },
      { label: '◄', dir: DIRECTIONS.LEFT, x: 10, y: 70 },
      { label: '►', dir: DIRECTIONS.RIGHT, x: 130, y: 70 },
      { label: '▼', dir: DIRECTIONS.DOWN, x: 70, y: 130 },
    ];

    const btnStyle = `
      width: 56px; height: 56px; border-radius: 10px; border: 2px solid #444;
      background: rgba(255,255,255,0.08); color: #ccc; font-size: 22px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; user-select: none;
    `;

    container.style.cssText += 'width: 200px; height: 200px; position: relative;';

    for (const { label, dir, x, y } of directions) {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.cssText = btnStyle + `position: absolute; left: ${x}px; top: ${y}px;`;
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._emit({ type: 'DIRECTION', direction: dir, player: 1 });
      });
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this._emit({ type: 'DIRECTION', direction: dir, player: 1 });
      });
      container.appendChild(btn);
      this._dpadButtons.push(btn);
    }

    this._dpadContainer = container;
  }

  _showDpad() {
    if (this._dpadContainer) {
      this._dpadContainer.style.display = 'block';
      this._dpadVisible = true;
    }
  }

  _hideDpad() {
    if (this._dpadContainer) {
      this._dpadContainer.style.display = 'none';
      this._dpadVisible = false;
    }
  }
}
