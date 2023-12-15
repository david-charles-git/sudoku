const populateSudoku: (sudoku: Grid) => void = (sudoku) => {
  const sudokuParent: HTMLElement = getSudokuParent();
  const sudokuGridContainer: Element = sudokuParent?.getElementsByClassName('sudoku-grid')[0] as Element;
  sudokuGridContainer.innerHTML = sudokuGrid(sudoku);
};

const populateSudokuContainer: () => void = () => {
  const sudokuParent: HTMLElement = getSudokuParent();
  sudokuParent.innerHTML = sudokuInner();
};

const populateSudokuControls: () => void = () => {
  const sudokuParent: HTMLElement = getSudokuParent();
  const sudokuControlsContainer: Element = sudokuParent?.getElementsByClassName('sudoku-controls')[0] as Element;
  sudokuControlsContainer.innerHTML = sudokuControls();
  populateSudokuUserInputs();
};

const populateSudokuDifficulty: () => void = () => {
  const sudokuParent: HTMLElement = getSudokuParent();
  const sudokuDifficultyContainer: Element = sudokuParent?.getElementsByClassName('sudoku-difficulty-title')[0] as Element;
  const sudokuDifficultyInput: HTMLCollectionOf<Element> = sudokuParent?.getElementsByClassName('sudoku-difficulty-input') as HTMLCollectionOf<Element>;
  for (let i: number = 0; i < sudokuDifficultyInput.length; i++) {
    const input: HTMLInputElement = sudokuDifficultyInput[i] as HTMLInputElement;
    input.value = sudokuGameState.difficulty.toString();
    input.max = sudokuGameState.difficultyMax.toString();
  }
  sudokuDifficultyContainer.innerHTML = sudokuDifficultyAsText();
};

const populateSudokuGame: () => void = () => {
  populateSudokuHeader();
  populateSudoku(sudokuGameState.puzzle);
  populateSudokuControls();
  populateSudokuDifficulty();
};

const populateSudokuGridSize: () => void = () => {
  const sudokuParent: HTMLElement = getSudokuParent();
  const sudokuGridSizeInput: HTMLCollectionOf<Element> = sudokuParent?.getElementsByClassName('sudoku-grid-size-input') as HTMLCollectionOf<Element>;
  for (let i: number = 0; i < sudokuGridSizeInput.length; i++) {
    const input: HTMLInputElement = sudokuGridSizeInput[i] as HTMLInputElement;
    input.value = sudokuGameState.gridSize.toString();
  }
};

const populateSudokuHeader: () => void = () => {
  const sudokuParent: HTMLElement = getSudokuParent();
  const sudokuHeaderContainer: Element = sudokuParent?.getElementsByClassName('sudoku-header')[0] as Element;
  sudokuHeaderContainer.innerHTML = sudokuHeader();
};

const populateSudokuUserInputs: () => void = () => {
  const sudokuParent: HTMLElement = getSudokuParent();
  const sudokuValuesContainer: Element = sudokuParent?.getElementsByClassName('sudoku-values')[0] as Element;
  sudokuValuesContainer.innerHTML = sudokuUserInputContainer();
};
