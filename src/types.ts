export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  value: number;
  id: number;
  mergedFrom?: Tile[];
}

export type Grid = (Tile | null)[][];

export enum Direction {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
}
