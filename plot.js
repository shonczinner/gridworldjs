function drawRewardPlot(ctx, data) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Increased bottom margin to avoid cutoff of "Episode"
  const marginLeft = 50;  // shift left margin a bit to make room for Y label
  const marginBottom = 40; // more bottom margin for X label
  const plotWidth = width - marginLeft - 10;
  const plotHeight = height - marginBottom - 10;

  // Find min/max reward for scaling
  const maxReward = Math.max(...data, 10); // At least 10 to avoid zero max
  const minReward = Math.min(...data, 0);

  // Draw axes
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;

  // Y axis line
  ctx.beginPath();
  ctx.moveTo(marginLeft, 10);
  ctx.lineTo(marginLeft, height - marginBottom);
  ctx.stroke();

  // X axis line
  ctx.beginPath();
  ctx.moveTo(marginLeft, height - marginBottom);
  ctx.lineTo(width - 10, height - marginBottom);
  ctx.stroke();

  // Number of ticks
  const yTicks = 5;
  const xTicks = Math.min(data.length, 10);

  ctx.fillStyle = '#000000';
  ctx.font = '12px Arial';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  // Draw Y ticks and labels
  for (let i = 0; i <= yTicks; i++) {
    const yValue = minReward + (i / yTicks) * (maxReward - minReward);
    const yPos = 10 + plotHeight - (i / yTicks) * plotHeight;

    // Tick mark
    ctx.beginPath();
    ctx.moveTo(marginLeft - 5, yPos);
    ctx.lineTo(marginLeft, yPos);
    ctx.stroke();

    // Label
    ctx.fillText(yValue.toFixed(1), marginLeft - 8, yPos);
  }

  // Draw X ticks and labels
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (let i = 0; i < xTicks; i++) {
    const dataIndex = Math.floor((i / (xTicks - 1 || 1)) * (data.length - 1));
    const xPos = marginLeft + (dataIndex / (data.length - 1 || 1)) * plotWidth;

    // Tick mark
    ctx.beginPath();
    ctx.moveTo(xPos, height - marginBottom);
    ctx.lineTo(xPos, height - marginBottom + 5);
    ctx.stroke();

    // Label (episode number)
    ctx.fillText(dataIndex + 1, xPos, height - marginBottom + 7);
  }

  // Draw reward line plot
  ctx.beginPath();
  ctx.strokeStyle = '#007acc';
  ctx.lineWidth = 2;

  for (let i = 0; i < data.length; i++) {
    const x = marginLeft + (i / (data.length - 1 || 1)) * plotWidth;
    const y = 10 + plotHeight - ((data[i] - minReward) / (maxReward - minReward)) * plotHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();

  // Axis labels
  ctx.fillStyle = '#000000';

  // X label - shift downward so not cutoff
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Episode', marginLeft + plotWidth / 2, height - marginBottom + 15);

  // Y label - shift left and vertically center better
  ctx.save();
  ctx.translate(15, 10 + plotHeight / 2); // moved from 12 to 15 (more left)
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle'; // changed from 0 to 'middle' for better centering
  ctx.fillText('Reward (Moving Avg)', 0, 0);
  ctx.restore();
}

function updatePlot(data, windowSize,ctx) {
      const movingAvg = computeMovingAverage(data, windowSize);
      drawRewardPlot(ctx, movingAvg);
}

function computeMovingAverage(data, windowSize) {
    const averages = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - windowSize + 1);
        const subset = data.slice(start, i + 1);
        const avg = subset.reduce((a, b) => a + b, 0) / subset.length;
        averages.push(avg);
    }
    return averages;
}
