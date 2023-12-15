const initialiseSudokuGame: () => void = () => {
  const sudokuParent: HTMLElement = getSudokuParent();
  if (sudokuParent === null) {
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
    const sudokuTimer: HTMLElement = sudokuParent.getElementsByClassName('sudoku-timer')[0] as HTMLElement;
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
