# Robo Adviser Platform - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install & Run
```bash
npm install
npm run dev
```
Open **http://localhost:3000** in your browser.

### Step 2: Try Part 1 (Efficient Frontier)
1. Click "Efficient Frontier (Part 1)"
2. Click "Without Short Sales" button
3. View the interactive chart showing 10,000 portfolios
4. GMVP (orange) shows minimum variance portfolio
5. Green line shows efficient frontier

### Step 3: Try Part 2 (Robo Adviser)
1. Click "Robo Adviser (Part 2)"
2. Answer all 10 questions
3. Click "Calculate My Portfolio"
4. See your personalized recommendations

---

## 📊 What's Happening Behind the Scenes

### Part 1 Analysis
- Loads 5 years of daily price data (10 funds)
- Calculates returns from prices
- Computes mean, variance, covariance, correlation
- Runs 10,000 Monte Carlo simulations
- Finds best (GMVP) and efficient portfolios

### Part 2 Recommendation
- Scores your answers (1-4 points each)
- Calculates risk aversion coefficient (A)
- Optimizes portfolio using utility function
- Recommends allocation for your risk profile

---

## 📱 Key Pages

| URL | Purpose |
|-----|---------|
| `/` | Home page with overview |
| `/part1` | Efficient frontier analysis |
| `/part2` | Robo adviser questionnaire |

---

## 🎯 Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Run production server
```

---

## 💡 Understanding the Results

### Part 1
- **Risk (X-axis)**: Standard deviation of returns
- **Return (Y-axis)**: Expected portfolio return
- **GMVP (orange)**: Portfolio with lowest risk
- **Efficient Frontier (green)**: Best combinations
- **Blue dots**: All simulated portfolios

### Part 2
- **Risk Aversion (A)**: 0.1 (aggressive) to 10 (conservative)
- **Fund Weights**: Allocation for each fund
- **Expected Return**: Your portfolio's annual return
- **Utility**: Score for your risk profile

---

## 🔧 Technical Stack

- Framework: Next.js (React)
- Language: JavaScript
- Charting: Recharts
- Deployment: AWS Amplify
- Data: CSV (no database)

---

## 📝 Quick File Reference

```
pages/index.js          → Home page
pages/part1.js          → Efficient frontier
pages/part2.js          → Robo adviser
pages/api/process-data.js → Calculations
lib/calculations.js     → Financial math
lib/questionnaire.js    → Questions & scoring
```

---

## ❓ FAQ

**Q: How long does simulation take?**
A: 2-3 seconds for 10,000 iterations

**Q: Can I modify questions?**
A: Yes, edit lib/questionnaire.js

**Q: Is this secure?**
A: Yes, nothing is stored on servers

**Q: How do I deploy?**
A: See SETUP_GUIDE.md for AWS Amplify instructions

---

**Ready to optimize your portfolio?** 🎯📈
