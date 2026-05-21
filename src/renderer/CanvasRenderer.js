import { CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SIZE, STATES } from '../config.js';
import { SKINS } from '../config.js';
import { drawSnake } from './drawSnake.js';
import { drawFood } from './drawFood.js';
import { drawHUD } from './drawHUD.js';
import { drawMenu } from './drawMenu.js';

export class CanvasRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this._time = 0;
  }

  render(gameState) {
    this._time += 0.05;
    this.clear();

    const state = gameState.getState();

    if (state === STATES.MENU) {
      drawMenu(this.ctx, gameState);
      return;
    }

    // Draw obstacles first (background layer)
    this.drawObstacles(gameState.getObstacles());

    // Draw food behind snakes
    const food = gameState.getFood();
    if (food) {
      drawFood(this.ctx, food, this._time);
    }

    const skin = SKINS[gameState.currentSkin] || SKINS[0];
    for (const snake of gameState.getSnakes()) {
      // Each snake uses its own skin index (important for 2P)
      const snakeSkin = SKINS[snake.skinIndex] || skin;
      drawSnake(this.ctx, snake, snakeSkin);
    }

    drawHUD(this.ctx, gameState);

    if (state === STATES.PAUSED) {
      this.drawPauseOverlay();
      return;
    }

    if (state === STATES.GAME_OVER) {
      this.drawGameOverOverlay(gameState);
      return;
    }
  }

  drawObstacles(obstacles) {
    this.ctx.fillStyle = '#555555';
    for (const obs of obstacles) {
      this.ctx.fillRect(obs.x, obs.y, GRID_SIZE, GRID_SIZE);
    }
  }

  drawPauseOverlay() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.fillStyle = '#ffff00';
    this.ctx.font = 'bold 28px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px Arial, sans-serif';
    this.ctx.fillText('Press P to continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
  }

  drawGameOverOverlay(gameState) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const is2P = gameState.getMode() === 2;
    const winner = gameState.getWinner();

    if (is2P && winner) {
      // 2P winner/loser display
      let winnerText, winnerColor;
      if (winner === 'p1') {
        winnerText = 'Player 1 Wins!';
        winnerColor = '#32cd32';
      } else if (winner === 'p2') {
        winnerText = 'Player 2 Wins!';
        winnerColor = '#00bfff';
      } else {
        winnerText = 'Draw!';
        winnerColor = '#ffd700';
      }
      this.ctx.fillStyle = winnerColor;
      this.ctx.font = 'bold 28px Arial, sans-serif';
      this.ctx.fillText(winnerText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '16px Arial, sans-serif';
      this.ctx.fillText('1 = Play again (1P) | 2 = Rematch (2P) | M = Menu', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15);
    } else {
      this.ctx.fillStyle = '#ff0000';
      this.ctx.font = 'bold 28px Arial, sans-serif';
      this.ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '16px Arial, sans-serif';
      this.ctx.fillText('Press ENTER to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
      this.ctx.fillText('Press M for menu', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 45);
    }
  }

  clear() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
