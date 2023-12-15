// Utils
const sudokuPreventDefault: (event: Event) => void = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

// Sudoku Game State Record
var sudokuGameStateRecord: GameState[] = [];
const getSudokuGameStateRecord: () => GameState[] = () => {
  return sudokuGameStateRecord;
};
const updateSudokuGameStateRecord: (type: 'add' | 'clear') => void = (gameState) => {
  if (gameState === 'add') {
    sudokuGameStateRecord.push(sudokuGameState);
  } else if (gameState === 'clear') {
    sudokuGameStateRecord.length = 0;
  }
};

// Sudoku Game State
var sudokuGameState: GameState = {
  grid: [],
  puzzle: [],
  gridSize: 3,
  timer: '0:0',
  gameScore: 0,
  activeValue: 0,
  difficulty: 40,
  timerOn: true,
  sudokuState: [],
  timeInSeconds: 0,
  difficultyMax: 80,
  showErrors: false,
  errorInterval: null,
  validationClicks: 0,
  playState: 'loading',
  containerID: 'sudoku',
  seed: Math.floor(Math.random() * 1000),
};
const getSudokuGameState: () => GameState = () => {
  return sudokuGameState;
};
const updateSudokuGameState: (state: GameStatePartial) => void = (state) => {
  sudokuGameState = { ...sudokuGameState, ...state };
};

// Sudoku Creation
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

//initialisation Functions
const initialiseSudokuGame: () => void = () => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  if (sudokuContainer === null) {
    console.error('Sudoku container not found!');
    return;
  }
  setSudokuPlayState('loading');
  initialiseSudokuVariables();
  populateSudokuContainer();
  populateSudokuGame();
  sudokuGameState.errorInterval = setInterval(() => {
    if (!sudokuGameState.timerOn) {
      return;
    }
    const sudokuTimer: HTMLElement = sudokuContainer.getElementsByClassName('sudoku-timer')[0] as HTMLElement;
    updateSudokuGameState({ timeInSeconds: sudokuGameState.timeInSeconds + 1, timer: `${Math.floor(sudokuGameState.timeInSeconds / 60)}:${sudokuGameState.timeInSeconds % 60}` });
    sudokuTimer.innerHTML = `<p>${sudokuGameState.timer}</p>`;
  }, 1000);
  document.addEventListener('DOMContentLoaded', () => {
    setSudokuPlayState('ready');
  });
};
const initialiseSudokuVariables: () => void = () => {
  updateSudokuGameState({
    grid: generateSudoku(),
  });
  updateSudokuGameState({ puzzle: generateSudokuPuzzle(sudokuGameState.grid) });
  updateSudokuGameState({ sudokuState: sudokuGameState.puzzle });
};

