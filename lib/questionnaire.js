// Questionnaire and risk aversion scoring

const questions = [
  {
    id: 1,
    question: 'What is your age group?',
    options: [
      { label: '18-30', score: 4 },
      { label: '31-45', score: 3 },
      { label: '46-60', score: 2 },
      { label: '60+', score: 1 }
    ]
  },
  {
    id: 2,
    question: 'What is your investment horizon?',
    options: [
      { label: 'Over 10 years', score: 4 },
      { label: '5-10 years', score: 3 },
      { label: '2-5 years', score: 2 },
      { label: 'Under 2 years', score: 1 }
    ]
  },
  {
    id: 3,
    question: 'How stable is your income?',
    options: [
      { label: 'Highly Stable', score: 4 },
      { label: 'Stable', score: 3 },
      { label: 'Mostly Stable', score: 2 },
      { label: 'Unstable', score: 1 }
    ]
  },
  {
    id: 4,
    question: 'How adequate is your emergency fund?',
    options: [
      { label: 'Very Adequate', score: 4 },
      { label: 'Adequate', score: 3 },
      { label: 'Marginal', score: 2 },
      { label: 'Little to None', score: 1 }
    ]
  },
  {
    id: 5,
    question: 'What is your primary investment goal?',
    options: [
      { label: 'Aggressive Growth', score: 4 },
      { label: 'Steady Appreciation', score: 3 },
      { label: 'Capital Preservation', score: 2 },
      { label: 'Inflation Protection', score: 1 }
    ]
  },
  {
    id: 6,
    question: 'What is your level of financial knowledge?',
    options: [
      { label: 'Professional/Expert', score: 4 },
      { label: 'Knowledgeable', score: 3 },
      { label: 'Limited Knowledge', score: 2 },
      { label: 'No Knowledge', score: 1 }
    ]
  },
  {
    id: 7,
    question: 'What is your volatility tolerance?',
    options: [
      { label: 'Above 25%', score: 4 },
      { label: '15%-25%', score: 3 },
      { label: '5%-15%', score: 2 },
      { label: 'Below 5%', score: 1 }
    ]
  },
  {
    id: 8,
    question: 'How would you react to a 20% market crash?',
    options: [
      { label: 'Buy More', score: 4 },
      { label: 'Hold', score: 3 },
      { label: 'Anxious/Sell Some', score: 2 },
      { label: 'Panic Sell', score: 1 }
    ]
  },
  {
    id: 9,
    question: 'What is your preferred risk/return trade-off?',
    options: [
      { label: 'Maximize Long-term Return', score: 4 },
      { label: 'Balance Return & Risk', score: 3 },
      { label: 'Avoid Any Loss', score: 1 }
    ]
  },
  {
    id: 10,
    question: 'How long can you hold an investment that loses value?',
    options: [
      { label: 'Over 3 years', score: 4 },
      { label: '1-3 years', score: 3 },
      { label: '3 months - 1 year', score: 2 },
      { label: 'Under 3 months', score: 1 }
    ]
  }
];

// Calculate total score and convert to risk aversion
function calculateRiskAversion(answers) {
  // answers is an object: { 1: optionIndex, 2: optionIndex, ... }
  let totalScore = 0;
  
  for (const qId in answers) {
    const questionId = parseInt(qId);
    const optionIndex = answers[qId];
    const question = questions[questionId - 1];
    const option = question.options[optionIndex];
    totalScore += option.score;
  }
  
  // Max score = 40 (10 questions * 4 points average)
  // Map to risk aversion A (0.1 to 10)
  // Higher score = higher risk tolerance = lower A
  // Lower score = lower risk tolerance = higher A
  
  const averageScore = totalScore / 10;
  // Score range: 1 to 4
  // A range: 10 to 0.1
  // A = 11 - averageScore
  
  const riskAversion = 11 - averageScore;
  return {
    totalScore,
    averageScore,
    riskAversion: Math.max(0.1, Math.min(10, riskAversion))
  };
}

export { questions, calculateRiskAversion };
