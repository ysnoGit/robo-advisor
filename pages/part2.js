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
      // Calculate risk aversion from answers
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

      // Get optimal portfolio
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
        <h2>Investment Questionnaire</h2>
        <p style={{ marginBottom: '2rem' }}>
          Please answer all 10 questions below. Your answers will be used to calculate your
          personalized risk aversion coefficient and determine your optimal portfolio allocation.
        </p>

        {questions.map((question, idx) => (
          <div key={question.id} style={{ 
            marginBottom: '2rem', 
            paddingBottom: '1.5rem',
            borderBottom: idx < questions.length - 1 ? '1px solid #eee' : 'none'
          }}>
            <h4 style={{ marginBottom: '1rem' }}>
              {question.id}. {question.question}
            </h4>
            <div style={{ marginLeft: '1rem' }}>
              {question.options.map((option, optIdx) => (
                <div key={optIdx} style={{ marginBottom: '0.8rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={answers[question.id] === optIdx}
                      onChange={() => handleAnswerChange(question.id, optIdx)}
                    />
                    <span>{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: '2rem' }}>
          <button 
            onClick={submitQuestionnaire}
            disabled={loading || !isAllAnswered()}
            className="success"
            style={{ padding: '15px 40px', fontSize: '1.1rem' }}
          >
            {loading ? 'Calculating...' : 'Calculate My Portfolio'}
          </button>
          <div style={{ marginTop: '1rem' }}>
            Answered: <strong>{Object.keys(answers).length}/{questions.length}</strong> questions
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!portfolio || !riskAversion) return null;

    return (
      <div className="card">
        <h2>📈 Your Personalized Portfolio</h2>

        <div className="info">
          <h3>Risk Profile Summary</h3>
          <p>
            <strong>Total Score:</strong> {riskAversion.totalScore}/40<br />
            <strong>Average Score:</strong> {riskAversion.averageScore.toFixed(2)}/4<br />
            <strong>Risk Aversion Coefficient (A):</strong> <strong>{riskAversion.riskAversion.toFixed(2)}</strong>
          </p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#0c5460' }}>
            A lower A means higher risk tolerance (more aggressive). A higher A means lower risk
            tolerance (more conservative).
          </p>
        </div>

        <div className="card" style={{ marginTop: '1.5rem', backgroundColor: '#f0f8ff' }}>
          <h3>Portfolio Performance Metrics</h3>
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
                <td><strong>{(portfolio.return * 100).toFixed(2)}%</strong></td>
              </tr>
              <tr>
                <td>Variance</td>
                <td>{(portfolio.variance * 10000).toFixed(4)}</td>
              </tr>
              <tr>
                <td>Standard Deviation (Risk)</td>
                <td><strong>{(portfolio.stdDev * 100).toFixed(2)}%</strong></td>
              </tr>
              <tr>
                <td>Utility Score</td>
                <td><strong>{portfolio.utility.toFixed(4)}</strong></td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#555' }}>
            <em>Utility = Expected Return - (A × Variance) / 2</em>
          </p>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Recommended Fund Allocation</h3>
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
              <tr key={i} style={{
                backgroundColor: portfolio.weights[i] > 0.05 ? '#e8f5e9' : 'transparent'
              }}>
                <td>{FUND_NAMES[i]}</td>
                <td>
                  <strong style={{ fontSize: '1.1rem' }}>
                    {(portfolio.weights[i] * 100).toFixed(2)}%
                  </strong>
                </td>
                <td>{FUND_NAMES[i + 5]}</td>
                <td>
                  <strong style={{ fontSize: '1.1rem' }}>
                    {(portfolio.weights[i + 5] * 100).toFixed(2)}%
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="info" style={{ marginTop: '2rem' }}>
          <h4>How to Interpret This Portfolio</h4>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Each percentage shows how much of your total investment should go to that fund</li>
            <li>Allocations sum to 100% (or close to it due to rounding)</li>
            <li>Small allocations (&lt;1%) may be practical to ignore in your actual investment</li>
            <li>This allocation maximizes your utility given your risk tolerance</li>
            <li>Review and rebalance periodically as market conditions change</li>
          </ul>
        </div>

        <button 
          onClick={() => {
            setPortfolio(null);
            setRiskAversion(null);
            setAnswers({});
          }}
          className="secondary"
          style={{ marginTop: '2rem' }}
        >
          Back to Questionnaire
        </button>
      </div>
    );
  };

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="card">
          <h1>💡 Robo Adviser - Personalized Portfolio Recommendation</h1>
          
          <p>
            This tool provides a customized portfolio allocation based on your specific
            financial situation and investment preferences. Answer the following 10 questions
            honestly for the best results.
          </p>
        </div>

        {error && <div className="error">{error}</div>}

        {!portfolio ? renderQuestions() : renderResults()}
      </div>
    </>
  );
}