// Population Functions
const populateSudoku: (sudoku: Grid) => void = (sudoku) => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const sudokuGridContainer: Element = sudokuContainer?.getElementsByClassName('sudoku-grid')[0] as Element;
  var sudokuGridHTML: string = '';
  for (var a: number = 0; a < sudoku.length; a++) {
    sudokuGridHTML += `<div class="sudoku-row row-${sudokuGameState.gridSize}">`;
    for (var b: number = 0; b < sudoku[a].length; b++) {
      const dataValue: number = sudoku[a][b] === 0 ? 0 : sudoku[a][b];
      const content: string = sudoku[a][b] === 0 ? '' : `<p>${sudoku[a][b]}</p>`;
      const className: string = sudoku[a][b] === 0 ? 'sudoku-item' : 'sudoku-item set';
      const functionString: string = sudoku[a][b] === 0 ? 'handleSudokuGridVariableItemOnClick(event)' : 'handleSudokuGridSetItemOnClick(event)';
      sudokuGridHTML += `<div class="${className}" data-value="${dataValue}" onclick="${functionString}" onmouseenter="handleSudokuGridItemMouseEnterExit(event, 'enter')" onmouseleave="handleSudokuGridItemMouseEnterExit(event, 'exit')"><div class="options"></div><div class="content">${content}</div></div>`;
    }
    sudokuGridHTML += '</div>';
  }
  sudokuGridContainer.innerHTML = sudokuGridHTML;
};
const populateSudokuContainer: () => void = () => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  sudokuContainer.innerHTML = `<div class="inner">
    <div class="menu-container">
      <div class="background"></div>
      <div class="content">
        <p class="sudoku-title">Menu</p>
        <div class="sudoku-difficulty-container">
          <p>Difficulty</p>
          <input
            type="range"
            min="1"
            max="${sudokuGameState.difficultyMax}"
            value="${sudokuGameState.difficulty}"
            class="slider sudoku-difficulty-input"
            oninput="handleSudokuDifficultyChange(event)" />
        </div>
        <div class="sudoku-grid-size-container">
          <p>Sudoku Grid Size</p>
          <input
            type="range"
            min="2"
            max="3"
            value="${sudokuGameState.gridSize}"
            class="slider sudoku-grid-size-input"
            oninput="handleSudokuGridSizeChange(event)" />
        </div>
        <button class="sudoku-controls-button show-errors" onclick="setSudokuShowErrors()">Show Errors: ${sudokuGameState.showErrors ? 'true' : 'false'}</button>
        <button class="sudoku-controls-button new" onclick="goToLandingScreen()">New Game</button>
        <button class="sudoku-controls-button restart" onclick="resetCurrentSudoku()">Restart Game</button>
        <button class="sudoku-controls-button solve" onclick="solveCurrentSudoku()">Solve</button>
        <button class="sudoku-controls-button home" onclick="goToLandingScreen()">Home</button>
        <button class="sudoku-controls-button back" onclick="goToPlayScreen()">Back</button>
      </div>
    </div>

    <div class="ready-container">
      <div class="background"></div>
      <div class="content">
        <p class="sudoku-title">Project-9 - Sudoku</p>
        <p>Click on a number to select it, then click on a variable cell once to add it to the cell list, again to set the value, and a third time to remove it from the cell list and remove value.</p> 
        <button class="sudoku-controls-button start" onclick="startNewSudoku()">Start</button>
        <button class="sudoku-controls-button menu" onclick="goToMenuScreen()">Menu</button>
      </div>
    </div>

    <div class="error-container">
      <div class="background"></div>
      <div class="content"></div>
    </div>

    <div class="completion-container">
      <div class="background"></div>
      <div class="content"></div>
    </div>

    <div class="loading-container">
      <div class="background"></div>
      <div class="content">
        <p>Loading</p>
      </div>
    </div>

    <div class="sudoku-container">
      <div class="sudoku-header"></div>
      <div class="sudoku-grid"></div>
      <div class="sudoku-controls"></div>
    </div>
  </div>`;
};
const populateSudokuControls: () => void = () => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const sudokuControlsContainer: Element = sudokuContainer?.getElementsByClassName('sudoku-controls')[0] as Element;
  var sudokuControlsHTML: string = `<div class="sudoku-values"></div>`;
  sudokuControlsHTML += `<button class="sudoku-controls-button new" onclick="goToLandingScreen()">New Game</button>`;
  sudokuControlsHTML += `<button class="sudoku-controls-button validate" onclick="validateCurrentSudoku()">Validate</button>`;
  sudokuControlsHTML += `<button class="sudoku-controls-button menu" onclick="goToMenuScreen()">Menu</button>`;
  sudokuControlsContainer.innerHTML = sudokuControlsHTML;
  populateSudokuUserInputs();
};
const populateSudokuDifficulty: () => void = () => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const sudokuDifficultyContainer: Element = sudokuContainer?.getElementsByClassName('sudoku-difficulty-title')[0] as Element;
  const sudokuDifficultyInput: HTMLCollectionOf<Element> = sudokuContainer?.getElementsByClassName('sudoku-difficulty-input') as HTMLCollectionOf<Element>;
  for (let i: number = 0; i < sudokuDifficultyInput.length; i++) {
    const input: HTMLInputElement = sudokuDifficultyInput[i] as HTMLInputElement;
    input.value = sudokuGameState.difficulty.toString();
    input.max = sudokuGameState.difficultyMax.toString();
  }
  sudokuDifficultyContainer.innerHTML = getSudokuDifficultyAsText();
};
const populateSudokuGame: () => void = () => {
  populateSudokuHeader();
  populateSudoku(sudokuGameState.puzzle);
  populateSudokuControls();
  populateSudokuDifficulty();
};
const populateSudokuGridSize: () => void = () => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const sudokuGridSizeInput: HTMLCollectionOf<Element> = sudokuContainer?.getElementsByClassName('sudoku-grid-size-input') as HTMLCollectionOf<Element>;
  for (let i: number = 0; i < sudokuGridSizeInput.length; i++) {
    const input: HTMLInputElement = sudokuGridSizeInput[i] as HTMLInputElement;
    input.value = sudokuGameState.gridSize.toString();
  }
};
const populateSudokuHeader: () => void = () => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const sudokuHeaderContainer: Element = sudokuContainer?.getElementsByClassName('sudoku-header')[0] as Element;
  var sudokuHeaderHTML: string = `<p class="sudoku-title">Sudoku</p>`;
  sudokuHeaderHTML += `<p class="sudoku-difficulty-title"></p>`;
  sudokuHeaderHTML += `<div class="sudoku-timer"><p>${sudokuGameState.timer}</p></div>`;
  sudokuHeaderContainer.innerHTML = sudokuHeaderHTML;
};
const populateSudokuUserInputs: () => void = () => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const sudokuValuesContainer: Element = sudokuContainer?.getElementsByClassName('sudoku-values')[0] as Element;
  var sudokuValuesHTML: string = '';
  for (let i: number = 1; i < Math.pow(sudokuGameState.gridSize, 2) + 1; i++) {
    sudokuValuesHTML += `<div class="sudoku-values-item" data-value="${i}" onclick="setSudokuActiveValue(event)"><p>${i}</p></div>`;
  }
  sudokuValuesContainer.innerHTML = sudokuValuesHTML;
};

