class DoubleQLearning {
    constructor(gridSize = 5, numActions = 4, {
        epsilon = 1.0,
        epsilonDecay = 0.995,
        epsilonMin = 0.01,
        learningRate = 0.1
    } = {}) {
        this.gridSize = gridSize;
        this.numActions = numActions;

        this.QTable = new StateActionValueTable(gridSize, numActions);
        this.QTable2 = new StateActionValueTable(gridSize, numActions);

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
            if(Math.random>0.5){
                  return this.QTable.greedyAction(x, y); // Greedy
            }else{
                 return this.QTable2.greedyAction(x, y); // Greedy
            }
           
        }
    }

    // Update Q-table using all (s, a) in the episode toward the target return
    update(episodeHistory, discountRate) {
        for (let i = 0; i < episodeHistory.states.length; i++) {
            const x = episodeHistory.states[i][0];
            const y = episodeHistory.states[i][1];
            const action = episodeHistory.actions[i];
            let target;
            if(i<episodeHistory.states.length-1){
                const x2 = episodeHistory.states[i+1][0];
                const y2 = episodeHistory.states[i+1][1];
                if(Math.random()>0.5){
                    const action2 = this.QTable.greedyAction(x2,y2)
                    target = episodeHistory.rewards[i]+discountRate*this.QTable2.getValue(x2,y2,action2)
                    this.QTable.updateValue(x, y, action, target, this.learningRate);
                }else{
                    const action2 = this.QTable2.greedyAction(x2,y2)
                    target = episodeHistory.rewards[i]+discountRate*this.QTable.getValue(x2,y2,action2)
                    this.QTable2.updateValue(x, y, action, target, this.learningRate);
                }
            }else{
                target = episodeHistory.rewards[i]
                 if(Math.random()>0.5){
                    this.QTable.updateValue(x, y, action, target, this.learningRate);
                 }else{
                    this.QTable2.updateValue(x, y, action, target, this.learningRate);
                 }
             
                
            }
           
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
