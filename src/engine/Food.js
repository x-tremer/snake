import { FOOD_TYPES, GRID_SIZE } from '../config.js';
import { Grid } from './Grid.js';

/** Maximum pixel distance to register food eaten. */
const EAT_DISTANCE = 15;

export class Food {
  constructor() {
    this._position = { x: 0, y: 0 };
    this._type = 'NORMAL';
    this._value = 1;
  }

  spawn(snakes, obstacles, canvasWidth, canvasHeight) {
    const r = Math.random();
    if (r < 0.05) {
      this._type = 'SPEED';
    } else if (r < 0.20) {
      this._type = 'BONUS';
    } else {
      this._type = 'NORMAL';
    }

    const config = FOOD_TYPES[this._type];
    this._value = config.value;

    const cell = Grid.randomFreeCell(snakes, obstacles, canvasWidth, canvasHeight);
    if (cell) {
      this._position = cell;
    }
  }

  checkEaten(snakeHeads) {
    for (let i = 0; i < snakeHeads.length; i++) {
      const head = snakeHeads[i];
      if (!head) continue;
      const dx = head.x - this._position.x;
      const dy = head.y - this._position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= EAT_DISTANCE) {
        return i;
      }
    }
    return -1;
  }

  get position() {
    return { ...this._position };
  }

  get type() {
    return this._type;
  }

  get value() {
    return this._value;
  }
}
