var sudokuGameStateRecord: GameState[] = [];
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

const getSudokuGameState: () => GameState = () => {
  return sudokuGameState;
};

const updateSudokuGameState: (state: GameStatePartial) => void = (state) => {
  sudokuGameState = { ...sudokuGameState, ...state };
};
