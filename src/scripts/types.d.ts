type Grid = number[][];
type GridIndex = [number, number];
type enterExit = 'enter' | 'exit';
type PlayState = 'loading' | 'ready' | 'playing' | 'complete' | 'error' | 'menu';
type GameState = {
  grid: Grid;
  puzzle: Grid;
  seed: number;
  timer: string;
  gridSize: number;
  timerOn: boolean;
  sudokuState: Grid;
  gameScore: number;
  errorInterval: any;
  difficulty: number;
  activeValue: number;
  showErrors: boolean;
  containerID: string;
  playState: PlayState;
  timeInSeconds: number;
  difficultyMax: number;
  validationClicks: number;
};
type GameStatePartial = {
  [key: string]: any;
};
