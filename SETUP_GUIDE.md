# Robo Adviser Platform - Complete Setup & Deployment Guide

## 📋 Project Overview

A complete web-based robo adviser platform that reproduces Excel financial analysis functionality using Next.js. The platform provides:

- **Part 1**: Efficient Frontier Analysis with Monte Carlo simulation
- **Part 2**: Personalized portfolio recommendations via questionnaire

## 🚀 Quick Start Commands

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📁 Project Structure

```
robo-advisor/
├── pages/
│   ├── _app.js                    # Global app config & CSS import
│   ├── index.js                   # Home page
│   ├── part1.js                   # Efficient frontier analysis
│   ├── part2.js                   # Robo adviser questionnaire
│   └── api/
│       └── process-data.js         # API route for calculations
├── components/
│   ├── Navigation.js              # Top navigation bar
│   └── PortfolioChart.js          # Recharts scatter plot
├── lib/
│   ├── calculations.js            # All financial math
│   └── questionnaire.js           # Questionnaire logic & scoring
├── styles/
│   └── globals.css                # Global styling
├── public/                        # Static assets
├── raw_fund_data.csv              # Historical price data (5 years, 10 funds)
├── package.json                   # Dependencies
├── next.config.js                 # Next.js config
├── .gitignore                     # Git ignore rules
└── README.md                      # User documentation
```

## 🔧 Technology Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js (React) |
| Language | JavaScript (ES6+) |
| Charting | Recharts |
| Styling | CSS |
| Data Format | CSV (no database) |
| Deployment | AWS Amplify |

## 📊 Financial Calculations

### Part 1: Efficient Frontier

**Input**: `raw_fund_data.csv` (5 years of daily prices for 10 funds)

**Processing**:
1. Parse CSV and extract prices
2. Calculate daily returns: `r = (P_t - P_{t-1}) / P_{t-1}`
3. Compute statistics:
   - Mean return: `E[r] = Σr / n`
   - Variance: `σ² = Σ(r - E[r])² / n`
   - Standard deviation: `σ = √σ²`
   - Covariance matrix: `Cov[i,j] = Σ(r_i - E[r_i])(r_j - E[r_j]) / n`
   - Correlation matrix: `ρ[i,j] = Cov[i,j] / (σ_i × σ_j)`

4. Monte Carlo Simulation:
   - Generate 10,000 random portfolio weights
   - For each portfolio:
     - Portfolio return: `R_p = Σ w_i × E[r_i]`
     - Portfolio variance: `σ²_p = w^T × Σ × w`
     - Portfolio std dev: `σ_p = √σ²_p`
   
5. Extract Efficient Frontier:
   - Sort portfolios by return
   - Keep only Pareto-optimal portfolios (no other has higher return at same risk)
   - Identify GMVP (portfolio with minimum variance)

**Output**: 
- Scatter chart showing all portfolios
- Efficient frontier curve (green)
- GMVP marker (orange)
- Summary statistics tables

### Part 2: Robo Adviser

**Input**: User answers to 10 questions

**Processing**:
1. Score each answer (1-4 points)
2. Calculate total score and average
3. Convert to risk aversion: `A = 11 - average_score` (range: 0.1 to 10)
   - Higher A = more conservative
   - Lower A = more aggressive
4. Optimize portfolio by maximizing utility:
   - Utility function: `U = r - (A × σ² / 2)`
   - Run 50,000 simulations
   - Find weights that maximize utility

**Output**:
- Risk profile summary (A coefficient)
- Recommended fund weights
- Expected return and risk
- Portfolio utility score

## 📈 Fund Universe (10 Funds)

The system analyzes these 10 funds:

1. JPMorgan Funds - Europe Dynamic A (acc) SGD-H
2. Allianz Global Sustainability Cl AM Dis H2-SGD
3. Manulife Asia Pacific Investment Grade Bond A MDis SGD
4. Fidelity China Focus SR-ACC-SGD (CPF)
5. Blackrock Next Generation Technology A2 SGD-H
6. LionGlobal SGD Money Market A Acc SGD
7. Schroder ISF Global Gold A Acc SGD-H
8. Maybank Money Market A Acc SGD
9. Franklin Templeton Investments (FTIF)
10. AB FCP I Global High Yield A2 SGD-H

