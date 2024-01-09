export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

export interface IBrick {
  x: number;
  y: number;
  w: number;
  h: number;
  value: number;
}

export interface Cart {
  x: number;
  y: number;
  w: number;
  h: number;
  dx: number;
  hitMomentum: number;
}

const bricksInRow = 5;
const bricksInCol = 2;