// Sudoku Highlight Functions
const handleHighlightAllSudokuItemsByIndex: (itemIndex: number) => void = (itemIndex) => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const itemRows: HTMLCollectionOf<Element> = sudokuContainer?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
  for (let i: number = 0; i < itemRows.length; i++) {
    const itemRowChildren: HTMLCollectionOf<Element> = itemRows[i].getElementsByClassName('sudoku-item');
    for (let j: number = 0; j < itemRowChildren.length; j++) {
      const itemRowChild: HTMLElement = itemRowChildren[j] as HTMLElement;
      const itemDataValue: string | null = itemRowChild.getAttribute('data-value');
      const itemValue: number = itemDataValue === null ? 0 : parseInt(itemDataValue);
      itemRowChild.classList.remove('highlight');
      if (itemValue === itemIndex) {
        itemRowChild.classList.add('highlight');
      }
    }
  }
};
const handleHighlightSudokuColumn: (columnIndex: number, enterExit: enterExit, currentValue: number) => void = (columnIndex, enterExit, currentValue) => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const itemRows: HTMLCollectionOf<Element> = sudokuContainer?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
  for (let i: number = 0; i < itemRows.length; i++) {
    const itemRowChildren: HTMLCollectionOf<Element> = itemRows[i].getElementsByClassName('sudoku-item');
    const itemRowChild: HTMLElement = itemRowChildren[columnIndex] as HTMLElement;
    const itemDataValue: string | null = itemRowChild.getAttribute('data-value');
    const itemValue: number = itemDataValue === null ? 0 : parseInt(itemDataValue);
    itemRowChild.classList.remove('error');
    if (enterExit === 'enter') {
      itemRowChild.classList.add('hover');
      if (itemValue === currentValue && sudokuGameState.showErrors) {
        itemRowChild.classList.add('error');
      }
    } else {
      itemRowChild.classList.remove('hover');
    }
  }
};
const handleHighlightSudokuGroup: (itemIndex: GridIndex, enterExit: enterExit, currentValue: number) => void = (itemIndex, enterExit, currentValue) => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const itemRows: HTMLCollectionOf<Element> = sudokuContainer?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
  const groupIndexLimits: [GridIndex, GridIndex] = getSudokuItemGroupIndexLimits(itemIndex);
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
            if (itemValue === currentValue && sudokuGameState.showErrors) {
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
const handleHighlightSudokuRow: (rowIndex: number, enterExit: enterExit, currentValue: number) => void = (rowIndex, enterExit, currentValue) => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const itemRows: HTMLCollectionOf<Element> = sudokuContainer?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
  const row: HTMLElement = itemRows[rowIndex] as HTMLElement;
  for (let i: number = 0; i < row.children.length; i++) {
    const itemParentRowChild: HTMLElement = row.children[i] as HTMLElement;
    const itemDataValue: string | null = itemParentRowChild.getAttribute('data-value');
    const itemValue: number = itemDataValue === null ? 0 : parseInt(itemDataValue);
    itemParentRowChild.classList.remove('error');
    if (enterExit === 'enter') {
      itemParentRowChild.classList.add('hover');
      if (itemValue === currentValue && sudokuGameState.showErrors) {
        itemParentRowChild.classList.add('error');
      }
    } else {
      itemParentRowChild.classList.remove('hover');
    }
  }
};

