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
  const [pricesError, setPricesError] = useState(null);

  useEffect(() => {
    setPricesError('External API integration not configured. Using local data only.');
  }, []);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="card">
            <h1 className="section-title text-blue-600 text-4xl">🤖 Robo Adviser Platform</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Build and optimize your investment portfolio using advanced financial mathematics. 
              Our platform analyzes historical fund performance and recommends personalized allocations 
              based on your risk profile using modern portfolio theory.
            </p>
          </div>

          {/* How It Works Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h2 className="subsection-title text-2xl">📊 Part 1: Efficient Frontier</h2>
              <p className="text-gray-700 mb-4">
                Understand the optimal risk-return tradeoff using Monte Carlo simulation analysis.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Generate 10,000 random portfolio combinations</li>
                <li>✓ Calculate risk and return metrics</li>
                <li>✓ Identify the Global Minimum Variance Portfolio</li>
                <li>✓ Visualize the efficient frontier curve</li>
              </ul>
            </div>

            <div className="card">
              <h2 className="subsection-title text-2xl">💡 Part 2: Robo Adviser</h2>
              <p className="text-gray-700 mb-4">
                Get personalized portfolio recommendations tailored to your financial situation.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Answer 10 questions about your finances</li>
                <li>✓ Automatically calculate your risk aversion</li>
                <li>✓ Optimize portfolio allocation for you</li>
                <li>✓ Receive fund allocation recommendations</li>
              </ul>
            </div>
          </div>

          {/* Fund Universe */}
          <div className="card">
            <h2 className="subsection-title">🏦 Your Fund Universe (10 Funds)</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {FUND_NAMES.map((name, idx) => (
                <div key={idx} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <span className="font-bold text-blue-600 mr-3 flex-shrink-0">#{idx + 1}</span>
                  <span className="text-gray-700 text-sm">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Alert */}
          {pricesError && (
            <div className="alert-info">
              <strong>ℹ️ Note:</strong> {pricesError}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="card bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <h2 className="text-2xl font-bold mb-6">Ready to Optimize Your Portfolio?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/part1" className="group">
                <button className="w-full btn-primary bg-white text-blue-600 hover:bg-gray-100 py-4 text-lg font-bold shadow-lg transform hover:scale-105 transition-all">
                  📊 Explore Efficient Frontier
                </button>
              </Link>
              <Link href="/part2" className="group">
                <button className="w-full btn-success py-4 text-lg font-bold shadow-lg transform hover:scale-105 transition-all">
                  💡 Get Personalized Recommendations
                </button>
              </Link>
            </div>
          </div>

          {/* Footer Info */}
          <div className="card text-center text-gray-600">
            <p className="text-sm mb-2">
              <strong>Data Source:</strong> 5 years of historical pricing data
            </p>
            <p className="text-sm mb-2">
              <strong>Analysis Method:</strong> Monte Carlo simulation with 10,000+ iterations
            </p>
            <p className="text-sm">
              <strong>Technology:</strong> Next.js, React, Recharts, Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
