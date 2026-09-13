# 🧭 Crypto Compass

> **Learn. Practice. Understand. Improve.**

Crypto Compass is a beginner-first crypto learning and paper-trading simulator that combines real-time market data, virtual trading, behavioral analysis, and personalized learning.

---

## ⚠️ Important Product Disclaimer

> **Crypto Compass is an educational simulation and does not involve real-money trading.**
>
> All users begin with **$10,000 in virtual funds**. The platform does not support real deposits, withdrawals, wallet transfers, or blockchain transactions. It does not provide financial advice, price targets, or guaranteed buy/sell signals. Every feature is designed solely to build knowledge, discipline, and risk awareness.

---

## 🌟 Core Philosophy

```text
                    LEARN
                      ↓
                  PRACTICE
                      ↓
                    TRADE
                      ↓
                  ANALYZE
                      ↓
                  FEEDBACK
                      ↓
                  IMPROVE
                      ↓
                    LEARN
```

Traditional paper trading simply displays profit and loss. **Crypto Compass turns every simulated trading mistake into a structured learning opportunity.**

---

## 🚀 Key Features

* **Virtual Trading Simulator**: Trade top cryptocurrencies with a $10,000 starting virtual balance in a risk-free environment.
* **Real-Time Market Data**: Live prices, percentage changes, market capitalization, 24h volumes, and historical data.
* **Interactive Charts**: Responsive candlestick charting powered by TradingView Lightweight Charts (planned).
* **Trade Coach**: Pre-trade context analyzing position sizing, risk exposure, diversification, and volatility without giving financial advice.
* **Mistake Analyzer**: Educational behavioral analysis evaluating holding duration, win/loss tendencies, and over-concentration.
* **Scenario Mode**: Interactive simulations testing reactions to market crashes, bull runs, fake breakouts, and sudden volatility.
* **What-If Simulator**: Experiment with hypothetical portfolio shifts and market swings before executing simulated trades.
* **Adaptive Learning & Lessons**: Curated modules on Crypto Basics, Trading Fundamentals, Technical Analysis, and Trading Psychology.
* **Quizzes & Gamified Progression**: Earn XP, level up from *Crypto Explorer* to *Crypto Navigator*, and unlock achievements.
* **Educational Leaderboard**: Ranks disciplined trading behavior, quiz success, and learning milestones rather than sheer reckless risk-taking.
* **AI-Powered Educational Assistant**: Contextual breakdowns of market concepts and trading behavior (future phase).

---

## 🛠️ Technology Stack

### Frontend
* **React** (Vite)
* **Tailwind CSS** (Futuristic fintech dark theme)
* **React Router DOM** (Single Page Application routing)
* **Axios** (Centralized API client)
* **Framer Motion** (Motion design)
* *TradingView Lightweight Charts* (Reserved for charting phase)

### Backend
* **Node.js** & **Express.js**
* **MongoDB** with **Mongoose** ORM
* **JWT** & **bcrypt** (Authentication infrastructure)
* **Zod** (Request validation)
* **CORS** & Centralized Error Handling

---

## 📁 Project Architecture

```text
crypto-compass/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, icons, branding
│   │   ├── components/         # Reusable React components
│   │   │   ├── common/         # Buttons, badges, spinners
│   │   │   ├── layout/         # Header, footer, navigation
│   │   │   └── ui/             # Glassmorphism cards, modals
│   │   ├── constants/          # App constants & configurations
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Page shell layouts
│   │   ├── pages/              # Route views
│   │   ├── services/           # Centralized API service layer
│   │   ├── utils/              # Helper utilities & formatters
│   │   ├── App.jsx             # Top-level Router configuration
│   │   ├── index.css           # Tailwind CSS directives & theme utilities
│   │   └── main.jsx            # React root mount
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend Application (Node + Express)
│   ├── config/                 # DB and environment configuration
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Central error, auth, and validation middleware
│   ├── models/                 # Mongoose schemas & models
│   ├── routes/                 # Express API routes
│   ├── services/               # Business logic layer
│   ├── utils/                  # Helper utilities
│   ├── validators/             # Request schema validation
│   ├── app.js                  # Express application setup
│   ├── server.js               # HTTP server listener & DB initializer
│   └── package.json
│
├── .gitignore
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 2. Environment Configuration
Copy `.env.example` into both `server/.env` and `client/.env`:

```bash
# In server directory
cp .env.example server/.env

# In client directory
cp .env.example client/.env
```

Ensure `server/.env` contains:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/crypto-compass
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Ensure `client/.env` contains:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation
Install all dependencies:

```bash
npm run install:all
```

### 4. Running the Development Servers
Run both backend and frontend concurrently:

```bash
npm run dev
```

Or run them individually:
```bash
# Terminal 1: Backend (http://localhost:5000)
npm run dev:server

# Terminal 2: Frontend (http://localhost:5173)
npm run dev:client
```

### 5. Verification
* **Frontend Application**: [http://localhost:5173](http://localhost:5173)
* **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
