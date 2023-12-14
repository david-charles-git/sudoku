const sudokuGameState: GameState = {
  playState: 'loading', //not yet in use
  activeValue: 0,
  showErrors: true, // not yet editable
  containerID: '', // not editable
  timerOn: false,
  difficulty: 0,
  errorInterval: null,
  puzzle: [],
  seed: 0, // not editable
  grid: [],
  timer: '0.0',
};

/* --- utilities --- */
const fillSudoku: (grid: Grid) => boolean = (grid) => {
  const emptyCell: GroupIndex | null = findSudokuEmptyCell(grid);
  if (!emptyCell) {
    return true;
  }
  const [row, col]: GroupIndex = emptyCell;
  const numbers: number[] = shuffleSudokuGrid([1, 2, 3, 4, 5, 6, 7, 8, 9]);
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

const findSudokuEmptyCell: (grid: Grid) => GroupIndex | null = (grid) => {
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

const generateSudokuPuzzle: (grid: Grid, sudokuSeed: number, difficulty: number) => Grid = (grid, sudokuSeed, difficulty) => {
  const puzzle: Grid = [];
  for (let i: number = 0; i < grid.length; i++) {
    puzzle[i] = grid[i].slice();
  }
  removeRandomSudokuNumbers(puzzle, sudokuSeed, difficulty);
  return puzzle;
};

const getSudokuDifficultyAsText: (difficulty: number) => string = (difficulty) => {
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

const getSudokuItemGroupIndexLimits: (itemIndex: GroupIndex) => [GroupIndex, GroupIndex] = (itemIndex) => {
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

const handleHighlightSudokuColumn: (
  sudokuID: string,
  columnIndex: number,
  enterExit: enterExit,
  currentValue: number,
  sudokuShowErrors?: boolean
) => void = (sudokuID, columnIndex, enterExit, currentValue, sudokuShowErrors = false) => {
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
      if (itemValue === currentValue && sudokuShowErrors) {
        itemRowChild.classList.add('error');
      }
    } else {
      itemRowChild.classList.remove('hover');
    }
  }
};

const handleHighlightSudokuGroup: (
  sudokuID: string,
  itemIndex: GroupIndex,
  enterExit: enterExit,
  currentValue: number,
  sudokuShowErrors?: boolean
) => void = (sudokuID, itemIndex, enterExit, currentValue, sudokuShowErrors = false) => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuID);
  const itemRows: HTMLCollectionOf<Element> = sudokuContainer?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
  const groupIndexLimits: [GroupIndex, GroupIndex] = getSudokuItemGroupIndexLimits(itemIndex);
  for (let i: number = 0; i < itemRows.length; i++) {
    const itemRowChildren: HTMLCollectionOf<Element> = itemRows[i].getElementsByClassName('sudoku-item');
    if (i > groupIndexLimits[1][0] && i < groupIndexLimits[1][1]) {
      for (let j: number = 0; j < itemRowChildren.length; j++) {
        if (j > groupIndexLimits[0][0] && j < groupIndexLimits[0][1]) {
          const itemRowChild: HTMLElement = itemRowChildren[j] as HTMLElement;
          const itemDataValue: string | null = itemRowChild.getAttribute('data-value');
          const itemValue: number = itemDataValue === null ? 0 : parseInt(itemDataValue);
          itemRowChild.classList.remove('error');
          if (enterExit === 'enter') {
            itemRowChild.classList.add('hover');
            if (itemValue === currentValue && sudokuShowErrors) {
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

const handleHighlightSudokuRow: (
  sudokuID: string,
  rowIndex: number,
  enterExit: enterExit,
  currentValue: number,
  sudokuShowErrors?: boolean
) => void = (sudokuID, rowIndex, enterExit, currentValue, sudokuShowErrors = false) => {
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
      if (itemValue === currentValue && sudokuShowErrors) {
        itemParentRowChild.classList.add('error');
      }
    } else {
      itemParentRowChild.classList.remove('hover');
    }
  }
};

const handleHighlightAllSudokuItemsByIndex: (sudokuID: string, itemIndex: number) => void = (sudokuID, itemIndex) => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuID);
  const itemRows: HTMLCollectionOf<Element> = sudokuContainer?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
  for (let i: number = 0; i < itemRows.length; i++) {
    const itemRowChildren: HTMLCollectionOf<Element> = itemRows[i].getElementsByClassName('sudoku-item');
    for (let j: number = 0; j < itemRowChildren.length; j++) {
      const itemRowChild: HTMLElement = itemRowChildren[j] as HTMLElement;
      const itemDataValue: string | null = itemRowChild.getAttribute('data-value');
      const itemValue: number = itemDataValue === null ? 0 : parseInt(itemDataValue);
      itemRowChild.classList.remove('highlight');
      if (itemValue === itemIndex && itemRowChild.classList.contains('set')) {
        itemRowChild.classList.add('highlight');
      }
    }
  }
};

const isValidSudokuPlacement: (grid: Grid, row: number, col: number, num: number) => boolean = (grid, row, col, num) => {
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

const randomiseSudokuSeed: (sudokuSeed: number) => () => number = (sudokuSeed) => {
  let state: number = sudokuSeed;
  return () => {
    const x: number = Math.sin(state++) * 10000;
    return x - Math.floor(x);
  };
};

const removeRandomSudokuNumbers: (grid: Grid, sudokuSeed: number, difficulty: number) => void = (grid, sudokuSeed, difficulty) => {
  const rng: () => number = randomiseSudokuSeed(sudokuSeed);
  for (let i: number = 0; i < difficulty; i++) {
    let row: number, col: number;
    do {
      row = Math.floor(rng() * 9);
      col = Math.floor(rng() * 9);
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
/* --- end utilities --- */

const clearSudokuUserValueInputsActiveState: () => void = () => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuGameState.containerID);
  if (sudokuContainer === null) {
    return;
  }
  const sudokuValueItems: HTMLCollectionOf<Element> = sudokuContainer.getElementsByClassName('sudoku-values-item');
  for (let i: number = 0; i < sudokuValueItems.length; i++) {
    sudokuValueItems[i].classList.remove('set');
  }
};

const clearSudokuHighlight: () => void = () => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuGameState.containerID);
  if (sudokuContainer === null) {
    return;
  }
  const sudokuItems: HTMLCollectionOf<Element> = sudokuContainer.getElementsByClassName('sudoku-item');
  for (let i: number = 0; i < sudokuItems.length; i++) {
    sudokuItems[i].classList.remove('highlight');
  }
};

const clearSudokuHover: () => void = () => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuGameState.containerID);
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
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuGameState.containerID);
  const sudokuGridContainer: Element | undefined = sudokuContainer?.getElementsByClassName('sudoku-grid')[0];
  if (sudokuGridContainer === undefined) {
    return false;
  }
  const sudokuItems: HTMLCollectionOf<Element> = sudokuGridContainer.getElementsByClassName('sudoku-item');
  var count: number = 0;
  var hasError: boolean = false;
  for (let i: number = 0; i < sudokuGameState.grid.length; i++) {
    for (let j: number = 0; j < sudokuGameState.grid[i].length; j++) {
      const dataValue: string | null = sudokuItems[count].getAttribute('data-value');
      const dataValueNumber: number = dataValue === null ? 0 : parseInt(dataValue);
      if (dataValueNumber === 0 || dataValueNumber !== sudokuGameState.grid[i][j]) {
        if (sudokuGameState.showErrors) {
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

const handleSudokuGridItemMouseEnterExit: (event: Event, enterExit: enterExit) => void = (event, enterExit) => {
  const target: HTMLElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
  const dataValue: string | null = target.getAttribute('data-value');
  const value: number = dataValue === null ? 0 : parseInt(dataValue);
  if (value === 0) {
    return;
  }
  const itemParentRow: HTMLElement = target.parentElement as HTMLElement;
  const itemColumnIndex: number = Array.prototype.indexOf.call(itemParentRow.children, target);
  const itemRowIndex: number = Array.prototype.indexOf.call(itemParentRow.parentElement?.children, itemParentRow);
  clearSudokuHover();
  handleHighlightSudokuColumn(sudokuGameState.containerID, itemColumnIndex, enterExit, value, sudokuGameState.showErrors);
  handleHighlightSudokuRow(sudokuGameState.containerID, itemRowIndex, enterExit, value, sudokuGameState.showErrors);
  handleHighlightSudokuGroup(sudokuGameState.containerID, [itemColumnIndex, itemRowIndex], enterExit, value, sudokuGameState.showErrors);
};

const handleSudokuGridSetItemOnClick: (event: Event) => void = (event) => {
  const target: HTMLElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
  const dataValue: string | null = target.getAttribute('data-value');
  const value: number = dataValue === null ? 0 : parseInt(dataValue);
  if (value === 0) {
    return;
  }
  handleHighlightAllSudokuItemsByIndex(sudokuGameState.containerID, value);
};

const handleSudokuDifficultyChange: (event: Event) => void = (event) => {
  const target: HTMLInputElement = (event.currentTarget as HTMLInputElement) || (event.target as HTMLInputElement);
  const inputValue: string | null = target.value;
  const value: number = inputValue === null ? 0 : parseInt(inputValue);
  sudokuGameState.difficulty = value;
};

const handleSudokuUserInput: (event: Event) => void = (event) => {
  const target: HTMLElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
  const dataValue: string | null = target.getAttribute('data-value');
  const value: number = dataValue === null ? 0 : parseInt(dataValue);
  const optionContainer: HTMLElement = target.getElementsByClassName('options')[0] as HTMLElement;
  const options: HTMLCollectionOf<Element> = target.getElementsByClassName('option') as HTMLCollectionOf<Element>;
  const content: HTMLElement = target.getElementsByClassName('content')[0] as HTMLElement;
  content.classList.remove('active');
  if (value === sudokuGameState.activeValue) {
    target.setAttribute('data-value', '0');
    content.innerHTML = '';
    return;
  } else if (options.length === 0) {
    optionContainer.innerHTML = `<span class="option _${sudokuGameState.activeValue}" data-value="${sudokuGameState.activeValue}">${sudokuGameState.activeValue}</span>`;
    content.innerHTML = '';
    return;
  }
  for (let i: number = 0; i < options.length; i++) {
    const optionDataValue: string | null = options[i].getAttribute('data-value');
    const optionValue: number = optionDataValue === null ? 0 : parseInt(optionDataValue);
    if (optionValue === sudokuGameState.activeValue) {
      var newHTML: string = '';
      for (let j: number = 0; j < options.length; j++) {
        newHTML += options[i] == options[j] ? '' : options[j].outerHTML;
      }
      optionContainer.innerHTML = newHTML;
      target.setAttribute('data-value', sudokuGameState.activeValue.toString());
      content.innerHTML = '<p>' + sudokuGameState.activeValue + '</p>';
      content.classList.add('active');
      return;
    }
  }
  optionContainer.innerHTML += `<span class="option ${sudokuGameState.activeValue}" data-value="${sudokuGameState.activeValue}">${sudokuGameState.activeValue}</span>`;
};

const initialiseSudokuVariables: () => void = () => {
  sudokuGameState.seed = Math.floor(Math.random() * 1000);
  sudokuGameState.containerID = 'sudoku';
  sudokuGameState.difficulty = 40;
  sudokuGameState.grid = generateSudokuGrid();
  sudokuGameState.puzzle = generateSudokuPuzzle(sudokuGameState.grid, sudokuGameState.seed, sudokuGameState.difficulty);
  sudokuGameState.timerOn = false;
};

const newSudoku: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuGameState.containerID) as HTMLElement;
  sudokuContainer.classList.remove('complete');
  sudokuContainer.classList.remove('error');
  sudokuContainer.classList.add('ready');
  sudokuGameState.timer = '0.0';
  clearSudokuHighlight();
  stopSudokuTimer();
};

const populateSudokuGrid: (sudoku: Grid) => void = (sudoku) => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuGameState.containerID);
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
      const functionString: string = sudoku[a][b] === 0 ? 'handleSudokuUserInput(event)' : 'handleSudokuGridSetItemOnClick(event)';
      sudokuGridHTML += `<div class="${className}" data-value="${dataValue}" onclick="${functionString}" onmouseenter="handleSudokuGridItemMouseEnterExit(event, 'enter')" onmouseleave="handleSudokuGridItemMouseEnterExit(event, 'exit')"><div class="options"></div><div class="content">${content}</div></div>`;
    }
    sudokuGridHTML += '</div>';
  }
  sudokuGridContainer.innerHTML = sudokuGridHTML;
  setSudokuContainerLoadingState(false);
};

