import Link from 'next/link';
import Navigation from '../components/Navigation';
import { useState, useEffect } from 'react';

const FUND_NAMES = [
  'JPMorgan Funds - Europe Dynamic A (acc) SGD-H',
  'Allianz Global Sustainability Cl AM Dis H2-SGD',
  'Manulife Asia Pacific Investment Grade Bond A MDis SGD',
  'Fidelity China Focus SR-ACC-SGD (CPF)',
  'Blackrock Next Generation Technology A2 SGD-H',
  'LionGlobal SGD Money Market A Acc SGD',
  'Schroder ISF Global Gold A Acc SGD-H',
  'Maybank Money Market A Acc SGD',
  'Franklin Templeton Investments (FTIF)',
  'AB FCP I Global High Yield A2 SGD-H'
];

export default function Home() {
  const [recentPrices, setRecentPrices] = useState(null);
  const [pricesError, setPricesError] = useState(null);

  useEffect(() => {
    // Try to fetch recent prices from Yahoo Finance (optional)
    fetchRecentPrices();
  }, []);

  const fetchRecentPrices = async () => {
    try {
      // This is a simplified example - in real app you might use a financial API
      setPricesError('External API integration not configured. Using local data only.');
    } catch (error) {
      setPricesError('Could not fetch recent prices. Using local historical data.');
    }
  };

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="card">
          <h1>🤖 Robo Adviser Platform</h1>
          
          <h2>Welcome to Your Intelligent Portfolio Optimizer</h2>
          
          <p>
            This platform helps you build and optimize your investment portfolio using advanced
            financial mathematics. We analyze the historical performance of 10 carefully selected
            funds and use modern portfolio theory to recommend the best allocation for your risk
            tolerance.
          </p>

          <h2>How It Works</h2>
          
          <h3>Part 1: Efficient Frontier Analysis</h3>
          <p>
            The Efficient Frontier shows the best possible portfolios that maximize return for
            a given level of risk. We use Monte Carlo simulation to:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Generate thousands of random portfolio combinations</li>
            <li>Calculate the risk and return of each portfolio</li>
            <li>Identify the Global Minimum Variance Portfolio (GMVP)</li>
            <li>Extract the efficient frontier curve</li>
          </ul>

          <h3>Part 2: Robo Adviser Recommendation</h3>
          <p>
            Complete a brief questionnaire about your financial situation, investment goals, and
            risk tolerance. Our algorithm will:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Convert your answers into a risk aversion coefficient</li>
            <li>Compute your optimal portfolio using utility maximization</li>
            <li>Recommend specific fund allocations tailored to you</li>
          </ul>

          <h2>Universe of 10 Funds</h2>
          <div style={{ marginBottom: '2rem' }}>
            {FUND_NAMES.map((name, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem', padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <strong>Fund {idx + 1}:</strong> {name}
              </div>
            ))}
          </div>

          {pricesError && (
            <div className="info">
              <strong>ℹ️ Note:</strong> {pricesError}
            </div>
          )}

          <h2>Get Started</h2>
          <div className="button-group">
            <Link href="/part1">
              <button>📊 Efficient Frontier (Part 1)</button>
            </Link>
            <Link href="/part2">
              <button className="success">💡 Robo Adviser (Part 2)</button>
            </Link>
          </div>

          <h2>Technical Details</h2>
          <p>
            <strong>Data Source:</strong> 5 years of historical price data for each fund<br />
            <strong>Analysis Method:</strong> Monte Carlo simulation with 10,000+ iterations<br />
            <strong>Optimization:</strong> Utility maximization with customizable risk aversion<br />
            <strong>Technology:</strong> Next.js, React, Recharts
          </p>
        </div>
      </div>
    </>
  );
}
