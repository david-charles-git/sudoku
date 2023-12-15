const fillSudoku: (grid: Grid) => boolean = (grid) => {
  const emptyCell: GridIndex | null = findSudokuEmptyCell(grid);
  if (!emptyCell) {
    return true;
  }
  const [row, col]: GridIndex = emptyCell;
  const numbers: number[] = shuffleSudokuGrid(getSudokuBaseGrid());
  for (const num of numbers) {
    if (isValidSudokuPlacement(grid, row, col, num)) {
      grid[row][col] = num;
      if (fillSudoku(grid)) {
        return true;
      }
      grid[row][col] = 0;
    }
  }
  return false;
};

const findSudokuEmptyCell: (grid: Grid) => GridIndex | null = (grid) => {
  for (let row: number = 0; row < Math.pow(sudokuGameState.gridSize, 2); row++) {
    for (let col: number = 0; col < Math.pow(sudokuGameState.gridSize, 2); col++) {
      if (grid[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
};

const generateSudoku: () => Grid = () => {
  const grid: Grid = Array.from({ length: Math.pow(sudokuGameState.gridSize, 2) }, () => Array(Math.pow(sudokuGameState.gridSize, 2)).fill(0));
  fillSudoku(grid);
  return grid;
};

const generateSudokuPuzzle: (grid: Grid) => Grid = (grid) => {
  const puzzle: Grid = [];
  for (let i: number = 0; i < grid.length; i++) {
    puzzle[i] = grid[i].slice();
  }
  removeRandomSudokuNumbers(puzzle);
  return puzzle;
};

const getSudokuBaseGrid: () => number[] = () => {
  if (sudokuGameState.gridSize <= 2) {
    return [1, 2, 3, 4];
  } else if (sudokuGameState.gridSize === 3) {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
  } else {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }
};

const getSudokuItemGroupIndexLimits: (itemIndex: GridIndex) => [GridIndex, GridIndex] = (itemIndex) => {
  const rowLimit: GridIndex = [0, sudokuGameState.gridSize];
  const columnLimit: GridIndex = [0, sudokuGameState.gridSize];
  for (let i: number = 0; i < sudokuGameState.gridSize; i++) {
    if (i === 0 && itemIndex[0] < sudokuGameState.gridSize) {
      columnLimit[0] = -1;
      columnLimit[1] = sudokuGameState.gridSize;
    } else if (itemIndex[0] > sudokuGameState.gridSize * i - 1 && itemIndex[0] < sudokuGameState.gridSize * (i + 1)) {
      columnLimit[0] = sudokuGameState.gridSize * i - 1;
      columnLimit[1] = sudokuGameState.gridSize * (i + 1);
    }
    if (i === 0 && itemIndex[1] < sudokuGameState.gridSize) {
      rowLimit[0] = -1;
      rowLimit[1] = sudokuGameState.gridSize;
    } else if (itemIndex[1] > sudokuGameState.gridSize * i - 1 && itemIndex[1] < sudokuGameState.gridSize * (i + 1)) {
      rowLimit[0] = sudokuGameState.gridSize * i - 1;
      rowLimit[1] = sudokuGameState.gridSize * (i + 1);
    }
  }
  return [columnLimit, rowLimit];
};

const isValidSudokuPlacement: (grid: Grid, row: number, col: number, num: number) => boolean = (grid, row, col, num) => {
  for (let i: number = 0; i < Math.pow(sudokuGameState.gridSize, 2); i++) {
    if (grid[row][i] === num || grid[i][col] === num) {
      return false;
    }
  }
  const subgridRowStart: number = Math.floor(row / sudokuGameState.gridSize) * sudokuGameState.gridSize;
  const subgridColStart: number = Math.floor(col / sudokuGameState.gridSize) * sudokuGameState.gridSize;
  for (let i: number = 0; i < sudokuGameState.gridSize; i++) {
    for (let j: number = 0; j < sudokuGameState.gridSize; j++) {
      if (grid[subgridRowStart + i][subgridColStart + j] === num) {
        return false;
      }
    }
  }
  return true;
};

const randomiseSudokuSeed: (sudokuSeed: number) => () => number = (sudokuSeed) => {
  let state: number = sudokuSeed;
  return () => {
    const x: number = Math.sin(state++) * 10000;
    return x - Math.floor(x);
  };
};

const removeRandomSudokuNumbers: (grid: Grid) => void = (grid) => {
  const rng: () => number = randomiseSudokuSeed(sudokuGameState.seed);
  for (let i: number = 0; i < sudokuGameState.difficulty; i++) {
    let row: number, col: number;
    do {
      row = Math.floor(rng() * Math.pow(sudokuGameState.gridSize, 2));
      col = Math.floor(rng() * Math.pow(sudokuGameState.gridSize, 2));
    } while (grid[row][col] === 0);
    grid[row][col] = 0;
  }
};

const shuffleSudokuGrid: (array: number[]) => number[] = (array) => {
  const shuffled: number[] = array.slice();
  for (let i: number = shuffled.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