const populateSudokuUserInputs: () => void = () => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuGameState.containerID);
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
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuGameState.containerID);
  const sudokuDifficultyContainer: Element | undefined = sudokuContainer?.getElementsByClassName('sudoku-difficulty-title')[0];
  if (sudokuDifficultyContainer === undefined) {
    return;
  }
  var sudokuDifficultyHTML: string = getSudokuDifficultyAsText(sudokuGameState.difficulty);
  sudokuDifficultyContainer.innerHTML = sudokuDifficultyHTML;
};

const restartSudoku: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuGameState.containerID) as HTMLElement;
  sudokuContainer.classList.remove('error');
  sudokuContainer.classList.remove('complete');
  sudokuGameState.timer = '0.0';
  clearSudokuHighlight();
  populateSudokuGrid(sudokuGameState.puzzle);
  stopSudokuTimer();
  startSudokuTimer();
};

const setNewSudokuGrid: () => void = () => {
  sudokuGameState.seed = Math.floor(Math.random() * 1000);
  sudokuGameState.grid = generateSudokuGrid();
  sudokuGameState.puzzle = generateSudokuPuzzle(sudokuGameState.grid, sudokuGameState.seed, sudokuGameState.difficulty);
  sudokuGameState.timer = '0.0';
  populateSudokuGrid(sudokuGameState.puzzle);
  populateSudokuDifficulty();
  stopSudokuTimer();
  startSudokuTimer();
};