## 📋 Questionnaire (10 Questions)

### Question 1: Age Group
- 18-30 (4 points)
- 31-45 (3 points)
- 46-60 (2 points)
- 60+ (1 point)

### Question 2: Investment Horizon
- Over 10 years (4 points)
- 5-10 years (3 points)
- 2-5 years (2 points)
- Under 2 years (1 point)

### Question 3: Income Stability
- Highly Stable (4 points)
- Stable (3 points)
- Mostly Stable (2 points)
- Unstable (1 point)

### Question 4: Emergency Fund
- Very Adequate (4 points)
- Adequate (3 points)
- Marginal (2 points)
- Little to None (1 point)

### Question 5: Investment Primary Goal
- Aggressive Growth (4 points)
- Steady Appreciation (3 points)
- Capital Preservation (2 points)
- Inflation Protection (1 point)

### Question 6: Financial Knowledge
- Professional/Expert (4 points)
- Knowledgeable (3 points)
- Limited Knowledge (2 points)
- No Knowledge (1 point)

### Question 7: Volatility Tolerance
- Above 25% (4 points)
- 15%-25% (3 points)
- 5%-15% (2 points)
- Below 5% (1 point)

### Question 8: Reaction to 20% Market Crash
- Buy More (4 points)
- Hold (3 points)
- Anxious/Sell Some (2 points)
- Panic Sell (1 point)

### Question 9: Risk/Return Trade-off
- Maximize Long-term Return (4 points)
- Balance Return & Risk (3 points)
- Avoid Any Loss (1 point)

### Question 10: Holding Period for Loss
- Over 3 years (4 points)
- 1-3 years (3 points)
- 3 months - 1 year (2 points)
- Under 3 months (1 point)

## 🌐 Deployment with AWS Amplify

### Prerequisites
- AWS Account with Amplify CLI configured
- Git repository initialized and pushed to GitHub/CodeCommit
- Node.js 18+ installed locally

### Step 1: Initialize Amplify

```bash
amplify init
```

Configuration:
```
? Project name: robo-advisor
? Environment name: prod
? Default editor: Visual Studio Code
? App type: javascript
? Framework: react (Next.js)
? Source directory path: ./
? Distribution directory path: .next
? Build command: npm run build
? Start command: npm start
```

### Step 2: Configure Hosting

```bash
amplify add hosting
```

Configuration:
```
? Select the plugin module to execute: Hosting with Amplify Console
? Choose a type: Continuous deployments (Git-based deployments)
? Connect repository (GitHub/CodeCommit): Select your repo
? Select branch: main
```

### Step 3: Deploy

```bash
amplify publish
```

This will:
1. Build the Next.js app
2. Upload to AWS S3
3. Deploy via Amplify Console
4. Provide you a live URL
5. Set up automatic deployments on git commits

### Step 4: Access Your App

After deployment, you'll get a URL like:
```
https://main.xxxxx.amplifyapp.com
```

## 📝 API Routes

### POST `/api/process-data`

Handles all financial calculations.

**Request body options**:

#### Get Statistics
```javascript
{
  action: 'statistics'
}
```

**Response**:
```javascript
{
  meanReturns: { 1: 0.0005, 2: 0.0003, ... },
  variances: { 1: 0.00012, 2: 0.00008, ... },
  stdDevs: { 1: 0.011, 2: 0.009, ... },
  covarianceMatrix: { ... },
  correlationMatrix: { ... }
}
```

#### Run Efficient Frontier
```javascript
{
  action: 'efficient-frontier',
  allowShorts: false  // or true
}
```

**Response**:
```javascript
{
  portfolios: [
    { weights: [...], return: 0.0005, variance: 0.00012, stdDev: 0.011, sharpeRatio: 0.045 },
    ...
  ],
  gmvp: { weights: [...], return: 0.0003, variance: 0.00008, stdDev: 0.009, sharpeRatio: 0.033 },
  frontier: [ /* Pareto optimal portfolios */ ],
  fundNames: [ /* 10 fund names */ ]
}
```

