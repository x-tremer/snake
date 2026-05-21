import { CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SIZE, STATES } from '../config.js';
import { SKINS } from '../config.js';

export class CanvasRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
  }

  render(gameState) {
    this.clear();

    const state = gameState.getState();

    if (state === STATES.MENU) {
      this.drawMenu(gameState);
      return;
    }

    if (state === STATES.PLAYING_1P || state === STATES.PLAYING_2P) {
      for (const snake of gameState.getSnakes()) {
        this.drawSnake(snake);
      }
      this.drawHUD(gameState);
      return;
    }

    if (state === STATES.PAUSED) {
      for (const snake of gameState.getSnakes()) {
        this.drawSnake(snake);
      }
      this.drawHUD(gameState);
      this.drawOverlay('PAUSED', '#ffffff');
      return;
    }

    if (state === STATES.GAME_OVER) {
      for (const snake of gameState.getSnakes()) {
        this.drawSnake(snake);
      }
      this.drawHUD(gameState);
      this.drawOverlay('GAME OVER', '#ff0000');
      this.drawOverlay('Press Enter to restart', '#ffffff', 40, CANVAS_HEIGHT / 2 + 30);
      return;
    }
  }

  drawSnake(snake) {
    const skin = SKINS[snake.skinIndex] || SKINS[0];
    this.ctx.fillStyle = skin.bodyColor;

    for (let i = 0; i < snake.segments.length; i++) {
      const seg = snake.segments[i];
      if (i === 0) {
        this.ctx.fillStyle = skin.headColor;
      } else {
        this.ctx.fillStyle = skin.bodyColor;
      }
      this.ctx.fillRect(seg.x, seg.y, GRID_SIZE, GRID_SIZE);
    }
  }

  drawHUD(gameState) {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${gameState.getScore()}`, 10, 20);
    this.ctx.fillText(`Record: ${gameState.record}`, 10, 40);
    this.ctx.fillText(`Level: ${gameState.getLevel()}`, 10, 60);
  }

  drawOverlay(text, color, fontSize = 48, y = CANVAS_HEIGHT / 2) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, CANVAS_WIDTH / 2, y);
  }

  drawMenu(gameState) {
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = '36px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Snake', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '20px sans-serif';
    this.ctx.fillText('Press Enter to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    this.ctx.fillText('1: 1 Player   2: 2 Players', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    this.ctx.fillText('K: Change Skin', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);

    const skin = SKINS[gameState.currentSkin] || SKINS[0];
    this.ctx.fillStyle = skin.headColor;
    this.ctx.fillText(`Skin: ${skin.name}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 90);
  }

  clear() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
