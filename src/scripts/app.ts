var seed: number = 0;
var sudokuContainerID: string = '';
var sudokuDifficulty: number = 0;
var sudokuGrid: Grid = [];
var sudokuPuzzle: Grid = [];
var activeUserValue: number = 0;
var showErrors: boolean = true;
var timerOn: boolean = false;
var interval: any = null;

/* --- utilities --- */
const fillSudoku: (grid: Grid) => boolean = (grid) => {
  const emptyCell: GroupIndex | null = findEmptyCell(grid);
  if (!emptyCell) {
    return true;
  }
  const [row, col]: GroupIndex = emptyCell;
  const numbers: number[] = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (const num of numbers) {
    if (isValidPlacement(grid, row, col, num)) {
      grid[row][col] = num;
      if (fillSudoku(grid)) {
        return true;
      }
      grid[row][col] = 0;
    }
  }
  return false;
};

const findEmptyCell: (grid: Grid) => GroupIndex | null = (grid) => {
  for (let row: number = 0; row < 9; row++) {
    for (let col: number = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
};

const generateSudokuGrid: () => Grid = () => {
  const grid: Grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillSudoku(grid);
  return grid;
};

const generateSudokuPuzzle: (grid: Grid, seed: number, difficulty: number) => Grid = (grid, seed, difficulty) => {
  const puzzle: Grid = [];
  for (let i: number = 0; i < grid.length; i++) {
    puzzle[i] = grid[i].slice();
  }
  removeRandomNumbers(puzzle, seed, difficulty);
  return puzzle;
};

const getDifficultyAsText: (difficulty: number) => string = (difficulty) => {
  const difficultyAsPercentage: number = (100 / 80) * difficulty;
  var sudokuDifficultyHTML: string = '';
  if (difficultyAsPercentage < 25) {
    sudokuDifficultyHTML = '<p>Easy</p>';
  } else if (difficultyAsPercentage >= 25 && difficultyAsPercentage < 50) {
    sudokuDifficultyHTML = '<p>Medium</p>';
  } else if (difficultyAsPercentage >= 50 && difficultyAsPercentage < 75) {
    sudokuDifficultyHTML = '<p>Hard</p>';
  } else if (difficultyAsPercentage >= 75) {
    sudokuDifficultyHTML = '<p>Extreme</p>';
  }
  return sudokuDifficultyHTML;
};

const getItemGroupIndexLimits: (itemIndex: GroupIndex) => [GroupIndex, GroupIndex] = (itemIndex) => {
  const rowLimit: GroupIndex = [0, 3];
  const columnLimit: GroupIndex = [0, 3];
  if (itemIndex[0] < 3) {
    columnLimit[0] = -1;
    columnLimit[1] = 3;
  } else if (itemIndex[0] > 2 && itemIndex[0] < 6) {
    columnLimit[0] = 2;
    columnLimit[1] = 6;
  } else if (itemIndex[0] > 5 && itemIndex[0] < 9) {
    columnLimit[0] = 5;
    columnLimit[1] = 9;
  }
  if (itemIndex[1] < 3) {
    rowLimit[0] = -1;
    rowLimit[1] = 3;
  } else if (itemIndex[1] > 2 && itemIndex[1] < 6) {
    rowLimit[0] = 2;
    rowLimit[1] = 6;
  } else if (itemIndex[1] > 5 && itemIndex[1] < 9) {
    rowLimit[0] = 5;
    rowLimit[1] = 9;
  }
  return [columnLimit, rowLimit];
};

const handleHighlightColumn: (sudokuID: string, columnIndex: number, enterExit: enterExit, currentValue: number, showErrors?: boolean) => void = (
  sudokuID,
  columnIndex,
  enterExit,
  currentValue,
  showErrors = false
) => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuID);
  const itemRows: HTMLCollectionOf<Element> = sudokuContainer?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
  for (let i: number = 0; i < itemRows.length; i++) {
    const itemRowChildren: HTMLCollectionOf<Element> = itemRows[i].getElementsByClassName('sudoku-item');
    const itemRowChild: HTMLElement = itemRowChildren[columnIndex] as HTMLElement;
    const itemDataValue: string | null = itemRowChild.getAttribute('data-value');
    const itemValue: number = itemDataValue === null ? 0 : parseInt(itemDataValue);
    itemRowChild.classList.remove('error');
    if (enterExit === 'enter') {
      itemRowChild.classList.add('hover');
      if (itemValue === currentValue && showErrors) {
        itemRowChild.classList.add('error');
      }
    } else {
      itemRowChild.classList.remove('hover');
    }
  }
};

