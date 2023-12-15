const getSudokuParent: () => HTMLElement = () => {
  const sudokuParent: HTMLElement = document.getElementById(sudokuGameState.containerID) as HTMLElement;
  return sudokuParent;
};
const getSudokuGridItems: () => HTMLCollectionOf<Element> = () => {
  const sudokuParent: HTMLElement = getSudokuParent();
  const sudokuItems: HTMLCollectionOf<Element> = sudokuParent.getElementsByClassName('sudoku-item');
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
  const sudokuParent: HTMLElement = getSudokuParent();
  const sudokuItems: HTMLCollectionOf<Element> = sudokuParent.getElementsByClassName('sudoku-values-item');
  for (let i: number = 0; i < sudokuItems.length; i++) {
    for (let j: number = 0; j < className.length; j++) {
      sudokuItems[i].classList.remove(className[j]);
    }
  }
};

const handleHighlightAllSudokuItemsByIndex: (itemIndex: number) => void = (itemIndex) => {
  const sudokuParent: HTMLElement = getSudokuParent();
  const itemRows: HTMLCollectionOf<Element> = sudokuParent?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
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
  const sudokuParent: HTMLElement = getSudokuParent();
  const itemRows: HTMLCollectionOf<Element> = sudokuParent?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
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
  const sudokuParent: HTMLElement = getSudokuParent();
  const itemRows: HTMLCollectionOf<Element> = sudokuParent?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
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
  const sudokuParent: HTMLElement = getSudokuParent();
  const itemRows: HTMLCollectionOf<Element> = sudokuParent?.getElementsByClassName('sudoku-row') as HTMLCollectionOf<Element>;
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
  const sudokuParent: HTMLElement = getSudokuParent();
  sudokuParent.classList.remove('error');
  sudokuParent.classList.remove('complete');
  sudokuParent.classList.remove('menu');
  sudokuParent.classList.add('loading');
  updateSudokuGameState({ playState: state });
  switch (state) {
    case 'loading':
      return;
    case 'ready':
      sudokuParent.classList.remove('playing');
      sudokuParent.classList.add('ready');
      break;
    case 'playing':
      sudokuParent.classList.remove('ready');
      sudokuParent.classList.add('playing');
      break;
    case 'complete':
      sudokuParent.classList.remove('playing');
      sudokuParent.classList.remove('ready');
      sudokuParent.classList.add('complete');
      break;
    case 'error':
      sudokuParent.classList.add('error');
      setTimeout(() => {
        sudokuParent.classList.remove('error');
      }, 3000);
      break;
    case 'menu':
      sudokuParent.classList.add('menu');
      break;
    default:
      break;
  }
  sudokuParent.classList.remove('loading');
};
const setSudokuShowErrors: () => void = () => {
  const sudokuParent: HTMLElement = getSudokuParent();
  const sudokuShowErrorsButton: HTMLElement = sudokuParent.getElementsByClassName('sudoku-controls-button show-errors')[0] as HTMLElement;
  updateSudokuGameState({ showErrors: !sudokuGameState.showErrors });
  sudokuShowErrorsButton.innerHTML = `Show Errors: ${sudokuGameState.showErrors ? 'true' : 'false'}`;
  clearSudokuGridItemsClassNames(['error']);
};
