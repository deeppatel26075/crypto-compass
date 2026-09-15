import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  GraduationCap,
  TrendingUp,
  Compass,
  LayoutDashboard,
  Briefcase,
  Clock,
  Calculator,
  Activity,
  Award,
  Trophy,
  User,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const SEARCH_INDEX = [
  // Platform Tools & Navigation
  {
    id: 'page-dashboard',
    type: 'PAGE',
    category: 'Platform Tools',
    title: 'Dashboard',
    description: 'Your simulated portfolio overview, recent performance, and daily tasks',
    path: '/dashboard',
    icon: LayoutDashboard,
    badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
    keywords: ['home', 'overview', 'balance', 'stats', 'wallet', 'funds'],
  },
  {
    id: 'page-markets',
    type: 'PAGE',
    category: 'Platform Tools',
    title: 'Market Simulator',
    description: 'Real-time spot cryptocurrency pricing and paper trading terminal',
    path: '/markets',
    icon: TrendingUp,
    badgeColor: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/30',
    keywords: ['trade', 'prices', 'buy', 'sell', 'quotes', 'crypto', 'coins'],
  },
  {
    id: 'page-portfolio',
    type: 'PAGE',
    category: 'Platform Tools',
    title: 'Virtual Portfolio',
    description: 'Inspect cash balance, coin holdings, total equity, and asset allocations',
    path: '/portfolio',
    icon: Briefcase,
    badgeColor: 'text-[#8A2BE2] bg-[#8A2BE2]/10 border-[#8A2BE2]/30',
    keywords: ['holdings', 'assets', 'balance', 'cash', 'allocations'],
  },
  {
    id: 'page-history',
    type: 'PAGE',
    category: 'Platform Tools',
    title: 'Trading History',
    description: 'Comprehensive audit log of all your executed paper buy/sell trades',
    path: '/history',
    icon: Clock,
    badgeColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    keywords: ['orders', 'records', 'past trades', 'transactions', 'logs'],
  },
  {
    id: 'page-learn',
    type: 'PAGE',
    category: 'Platform Tools',
    title: 'Learn Academy',
    description: '15 structured lessons covering blockchain basics, market dynamics, and risk',
    path: '/learn',
    icon: GraduationCap,
    badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
    keywords: ['academy', 'education', 'lessons', 'course', 'curriculum', 'study'],
  },
  {
    id: 'page-scenarios',
    type: 'PAGE',
    category: 'Platform Tools',
    title: 'Decision Scenarios',
    description: 'Practice high-pressure trading dilemmas in realistic simulated environments',
    path: '/scenarios',
    icon: Compass,
    badgeColor: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/30',
    keywords: ['practice', 'dilemmas', 'fomo', 'risk control', 'simulations'],
  },
  {
    id: 'page-simulator',
    type: 'PAGE',
    category: 'Platform Tools',
    title: 'What-If Simulator',
    description: 'Hypothetical trade calculator to test trade setups before executing',
    path: '/simulator',
    icon: Calculator,
    badgeColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    keywords: ['calculator', 'what if', 'projection', 'risk reward', 'planner'],
  },
  {
    id: 'page-analysis',
    type: 'PAGE',
    category: 'Platform Tools',
    title: 'Mistake Analyzer',
    description: 'Objective behavioral analytics diagnosing overtrading, FOMO, and sizing habits',
    path: '/analysis',
    icon: Activity,
    badgeColor: 'text-[#8A2BE2] bg-[#8A2BE2]/10 border-[#8A2BE2]/30',
    keywords: ['behavior', 'habits', 'mistakes', 'analytics', 'discipline', 'coach'],
  },
  {
    id: 'page-challenges',
    type: 'PAGE',
    category: 'Platform Tools',
    title: 'Daily & Weekly Challenges',
    description: 'Gamified trading and learning challenges to earn XP and level up',
    path: '/challenges',
    icon: Award,
    badgeColor: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/30',
    keywords: ['quests', 'tasks', 'xp', 'rewards', 'streaks', 'missions'],
  },
  {
    id: 'page-leaderboard',
    type: 'PAGE',
    category: 'Platform Tools',
    title: 'Global Leaderboard',
    description: 'Compare simulation performance, discipline scores, and skill levels',
    path: '/leaderboard',
    icon: Trophy,
    badgeColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    keywords: ['ranking', 'top traders', 'competition', 'standings', 'score'],
  },
  {
    id: 'page-profile',
    type: 'PAGE',
    category: 'Platform Tools',
    title: 'User Profile & Achievements',
    description: 'Inspect unlocked badges, XP progression, trading stats, and account settings',
    path: '/profile',
    icon: User,
    badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
    keywords: ['account', 'badges', 'progression', 'settings', 'level'],
  },

  // Cryptocurrency Spot Markets
  {
    id: 'market-btc',
    type: 'MARKET',
    category: 'Markets & Coins',
    title: 'Bitcoin (BTC)',
    symbol: 'BTC',
    description: 'The pioneering decentralized digital currency and premier digital store of value',
    path: '/markets/BTC',
    icon: TrendingUp,
    badgeColor: 'text-[#F7931A] bg-[#F7931A]/10 border-[#F7931A]/30',
    keywords: ['bitcoin', 'btc', 'crypto gold', 'satoshi', 'digital currency'],
  },
  {
    id: 'market-eth',
    type: 'MARKET',
    category: 'Markets & Coins',
    title: 'Ethereum (ETH)',
    symbol: 'ETH',
    description: 'Leading smart contract and decentralized application blockchain',
    path: '/markets/ETH',
    icon: TrendingUp,
    badgeColor: 'text-[#627EEA] bg-[#627EEA]/10 border-[#627EEA]/30',
    keywords: ['ethereum', 'eth', 'ether', 'smart contracts', 'defi'],
  },
  {
    id: 'market-sol',
    type: 'MARKET',
    category: 'Markets & Coins',
    title: 'Solana (SOL)',
    symbol: 'SOL',
    description: 'High-throughput Layer 1 blockchain designed for speed and low fees',
    path: '/markets/SOL',
    icon: TrendingUp,
    badgeColor: 'text-[#14F195] bg-[#14F195]/10 border-[#14F195]/30',
    keywords: ['solana', 'sol', 'layer 1', 'fast'],
  },
  {
    id: 'market-bnb',
    type: 'MARKET',
    category: 'Markets & Coins',
    title: 'BNB',
    symbol: 'BNB',
    description: 'Native utility asset of the BNB Chain and exchange ecosystem',
    path: '/markets/BNB',
    icon: TrendingUp,
    badgeColor: 'text-[#F3BA2F] bg-[#F3BA2F]/10 border-[#F3BA2F]/30',
    keywords: ['bnb', 'binance coin', 'bsc'],
  },
  {
    id: 'market-xrp',
    type: 'MARKET',
    category: 'Markets & Coins',
    title: 'Ripple (XRP)',
    symbol: 'XRP',
    description: 'Digital asset built for instant, low-cost international settlements',
    path: '/markets/XRP',
    icon: TrendingUp,
    badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
    keywords: ['ripple', 'xrp', 'payments', 'cross border'],
  },
  {
    id: 'market-ada',
    type: 'MARKET',
    category: 'Markets & Coins',
    title: 'Cardano (ADA)',
    symbol: 'ADA',
    description: 'Proof-of-stake blockchain built on peer-reviewed academic research',
    path: '/markets/ADA',
    icon: TrendingUp,
    badgeColor: 'text-[#0033AD] bg-[#0033AD]/10 border-[#0033AD]/30',
    keywords: ['cardano', 'ada', 'pos', 'research'],
  },
  {
    id: 'market-doge',
    type: 'MARKET',
    category: 'Markets & Coins',
    title: 'Dogecoin (DOGE)',
    symbol: 'DOGE',
    description: 'Popular open-source peer-to-peer cryptocurrency and community coin',
    path: '/markets/DOGE',
    icon: TrendingUp,
    badgeColor: 'text-[#C2A633] bg-[#C2A633]/10 border-[#C2A633]/30',
    keywords: ['doge', 'dogecoin', 'meme'],
  },
  {
    id: 'market-avax',
    type: 'MARKET',
    category: 'Markets & Coins',
    title: 'Avalanche (AVAX)',
    symbol: 'AVAX',
    description: 'Smart contract platform built for scalable decentralized applications and subnets',
    path: '/markets/AVAX',
    icon: TrendingUp,
    badgeColor: 'text-[#E84142] bg-[#E84142]/10 border-[#E84142]/30',
    keywords: ['avalanche', 'avax', 'subnets'],
  },
  {
    id: 'market-dot',
    type: 'MARKET',
    category: 'Markets & Coins',
    title: 'Polkadot (DOT)',
    symbol: 'DOT',
    description: 'Multi-chain protocol enabling cross-blockchain transfers of data and assets',
    path: '/markets/DOT',
    icon: TrendingUp,
    badgeColor: 'text-[#E6007A] bg-[#E6007A]/10 border-[#E6007A]/30',
    keywords: ['polkadot', 'dot', 'parachains', 'interoperability'],
  },

  // Academy Lessons
  {
    id: 'lesson-1',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'What Is Cryptocurrency?',
    description: 'Basic concepts of digital currency, cryptography, and decentralized networks',
    path: '/learn/what-is-cryptocurrency',
    icon: GraduationCap,
    badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
    keywords: ['cryptocurrency', 'basics', 'decentralization', 'fiat', 'money'],
  },
  {
    id: 'lesson-2',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'How Blockchain Works',
    description: 'Distributed ledgers, blocks, proof-of-work, and consensus mechanisms',
    path: '/learn/how-blockchain-works',
    icon: GraduationCap,
    badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
    keywords: ['blockchain', 'ledger', 'blocks', 'mining', 'consensus', 'nodes'],
  },
  {
    id: 'lesson-3',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'Bitcoin vs Altcoins',
    description: 'Comparing store-of-value digital gold to utility tokens and smart contract platforms',
    path: '/learn/bitcoin-vs-altcoins',
    icon: GraduationCap,
    badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
    keywords: ['altcoins', 'btc', 'comparison', 'tokens', 'ecosystem'],
  },
  {
    id: 'lesson-4',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'Crypto Wallets Explained',
    description: 'Public keys, private keys, seed phrases, hot vs cold storage security',
    path: '/learn/crypto-wallets-explained',
    icon: GraduationCap,
    badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
    keywords: ['wallet', 'private key', 'seed phrase', 'hardware wallet', 'custody'],
  },
  {
    id: 'lesson-5',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'Understanding Crypto Prices',
    description: 'How supply, demand, liquidity, and exchange order books determine spot prices',
    path: '/learn/understanding-crypto-prices',
    icon: GraduationCap,
    badgeColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    keywords: ['price', 'supply', 'demand', 'liquidity', 'quotes'],
  },
  {
    id: 'lesson-6',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'Market Capitalization Explained',
    description: 'Why unit coin price is misleading and how market cap measures relative scale',
    path: '/learn/market-cap-explained',
    icon: GraduationCap,
    badgeColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    keywords: ['market cap', 'circulating supply', 'valuation', 'ranking'],
  },
  {
    id: 'lesson-7',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'Volatility Explained',
    description: 'Causes of sudden crypto price swings and how to navigate volatile markets',
    path: '/learn/volatility-explained',
    icon: GraduationCap,
    badgeColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    keywords: ['volatility', 'swings', 'risk', 'drawdown', 'fluctuations'],
  },
  {
    id: 'lesson-8',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'What Is Spot Trading?',
    description: 'Immediate exchange of assets without debt, margin, or liquidation risk',
    path: '/learn/what-is-spot-trading',
    icon: GraduationCap,
    badgeColor: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/30',
    keywords: ['spot', 'trading', 'buying', 'selling', 'execution'],
  },
  {
    id: 'lesson-9',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'Market Orders Explained',
    description: 'Instant execution against current order book liquidity and slippage considerations',
    path: '/learn/market-orders-explained',
    icon: GraduationCap,
    badgeColor: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/30',
    keywords: ['market order', 'slippage', 'instant', 'taker'],
  },
  {
    id: 'lesson-10',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'Limit Orders Explained',
    description: 'Setting target execution prices to avoid chasing fast spikes or dips',
    path: '/learn/limit-orders-explained',
    icon: GraduationCap,
    badgeColor: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/30',
    keywords: ['limit order', 'maker', 'target price', 'patience'],
  },
  {
    id: 'lesson-11',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'Order Books Explained',
    description: 'Visualizing bids, asks, spread, and market depth',
    path: '/learn/order-books-explained',
    icon: GraduationCap,
    badgeColor: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/30',
    keywords: ['order book', 'bids', 'asks', 'depth', 'spread'],
  },
  {
    id: 'lesson-12',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'What Is Risk Management?',
    description: 'Protecting capital through position limits, stop losses, and loss limits',
    path: '/learn/what-is-risk-management',
    icon: GraduationCap,
    badgeColor: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
    keywords: ['risk', 'capital preservation', 'stop loss', 'downside', 'risk management'],
  },
  {
    id: 'lesson-13',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'Position Sizing Basics',
    description: 'How much to allocate per trade to survive inevitable market drawdowns',
    path: '/learn/position-sizing-basics',
    icon: GraduationCap,
    badgeColor: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
    keywords: ['position size', 'allocation', 'sizing', 'risk percentage'],
  },
  {
    id: 'lesson-14',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'Trading with a Plan',
    description: 'Establishing entry rules, exit targets, and written trading rules before clicking buy',
    path: '/learn/trading-with-a-plan',
    icon: GraduationCap,
    badgeColor: 'text-[#8A2BE2] bg-[#8A2BE2]/10 border-[#8A2BE2]/30',
    keywords: ['plan', 'strategy', 'targets', 'discipline', 'checklist'],
  },
  {
    id: 'lesson-15',
    type: 'LESSON',
    category: 'Academy Lessons',
    title: 'Common Beginner Mistakes',
    description: 'Identifying FOMO, revenge trading, panic selling, and over-leveraging',
    path: '/learn/common-beginner-mistakes',
    icon: GraduationCap,
    badgeColor: 'text-[#8A2BE2] bg-[#8A2BE2]/10 border-[#8A2BE2]/30',
    keywords: ['mistakes', 'fomo', 'panic selling', 'revenge trading', 'emotions'],
  },

  // Interactive Decision Scenarios
  {
    id: 'scenario-1',
    type: 'SCENARIO',
    category: 'Trading Scenarios',
    title: 'Avoiding FOMO Impulses',
    description: 'A coin surges 45% in 2 hours with hype on social media. What do you do?',
    path: '/scenarios/scenario-avoiding-fomo-impulses',
    icon: Compass,
    badgeColor: 'text-[#00F59B] bg-[#00F59B]/10 border-[#00F59B]/30',
    keywords: ['fomo', 'hype', 'pump', 'impulse', 'discipline'],
  },
  {
    id: 'scenario-2',
    type: 'SCENARIO',
    category: 'Trading Scenarios',
    title: 'Defining Downside Risk',
    description: 'Structure risk before entering a high-conviction swing trade',
    path: '/scenarios/scenario-defining-downside-risk',
    icon: Compass,
    badgeColor: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
    keywords: ['downside', 'risk', 'stop loss', 'sizing'],
  },
  {
    id: 'scenario-3',
    type: 'SCENARIO',
    category: 'Trading Scenarios',
    title: 'Sticking to a Trade Plan',
    description: 'The market hits your profit target early. Do you sell or greedily hold?',
    path: '/scenarios/scenario-sticking-to-a-trade-plan',
    icon: Compass,
    badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
    keywords: ['plan', 'greed', 'exit', 'profit target', 'discipline'],
  },
  {
    id: 'scenario-4',
    type: 'SCENARIO',
    category: 'Trading Scenarios',
    title: 'Position Sizing Discipline',
    description: 'Decide proper portfolio allocation for an attractive but volatile altcoin',
    path: '/scenarios/scenario-position-sizing-discipline',
    icon: Compass,
    badgeColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    keywords: ['sizing', 'discipline', 'allocation', 'portfolio'],
  },
  {
    id: 'scenario-5',
    type: 'SCENARIO',
    category: 'Trading Scenarios',
    title: 'Chasing a Fast Market',
    description: 'Breakout above key resistance: market buy instantly or wait for retest?',
    path: '/scenarios/scenario-chasing-fast-market',
    icon: Compass,
    badgeColor: 'text-[#8A2BE2] bg-[#8A2BE2]/10 border-[#8A2BE2]/30',
    keywords: ['chasing', 'breakout', 'retest', 'market order'],
  },
  {
    id: 'scenario-6',
    type: 'SCENARIO',
    category: 'Trading Scenarios',
    title: 'Managing an Unrealized Loss',
    description: 'Position down 8% below invalidation. Cut according to rules or pray?',
    path: '/scenarios/scenario-managing-unrealized-loss',
    icon: Compass,
    badgeColor: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
    keywords: ['loss', 'drawdown', 'invalidation', 'stop loss'],
  },
];

