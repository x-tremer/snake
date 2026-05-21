import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';

/**
 * Simple particle/starfield effect for animated background.
 * Particles float upward and wrap around when they reach the top.
 */
export class ParticleSystem {
  constructor(count = 30) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this._createParticle());
    }
  }

  _createParticle() {
    return {
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      speed: 0.2 + Math.random() * 0.6,
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.2 + Math.random() * 0.4,
    };
  }

  update() {
    for (const p of this.particles) {
      p.y -= p.speed;
      if (p.y < -10) {
        p.y = CANVAS_HEIGHT + 10;
        p.x = Math.random() * CANVAS_WIDTH;
      }
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      ctx.fillStyle = `rgba(25, 25, 112, ${p.opacity})`; // midnight blue
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
  }
}