#### Optimize Portfolio
```javascript
{
  action: 'optimize-portfolio',
  riskAversion: 5.2  // A coefficient
}
```

**Response**:
```javascript
{
  portfolio: {
    weights: [0.05, 0.10, 0.02, ..., 0.15],
    return: 0.0004,
    variance: 0.00010,
    stdDev: 0.010,
    utility: 0.0002
  },
  fundNames: [ /* 10 fund names */ ]
}
```

## 🧪 Testing the Application

### Test Part 1 (Efficient Frontier)
1. Go to http://localhost:3000
2. Click "Efficient Frontier (Part 1)" button
3. Click "Without Short Sales" to run simulation
4. Verify:
   - Chart loads with portfolio scatter plot
   - GMVP is highlighted in orange
   - Efficient frontier curve is visible in green
   - Summary statistics are displayed

### Test Part 2 (Robo Adviser)
1. Go to http://localhost:3000
2. Click "Robo Adviser (Part 2)" button
3. Answer all 10 questions
4. Click "Calculate My Portfolio"
5. Verify:
   - Risk profile summary shows A coefficient
   - Fund weights sum to 100%
   - Expected return and risk are displayed
   - Portfolio utility is calculated

## 🐛 Troubleshooting

### "Cannot find raw_fund_data.csv"
- Ensure the CSV file is in the root directory
- File name must be exact: `raw_fund_data.csv`

### "Build error: module format mismatch"
- Remove `"type": "commonjs"` from package.json
- Use ES6 import/export syntax

### Development server not starting
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Start again
npm run dev
```

### Amplify deployment fails
```bash
# Verify build locally
npm run build

# Check Amplify logs
amplify console
```

## 📚 File Descriptions

### `pages/index.js`
Home page explaining the platform. Lists all 10 funds and provides navigation buttons to Part 1 and Part 2.

### `pages/part1.js`
Efficient frontier analysis page. Allows users to run Monte Carlo simulation with/without short sales. Displays interactive chart and summary statistics.

### `pages/part2.js`
Robo adviser page. Renders 10-question questionnaire, calculates risk aversion, and displays recommended portfolio allocation.

### `pages/api/process-data.js`
Next.js API route that handles all financial calculations. Reads CSV, processes data, and returns results as JSON.

### `lib/calculations.js`
Core financial calculations:
- CSV parsing
- Return calculations
- Statistics (mean, variance, std dev)
- Matrix operations (covariance, correlation)
- Monte Carlo simulation
- Efficient frontier extraction
- Portfolio optimization

### `lib/questionnaire.js`
Questionnaire logic:
- Question definitions with scoring
- Risk aversion calculation
- Score to A coefficient conversion

### `components/Navigation.js`
Navigation bar component linking home, part1, and part2 pages.

### `components/PortfolioChart.js`
Recharts scatter plot for visualizing efficient frontier, GMVP, and individual portfolios.

### `styles/globals.css`
Global styles for all pages. Includes responsive design, button styles, tables, cards, and utility classes.

## 🔐 Security Notes

- No sensitive data is stored
- CSV file is read server-side only
- All calculations are stateless
- No user data persistence
- Safe for public deployment

## 📱 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (responsive design)

## 📈 Performance

- Build size: ~200KB (optimized)
- Development: Next.js fast refresh enabled
- Production: Static pre-rendering where possible
- API routes: Serverless on Amplify

## 🔄 Continuous Deployment

Once deployed to Amplify:
1. Push changes to git
2. Amplify automatically builds and deploys
3. Get instant feedback on live app
4. No manual deployment steps needed

## 📞 Support

For issues:
1. Check the troubleshooting section
2. Review browser console (F12)
3. Check Amplify console logs
4. Verify CSV file is in root directory
5. Run `npm run build` to test locally

## 📄 License

ISC

## 👨‍💻 Author

GitHub Copilot

---

**Last Updated**: April 2026  
**Version**: 1.0.0