const handleHighlightGroup: (sudokuID: string, itemIndex: GroupIndex, enterExit: enterExit, currentValue: number, showErrors?: boolean) => void = (
  sudokuID,
  itemIndex,
  enterExit,
  currentValue,
  showErrors = false
) => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuID);
  const itemRows: HTMLCollectionOf<Element> = sudokuContainer?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
  const groupIndexLimits: [GroupIndex, GroupIndex] = getItemGroupIndexLimits(itemIndex);
  for (let i: number = 0; i < itemRows.length; i++) {
    const itemRowChildren: HTMLCollectionOf<Element> = itemRows[i].getElementsByClassName('sudoku-item');
    if (i > groupIndexLimits[1][0] && i < groupIndexLimits[1][1]) {
      for (let j: number = 0; j < itemRows.length; j++) {
        if (j > groupIndexLimits[0][0] && j < groupIndexLimits[0][1]) {
          const itemRowChild: HTMLElement = itemRowChildren[j] as HTMLElement;
          const itemDataValue: string | null = itemRowChild.getAttribute('data-value');
          const itemValue: number = itemDataValue === null ? 0 : parseInt(itemDataValue);
          itemRowChild.classList.remove('error');
          if (enterExit === 'enter') {
            itemRowChild.classList.add('hover');
            if (itemValue === currentValue && showErrors) {
              itemRowChild.classList.add('error');
            }
          } else {
            itemRowChild.classList.remove('hover');
          }
        }
      }
    }
  }
};

const handleHighlightRow: (sudokuID: string, rowIndex: number, enterExit: enterExit, currentValue: number, showErrors?: boolean) => void = (
  sudokuID,
  rowIndex,
  enterExit,
  currentValue,
  showErrors = false
) => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuID);
  const itemRows: HTMLCollectionOf<Element> = sudokuContainer?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
  const row: HTMLElement = itemRows[rowIndex] as HTMLElement;
  for (let i: number = 0; i < row.children.length; i++) {
    const itemParentRowChild: HTMLElement = row.children[i] as HTMLElement;
    const itemDataValue: string | null = itemParentRowChild.getAttribute('data-value');
    const itemValue: number = itemDataValue === null ? 0 : parseInt(itemDataValue);
    itemParentRowChild.classList.remove('error');
    if (enterExit === 'enter') {
      itemParentRowChild.classList.add('hover');
      if (itemValue === currentValue && showErrors) {
        itemParentRowChild.classList.add('error');
      }
    } else {
      itemParentRowChild.classList.remove('hover');
    }
  }
};

const isValidPlacement: (grid: Grid, row: number, col: number, num: number) => boolean = (grid, row, col, num) => {
  for (let i: number = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) {
      return false;
    }
  }
  const subgridRowStart: number = Math.floor(row / 3) * 3;
  const subgridColStart: number = Math.floor(col / 3) * 3;
  for (let i: number = 0; i < 3; i++) {
    for (let j: number = 0; j < 3; j++) {
      if (grid[subgridRowStart + i][subgridColStart + j] === num) {
        return false;
      }
    }
  }
  return true;
};

const randomiseSeed: (seed: number) => () => number = (seed) => {
  let state: number = seed;
  return () => {
    const x: number = Math.sin(state++) * 10000;
    return x - Math.floor(x);
  };
};

