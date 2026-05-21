import {
  GRID_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  STATES,
  SPEED_DECREASE,
  POINTS_PER_LEVEL,
  INITIAL_DELAY,
  MIN_DELAY,
} from '../config.js';
import { Snake } from './Snake.js';
import { Food } from './Food.js';
import { Obstacles } from './Obstacles.js';
import { getRecord, setRecord } from '../storage.js';

export class GameState {
  constructor() {
    this.state = STATES.MENU;
    this.currentLevel = 1;
    this.score = 0;
    this.record = getRecord();
    this.currentSkin = 0;
    this.currentMap = 0;
    this.snakes = [];
    this.delay = INITIAL_DELAY;
    this.food = new Food();
    this.obstacles = new Obstacles();
  }

  init1P() {
    this.snakes = [new Snake(this.currentSkin, 300, 300, 'right')];
    this.state = STATES.PLAYING_1P;
    this.score = 0;
    this.currentLevel = 1;
    this.delay = INITIAL_DELAY;
    this.obstacles.generate(1, this.currentMap);
    this.food.spawn(this.snakes, this.obstacles.positions, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  init2P() {
    this.snakes = [
      new Snake(this.currentSkin, 200, 300, 'right'),
      new Snake(this.currentSkin, 400, 300, 'left'),
    ];
    this.state = STATES.PLAYING_2P;
    this.score = 0;
    this.currentLevel = 1;
    this.delay = INITIAL_DELAY;
    this.obstacles.generate(1, this.currentMap);
    this.food.spawn(this.snakes, this.obstacles.positions, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  tick(actions = []) {
    if (this.state !== STATES.PLAYING_1P && this.state !== STATES.PLAYING_2P) {
      return null;
    }

    // Process direction changes
    for (const action of actions) {
      if (action.type === 'DIRECTION' && action.player) {
        const snake = this.snakes[action.player - 1];
        if (snake && snake.alive) {
          snake.setDirection(action.direction);
        }
      }
    }

    // Move snakes
    for (const snake of this.snakes) {
      if (snake.alive) snake.move();
    }

    // Check food collisions
    const heads = this.snakes.map((s) => s.headPosition());
    const eatenIndex = this.food.checkEaten(heads);
    if (eatenIndex >= 0) {
      const snake = this.snakes[eatenIndex];
      if (snake && snake.alive) {
        this.score += this.food.value;
        snake.grow(1);
        this.updateLevel();
        this.food.spawn(this.snakes, this.obstacles.positions, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }

    // Check collisions
    const result = this.checkAllCollisions();
    if (result.type) {
      this.handleDeath(result);
      return result;
    }

    return null;
  }

  checkAllCollisions() {
    const is2P = this.state === STATES.PLAYING_2P;
    const heads = this.snakes.map((s) => s.headPosition());

    for (let i = 0; i < this.snakes.length; i++) {
      const snake = this.snakes[i];
      if (!snake.alive) continue;
      const head = heads[i];

      // Border collision (10px padding)
      if (
        head.x < 10 ||
        head.x >= CANVAS_WIDTH - 10 - GRID_SIZE ||
        head.y < 10 ||
        head.y >= CANVAS_HEIGHT - 10 - GRID_SIZE
      ) {
        snake.alive = false;
        if (is2P && this.snakes.every((s) => !s.alive)) {
          return { type: 'draw', snakeIndex: i };
        }
        return { type: 'border', snakeIndex: i };
      }

      // Self collision
      if (snake.checkSelfCollision()) {
        snake.alive = false;
        if (is2P && this.snakes.every((s) => !s.alive)) {
          return { type: 'draw', snakeIndex: i };
        }
        return { type: 'self', snakeIndex: i };
      }

      // Obstacle collision
      const obsList = this.obstacles.positions;
      for (const obs of obsList) {
        if (head.x === obs.x && head.y === obs.y) {
          snake.alive = false;
          if (is2P && this.snakes.every((s) => !s.alive)) {
            return { type: 'draw', snakeIndex: i };
          }
          return { type: 'obstacle', snakeIndex: i };
        }
      }

      // Opponent collision (2P only)
      if (is2P) {
        const opponentIndex = i === 0 ? 1 : 0;
        const opponent = this.snakes[opponentIndex];
        if (opponent && opponent.alive) {
          // Head-to-head
          if (
            head.x === heads[opponentIndex].x &&
            head.y === heads[opponentIndex].y
          ) {
            snake.alive = false;
            opponent.alive = false;
            return { type: 'headToHead', snakeIndex: i, winnerIndex: null };
          }
          // Head hitting opponent body
          for (const seg of opponent.segments) {
            if (head.x === seg.x && head.y === seg.y) {
              snake.alive = false;
              if (this.snakes.every((s) => !s.alive)) {
                return { type: 'draw', snakeIndex: i };
              }
              return { type: 'opponent', snakeIndex: i, winnerIndex: opponentIndex };
            }
          }
        }
      }
    }

    return { type: null };
  }

  handleDeath(result) {
    if (result.type === 'headToHead') {
      this.state = STATES.GAME_OVER;
      return;
    }
    if (result.type === 'draw') {
      this.state = STATES.GAME_OVER;
      return;
    }
    if (this.state === STATES.PLAYING_2P) {
      const winnerIndex = result.winnerIndex;
      if (winnerIndex !== undefined && winnerIndex !== null) {
        // One snake died, the other wins
        this.state = STATES.GAME_OVER;
        return;
      }
    }
    this.state = STATES.GAME_OVER;
    if (this.score > this.record) {
      this.record = this.score;
      setRecord(this.record);
    }
  }

  updateLevel() {
    const nextLevel = Math.floor(this.score / POINTS_PER_LEVEL) + 1;
    if (nextLevel > this.currentLevel) {
      this.currentLevel = nextLevel;
      this.delay = Math.max(
        MIN_DELAY,
        INITIAL_DELAY - (this.currentLevel - 1) * SPEED_DECREASE
      );
      this.obstacles.generate(this.currentLevel, this.currentMap);
    }
  }

  transitionMenu() {
    this.state = STATES.MENU;
  }

  togglePause() {
    if (this.state === STATES.PLAYING_1P || this.state === STATES.PLAYING_2P) {
      this._previousState = this.state;
      this.state = STATES.PAUSED;
    } else if (this.state === STATES.PAUSED) {
      this.state = this._previousState || STATES.PLAYING_1P;
    }
  }

  restart() {
    if (this.state === STATES.PLAYING_1P || this._previousState === STATES.PLAYING_1P) {
      this.init1P();
    } else if (this.state === STATES.PLAYING_2P || this._previousState === STATES.PLAYING_2P) {
      this.init2P();
    }
  }

  cycleSkin() {
    this.currentSkin = (this.currentSkin + 1) % 4;
  }

  cycleMap() {
    this.currentMap = (this.currentMap + 1) % 4;
  }

  getState() {
    return this.state;
  }

  getSnakes() {
    return this.snakes;
  }

  getLevel() {
    return this.currentLevel;
  }

  getScore() {
    return this.score;
  }

  getDelay() {
    return this.delay;
  }

  getRecord() {
    return this.record;
  }

  getFood() {
    return this.food;
  }

  getObstacles() {
    return this.obstacles.positions;
  }
}
