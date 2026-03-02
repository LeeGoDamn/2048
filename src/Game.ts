import { Tile, Grid, Direction, Position } from './types';

export class Game2048 {
  private grid: Grid;
  private score: number = 0;
  private bestScore: number = 0;
  private gameOver: boolean = false;
  private won: boolean = false;
  private tileIdCounter: number = 0;
  private onGridChange?: (grid: Grid, score: number) => void;
  private onGameOver?: () => void;
  private onWin?: () => void;

  constructor() {
    this.grid = this.createEmptyGrid();
    this.loadBestScore();
    this.addRandomTile();
    this.addRandomTile();
  }

  setOnGridChange(callback: (grid: Grid, score: number) => void) {
    this.onGridChange = callback;
  }

  setOnGameOver(callback: () => void) {
    this.onGameOver = callback;
  }

  setOnWin(callback: () => void) {
    this.onWin = callback;
  }

  private createEmptyGrid(): Grid {
    return Array(4).fill(null).map(() => Array(4).fill(null));
  }

  private loadBestScore() {
    const saved = localStorage.getItem('2048-best-score');
    if (saved) {
      this.bestScore = parseInt(saved, 10);
    }
  }

  private saveBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('2048-best-score', this.bestScore.toString());
    }
  }

  getGrid(): Grid {
    return this.grid;
  }

  getScore(): number {
    return this.score;
  }

  getBestScore(): number {
    return this.bestScore;
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  hasWon(): boolean {
    return this.won;
  }

  private addRandomTile() {
    const emptyCells: Position[] = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!this.grid[row][col]) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) return;

    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    this.grid[row][col] = { value, id: this.tileIdCounter++ };
  }

  private notifyChange() {
    if (this.onGridChange) {
      this.onGridChange(this.grid, this.score);
    }
  }

  move(direction: Direction): boolean {
    if (this.gameOver) return false;

    const oldGrid = this.serializeGrid();
    let moved = false;
    let mergedScore = 0;

    const rotateGrid = (grid: Grid, times: number): Grid => {
      let result = grid.map(row => [...row]);
      for (let i = 0; i < times; i++) {
        const newGrid: Grid = this.createEmptyGrid();
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            newGrid[col][3 - row] = result[row][col];
          }
        }
        result = newGrid;
      }
      return result;
    };

    // 旋转到向左的方向
    const rotations = [3, 2, 1, 0][direction];
    let workingGrid = rotateGrid(this.grid, rotations);

    // 向左合并
    for (let row = 0; row < 4; row++) {
      const tiles = workingGrid[row].filter(tile => tile !== null) as Tile[];
      const newRow: (Tile | null)[] = [];
      let skip = false;

      for (let i = 0; i < tiles.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
          const mergedValue = tiles[i].value * 2;
          mergedScore += mergedValue;
          newRow.push({
            value: mergedValue,
            id: this.tileIdCounter++,
            mergedFrom: [tiles[i], tiles[i + 1]]
          });
          skip = true;
        } else {
          newRow.push(tiles[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(null);
      }

      workingGrid[row] = newRow;
    }

    // 旋转回来
    workingGrid = rotateGrid(workingGrid, (4 - rotations) % 4);

    // 检查是否有变化
    const newGridStr = this.serializeGrid(workingGrid);
    if (newGridStr !== oldGrid) {
      moved = true;
      this.grid = workingGrid;
      this.score += mergedScore;
      this.saveBestScore();
      this.addRandomTile();
      this.notifyChange();

      // 检查是否达到 2048
      if (!this.won && this.hasTileValue(2048)) {
        this.won = true;
        if (this.onWin) {
          this.onWin();
        }
      }

      // 检查游戏是否结束
      if (this.isGridFull() && !this.canMove()) {
        this.gameOver = true;
        if (this.onGameOver) {
          this.onGameOver();
        }
      }
    }

    return moved;
  }

  private serializeGrid(grid: Grid = this.grid): string {
    return grid.map(row => row.map(tile => tile ? tile.value : 0).join(',')).join(';');
  }

  private hasTileValue(value: number): boolean {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col]?.value === value) {
          return true;
        }
      }
    }
    return false;
  }

  private isGridFull(): boolean {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!this.grid[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  private canMove(): boolean {
    // 检查水平方向
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.grid[row][col]?.value === this.grid[row][col + 1]?.value) {
          return true;
        }
      }
    }

    // 检查垂直方向
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.grid[row][col]?.value === this.grid[row + 1][col]?.value) {
          return true;
        }
      }
    }

    return false;
  }

  restart() {
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.gameOver = false;
    this.won = false;
    this.tileIdCounter = 0;
    this.addRandomTile();
    this.addRandomTile();
    this.notifyChange();
  }
}
