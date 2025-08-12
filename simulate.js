class GridWorldSimulator {
    constructor({ env, agent, onStep, onProgress, onFinish }) {
        this.env = env;
        this.agent = agent;
        this.onStep = onStep || (() => {});
        this.onProgress = onProgress || (() => {});
        this.onFinish = onFinish || (() => {});
        this.isRunning = false;
        this.rewardHistory = [];
    }

    async start(maxSteps,nEpisodes,stepDelay=100) {
        this.isRunning = true;


        for (let episode = 0; episode < nEpisodes; episode++) {
            if (!this.isRunning) {
                console.log('Simulation stopped.');
                break;
            }

            const history = await this.runEpisode(stepDelay, maxSteps);
            const totalReward = history.rewards.reduce((a, b) => a + b, 0);
            this.rewardHistory.push(totalReward);
            console.log(`Episode ${episode + 1} finished. Total Reward = ${totalReward}`);

           
            this.onProgress(episode + 1, totalReward,this.agent.epsilon.toPrecision(4),this.rewardHistory,history);
        }

        this.isRunning = false;
        this.onFinish();  // 🔔 Notify simulation finished
    }

    stop() {
        this.isRunning = false;
    }

    async runEpisode(delay, maxSteps) {
        const episodeHistory = {
            states: [],
            actions: [],
            rewards: [],
            finalState: null,
        };

        let obs = this.env.reset();
        let done = false;

        for (let step = 0; step < maxSteps; step++) {
            const action = this.agent.selectAction(obs[0], obs[1], true);

            episodeHistory.states.push(obs);
            episodeHistory.actions.push(action);

            const result = this.env.step(action);

            this.onStep();

            episodeHistory.rewards.push(result.reward);

            obs = result.observation;
            done = result.done;

            if (done) {
                episodeHistory.finalState = obs;
                break;
            }

            await this.sleep(delay);
        }

        return episodeHistory;
    }



    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