// Game Functions
const getSudokuContainer: () => HTMLElement = () => {
  const sudokuContainer: HTMLElement = document.getElementById(sudokuGameState.containerID) as HTMLElement;
  return sudokuContainer;
};
const getSudokuDifficultyAsText: () => string = () => {
  const difficultyAsPercentage: number = (100 / sudokuGameState.difficultyMax) * sudokuGameState.difficulty;
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
const getSudokuGridItems: () => HTMLCollectionOf<Element> = () => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const sudokuItems: HTMLCollectionOf<Element> = sudokuContainer.getElementsByClassName('sudoku-item');
  return sudokuItems;
};
const getSudokuIsValid: () => boolean = () => {
  const sudokuItems: HTMLCollectionOf<Element> = getSudokuGridItems();
  updateSudokuGameState({ sudokuState: getSudokuState() });
  var count: number = 0;
  var hasError: boolean = false;
  for (let i: number = 0; i < sudokuGameState.grid.length; i++) {
    for (let j: number = 0; j < sudokuGameState.grid[i].length; j++) {
      if (sudokuGameState.sudokuState[i][j] === 0 || sudokuGameState.sudokuState[i][j] !== sudokuGameState.grid[i][j]) {
        if (sudokuGameState.showErrors) {
          sudokuItems[count].classList.add('error');
        }
        hasError = true;
      }
      count++;
    }
  }
  return !hasError;
};
const getSudokuState: () => Grid = () => {
  const gridItems: HTMLCollectionOf<Element> = getSudokuGridItems();
  var count: number = 0;
  var grid: Grid = [];
  for (let i: number = 0; i < Math.pow(sudokuGameState.gridSize, 2); i++) {
    grid[i] = [];
    for (let j: number = 0; j < Math.pow(sudokuGameState.gridSize, 2); j++) {
      const dataValue: string | null = gridItems[count].getAttribute('data-value');
      const value: number = dataValue === null ? 0 : parseInt(dataValue);
      grid[i][j] = value;
      count++;
    }
  }
  return grid;
};

const goToLandingScreen: () => void = () => {
  setSudokuPlayState('loading');
  updateSudokuGameState({ timerOn: false });
  populateSudokuGame();
  setSudokuPlayState('ready');
};
const goToMenuScreen: () => void = () => {
  setSudokuPlayState('loading');
  updateSudokuGameState({ timerOn: false });
  setSudokuPlayState('menu');
};
const goToPlayScreen: () => void = () => {
  setSudokuPlayState('loading');
  setSudokuPlayState('playing');
  updateSudokuGameState({ timerOn: true });
};

const clearSudokuGridItemsClassNames: (classNames: string[]) => void = (className) => {
  const sudokuItems: HTMLCollectionOf<Element> = getSudokuGridItems();
  for (let i: number = 0; i < sudokuItems.length; i++) {
    for (let j: number = 0; j < className.length; j++) {
      sudokuItems[i].classList.remove(className[j]);
    }
  }
};
const clearSudokuUserInputItemsClassNames: (classNames: string[]) => void = (className) => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const sudokuItems: HTMLCollectionOf<Element> = sudokuContainer.getElementsByClassName('sudoku-values-item');
  for (let i: number = 0; i < sudokuItems.length; i++) {
    for (let j: number = 0; j < className.length; j++) {
      sudokuItems[i].classList.remove(className[j]);
    }
  }
};

