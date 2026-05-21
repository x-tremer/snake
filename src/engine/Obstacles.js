import { GRID_SIZE } from '../config.js';

const MAP_PRESETS = {
  CLASICO:    0,
  COLUMNAS:   1,
  CRUZ:       2,
  FORTALEZA:  3,
};

function range(start, end, step) {
  const arr = [];
  for (let v = start; v <= end; v += step) arr.push(v);
  return arr;
}

function generateClasico() {
  return [];
}

function generateColumnas(level) {
  const obstacles = [];
  const xs = [-120, 120];
  const yStart = -100;
  const yEnd = 120;
  for (const x of xs) {
    for (const y of range(yStart, yEnd, GRID_SIZE)) {
      obstacles.push({ x, y });
    }
  }
  if (level >= 3) {
    const extraXs = [-60, 60];
    for (const x of extraXs) {
      for (const y of range(yStart, yEnd, GRID_SIZE)) {
        obstacles.push({ x, y });
      }
    }
  }
  return obstacles;
}

function generateCruz(level) {
  const obstacles = [];
  const y = 0;
  for (const x of range(-120, 140, GRID_SIZE)) {
    obstacles.push({ x, y });
  }
  const x = 0;
  for (const y of range(-120, 140, GRID_SIZE)) {
    obstacles.push({ x, y });
  }
  if (level >= 3) {
    const extras = [
      ...range(-120, 140, GRID_SIZE).map((vx) => ({ x: vx, y: -60 })),
      ...range(-120, 140, GRID_SIZE).map((vx) => ({ x: vx, y: 60 })),
    ];
    obstacles.push(...extras);
  }
  return obstacles;
}

function generateFortaleza(level) {
  const obstacles = [];
  // Top border (y = -160)
  for (const x of range(-180, 200, GRID_SIZE)) {
    if (x === -20 || x === 0 || x === 20) continue;
    obstacles.push({ x, y: -160 });
  }
  // Bottom border (y = 160)
  for (const x of range(-180, 200, GRID_SIZE)) {
    if (x === -20 || x === 0 || x === 20) continue;
    obstacles.push({ x, y: 160 });
  }
  // Left wall (x = -180)
  for (const y of range(-120, 140, GRID_SIZE)) {
    obstacles.push({ x: -180, y });
  }
  // Right wall (x = 180)
  for (const y of range(-120, 140, GRID_SIZE)) {
    obstacles.push({ x: 180, y });
  }

  if (level >= 3) {
    for (const x of range(-180, 200, GRID_SIZE)) {
      if (x === -20 || x === 0 || x === 20) continue;
      obstacles.push({ x, y: -120 });
    }
    for (const x of range(-180, 200, GRID_SIZE)) {
      if (x === -20 || x === 0 || x === 20) continue;
      obstacles.push({ x, y: 120 });
    }
  }
  return obstacles;
}

export class Obstacles {
  constructor() {
    this._positions = [];
  }

  generate(level, mapPreset) {
    if (level <= 1) {
      this._positions = generateClasico();
      return this._positions;
    }
    switch (mapPreset) {
      case MAP_PRESETS.COLUMNAS:
        this._positions = generateColumnas(level);
        break;
      case MAP_PRESETS.CRUZ:
        this._positions = generateCruz(level);
        break;
      case MAP_PRESETS.FORTALEZA:
        this._positions = generateFortaleza(level);
        break;
      case MAP_PRESETS.CLASICO:
      default:
        this._positions = generateClasico();
        break;
    }
    return this._positions;
  }

  get positions() {
    return [...this._positions];
  }

  static get presets() {
    return { ...MAP_PRESETS };
  }
}
