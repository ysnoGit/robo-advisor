import { useState } from 'react';
import Navigation from '../components/Navigation';
import { questions } from '../lib/questionnaire';

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

export default function Part2() {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [riskAversion, setRiskAversion] = useState(null);

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const isAllAnswered = () => {
    return Object.keys(answers).length === questions.length;
  };

  const submitQuestionnaire = async () => {
    if (!isAllAnswered()) {
      setError('Please answer all questions before proceeding.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let totalScore = 0;
      for (const qId in answers) {
        const questionId = parseInt(qId);
        const optionIndex = answers[qId];
        const question = questions[questionId - 1];
        const option = question.options[optionIndex];
        totalScore += option.score;
      }

      const averageScore = totalScore / 10;
      const riskAversionValue = 11 - averageScore;
      const finalA = Math.max(0.1, Math.min(10, riskAversionValue));
      
      setRiskAversion({
        totalScore,
        averageScore,
        riskAversion: finalA
      });

      const res = await fetch('/api/process-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimize-portfolio',
          riskAversion: finalA
        })
      });

      const data = await res.json();
      setPortfolio(data.portfolio);
    } catch (err) {
      setError(`Error calculating portfolio: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestions = () => {
    return (
      <div className="card">
        <h2 className="subsection-title">📋 Investment Questionnaire</h2>
        <p className="text-gray-700 mb-8">
          Please answer all 10 questions below. Your answers will be used to calculate your
          personalized risk aversion coefficient and determine your optimal portfolio allocation.
        </p>

        {questions.map((question, idx) => (
          <div key={question.id} className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
            <h4 className="font-bold text-gray-900 mb-4 text-lg">
              {question.id}. {question.question}
            </h4>
            <div className="space-y-3 ml-4">
              {question.options.map((option, optIdx) => (
                <label key={optIdx} className="flex items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[question.id] === optIdx}
                    onChange={() => handleAnswerChange(question.id, optIdx)}
                    className="w-4 h-4 text-blue-600 cursor-pointer"
                  />
                  <span className="ml-3 text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button 
            onClick={submitQuestionnaire}
            disabled={loading || !isAllAnswered()}
            className={`w-full py-3 px-6 rounded-lg font-bold text-white text-lg transition-all ${
              isAllAnswered() && !loading
                ? 'btn-success hover:scale-105'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? '⏳ Calculating Your Portfolio...' : '✨ Calculate My Portfolio'}
          </button>
          <div className="mt-4 text-center text-gray-600">
            Answered: <strong>{Object.keys(answers).length}/{questions.length}</strong> questions
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!portfolio || !riskAversion) return null;

    return (
      <div>
        <div className="card-highlight">
          <h2 className="subsection-title text-2xl text-blue-600">📈 Your Personalized Portfolio</h2>

          <div className="mt-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Risk Profile Summary</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-gray-600 text-sm font-semibold">Total Score</p>
                <p className="text-3xl font-bold text-blue-600">{riskAversion.totalScore}/40</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-gray-600 text-sm font-semibold">Average Score</p>
                <p className="text-3xl font-bold text-blue-600">{riskAversion.averageScore.toFixed(2)}/4</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-gray-600 text-sm font-semibold">Risk Aversion (A)</p>
                <p className="text-3xl font-bold text-blue-600">{riskAversion.riskAversion.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              A lower value means higher risk tolerance (aggressive). A higher value means lower risk tolerance (conservative).
            </p>
          </div>
        </div>

        <div className="card">
          <h3 className="small-title">Portfolio Performance Metrics</h3>
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
                  <td className="text-green-600 font-bold">{(portfolio.return * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                  <td className="font-semibold">Variance</td>
                  <td>{(portfolio.variance * 10000).toFixed(4)}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Standard Deviation (Risk)</td>
                  <td className="text-orange-600 font-bold">{(portfolio.stdDev * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                  <td className="font-semibold">Utility Score</td>
                  <td className="text-blue-600 font-bold">{portfolio.utility.toFixed(4)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            <em>Utility = Expected Return - (A × Variance) / 2</em>
          </p>
        </div>

        <div className="card">
          <h3 className="small-title">Recommended Fund Allocation</h3>
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
                  <tr key={i} className={`${
                    portfolio.weights[i] > 0.05 ? 'bg-green-50' : ''
                  }`}>
                    <td className="text-sm text-gray-700">{FUND_NAMES[i]}</td>
                    <td className="text-blue-600 font-bold text-lg">{(portfolio.weights[i] * 100).toFixed(2)}%</td>
                    <td className="text-sm text-gray-700">{FUND_NAMES[i + 5]}</td>
                    <td className="text-blue-600 font-bold text-lg">{(portfolio.weights[i + 5] * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-highlight">
          <h4 className="font-bold text-gray-900 mb-4">How to Use This Portfolio</h4>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Each percentage shows how much of your total investment should go to that fund</li>
            <li>✓ Allocations sum to 100% (or close to it due to rounding)</li>
            <li>✓ Small allocations (&lt;1%) may be practical to ignore in your actual investment</li>
            <li>✓ This allocation maximizes your utility given your risk tolerance</li>
            <li>✓ Review and rebalance periodically as market conditions change</li>
          </ul>
        </div>

        <button 
          onClick={() => {
            setPortfolio(null);
            setRiskAversion(null);
            setAnswers({});
          }}
          className="btn-secondary w-full"
        >
          ← Back to Questionnaire
        </button>
      </div>
    );
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="card">
            <h1 className="section-title text-blue-600">💡 Robo Adviser - Personalized Portfolio</h1>
            
            <p className="text-gray-700">
              This tool provides a customized portfolio allocation based on your specific
              financial situation and investment preferences. Answer the following 10 questions
              honestly for the best results.
            </p>
          </div>

          {error && <div className="alert-error">{error}</div>}

          {!portfolio ? renderQuestions() : renderResults()}
        </div>
      </div>
    </>
  );
}
