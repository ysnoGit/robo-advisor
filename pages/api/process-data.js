import fs from 'fs';
import path from 'path';
import {
  parseData,
  calculateReturns,
  calculateMeanReturns,
  calculateVarianceStdDev,
  calculateCovarianceMatrix,
  calculateCorrelationMatrix,
  runMonteCarlo,
  findGMVP,
  extractEfficientFrontier,
  optimizePortfolio,
  FUND_NAMES
} from '../../lib/calculations';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, riskAversion } = req.body;
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'raw_fund_data.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse data
    const prices = parseData(csvContent);
    const returns = calculateReturns(prices);
    
    if (action === 'statistics') {
      const meanReturns = calculateMeanReturns(returns);
      const { variances, stdDevs } = calculateVarianceStdDev(returns);
      const covMatrix = calculateCovarianceMatrix(returns);
      const corrMatrix = calculateCorrelationMatrix(returns);
      
      // Format for response
      const stats = {
        meanReturns: {},
        variances: {},
        stdDevs: {},
        covarianceMatrix: {},
        correlationMatrix: {}
      };
      
      for (let i = 1; i <= 10; i++) {
        stats.meanReturns[i] = meanReturns[`fund${i}`];
        stats.variances[i] = variances[`fund${i}`];
        stats.stdDevs[i] = stdDevs[`fund${i}`];
      }
      
      for (let i = 1; i <= 10; i++) {
        stats.covarianceMatrix[i] = {};
        stats.correlationMatrix[i] = {};
        for (let j = 1; j <= 10; j++) {
          stats.covarianceMatrix[i][j] = covMatrix[`fund${i}`][`fund${j}`];
          stats.correlationMatrix[i][j] = corrMatrix[`fund${i}`][`fund${j}`];
        }
      }
      
      return res.status(200).json(stats);
    }
    
    if (action === 'efficient-frontier') {
      const { allowShorts } = req.body;
      const portfolios = runMonteCarlo(returns, 10000, allowShorts);
      const gmvp = findGMVP(portfolios);
      const frontier = extractEfficientFrontier(portfolios);
      
      return res.status(200).json({
        portfolios,
        gmvp,
        frontier,
        fundNames: FUND_NAMES
      });
    }
    
    if (action === 'optimize-portfolio') {
      const portfolio = optimizePortfolio(returns, riskAversion);
      
      return res.status(200).json({
        portfolio,
        fundNames: FUND_NAMES
      });
    }
    
    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