export default function GlobalSearchModal({ isOpen, onClose, initialQuery = '' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen, initialQuery]);

  // Filter items matching query
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Return top recommended shortcuts
      return SEARCH_INDEX.slice(0, 8);
    }

    return SEARCH_INDEX.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchSymbol = item.symbol && item.symbol.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchSymbol || matchCategory || matchKeywords;
    });
  }, [query]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  const handleSelect = (item) => {
    if (!item) return;
    onClose();
    navigate(item.path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? filteredResults.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md transition-all"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#08111a] border border-white/[0.14] shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-[#0a1522]">
          <Search className="w-5 h-5 text-[#00F59B] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search lessons, markets, scenarios, or tools... (e.g. BTC, Risk, FOMO)"
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm font-sans outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-gray-400 hover:text-white mr-2 text-xs"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md bg-white/[0.06] hover:bg-white/10 text-[11px] font-mono text-gray-400 hover:text-white border border-white/10 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Tag Suggestions when query is empty */}
        {!query && (
          <div className="px-4 py-2 bg-[#050a0f]/60 border-b border-white/[0.05] flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
            <span className="text-gray-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00F59B]" />
              <span>Suggested:</span>
            </span>
            {['BTC', 'ETH', 'Risk Management', 'FOMO', 'Spot Trading', 'Simulator'].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-[#00F59B] border border-white/[0.06] transition-colors whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-white/[0.04]">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto text-gray-500">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-300">No results found for "{query}"</p>
              <p className="text-xs text-gray-500">
                Try searching for coin tickers like "BTC" or topics like "Risk", "Order", or "FOMO".
              </p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const Icon = item.icon || ExternalLink;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#00F59B]/10 border border-[#00F59B]/40 text-white'
                      : 'hover:bg-white/[0.04] text-gray-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-[#00F59B]/20 text-[#00F59B]'
                          : 'bg-white/[0.05] text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate font-sans">
                          {item.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-semibold ${item.badgeColor}`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5 font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-mono text-gray-500 hidden sm:inline">
                      {item.path}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'text-[#00F59B] translate-x-1' : 'text-gray-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-4 py-2.5 bg-[#050a0f] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <div>{filteredResults.length} matching items</div>
        </div>
      </div>
    </div>
  );
}
