function computeReturns(rewards, discountRate) {
    const returns = [];
    let G = 0;
    for (let t = rewards.length - 1; t >= 0; t--) {
        G = rewards[t] + discountRate * G;
        returns[t] = G;
    }
    return returns;
}