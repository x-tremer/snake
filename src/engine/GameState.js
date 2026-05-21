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
    this.score2 = 0;
    this.record = getRecord();
    this.currentSkin = 0;
    this.currentMap = 0;
    this.snakes = [];
    this.delay = INITIAL_DELAY;
    this.food = new Food();
    this.obstacles = new Obstacles();
    this.mode = 1; // 1=1P, 2=2P
    this.winner = null; // 'p1' | 'p2' | 'draw' | null
  }

  init1P() {
    this.snakes = [new Snake(this.currentSkin, 300, 300, 'right')];
    this.state = STATES.PLAYING_1P;
    this.mode = 1;
    this.winner = null;
    this.score = 0;
    this.score2 = 0;
    this.currentLevel = 1;
    this.delay = INITIAL_DELAY;
    this.obstacles.generate(1, this.currentMap);
    this.food.spawn(this.snakes, this.obstacles.positions, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  init2P() {
    const p2SkinIndex = 2; // Azul/cyan for P2
    this.snakes = [
      new Snake(this.currentSkin, 180, 300, 'right'),   // grid(~9, 15) going RIGHT
      new Snake(p2SkinIndex, 420, 300, 'left'),          // grid(~21, 15) going LEFT
    ];
    this.state = STATES.PLAYING_2P;
    this.mode = 2;
    this.winner = null;
    this.score = 0;
    this.score2 = 0;
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
        const points = this.food.value;
        if (this.mode === 2) {
          // Separate scores for 2P
          if (eatenIndex === 0) {
            this.score += points;
          } else {
            this.score2 += points;
          }
        } else {
          this.score += points;
        }
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
        if (is2P) {
          const otherAlive = this.snakes[1 - i].alive;
          if (!otherAlive) return { type: 'draw', snakeIndex: i, winnerIndex: null };
          return { type: 'border', snakeIndex: i, winnerIndex: 1 - i };
        }
        return { type: 'border', snakeIndex: i };
      }

      // Self collision
      if (snake.checkSelfCollision()) {
        snake.alive = false;
        if (is2P) {
          const otherAlive = this.snakes[1 - i].alive;
          if (!otherAlive) return { type: 'draw', snakeIndex: i, winnerIndex: null };
          return { type: 'self', snakeIndex: i, winnerIndex: 1 - i };
        }
        return { type: 'self', snakeIndex: i };
      }

      // Obstacle collision
      const obsList = this.obstacles.positions;
      for (const obs of obsList) {
        if (head.x === obs.x && head.y === obs.y) {
          snake.alive = false;
          if (is2P) {
            const otherAlive = this.snakes[1 - i].alive;
            if (!otherAlive) return { type: 'draw', snakeIndex: i, winnerIndex: null };
            return { type: 'obstacle', snakeIndex: i, winnerIndex: 1 - i };
          }
          return { type: 'obstacle', snakeIndex: i };
        }
      }

      // Opponent collision (2P only)
      if (is2P) {
        const opponentIndex = 1 - i;
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
              return { type: 'opponent', snakeIndex: i, winnerIndex: opponentIndex };
            }
          }
        }
      }
    }

    return { type: null };
  }

  handleDeath(result) {
    const is2P = this.state === STATES.PLAYING_2P;
    this.state = STATES.GAME_OVER;

    if (is2P) {
      if (result.type === 'headToHead' || result.type === 'draw') {
        this.winner = 'draw';
      } else if (result.winnerIndex === 0) {
        this.winner = 'p1';
      } else if (result.winnerIndex === 1) {
        this.winner = 'p2';
      }
    }

    // Always persist best score as record
    const bestScore = is2P ? Math.max(this.score, this.score2) : this.score;
    if (bestScore > this.record) {
      this.record = bestScore;
      setRecord(this.record);
    }
  }

  updateLevel() {
    const totalScore = this.mode === 2 ? this.score + this.score2 : this.score;
    const nextLevel = Math.floor(totalScore / POINTS_PER_LEVEL) + 1;
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
    if (this.mode === 2 || this._previousState === STATES.PLAYING_2P) {
      this.init2P();
    } else {
      this.init1P();
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

  getScore2() {
    return this.score2;
  }

  getMode() {
    return this.mode;
  }

  getWinner() {
    return this.winner;
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
