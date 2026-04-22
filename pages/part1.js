import { useState } from 'react';
import Navigation from '../components/Navigation';
import PortfolioChart from '../components/PortfolioChart';

const FUND_NAMES = [
  'JPMorgan Europe Dynamic A',
  'Allianz Global Sustainability',
  'Manulife Asia Pacific Bond',
  'Fidelity China Focus',
  'Blackrock Next Gen Tech',
  'LionGlobal SGD Money Market',
  'Schroder ISF Global Gold',
  'Maybank Money Market',
  'Franklin Templeton',
  'AB Global High Yield'
];

export default function Part1() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('without-shorts');
  
  // Data states for "without shorts"
  const [portfoliosWithoutShorts, setPortfoliosWithoutShorts] = useState(null);
  const [gmvpWithoutShorts, setGmvpWithoutShorts] = useState(null);
  const [frontierWithoutShorts, setFrontierWithoutShorts] = useState(null);
  const [statsWithoutShorts, setStatsWithoutShorts] = useState(null);
  
  // Data states for "with shorts"
  const [portfoliosWithShorts, setPortfoliosWithShorts] = useState(null);
  const [gmvpWithShorts, setGmvpWithShorts] = useState(null);
  const [frontierWithShorts, setFrontierWithShorts] = useState(null);
  const [statsWithShorts, setStatsWithShorts] = useState(null);

  const runSimulation = async (allowShorts) => {
    setLoading(true);
    setError(null);

    try {
      // Get statistics first
      const statsRes = await fetch('/api/process-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'statistics' })
      });
      const stats = await statsRes.json();

      // Get efficient frontier
      const efRes = await fetch('/api/process-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'efficient-frontier', allowShorts })
      });
      const efData = await efRes.json();

      if (allowShorts) {
        setStatsWithShorts(stats);
        setPortfoliosWithShorts(efData.portfolios);
        setGmvpWithShorts(efData.gmvp);
        setFrontierWithShorts(efData.frontier);
        setActiveTab('with-shorts');
      } else {
        setStatsWithoutShorts(stats);
        setPortfoliosWithoutShorts(efData.portfolios);
        setGmvpWithoutShorts(efData.gmvp);
        setFrontierWithoutShorts(efData.frontier);
        setActiveTab('without-shorts');
      }
    } catch (err) {
      setError(`Error running simulation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStatistics = (stats) => {
    if (!stats) return null;

    return (
      <div className="card">
        <h3>Summary Statistics</h3>
        
        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.8rem' }}>Mean Returns (Annual)</h4>
        <table>
          <thead>
            <tr>
              <th>Fund</th>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i}>Fund {i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mean Return</td>
              {[1, 2, 3, 4, 5].map((i) => (
                <td key={i}>{(stats.meanReturns[i] * 100).toFixed(2)}%</td>
              ))}
            </tr>
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th>Fund</th>
              {[6, 7, 8, 9, 10].map((i) => (
                <th key={i}>Fund {i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mean Return</td>
              {[6, 7, 8, 9, 10].map((i) => (
                <td key={i}>{(stats.meanReturns[i] * 100).toFixed(2)}%</td>
              ))}
            </tr>
          </tbody>
        </table>

        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.8rem' }}>Standard Deviations</h4>
        <table>
          <thead>
            <tr>
              <th>Fund</th>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i}>Fund {i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Std Dev</td>
              {[1, 2, 3, 4, 5].map((i) => (
                <td key={i}>{(stats.stdDevs[i] * 100).toFixed(2)}%</td>
              ))}
            </tr>
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th>Fund</th>
              {[6, 7, 8, 9, 10].map((i) => (
                <th key={i}>Fund {i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Std Dev</td>
              {[6, 7, 8, 9, 10].map((i) => (
                <td key={i}>{(stats.stdDevs[i] * 100).toFixed(2)}%</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderGMVPDetails = (gmvp) => {
    if (!gmvp) return null;

    return (
      <div className="card">
        <h3>Global Minimum Variance Portfolio (GMVP)</h3>
        <p>
          The GMVP is the portfolio with the lowest possible risk. It represents the minimum
          volatility you can achieve across all possible allocations.
        </p>
        
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Expected Return</td>
              <td><strong>{(gmvp.return * 100).toFixed(2)}%</strong></td>
            </tr>
            <tr>
              <td>Standard Deviation (Risk)</td>
              <td><strong>{(gmvp.stdDev * 100).toFixed(2)}%</strong></td>
            </tr>
            <tr>
              <td>Variance</td>
              <td>{(gmvp.variance * 10000).toFixed(4)}</td>
            </tr>
            <tr>
              <td>Sharpe Ratio (rf=0)</td>
              <td>{gmvp.sharpeRatio.toFixed(4)}</td>
            </tr>
          </tbody>
        </table>

        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.8rem' }}>Recommended Weights</h4>
        <table>
          <thead>
            <tr>
              <th>Fund</th>
              <th>Weight</th>
              <th>Fund</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4].map((i) => (
              <tr key={i}>
                <td>{FUND_NAMES[i]}</td>
                <td><strong>{(gmvp.weights[i] * 100).toFixed(2)}%</strong></td>
                <td>{FUND_NAMES[i + 5]}</td>
                <td><strong>{(gmvp.weights[i + 5] * 100).toFixed(2)}%</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFrontierChart = (portfolios, gmvp, frontier) => {
    if (!portfolios) return null;

    return (
      <div className="card">
        <h3>Efficient Frontier Chart</h3>
        <PortfolioChart portfolios={portfolios} gmvp={gmvp} frontier={frontier} />
      </div>
    );
  };

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="card">
          <h1>📊 Efficient Frontier Analysis</h1>
          
          <p>
            The Efficient Frontier shows the best possible risk-return combinations. This page
            analyzes your fund universe using Monte Carlo simulation to identify optimal portfolio
            allocations.
          </p>

          <h2>Run Analysis</h2>
          <p>Click a button below to generate the efficient frontier with or without allowing short sales.</p>
          
          <div className="button-group">
            <button 
              onClick={() => runSimulation(false)}
              disabled={loading}
            >
              {loading ? 'Running...' : 'Without Short Sales'}
            </button>
            <button 
              onClick={() => runSimulation(true)}
              disabled={loading}
              className="secondary"
            >
              {loading ? 'Running...' : 'With Short Sales'}
            </button>
          </div>

          {loading && <div className="loading">Running simulation with 10,000+ iterations...</div>}

          {error && <div className="error">{error}</div>}
        </div>

        {(portfoliosWithoutShorts || portfoliosWithShorts) && (
          <>
            <div className="card">
              <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                <button 
                  onClick={() => setActiveTab('without-shorts')}
                  className={activeTab === 'without-shorts' ? '' : 'secondary'}
                >
                  Without Short Sales
                </button>
                <button 
                  onClick={() => setActiveTab('with-shorts')}
                  className={activeTab === 'with-shorts' ? '' : 'secondary'}
                >
                  With Short Sales
                </button>
              </div>
            </div>

            {activeTab === 'without-shorts' && (
              <>
                {renderFrontierChart(portfoliosWithoutShorts, gmvpWithoutShorts, frontierWithoutShorts)}
                {renderGMVPDetails(gmvpWithoutShorts)}
                {renderStatistics(statsWithoutShorts)}
              </>
            )}

            {activeTab === 'with-shorts' && (
              <>
                {renderFrontierChart(portfoliosWithShorts, gmvpWithShorts, frontierWithShorts)}
                {renderGMVPDetails(gmvpWithShorts)}
                {renderStatistics(statsWithShorts)}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
