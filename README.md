# 🔥 FIRE Works · Financial Independence & Early Retirement Simulator

> Engineered by **Ravindra Elicherla** · Applying an engineer's mindset to wealth compounding, non-directional cashflow, and systematic early retirement.

A standalone, ultra-responsive web application designed for one-click deployment on **Vercel**. Built with **Next.js 15**, **React 19**, **Tailwind CSS v4**, and **Radix UI**.

---

## ✨ Features & Architecture

### 1. 🧮 Interactive Expenses Engine
- **Itemized Breakdown**: Categorized into *Essentials*, *Discretionary*, and *Security*.
- **Quick Burn Rate**: Toggle to single lump-sum monthly estimate.
- **Custom Categories**: Add bespoke expenses (e.g., parents' healthcare, child's overseas education).
- **Category Proportion Visualizer**: Live distribution bar highlighting your spending profile.

### 2. 🎯 Multiplier & Safe Withdrawal Rate (SWR) Matrix
- **25× (4.0% SWR)**: Classic Trinity Study standard (ideal for low-inflation dollar regimes).
- **30× (3.33% SWR)**: **Recommended for India** to counteract domestic 5.5%–7% inflation.
- **33× (3.0% SWR)**: Ultra-conservative 40-year early retirement horizon.
- **40× (2.5% SWR)**: Fat FIRE with generous lifestyle buffers and global travel.
- **Dynamic Slider**: Fine-tune multiplier anywhere from 20× to 50×.

### 3. 📈 30-Year Wealth Compounding & Crossover Chart
- **Interactive SVG Chart**: Zero heavy third-party bundle weight.
- **Milestone Detection**: Automatically detects and highlights the exact crossover year and age where portfolio value surpasses the inflation-adjusted FIRE line.
- **Nominal vs. Real Views**: Toggle between future rupee amounts and inflation-adjusted purchasing power.
- **Hover Inspection**: Move cursor over any year to inspect portfolio value, invested principal, wealth multiplier, and annual SIP.

### 4. 🌴 The 5 FIRE Archetypes
- **Lean FIRE (22×)**: Barebones survival budget.
- **Standard FIRE (User Multiplier)**: 100% lifestyle maintenance.
- **Fat FIRE (40×)**: Generous luxury and medical buffers.
- **Coast FIRE (Age 58 Milestone)**: The invested amount needed today to retire comfortably without ever investing another rupee.
- **Barista / Semi-Retirement FIRE**: How modest consulting or freelance income (covering ~40% expenses) cuts your required corpus by up to 50%.

### 5. ⚙️ The Engineer's 3 Pillars to Accelerate FIRE
1. **Direct Equity Compounding**: Concentrated high-momentum Stage-2 leaders for superior CAGR.
2. **Automated Theta Cashflow**: Selling systematic OTM Strangles / Covered calls to generate 1%–2% monthly cashflow without liquidating equities during drawdowns.
3. **Quantitative Risk Controls**: Hard stop-loss limits (1%–2% risk per idea) and programmatic macro tracking.

### 6. 👤 Persona Presets
- 👨‍💻 **Young Engineer (Age 26)**: ₹60k burn, ₹25L corpus, ₹1L/mo SIP, +12% annual step-up.
- 🚀 **Tech Lead / Staff (Age 35)**: ₹1.5L burn, ₹1.5 Cr corpus, ₹2L/mo SIP, +8% annual step-up.
- 🏛️ **Director / Principal (Age 44)**: ₹2.5L burn, ₹4.5 Cr corpus, ₹3.5L/mo SIP, 33× multiplier.
- 🌴 **Coast FIRE Aspirant (Age 32)**: Transitioning from corporate grind to indie projects.

---

## 🚀 Local Development

```bash
# Clone or navigate to the directory
cd projects/195-FIRE

# Install dependencies
npm install

# Run development server (configured on port 6195)
npm run dev

# Open in browser
http://localhost:6195
```

---

## ☁️ Deploying to Vercel

### Option 1: Vercel CLI
```bash
npx vercel
```

### Option 2: GitHub / Vercel Web Dashboard
1. Push this directory to your GitHub account (e.g., `github.com/<username>/fire-works`).
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Next.js will be auto-detected. Click **Deploy**!

---

## 📜 License
MIT License. Created by [Ravindra Elicherla](https://github.com/elicherla).
