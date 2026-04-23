// Financial calculations library

const FUND_NAMES = [
  'JPMorgan Europe Dynamic A',
  'Allianz Global Sustainability AM',
  'Manulife Asia Pacific Bond A',
  'Fidelity China Focus SR-ACC',
  'Blackrock Next Generation Tech A2',
  'LionGlobal SGD Money Market A',
  'Schroder ISF Global Gold A',
  'Maybank Money Market A',
  'Franklin Templeton Investments',
  'AB Global High Yield A2'
];

// Parse prices from CSV data and convert to returns
function parseData(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  const prices = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      if (j === 0) {
        row.date = values[j];
      } else {
        row[`fund${j}`] = parseFloat(values[j]);
      }
    }
    prices.push(row);
  }
  
  return prices.reverse(); // Earliest date first
}

// Calculate daily returns
function calculateReturns(prices) {
  const n = prices.length;
  const returns = [];
  
  for (let i = 1; i < n; i++) {
    const dayReturns = {};
    for (let j = 1; j <= 10; j++) {
      const prev = prices[i - 1][`fund${j}`];
      const curr = prices[i][`fund${j}`];
      dayReturns[`fund${j}`] = (curr - prev) / prev;
    }
    returns.push(dayReturns);
  }
  
  return returns;
}

// Calculate mean return for each fund
function calculateMeanReturns(returns) {
  const meanReturns = {};
  const n = returns.length;
  
  for (let j = 1; j <= 10; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += returns[i][`fund${j}`];
    }
    meanReturns[`fund${j}`] = sum / n;
  }
  
  return meanReturns;
}

// Calculate variance and std dev
function calculateVarianceStdDev(returns) {
  const n = returns.length;
  const meanReturns = calculateMeanReturns(returns);
  const variances = {};
  const stdDevs = {};
  
  for (let j = 1; j <= 10; j++) {
    let sumSquaredDiff = 0;
    for (let i = 0; i < n; i++) {
      const diff = returns[i][`fund${j}`] - meanReturns[`fund${j}`];
      sumSquaredDiff += diff * diff;
    }
    variances[`fund${j}`] = sumSquaredDiff / n;
    stdDevs[`fund${j}`] = Math.sqrt(variances[`fund${j}`]);
  }
  
  return { variances, stdDevs };
}

// Calculate covariance matrix
function calculateCovarianceMatrix(returns) {
  const n = returns.length;
  const meanReturns = calculateMeanReturns(returns);
  const cov = {};
  
  for (let i = 1; i <= 10; i++) {
    cov[`fund${i}`] = {};
    for (let j = 1; j <= 10; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        const diffI = returns[k][`fund${i}`] - meanReturns[`fund${i}`];
        const diffJ = returns[k][`fund${j}`] - meanReturns[`fund${j}`];
        sum += diffI * diffJ;
      }
      cov[`fund${i}`][`fund${j}`] = sum / n;
    }
  }
  
  return cov;
}

// Calculate correlation matrix
function calculateCorrelationMatrix(returns) {
  const cov = calculateCovarianceMatrix(returns);
  const { stdDevs } = calculateVarianceStdDev(returns);
  const corr = {};
  
  for (let i = 1; i <= 10; i++) {
    corr[`fund${i}`] = {};
    for (let j = 1; j <= 10; j++) {
      corr[`fund${i}`][`fund${j}`] = 
        cov[`fund${i}`][`fund${j}`] / 
        (stdDevs[`fund${i}`] * stdDevs[`fund${j}`]);
    }
  }
  
  return corr;
}

// Generate random weights (normalized)
function generateRandomWeights(numFunds = 10, allowShorts = false) {
  const weights = [];
  let sum = 0;
  
  for (let i = 0; i < numFunds; i++) {
    let w;
    if (allowShorts) {
      w = Math.random() * 2 - 1; // -1 to 1
    } else {
      w = Math.random(); // 0 to 1
    }
    weights.push(w);
    sum += Math.abs(w);
  }
  
  // Normalize
  return weights.map(w => w / sum);
}