const removeRandomNumbers: (grid: Grid, seed: number, difficulty: number) => void = (grid, seed, difficulty) => {
  const rng: () => number = randomiseSeed(seed);
  for (let i: number = 0; i < difficulty; i++) {
    let row: number, col: number;
    do {
      row = Math.floor(rng() * 9);
      col = Math.floor(rng() * 9);
    } while (grid[row][col] === 0);
    grid[row][col] = 0;
  }
};

const shuffleArray: (array: number[]) => number[] = (array) => {
  const shuffled: number[] = array.slice();
  for (let i: number = shuffled.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
/* --- end utilities --- */

const clearUserValueInputsActiveState: () => void = () => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuContainerID);
  if (sudokuContainer === null) {
    return;
  }
  const sudokuValueItems: HTMLCollectionOf<Element> = sudokuContainer.getElementsByClassName('sudoku-values-item');
  for (let i: number = 0; i < sudokuValueItems.length; i++) {
    sudokuValueItems[i].classList.remove('set');
  }
};

const clearHighlighting: () => void = () => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuContainerID);
  if (sudokuContainer === null) {
    return;
  }
  const sudokuItems: HTMLCollectionOf<Element> = sudokuContainer.getElementsByClassName('sudoku-item');
  for (let i: number = 0; i < sudokuItems.length; i++) {
    sudokuItems[i].classList.remove('error');
    sudokuItems[i].classList.remove('hover');
  }
};

const getIsValidSudoku: () => boolean = () => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuContainerID);
  const sudokuGridContainer: Element | undefined = sudokuContainer?.getElementsByClassName('sudoku-grid')[0];
  if (sudokuGridContainer === undefined) {
    return false;
  }
  const sudokuItems: HTMLCollectionOf<Element> = sudokuGridContainer.getElementsByClassName('sudoku-item');
  var count: number = 0;
  var hasError: boolean = false;
  for (let i: number = 0; i < sudokuGrid.length; i++) {
    for (let j: number = 0; j < sudokuGrid[i].length; j++) {
      const dataValue: string | null = sudokuItems[count].getAttribute('data-value');
      const dataValueNumber: number = dataValue === null ? 0 : parseInt(dataValue);
      if (dataValueNumber === 0 || dataValueNumber !== sudokuGrid[i][j]) {
        if (showErrors) {
          sudokuItems[count].classList.add('error');
        }
        sudokuItems[count].classList.add('error');
        hasError = true;
      }
      count++;
    }
  }
  return !hasError;
};

const handleGridItemMouseEnterExit: (event: Event, enterExit: enterExit) => void = (event, enterExit) => {
  const target: HTMLElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
  const dataValue: string | null = target.getAttribute('data-value');
  const value: number = dataValue === null ? 0 : parseInt(dataValue);
  if (value === 0) {
    return;
  }
  const itemParentRow: HTMLElement = target.parentElement as HTMLElement;
  const itemColumnIndex: number = Array.prototype.indexOf.call(itemParentRow.children, target);
  const itemRowIndex: number = Array.prototype.indexOf.call(itemParentRow.parentElement?.children, itemParentRow);
  clearHighlighting();
  handleHighlightColumn(sudokuContainerID, itemColumnIndex, enterExit, value, showErrors);
  handleHighlightRow(sudokuContainerID, itemRowIndex, enterExit, value, showErrors);
  handleHighlightGroup(sudokuContainerID, [itemColumnIndex, itemRowIndex], enterExit, value, showErrors);
};

const handleSudokuDifficultyChange: (event: Event) => void = (event) => {
  const target: HTMLInputElement = (event.currentTarget as HTMLInputElement) || (event.target as HTMLInputElement);
  const inputValue: string | null = target.value;
  const value: number = inputValue === null ? 0 : parseInt(inputValue);
  sudokuDifficulty = value;
};

