

class MonteCarlo {
    constructor(gridSize = 5, numActions = 4, {
        epsilon = 1.0,
        epsilonDecay = 0.995,
        epsilonMin = 0.01,
        learningRate = 0.1
    } = {}) {
        this.gridSize = gridSize;
        this.numActions = numActions;

        this.QTable = new StateActionValueTable(gridSize, numActions);

        this.epsilon = epsilon;
        this.epsilonDecay = epsilonDecay;
        this.epsilonMin = epsilonMin;
        this.learningRate = learningRate;
    }

    // Epsilon-greedy action selection
    selectAction(x, y, random = true) {
        if (random && Math.random() < this.epsilon) {
            return Math.floor(Math.random() * this.numActions); // Random
        } else {
            return this.QTable.greedyAction(x, y); // Greedy
        }
    }

    // Update Q-table using all (s, a) in the episode toward the target return
    update(episodeHistory, discountRate) {
        const targets = computeReturns(episodeHistory.rewards, discountRate);

        for (let i = 0; i < episodeHistory.states.length; i++) {
            const x = episodeHistory.states[i][0];
            const y = episodeHistory.states[i][1];
            const action = episodeHistory.actions[i];
            this.QTable.updateValue(x, y, action, targets[i], this.learningRate);
        }
        this.decayEpsilon();
    }

    // Anneal epsilon after each episode
    decayEpsilon() {
        this.epsilon = Math.max(this.epsilonMin, this.epsilon * this.epsilonDecay);
    }

    // ✅ Dynamically update config values
    resetConfig(config = {}) {
        if (config.epsilon !== undefined) this.epsilon = config.epsilon;
        if (config.epsilonDecay !== undefined) this.epsilonDecay = config.epsilonDecay;
        if (config.epsilonMin !== undefined) this.epsilonMin = config.epsilonMin;
        if (config.learningRate !== undefined) this.learningRate = config.learningRate;
    }
}
