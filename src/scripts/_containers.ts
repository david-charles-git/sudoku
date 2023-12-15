const sudokuUserInputContainer: () => string = () => {
  var userInputContainer: string = '';
  for (let i: number = 1; i < Math.pow(sudokuGameState.gridSize, 2) + 1; i++) {
    userInputContainer += sudokuUserInput(i);
  }
  return userInputContainer;
};
const sudokuUserInput: (value: number) => string = (value) => {
  return `<div class="sudoku-values-item" data-value="${value}" onclick="setSudokuActiveValue(event)"><p>${value}</p></div>`;
};
const sudokuHeader: () => string = () => {
  return `
    <p class="sudoku-title">Sudoku</p>
    <p class="sudoku-difficulty-title"></p>
    <div class="sudoku-timer">
      <p>${sudokuGameState.timer}</p>
    </div>
  `;
};
const sudokuControls: () => string = () => {
  return `
    <div class="sudoku-values"></div>
    <button class="sudoku-controls-button new" onclick="goToLandingScreen()">New Game</button>
    <button class="sudoku-controls-button validate" onclick="validateCurrentSudoku()">Validate</button>
    <button class="sudoku-controls-button menu" onclick="goToMenuScreen()">Menu</button>
  `;
};
const sudokuMenu: () => string = () => {
  return `
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
  `;
};
const sudokuReady: () => string = () => {
  return `
    <div class="ready-container">
      <div class="background"></div>
      <div class="content">
        <p class="sudoku-title">Project-9 - Sudoku</p>
        <p>Click on a number to select it, then click on a variable cell once to add it to the cell list, again to set the value, and a third time to remove it from the cell list and remove value.</p> 
        <button class="sudoku-controls-button start" onclick="startNewSudoku()">Start</button>
        <button class="sudoku-controls-button menu" onclick="goToMenuScreen()">Menu</button>
      </div>
    </div>
  `;
};
const sudokuError: () => string = () => {
  return `
    <div class="error-container">
      <div class="background"></div>
      <div class="content">
      </div>
    </div>
  `;
};
const sudokuComplete: () => string = () => {
  return `
    <div class="complete-container">
      <div class="background"></div>
      <div class="content">
      </div>
    </div>
  `;
};
const sudokuLoading: () => string = () => {
  return `
    <div class="loading-container">
      <div class="background"></div>
      <div class="content">
        <p>Loading</p>
      </div>
    </div>
  `;
};
const sudokuContainer: () => string = () => {
  return `
    <div class="sudoku-container">
      <div class="sudoku-header"></div>
      <div class="sudoku-grid"></div>
      <div class="sudoku-controls"></div>
    </div>
  `;
};
const sudokuInner: () => string = () => {
  var sudokuInner: string = '<div class="inner">';
  sudokuInner += sudokuMenu();
  sudokuInner += sudokuReady();
  sudokuInner += sudokuError();
  sudokuInner += sudokuComplete();
  sudokuInner += sudokuLoading();
  sudokuInner += sudokuContainer();
  sudokuInner += '</div>';
  return sudokuInner;
};
const sudokuGrid: (grid: Grid) => string = (grid) => {
  var sudokuGrid: string = '';
  for (var a: number = 0; a < grid.length; a++) {
    sudokuGrid += `<div class="sudoku-row row-${sudokuGameState.gridSize}">`;
    for (var b: number = 0; b < grid[a].length; b++) {
      sudokuGrid += sudokuItem(grid[a][b]);
    }
    sudokuGrid += '</div>';
  }
  return sudokuGrid;
};
const sudokuItem: (value: number) => string = (value) => {
  const dataValue: number = value === 0 ? 0 : value;
  const content: string = value === 0 ? '' : `<p>${value}</p>`;
  const className: string = value === 0 ? 'sudoku-item' : 'sudoku-item set';
  const functionString: string = value === 0 ? 'handleSudokuGridVariableItemOnClick(event)' : 'handleSudokuGridSetItemOnClick(event)';
  return `<div class="${className}" data-value="${dataValue}" onclick="${functionString}" onmouseenter="handleSudokuGridItemMouseEnterExit(event, 'enter')" onmouseleave="handleSudokuGridItemMouseEnterExit(event, 'exit')"><div class="options"></div><div class="content">${content}</div></div>`;
};
const sudokuDifficultyAsText: () => string = () => {
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