const handleUserInput: (event: Event) => void = (event) => {
  const target: HTMLElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
  const dataValue: string | null = target.getAttribute('data-value');
  const value: number = dataValue === null ? 0 : parseInt(dataValue);
  const optionContainer: HTMLElement = target.getElementsByClassName('options')[0] as HTMLElement;
  const options: HTMLCollectionOf<Element> = target.getElementsByClassName('option') as HTMLCollectionOf<Element>;
  const content: HTMLElement = target.getElementsByClassName('content')[0] as HTMLElement;
  content.classList.remove('active');
  if (value === activeUserValue) {
    target.setAttribute('data-value', '0');
    content.innerHTML = '';
    return;
  } else if (options.length === 0) {
    optionContainer.innerHTML = `<span class="option _${activeUserValue}" data-value="${activeUserValue}">${activeUserValue}</span>`;
    content.innerHTML = '';
    return;
  }
  for (let i: number = 0; i < options.length; i++) {
    const optionDataValue: string | null = options[i].getAttribute('data-value');
    const optionValue: number = optionDataValue === null ? 0 : parseInt(optionDataValue);
    if (optionValue === activeUserValue) {
      var newHTML: string = '';
      for (let j: number = 0; j < options.length; j++) {
        newHTML += options[i] == options[j] ? '' : options[j].outerHTML;
      }
      optionContainer.innerHTML = newHTML;
      target.setAttribute('data-value', activeUserValue.toString());
      content.innerHTML = '<p>' + activeUserValue + '</p>';
      content.classList.add('active');
      return;
    }
  }
  optionContainer.innerHTML += `<span class="option ${activeUserValue}" data-value="${activeUserValue}">${activeUserValue}</span>`;
};

const initialiseSudokuVariables: () => void = () => {
  seed = Math.floor(Math.random() * 1000);
  sudokuContainerID = 'sudoku';
  sudokuDifficulty = 40;
  sudokuGrid = generateSudokuGrid();
  sudokuPuzzle = generateSudokuPuzzle(sudokuGrid, seed, sudokuDifficulty);
  timerOn = false;
};

const newSudoku: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuContainerID) as HTMLElement;
  sudokuContainer.classList.remove('complete');
  sudokuContainer.classList.remove('error');
  sudokuContainer.classList.add('ready');
  stopSudokuTimer();
};

const populateSudokuGrid: (sudoku: Grid) => void = (sudoku) => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuContainerID);
  const sudokuGridContainer: Element | undefined = sudokuContainer?.getElementsByClassName('sudoku-grid')[0];
  if (sudokuGridContainer === undefined) {
    return;
  }
  setSudokuContainerLoadingState(true);
  var sudokuGridHTML: string = '';
  for (var a: number = 0; a < sudoku.length; a++) {
    sudokuGridHTML += '<div class="sudoku-row">';
    for (var b: number = 0; b < sudoku[a].length; b++) {
      const dataValue: number = sudoku[a][b] === 0 ? 0 : sudoku[a][b];
      const content: string = sudoku[a][b] === 0 ? '' : `<p>${sudoku[a][b]}</p>`;
      const className: string = sudoku[a][b] === 0 ? 'sudoku-item' : 'sudoku-item set';
      const functionString: string = sudoku[a][b] === 0 ? 'handleUserInput(event)' : '';
      sudokuGridHTML += `<div class="${className}" data-value="${dataValue}" onclick="${functionString}" onmouseenter="handleGridItemMouseEnterExit(event, 'enter')" onmouseleave="handleGridItemMouseEnterExit(event, 'exit')"><div class="options"></div><div class="content">${content}</div></div>`;
    }
    sudokuGridHTML += '</div>';
  }
  sudokuGridContainer.innerHTML = sudokuGridHTML;
  setSudokuContainerLoadingState(false);
};

const populateSudokuUserInputs: () => void = () => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuContainerID);
  const sudokuValuesContainer: Element | undefined = sudokuContainer?.getElementsByClassName('sudoku-values')[0];
  if (sudokuValuesContainer === undefined) {
    return;
  }
  var sudokuValuesHTML: string = '';
  for (let i: number = 1; i < 10; i++) {
    sudokuValuesHTML += `<div class="sudoku-values-item" data-value="${i}" onclick="setSudokuUserValue(event)"><p>${i}</p></div>`;
  }
  sudokuValuesContainer.innerHTML = sudokuValuesHTML;
};