const setSudokuContainerLoadingState: (isLoading: boolean) => void = (isLoading) => {
  const sudokuContainer: HTMLElement | null = document.getElementById(sudokuGameState.containerID);
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
  clearSudokuUserValueInputsActiveState();
  target.classList.add('set');
  sudokuGameState.activeValue = value;
};

const showSudokuCompleteState: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuGameState.containerID) as HTMLElement;
  sudokuContainer.classList.remove('error');
  sudokuContainer.classList.add('complete');
};

const showSudokuErrorState: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuGameState.containerID) as HTMLElement;
  sudokuContainer.classList.add('error');
  setTimeout(() => {
    sudokuContainer.classList.remove('error');
  }, 3000);
};

const solveSudoku: () => void = () => {
  clearSudokuHighlight();
  populateSudokuGrid(sudokuGameState.grid);
  stopSudokuTimer();
};

const startSudoku: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuGameState.containerID) as HTMLElement;
  sudokuContainer.classList.remove('error');
  sudokuContainer.classList.remove('ready');
  clearSudokuHighlight();
  setNewSudokuGrid();
  startSudokuTimer();
};

const startSudokuTimer: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuGameState.containerID) as HTMLElement;
  const sudokuTimer: HTMLElement | null = sudokuContainer.getElementsByClassName('sudoku-timer')[0] as HTMLElement;
  if (sudokuTimer === null || sudokuGameState.timerOn) {
    return;
  }
  var seconds: number = 0;
  var minutes: number = 0;
  sudokuGameState.errorInterval = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
    sudokuGameState.timer = `${minutes}:${seconds}`;
    sudokuTimer.innerHTML = `<p>${sudokuGameState.timer}</p>`;
  }, 1000);
  sudokuGameState.timerOn = true;
};

const stopSudokuTimer: () => void = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuGameState.containerID) as HTMLElement;
  const sudokuTimer: HTMLElement | null = sudokuContainer.getElementsByClassName('sudoku-timer')[0] as HTMLElement;
  if (sudokuTimer === null) {
    return;
  }
  clearInterval(sudokuGameState.errorInterval);
  sudokuGameState.timerOn = false;
};

const validateSudoku: () => void = () => {
  setSudokuContainerLoadingState(true);
  const validSudoku: boolean = getIsValidSudoku();
  clearSudokuHighlight();
  if (!validSudoku) {
    showSudokuErrorState();
  } else {
    stopSudokuTimer();
    showSudokuCompleteState();
  }
  setSudokuContainerLoadingState(false);
};

initialiseSudokuVariables();
document.addEventListener('DOMContentLoaded', () => {
  populateSudokuGrid(sudokuGameState.puzzle);
  populateSudokuUserInputs();
});
