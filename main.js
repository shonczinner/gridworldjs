const canvas = document.getElementById('rewardPlot');
const ctx = canvas.getContext('2d');
const container = document.getElementById('gridContainer');
const status = document.getElementById('status');

const episodesInput = document.getElementById('episodesInput');
const delayInput = document.getElementById('delayInput');
const epsilonInput = document.getElementById('epsilonInput');
const epsilonDecayInput = document.getElementById('epsilonDecayInput');
const discountRateInput = document.getElementById('discountRateInput');
const learningRateInput = document.getElementById('learningRateInput');

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');

const qValueInput = document.getElementById('qValueInput');
const setQValuesButton = document.getElementById('setQValuesButton');

const agentSelect = document.getElementById('agentSelect');


let nEpisodes =  DEFAULT_N_EPISODES;
let stepDelay =  DEFAULT_STEP_INTERVAL_MS;
let discountRate = DEFAULT_DISCOUNT_RATE;
let learningRate = DEFAULT_LEARNING_RATE;
let epsilon = DEFAULT_EPSILON;
let epsilonDecay = DEFAULT_EPSILON_DECAY;

let env = new GridWorld(DEFAULT_GRID_SIZE);



function createAgent() {
    const type = agentSelect.value;
    const params = {
        epsilon,
        epsilonDecay,
        epsilonMin: DEFAULT_EPSILON_MIN,
        learningRate
    };

    if (type === 'sarsa') {
        return new SARSA(DEFAULT_GRID_SIZE, 4, params);
    } else if(type==='qlearning') {
        return new QLearning(DEFAULT_GRID_SIZE, 4, params);
    }else if(type==='doubleqlearning'){
        return new DoubleQLearning(DEFAULT_GRID_SIZE, 4, params);
    }else{
        return new MonteCarlo(DEFAULT_GRID_SIZE, 4, params);
    }


}

let agent = createAgent();

env.draw(agent.QTable,container)



let simulator = new GridWorldSimulator({
        env,
        agent,
        onStep:()=>{
                env.draw(agent.QTable,container)
        },
        onProgress: (ep, reward, epsilon,rewardHistory,history) => {
            console.log(`Progress: ${ep} / ${nEpisodes}`);
            status.innerHTML = `Progress: ${ep} / ${nEpisodes}, Reward: ${reward}`;
            updatePlot(rewardHistory,MOVING_AVERAGE_WINDOW,ctx);
            agent.update(history,discountRate);
            env.reset();
            env.draw(agent.QTable,container);
            epsilonInput.value = epsilon;
        },
        onFinish: () => {
            setControlsDisabled(false);
        }
    });


function setControlsDisabled(disabled) {
    episodesInput.disabled = disabled;
    delayInput.disabled = disabled;
    epsilonInput.disabled = disabled;
    epsilonDecayInput.disabled = disabled;
    discountRateInput.disabled = disabled;
    learningRateInput.disabled = disabled;
    startButton.disabled = disabled;
    stopButton.disabled = !disabled;
}


startButton.addEventListener('click', () => {
    nEpisodes = parseInt(episodesInput.value) || DEFAULT_N_EPISODES;
    stepDelay = parseInt(delayInput.value) || DEFAULT_STEP_INTERVAL_MS;
    discountRate = parseFloat(discountRateInput.value) || DEFAULT_DISCOUNT_RATE;

    epsilon = parseFloat(epsilonInput.value) || DEFAULT_EPSILON;
    epsilonDecay = parseFloat(epsilonDecayInput.value) || DEFAULT_EPSILON_DECAY;
    learningRate = parseFloat(learningRateInput.value) || DEFAULT_LEARNING_RATE;

    agent.resetConfig({ epsilon, epsilonDecay, learningRate });


    if (simulator && simulator.isRunning) {
        simulator.stop();  // ensure clean restart
    }

    setControlsDisabled(true);
    simulator.start(DEFAULT_MAX_STEPS,nEpisodes,stepDelay);
});

stopButton.addEventListener('click', () => {
    if (simulator && simulator.isRunning) {
        simulator.stop();
        setControlsDisabled(false);
    }
});


function reset(){
  // Stop simulator if it's running
    if (simulator && simulator.isRunning) {
        simulator.stop();
    }

    // Recreate environment and agent
    env = new GridWorld(DEFAULT_GRID_SIZE);
    agent = createAgent();

    // Redraw environment
    env.draw(agent.QTable, container);

    // Reset plot
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset status text
    status.innerHTML = "Environment reset.";

    epsilonInput.value = DEFAULT_EPSILON;
    epsilonDecayInput.value = DEFAULT_EPSILON_DECAY;
    discountRateInput.value = DEFAULT_DISCOUNT_RATE;
    learningRateInput.value = DEFAULT_LEARNING_RATE;

    // Create a fresh simulator
    simulator = new GridWorldSimulator({
        env,
        agent,
        onStep: () => {
            env.draw(agent.QTable, container);
        },
        onProgress: (ep, reward, epsilon, rewardHistory, history) => {
            console.log(`Progress: ${ep} / ${nEpisodes}`);
            status.innerHTML = `Progress: ${ep} / ${nEpisodes}, Reward: ${reward}`;
            updatePlot(rewardHistory, MOVING_AVERAGE_WINDOW, ctx);
            agent.update(history, discountRate);
            env.reset();
            env.draw(agent.QTable, container);
            epsilonInput.value = epsilon;
        },
        onFinish: () => {
            setControlsDisabled(false);
        }
    });

    // Re-enable controls
    setControlsDisabled(false);
}

resetButton.addEventListener('click', () => {
  reset();
});


setQValuesButton.addEventListener('click', () => {
    const val = parseFloat(qValueInput.value);
    if (!isNaN(val)) {
        // Update all Q-values in place
        if (agent && agent.QTable && typeof agent.QTable.fill === 'function') {
            agent.QTable.fill(val);
            env.draw(agent.QTable, container); // refresh grid display
            status.innerHTML = `All Q-values set to ${val}`;
        } else {
            console.warn("Agent's Q-table does not have a fill method.");
        }
    } else {
        console.warn("Invalid Q value entered.");
    }
}); 

agentSelect.addEventListener('change', () => {
    reset();
    agent = createAgent();
    env.draw(agent.QTable, container);
    status.innerHTML = `Agent switched to ${agentSelect.value}`;
});

reset();