// Calculate portfolio return
function calculatePortfolioReturn(weights, meanReturns) {
  let portfolioReturn = 0;
  for (let i = 0; i < 10; i++) {
    portfolioReturn += weights[i] * meanReturns[`fund${i + 1}`];
  }
  return portfolioReturn;
}

// Calculate portfolio variance
function calculatePortfolioVariance(weights, covMatrix) {
  let variance = 0;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      variance += weights[i] * weights[j] * covMatrix[`fund${i + 1}`][`fund${j + 1}`];
    }
  }
  return variance;
}

// Run Monte Carlo simulation
function runMonteCarlo(returns, numSimulations = 10000, allowShorts = false) {
  const meanReturns = calculateMeanReturns(returns);
  const covMatrix = calculateCovarianceMatrix(returns);
  
  const portfolios = [];
  
  for (let i = 0; i < numSimulations; i++) {
    const weights = generateRandomWeights(10, allowShorts);
    const pReturn = calculatePortfolioReturn(weights, meanReturns);
    const pVariance = calculatePortfolioVariance(weights, covMatrix);
    const pStdDev = Math.sqrt(pVariance);
    
    portfolios.push({
      weights,
      return: pReturn,
      variance: pVariance,
      stdDev: pStdDev,
      sharpeRatio: pReturn / pStdDev // Assuming rf = 0
    });
  }
  
  return portfolios;
}

// Find Global Minimum Variance Portfolio (GMVP)
function findGMVP(portfolios) {
  let gmvp = portfolios[0];
  for (let i = 1; i < portfolios.length; i++) {
    if (portfolios[i].variance < gmvp.variance) {
      gmvp = portfolios[i];
    }
  }
  return gmvp;
}

// Extract efficient frontier (Pareto optimal portfolios)
function extractEfficientFrontier(portfolios) {
  if (portfolios.length === 0) return [];
  
  // Sort by risk (stdDev) ascending
  const sorted = [...portfolios].sort((a, b) => a.stdDev - b.stdDev);
  
  const frontier = [];
  let maxReturn = -Infinity;
  
  // For each risk level, only keep if return is better than any lower risk
  for (const p of sorted) {
    if (p.return > maxReturn) {
      frontier.push(p);
      maxReturn = p.return;
    }
  }
  
  // Thin the frontier to reduce visual clutter if too many points
  // Keep approximately 50-100 points for clean visualization
  if (frontier.length > 100) {
    const thinned = [];
    const step = Math.floor(frontier.length / 80);
    
    for (let i = 0; i < frontier.length; i += step) {
      thinned.push(frontier[i]);
    }
    
    // Always include the last point
    if (thinned[thinned.length - 1] !== frontier[frontier.length - 1]) {
      thinned.push(frontier[frontier.length - 1]);
    }
    
    return thinned;
  }
  
  return frontier;
}

// Optimize portfolio using utility function
function optimizePortfolio(returns, riskAversion, allowShorts = false) {
  const numSimulations = 50000;
  const portfolios = runMonteCarlo(returns, numSimulations, allowShorts);
  
  // Calculate utility for each portfolio: U = r - (A * sigma^2) / 2
  let optimalPortfolio = null;
  let maxUtility = -Infinity;
  
  for (const p of portfolios) {
    const utility = p.return - (riskAversion * p.variance) / 2;
    if (utility > maxUtility) {
      maxUtility = utility;
      optimalPortfolio = { ...p, utility };
    }
  }
  
  return optimalPortfolio;
}

export {
  FUND_NAMES,
  parseData,
  calculateReturns,
  calculateMeanReturns,
  calculateVarianceStdDev,
  calculateCovarianceMatrix,
  calculateCorrelationMatrix,
  generateRandomWeights,
  calculatePortfolioReturn,
  calculatePortfolioVariance,
  runMonteCarlo,
  findGMVP,
  extractEfficientFrontier,
  optimizePortfolio
};
