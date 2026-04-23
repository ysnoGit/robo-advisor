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
  const [activeTab, setActiveTab] = useState(null);
  
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
      const statsRes = await fetch('/api/process-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'statistics' })
      });
      const stats = await statsRes.json();

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
        <h3 className="small-title">Summary Statistics</h3>
        
        <h4 className="font-bold text-gray-800 mt-6 mb-4">Mean Returns (Annual)</h4>
        <div className="table-container">
          <table className="table-styled">
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
                <td className="font-semibold">Mean Return</td>
                {[1, 2, 3, 4, 5].map((i) => (
                  <td key={i}>{(stats.meanReturns[i] * 100).toFixed(2)}%</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <table className="table-styled">
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
                <td className="font-semibold">Mean Return</td>
                {[6, 7, 8, 9, 10].map((i) => (
                  <td key={i}>{(stats.meanReturns[i] * 100).toFixed(2)}%</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="font-bold text-gray-800 mt-6 mb-4">Standard Deviations</h4>
        <div className="table-container">
          <table className="table-styled">
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
                <td className="font-semibold">Std Dev</td>
                {[1, 2, 3, 4, 5].map((i) => (
                  <td key={i}>{(stats.stdDevs[i] * 100).toFixed(2)}%</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <table className="table-styled">
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
                <td className="font-semibold">Std Dev</td>
                {[6, 7, 8, 9, 10].map((i) => (
                  <td key={i}>{(stats.stdDevs[i] * 100).toFixed(2)}%</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderGMVPDetails = (gmvp) => {
    if (!gmvp) return null;

    return (
      <div className="card">
        <h3 className="small-title">Global Minimum Variance Portfolio (GMVP)</h3>
        <p className="text-gray-700 mb-4">
          The GMVP is the portfolio with the lowest possible risk. It represents the minimum
          volatility you can achieve across all possible allocations.
        </p>
        
        <div className="table-container">
          <table className="table-styled">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">Expected Return</td>
                <td className="text-blue-600 font-bold">{(gmvp.return * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="font-semibold">Standard Deviation (Risk)</td>
                <td className="text-blue-600 font-bold">{(gmvp.stdDev * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="font-semibold">Variance</td>
                <td>{(gmvp.variance * 10000).toFixed(4)}</td>
              </tr>
              <tr>
                <td className="font-semibold">Sharpe Ratio (rf=0)</td>
                <td>{gmvp.sharpeRatio.toFixed(4)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="font-bold text-gray-800 mt-6 mb-4">Recommended Weights</h4>
        <div className="table-container">
          <table className="table-styled">
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
                  <td className="text-sm">{FUND_NAMES[i]}</td>
                  <td className="text-blue-600 font-bold">{(gmvp.weights[i] * 100).toFixed(2)}%</td>
                  <td className="text-sm">{FUND_NAMES[i + 5]}</td>
                  <td className="text-blue-600 font-bold">{(gmvp.weights[i + 5] * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFrontierChart = (portfolios, gmvp, frontier) => {
    if (!portfolios) return null;

    return (
      <div className="card">
        <h3 className="small-title">Efficient Frontier Visualization</h3>
        <PortfolioChart portfolios={portfolios} gmvp={gmvp} frontier={frontier} />
      </div>
    );
  };

  const hasData = portfoliosWithoutShorts || portfoliosWithShorts;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="card">
            <h1 className="section-title text-blue-600">📊 Efficient Frontier Analysis</h1>
            
            <p className="text-gray-700 mb-4">
              The Efficient Frontier shows the best possible risk-return combinations. This page
              analyzes your fund universe using Monte Carlo simulation to identify optimal portfolio
              allocations.
            </p>

            <h2 className="subsection-title">Run Analysis</h2>
            <p className="text-gray-700 mb-6">Click a button below to generate the efficient frontier with or without allowing short sales.</p>
            
            <div className="flex gap-4 mb-6 flex-wrap">
              <button 
                onClick={() => runSimulation(false)}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? '⏳ Running...' : '📊 Without Short Sales'}
              </button>
              <button 
                onClick={() => runSimulation(true)}
                disabled={loading}
                className="btn-secondary"
              >
                {loading ? '⏳ Running...' : '📈 With Short Sales'}
              </button>
            </div>

            {loading && <div className="loading-text">Running simulation with 10,000+ iterations...</div>}

            {error && <div className="alert-error">{error}</div>}
          </div>

          {/* Tab Controls - Only show if data exists */}
          {hasData && (
            <div className="card">
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setActiveTab('without-shorts')}
                  className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                    activeTab === 'without-shorts' 
                      ? 'btn-primary' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Without Short Sales
                </button>
                <button 
                  onClick={() => setActiveTab('with-shorts')}
                  className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                    activeTab === 'with-shorts' 
                      ? 'btn-primary' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  With Short Sales
                </button>
              </div>
            </div>
          )}

          {/* Results Sections - Show based on active tab */}
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
        </div>
      </div>
    </>
  );
}
