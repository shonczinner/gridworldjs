class GridWorld {
  constructor(size = DEFAULT_GRID_SIZE, traps = DEFAULT_TRAPS) {
    this.size = size;
    this.trapPositions = traps;
    this.reset();
  }

  reset() {
    this.agentPos = [0,0];
    this.goalPos = [this.size - 1, this.size - 1];
    return this._getObservation();
  }

    _getObservation() {
        return this.agentPos;
    }


  _isGoal(pos) {
    return pos[0] === this.goalPos[0] && pos[1] === this.goalPos[1];
  }

  _isTrap(pos) {
    return this.trapPositions.some(([tx, ty]) => tx === pos[0] && ty === pos[1]);
  }

  step(action) {
    let [x, y] = this.agentPos;

    if (action === ACTIONS.UP && x > 0) x -= 1;
    else if (action === ACTIONS.DOWN && x < this.size - 1) x += 1;
    else if (action === ACTIONS.LEFT && y > 0) y -= 1;
    else if (action === ACTIONS.RIGHT && y < this.size - 1) y += 1;

    this.agentPos = [x, y];

    const done = this._isGoal(this.agentPos) || this._isTrap(this.agentPos);
    let reward = REWARD_STEP;

    if (this._isGoal(this.agentPos)) {
      reward = REWARD_GOAL;
    } else if (this._isTrap(this.agentPos)) {
      reward = REWARD_TRAP;
    }

    return {
      observation: this._getObservation(),
      reward: reward,
      done: done,
      info: {}
    };
  }

  render() {
    const grid = Array(this.size).fill(null).map(() =>
      Array(this.size).fill('.')
    );

    const [gx, gy] = this.goalPos;
    const [ax, ay] = this.agentPos;

    grid[gx][gy] = GOAL_LABEL;
    grid[ax][ay] = AGENT_LABEL;

    this.trapPositions.forEach(([tx, ty]) => {
      grid[tx][ty] = TRAP_LABEL;
    });

    console.clear();
    console.log('GridWorld:');
    grid.forEach(row => console.log(row.join(' ')));
  }

  sampleAction() {
    return Math.floor(Math.random() * Object.keys(ACTIONS).length);
  }

  draw(qTable = null, container = null) {
    const arrowMap = ['↑', '↓', '←', '→'];  // Actions
    const createEnvTable = () => {
      const table = document.createElement('table');
      table.style.borderCollapse = 'collapse';
      table.style.marginTop = '10px';

      for (let i = 0; i < this.size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < this.size; j++) {
          const cell = document.createElement('td');
          cell.style.width = `${CELL_SIZE_PX}px`;
          cell.style.height = `${CELL_SIZE_PX}px`;
          cell.style.textAlign = 'center';
          cell.style.border = '1px solid black';
          cell.style.fontWeight = 'bold';
          cell.style.fontSize = '14px';

          // Agent
          if (this.agentPos[0] === i && this.agentPos[1] === j) {
            cell.textContent = AGENT_LABEL;
            cell.style.backgroundColor = AGENT_COLOR;

          // Goal
          } else if (this.goalPos[0] === i && this.goalPos[1] === j) {
            cell.textContent = GOAL_LABEL;
            cell.style.backgroundColor = GOAL_COLOR;

          // Trap
          } else if (this._isTrap([i, j])) {
            cell.textContent = TRAP_LABEL;
            cell.style.backgroundColor = TRAP_COLOR;

          // Empty with best action
          } else if (qTable) {
            let bestAction = 0;
            let bestValue = qTable.getValue(i, j, 0);
            for (let a = 1; a < 4; a++) {
              const val = qTable.getValue(i, j, a);
              if (val > bestValue) {
                bestValue = val;
                bestAction = a;
              }
            }
            const arrowElem = document.createElement('div');
            arrowElem.textContent = arrowMap[bestAction];
            arrowElem.style.fontSize = '16px';

            const valueElem = document.createElement('div');
            valueElem.textContent = bestValue.toFixed(1);
            valueElem.style.fontSize = '12px';

            cell.appendChild(arrowElem);
            cell.appendChild(valueElem);
          }

          row.appendChild(cell);
        }
        table.appendChild(row);
      }
      return table;
    };

    const createQTable = () => {
      const table = document.createElement('table');
      table.style.borderCollapse = 'collapse';
      table.style.marginTop = '10px';
      table.style.marginLeft = '20px';

      for (let i = 0; i < this.size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < this.size; j++) {
          const cell = document.createElement('td');
          cell.style.width = `${CELL_SIZE_PX * 1.5}px`;
          cell.style.height = `${CELL_SIZE_PX * 1.5}px`;
          cell.style.border = '1px solid black';
          cell.style.fontSize = '10px';
          cell.style.whiteSpace = 'pre-line';
          cell.style.textAlign = 'center';

          if (qTable) {
            let qStr = arrowMap.map((arrow, a) => 
              `${arrow}: ${qTable.getValue(i, j, a).toFixed(2)}`
            ).join('\n');
            cell.textContent = qStr;
          }

          row.appendChild(cell);
        }
        table.appendChild(row);
      }
      return table;
    };

    // Build both tables
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'flex-start';
    wrapper.appendChild(createEnvTable());
    if (qTable) wrapper.appendChild(createQTable());

    if (container) {
      container.innerHTML = '';
      container.appendChild(wrapper);
      return;
    }

    return wrapper;
  }

}
