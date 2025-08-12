class StateActionValueTable {
  constructor(gridSize = 5, numActions = 4) {
    this.gridSize = gridSize;
    this.numActions = numActions;

    // Initialize Q-table with zeros: shape [gridSize, gridSize, numActions]
    this.Q = torch.zeros([this.gridSize, this.gridSize, this.numActions]);
  }

  // Get Q value for state (x,y) and action
  getValue(x, y, action) {
    return this.Q.data[x][y][action];
  }

  // Update Q value for state (x,y) and action with learning rate alpha
  updateValue(x, y, action, target, alpha = 0.1) {
    const current = this.Q.data[x][y][action]
    const newValue = current + alpha * (target - current);
    this.Q.data[x][y][action] = newValue
  }

  // Always select greedy action
  greedyAction(x, y) {
    let bestAction = 0;
    let bestValue = this.getValue(x, y, 0);
    for (let a = 1; a < this.numActions; a++) {
      const val = this.getValue(x, y, a);
      if (val > bestValue) {
        bestValue = val;
        bestAction = a;
      }
    }
    return bestAction;
  }

  fill(value) {
    this.Q = torch.add(
        torch.zeros([this.gridSize, this.gridSize, this.numActions]),
        value
    );
  }
}