const handleSudokuDifficultyChange: (event: Event) => void = (event) => {
  sudokuPreventDefault(event);
  const target: HTMLInputElement = (event.currentTarget as HTMLInputElement) || (event.target as HTMLInputElement);
  const inputValue: string | null = target.value;
  const value: number = inputValue === null ? 0 : parseInt(inputValue);
  updateSudokuGameState({ difficulty: value });
  populateSudokuDifficulty();
};
const handleSudokuGridItemMouseEnterExit: (event: Event, enterExit: enterExit) => void = (event, enterExit) => {
  sudokuPreventDefault(event);
  const target: HTMLElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
  const dataValue: string | null = target.getAttribute('data-value');
  const value: number = dataValue === null ? 0 : parseInt(dataValue);
  if (value === 0) {
    return;
  }
  const itemParentRow: HTMLElement = target.parentElement as HTMLElement;
  const itemColumnIndex: number = Array.prototype.indexOf.call(itemParentRow.children, target);
  const itemRowIndex: number = Array.prototype.indexOf.call(itemParentRow.parentElement?.children, itemParentRow);
  clearSudokuGridItemsClassNames(['error', 'hover']);
  handleHighlightSudokuColumn(itemColumnIndex, enterExit, value);
  handleHighlightSudokuRow(itemRowIndex, enterExit, value);
  handleHighlightSudokuGroup([itemColumnIndex, itemRowIndex], enterExit, value);
};
const handleSudokuGridSetItemOnClick: (event: Event) => void = (event) => {
  sudokuPreventDefault(event);
  const target: HTMLElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
  const dataValue: string | null = target.getAttribute('data-value');
  const value: number = dataValue === null ? 0 : parseInt(dataValue);
  if (value === 0) {
    return;
  }
  clearSudokuGridItemsClassNames(['highlight', 'error', 'hover']);
  handleHighlightAllSudokuItemsByIndex(value);
};
const handleSudokuGridSizeChange: (event: Event) => void = (event) => {
  sudokuPreventDefault(event);
  const target: HTMLInputElement = (event.currentTarget as HTMLInputElement) || (event.target as HTMLInputElement);
  const inputValue: string | null = target.value;
  const value: number = inputValue === null ? 0 : parseInt(inputValue);
  updateSudokuGameState({ gridSize: value, difficultyMax: Math.pow(value, 4) - 1, difficulty: Math.floor((Math.pow(value, 4) - 1) / 2) });
  populateSudokuGridSize();
  populateSudokuDifficulty();
};
const handleSudokuGridVariableItemOnClick: (event: Event) => void = (event) => {
  sudokuPreventDefault(event);
  const target: HTMLElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
  const dataValue: string | null = target.getAttribute('data-value');
  const value: number = dataValue === null ? 0 : parseInt(dataValue);
  const optionContainer: HTMLElement = target.getElementsByClassName('options')[0] as HTMLElement;
  const options: HTMLCollectionOf<Element> = target.getElementsByClassName('option') as HTMLCollectionOf<Element>;
  const content: HTMLElement = target.getElementsByClassName('content')[0] as HTMLElement;
  clearSudokuGridItemsClassNames(['highlight', 'error', 'hover']);
  content.classList.remove('active');
  if (value === sudokuGameState.activeValue) {
    target.setAttribute('data-value', '0');
    content.innerHTML = '';
    return;
  } else if (options.length === 0) {
    optionContainer.innerHTML = `<span class="option option-${sudokuGameState.activeValue}" data-value="${sudokuGameState.activeValue}">${sudokuGameState.activeValue}</span>`;
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

const resetCurrentSudoku: () => void = () => {
  setSudokuPlayState('loading');
  updateSudokuGameState({
    timer: '0:0',
    timeInSeconds: 0,
    sudokuState: sudokuGameState.puzzle,
    validationClicks: 0,
    timerOn: false,
  });
  populateSudokuGame();
  setSudokuPlayState('playing');
  updateSudokuGameState({ timerOn: true });
};
const solveCurrentSudoku: () => void = () => {
  setSudokuPlayState('loading');
  populateSudoku(sudokuGameState.grid);
  setSudokuPlayState('complete');
  updateSudokuGameState({ timerOn: false });
};
const validateCurrentSudoku: () => void = () => {
  setSudokuPlayState('loading');
  clearSudokuGridItemsClassNames(['highlight']);
  const validSudoku: boolean = getSudokuIsValid();
  updateSudokuGameState({ validationClicks: sudokuGameState.validationClicks + 1 });
  if (!validSudoku) {
    setSudokuPlayState('error');
  } else {
    updateSudokuGameState({ timerOn: false });
    setSudokuGameScore();
    sudokuGameStateRecord.push(sudokuGameState);
    setSudokuPlayState('complete');
  }
};
const startNewSudoku: () => void = () => {
  setSudokuPlayState('loading');
  updateSudokuGameState({ timerOn: false });
  updateSudokuGameState({
    seed: Math.floor(Math.random() * 1000),
    grid: generateSudoku(),
    timer: '0:0',
    timeInSeconds: 0,
    validationClicks: 0,
  });
  updateSudokuGameState({ puzzle: generateSudokuPuzzle(sudokuGameState.grid) });
  updateSudokuGameState({ sudokuState: sudokuGameState.puzzle });
  populateSudokuGame();
  goToPlayScreen();
};

const setSudokuActiveValue: (event: Event) => void = (event) => {
  sudokuPreventDefault(event);
  const target: HTMLElement = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
  const dataValue: string | null = target.getAttribute('data-value');
  const value: number = dataValue === null ? 0 : parseInt(dataValue);
  clearSudokuUserInputItemsClassNames(['set']);
  clearSudokuGridItemsClassNames(['highlight', 'error', 'hover']);
  updateSudokuGameState({ activeValue: value, sudokuState: getSudokuState() });
  target.classList.add('set');
};
const setSudokuGameScore: () => void = () => {
  var score: number = sudokuGameState.showErrors ? 2 : 1;
  score = sudokuGameState.validationClicks <= 1 ? 1 : sudokuGameState.validationClicks * score;
  score = sudokuGameState.timeInSeconds <= 1 ? 1 * score : sudokuGameState.timeInSeconds * score;
  score = (1000 * sudokuGameState.difficulty) / score;
  updateSudokuGameState({ gameScore: score });
};
const setSudokuPlayState: (state: PlayState) => void = (state) => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  sudokuContainer.classList.remove('error');
  sudokuContainer.classList.remove('complete');
  sudokuContainer.classList.remove('menu');
  sudokuContainer.classList.add('loading');
  updateSudokuGameState({ playState: state });
  switch (state) {
    case 'loading':
      return;
    case 'ready':
      sudokuContainer.classList.remove('playing');
      sudokuContainer.classList.add('ready');
      break;
    case 'playing':
      sudokuContainer.classList.remove('ready');
      sudokuContainer.classList.add('playing');
      break;
    case 'complete':
      sudokuContainer.classList.remove('playing');
      sudokuContainer.classList.remove('ready');
      sudokuContainer.classList.add('complete');
      break;
    case 'error':
      sudokuContainer.classList.add('error');
      setTimeout(() => {
        sudokuContainer.classList.remove('error');
      }, 3000);
      break;
    case 'menu':
      sudokuContainer.classList.add('menu');
      break;
    default:
      break;
  }
  sudokuContainer.classList.remove('loading');
};
const setSudokuShowErrors: () => void = () => {
  const sudokuContainer: HTMLElement = getSudokuContainer();
  const sudokuShowErrorsButton: HTMLElement = sudokuContainer.getElementsByClassName('sudoku-controls-button show-errors')[0] as HTMLElement;
  updateSudokuGameState({ showErrors: !sudokuGameState.showErrors });
  sudokuShowErrorsButton.innerHTML = `Show Errors: ${sudokuGameState.showErrors ? 'true' : 'false'}`;
  clearSudokuGridItemsClassNames(['error']);
};

// Initialise Game
initialiseSudokuGame();
