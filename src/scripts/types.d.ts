type Grid = number[][];
type GroupIndex = [number, number];
type enterExit = 'enter' | 'exit';
type PlayState = 'loading' | 'ready' | 'playing' | 'complete' | 'error';
type GameState = {
  playState: PlayState;
  activeValue: number;
  showErrors: boolean;
  containerID: string;
  timerOn: boolean;
  difficulty: number;
  errorInterval: any;
  puzzle: Grid;
  seed: number;
  grid: Grid;
  timer: string;
};
