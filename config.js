const MOVING_AVERAGE_WINDOW = 10;

const DEFAULT_GRID_SIZE = 5;
const DEFAULT_MAX_STEPS = 30;
const DEFAULT_STEP_INTERVAL_MS = 1;
const DEFAULT_DISCOUNT_RATE = 0.90;
const DEFAULT_N_EPISODES = 100;

const DEFAULT_EPSILON_MIN = 0.01
const DEFAULT_EPSILON = 1.00;
const DEFAULT_EPSILON_DECAY = 0.995;
const DEFAULT_LEARNING_RATE = 0.1;

const CELL_SIZE_PX = 40;
const REWARD_GOAL = 10.0;
const REWARD_STEP = -1.0;
const REWARD_TRAP = -10.0;

// Actions: 0 = Up, 1 = Down, 2 = Left, 3 = Right
const ACTIONS = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

// Cell Labels & Colors
const AGENT_LABEL = 'A';
const GOAL_LABEL = 'G';
const TRAP_LABEL = 'T';

const AGENT_COLOR = '#8ecae6';
const GOAL_COLOR = '#90be6d';
const TRAP_COLOR = '#e63946';

// Default trap locations
const DEFAULT_TRAPS = [
  [1, 1],
  [2, 3],
  [3, 1]
];