const populateSudokuDifficulty: () => void = () => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuContainerID);
  const sudokuDifficultyContainer: Element | undefined = sudokuContainer?.getElementsByClassName('sudoku-difficulty-title')[0];
  if (sudokuDifficultyContainer === undefined) {
    return;
  }
  var sudokuDifficultyHTML: string = getDifficultyAsText(sudokuDifficulty);
  sudokuDifficultyContainer.innerHTML = sudokuDifficultyHTML;
};

const restartSudoku: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuContainerID) as HTMLElement;
  sudokuContainer.classList.remove('error');
  sudokuContainer.classList.remove('complete');
  populateSudokuGrid(sudokuPuzzle);
  stopSudokuTimer();
  startSudokuTimer();
};

const setNewSudokuGrid: () => void = () => {
  seed = Math.floor(Math.random() * 1000);
  sudokuGrid = generateSudokuGrid();
  sudokuPuzzle = generateSudokuPuzzle(sudokuGrid, seed, sudokuDifficulty);
  populateSudokuGrid(sudokuPuzzle);
  populateSudokuDifficulty();
  stopSudokuTimer();
  startSudokuTimer();
};

const setSudokuContainerLoadingState: (isLoading: boolean) => void = (isLoading) => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuContainerID);
  if (sudokuContainer === null) {
    return;
  }
  if (isLoading) {
    sudokuContainer.classList.add('loading');
  } else {
    sudokuContainer.classList.remove('loading');
  }
};

const setSudokuUserValue: (event: Event) => void = (event) => {
  const target: HTMLElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
  const dataValue: string | null = target.getAttribute('data-value');
  const value: number = dataValue === null ? 0 : parseInt(dataValue);
  clearUserValueInputsActiveState();
  target.classList.add('set');
  activeUserValue = value;
};

const showCompleteState: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuContainerID) as HTMLElement;
  sudokuContainer.classList.remove('error');
  sudokuContainer.classList.add('complete');
};

const showErrorState: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuContainerID) as HTMLElement;
  sudokuContainer.classList.add('error');
  setTimeout(() => {
    sudokuContainer.classList.remove('error');
  }, 3000);
};

const solveSudoku: () => void = () => {
  populateSudokuGrid(sudokuGrid);
  stopSudokuTimer();
};

const startSudoku: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuContainerID) as HTMLElement;
  sudokuContainer.classList.remove('error');
  sudokuContainer.classList.remove('ready');
  setNewSudokuGrid();
  startSudokuTimer();
};

const startSudokuTimer: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuContainerID) as HTMLElement;
  const sudokuTimer: HTMLElement | null = sudokuContainer.getElementsByClassName('sudoku-timer')[0] as HTMLElement;
  if (sudokuTimer === null || timerOn) {
    return;
  }
  var seconds: number = 0;
  var minutes: number = 0;
  interval = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
    sudokuTimer.innerHTML = `<p>${minutes}:${seconds}</p>`;
  }, 1000);
  timerOn = true;
};

const stopSudokuTimer: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuContainerID) as HTMLElement;
  const sudokuTimer: HTMLElement | null = sudokuContainer.getElementsByClassName('sudoku-timer')[0] as HTMLElement;
  if (sudokuTimer === null) {
    return;
  }
  clearInterval(interval);
  sudokuTimer.innerHTML = '<p>0:0</p>';
  timerOn = false;
};

const validateSudoku: () => void = () => {
  setSudokuContainerLoadingState(true);
  const validSudoku: boolean = getIsValidSudoku();
  if (!validSudoku) {
    showErrorState();
  } else {
    stopSudokuTimer();
    showCompleteState();
  }
  setSudokuContainerLoadingState(false);
};

initialiseSudokuVariables();
document.addEventListener('DOMContentLoaded', () => {
  populateSudokuGrid(sudokuPuzzle);
  populateSudokuUserInputs();
});
