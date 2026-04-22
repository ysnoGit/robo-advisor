# Robo Adviser Platform

A complete web-based robo adviser platform that reproduces Excel Part 1 (Efficient Frontier) and Part 2 (Robo Adviser) functionality using Next.js.

## Features

### Part 1: Efficient Frontier Analysis
- Monte Carlo simulation with 10,000+ iterations
- Calculates mean returns, variance, standard deviation, covariance matrix, correlation matrix
- Identifies Global Minimum Variance Portfolio (GMVP)
- Extracts efficient frontier curve
- Support for both with and without short sales

### Part 2: Robo Adviser
- 10-question investment questionnaire
- Converts answers to risk aversion coefficient
- Computes optimal portfolio using utility maximization: U = r - (A × σ²) / 2
- Provides personalized fund allocation

## Tech Stack

- **Frontend**: React with Next.js
- **Charting**: Recharts
- **Calculations**: Pure JavaScript (no database)
- **Deployment**: AWS Amplify
- **Data**: CSV file parsing

## Fund Universe

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

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
.
├── pages/
│   ├── _app.js                 # Global app configuration
│   ├── index.js               # Home page
│   ├── part1.js               # Efficient frontier page
│   ├── part2.js               # Robo adviser page
│   └── api/
│       └── process-data.js     # API route for calculations
├── components/
│   ├── Navigation.js           # Navigation component
│   └── PortfolioChart.js       # Recharts portfolio visualization
├── lib/
│   ├── calculations.js         # All financial calculations
│   └── questionnaire.js        # Questionnaire and scoring logic
├── styles/
│   └── globals.css            # Global styles
├── public/                     # Static files
├── raw_fund_data.csv          # Historical price data (5 years)
├── package.json               # Dependencies
├── next.config.js             # Next.js configuration
└── README.md                  # This file
```

## Running Locally

1. **Clone the repository and navigate to the directory**
   ```bash
   cd robo-advisor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## CSV Data Format

The `raw_fund_data.csv` file contains:
- First column: Date (format: "DD MMM YYYY")
- Columns 2-11: Fund prices (funds 1-10)
- Rows: Daily prices in reverse chronological order (newest first)

Example:
```
date,1,2,3,4,5,6,7,8,9,10
10 Apr 2026,25.57,11.7717,0.863,2.408,25.67,1.4942,566.1843,1.11245,7.6,24
09 Apr 2026,25.31,11.706,0.863,2.39,25.61,1.4941,565.4149,1.11238,7.59,24
```

## Financial Calculations

### Part 1 Calculations
- **Returns**: Daily price changes converted to percentage returns
- **Mean Return**: Average of all daily returns for each fund
- **Variance**: Average squared deviation from mean
- **Standard Deviation**: Square root of variance
- **Covariance Matrix**: Measure of joint variability between funds
- **Correlation Matrix**: Normalized covariance
- **Portfolio Return**: Weighted sum of individual returns
- **Portfolio Variance**: w'Σw (quadratic form with covariance matrix)
- **Portfolio Std Dev**: Square root of portfolio variance
- **Efficient Frontier**: Pareto optimal portfolios (no other portfolio has higher return at same risk)
- **GMVP**: Portfolio with minimum variance

### Part 2 Calculations
- **Risk Aversion (A)**: Derived from questionnaire scores (range 0.1 to 10)
- **Utility Function**: U = r - (A × σ²) / 2
- **Optimal Portfolio**: Maximizes utility across all possible allocations

## Deployment with AWS Amplify

### Prerequisites
- AWS account with Amplify CLI configured
- Git repository initialized and pushed to GitHub/CodeCommit

### Deployment Steps

1. **Initialize Amplify**
   ```bash
   amplify init
   ```
   - Project name: robo-advisor
   - Environment: dev
   - Editor: VS Code
   - App type: javascript
   - Framework: react
   - Build command: npm run build
   - Start command: npm start

2. **Add hosting**
   ```bash
   amplify add hosting
   ```
   - Select "Hosting with Amplify Console"
   - Connect to Git repository

3. **Deploy**
   ```bash
   amplify publish
   ```

4. **View live app**
   - Your app will be available at the Amplify-provided URL
   - Automatic deployments on git commits

## How It Works

### Part 1: Efficient Frontier
1. Load CSV data containing 5 years of daily prices
2. Calculate daily returns for each fund
3. Compute statistical measures (mean, variance, covariance)
4. Generate 10,000 random portfolio allocations
5. Calculate return and risk for each portfolio
6. Identify GMVP (minimum variance point)
7. Extract efficient frontier by keeping Pareto-optimal portfolios
8. Visualize using scatter chart

### Part 2: Robo Adviser
1. User answers 10 questions about their financial situation
2. Each answer assigned a score (1-4)
3. Total score converted to risk aversion coefficient A
4. Run portfolio optimization to find weights maximizing: U = r - (A × σ²) / 2
5. Display recommended allocation and expected performance

## Key Features

- **No Database Required**: All data processed in-memory from CSV
- **Fast Calculations**: Optimized JavaScript algorithms
- **Interactive UI**: Responsive design works on desktop and mobile
- **Chart Visualization**: Recharts for interactive portfolio visualization
- **Questionnaire Scoring**: Sophisticated risk profiling algorithm
- **Production Ready**: Optimized Next.js build with proper error handling

## Technical Highlights

- All financial calculations implemented from first principles
- Efficient matrix operations for covariance/correlation
- Monte Carlo simulation with variable parameters
- Utility maximization using numerical optimization
- RESTful API design with Next.js API routes
- Responsive CSS Grid layout
- Client-side and server-side rendering where appropriate

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

ISC

## Author

GitHub Copilot

## Support

For issues or questions, please open an issue in the repository.
