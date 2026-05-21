export const GRID_SIZE = 20;
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;
export const INITIAL_DELAY = 120;
export const MIN_DELAY = 50;
export const SPEED_DECREASE = 10;
export const POINTS_PER_LEVEL = 5;

export const SKINS = [
  { name: 'Clásica', headColor: '#32cd32', bodyColor: '#228b22' },
  { name: 'Azul', headColor: '#00bfff', bodyColor: '#0000ff' },
  { name: 'Fuego', headColor: '#ffa500', bodyColor: '#ff0000' },
  { name: 'Morada', headColor: '#ee82ee', bodyColor: '#800080' },
];

export const MAPS = [
  { name: 'Clásico' },
  { name: 'Columnas' },
  { name: 'Cruz' },
  { name: 'Fortaleza' },
];

export const FOOD_TYPES = {
  NORMAL: { value: 1, color: '#ff0000' },
  BONUS: { value: 3, color: '#ffd700' },
  SPEED: { value: 2, color: '#00ffff' },
};

export const STATES = {
  MENU: 'MENU',
  PLAYING_1P: 'PLAYING_1P',
  PLAYING_2P: 'PLAYING_2P',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
};

export const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};
