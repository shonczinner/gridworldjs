class GridWorldSimulator {
    constructor({ env, agent, onStep, onProgress, onFinish }) {
        this.env = env;
        this.agent = agent;
        this.onStep = onStep || (() => {});
        this.onProgress = onProgress || (() => {});
        this.onFinish = onFinish || (() => {});
        this.isRunning = false;
        this.rewardHistory = [];
        this.runId = 0; // unique ID for each run
    }

    async start(maxSteps, nEpisodes, stepDelay = 100) {
        this.isRunning = true;
        this.runId++;
        const myRunId = this.runId;

        for (let episode = 0; episode < nEpisodes; episode++) {
            if (!this.isRunning || myRunId !== this.runId) break;

            const history = await this.runEpisode(stepDelay, maxSteps, myRunId);
            if (!this.isRunning || myRunId !== this.runId) break;

            const totalReward = history.rewards.reduce((a, b) => a + b, 0);
            this.rewardHistory.push(totalReward);

            this.onProgress(
                episode + 1,
                totalReward,
                this.agent.epsilon.toPrecision(4),
                this.rewardHistory,
                history
            );
        }

        if (myRunId === this.runId) {
            this.isRunning = false;
            this.onFinish();
        }
    }

    stop() {
        this.isRunning = false;
        this.runId++; // invalidate any pending async work
    }

    async runEpisode(delay, maxSteps, myRunId) {
        const episodeHistory = {
            states: [],
            actions: [],
            rewards: [],
            finalState: null,
        };

        let obs = this.env.reset();
        let done = false;

        for (let step = 0; step < maxSteps; step++) {
            if (!this.isRunning || myRunId !== this.runId) break;

            const action = this.agent.selectAction(obs[0], obs[1], true);

            episodeHistory.states.push(obs);
            episodeHistory.actions.push(action);

            const result = this.env.step(action);

            if (!this.isRunning || myRunId !== this.runId) break;
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
