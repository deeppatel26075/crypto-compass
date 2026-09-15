/**
 * Crypto Compass — Lesson Catalog (Phase 13)
 *
 * 15 Structured, Beginner-First Educational Lessons across 5 Core Categories:
 * 1. Crypto Fundamentals (4)
 * 2. Market Basics (3)
 * 3. Trading Fundamentals (4)
 * 4. Risk Management (2)
 * 5. Trading Discipline (2)
 *
 * Strictly educational: zero financial advice, zero predictions, zero guaranteed-return claims.
 */

const CATEGORIES = {
  CRYPTO_FUNDAMENTALS: { id: 'crypto_fundamentals', label: 'Crypto Fundamentals' },
  MARKET_BASICS: { id: 'market_basics', label: 'Market Basics' },
  TRADING_FUNDAMENTALS: { id: 'trading_fundamentals', label: 'Trading Fundamentals' },
  RISK_MANAGEMENT: { id: 'risk_management', label: 'Risk Management' },
  TRADING_DISCIPLINE: { id: 'trading_discipline', label: 'Trading Discipline' },
};

const LESSONS = [
  // ==========================================
  // CATEGORY 1: CRYPTO FUNDAMENTALS (4 Lessons)
  // ==========================================
  {
    id: 'what-is-cryptocurrency',
    title: 'What Is Cryptocurrency?',
    category: 'crypto_fundamentals',
    categoryLabel: 'Crypto Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description: 'Understand the basic concept of digital currency, cryptography, and how decentralized networks differ from traditional money.',
    objectives: [
      'Define what cryptocurrency is and why it was created',
      'Understand the fundamental difference between digital money and fiat currency',
      'Learn how decentralization protects transaction integrity',
    ],
    sections: [
      {
        id: 'the-basics',
        title: 'Money in the Digital Era',
        content:
          'Cryptocurrency is a form of digital money secured by cryptography. Unlike traditional fiat currencies like the US Dollar or Euro, which are issued and controlled by central banks and governments, cryptocurrencies typically operate on decentralized computer networks. This means no single institution, corporation, or authority has unilateral power to alter the transaction history or inflate the supply arbitrarily.',
      },
      {
        id: 'how-it-functions',
        title: 'How Cryptography Protects Value',
        content:
          'In traditional banking, a centralized ledger tracks your balance. When you send money, the bank verifies that you have the funds and updates its private database. In cryptocurrency networks, mathematical cryptography replaces the trusted intermediary. Cryptographic keys enable users to prove ownership of their assets and digitally sign transactions without exposing sensitive credentials.',
      },
      {
        id: 'why-it-matters',
        title: 'Why It Matters for Beginners',
        content:
          'Understanding cryptocurrency begins with understanding self-custody and peer-to-peer exchange. Because transactions cannot be reversed once confirmed on the network, learners must develop careful operational habits before interacting with simulated or live digital asset environments.',
      },
    ],
    keyTakeaways: [
      'Cryptocurrency is decentralized digital money secured by mathematical cryptography.',
      'Unlike fiat currencies, most cryptocurrencies operate without central bank intermediaries.',
      'Decentralization removes single points of failure but requires personal responsibility.',
    ],
  },
  {
    id: 'how-blockchain-works',
    title: 'How Blockchain Works',
    category: 'crypto_fundamentals',
    categoryLabel: 'Crypto Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 6,
    description: 'Discover how distributed ledgers group transactions into blocks and chain them together into an immutable public record.',
    objectives: [
      'Understand what a distributed public ledger is',
      'Learn how blocks of transactions are cryptographically linked together',
      'Explain consensus mechanisms like Proof of Work and Proof of Stake simply',
    ],
    sections: [
      {
        id: 'the-ledger',
        title: 'A Public, Shared Notebook',
        content:
          'Imagine a financial ledger shared across thousands of computers simultaneously. Every participant has an identical copy. When a new batch of transactions occurs, it is packaged into a "block." Once network participants verify that all transactions in the block are valid, that block is permanently appended to the previous block, forming an unbroken "blockchain."',
      },
      {
        id: 'immutability',
        title: 'Why the Chain Cannot Be Tampered With',
        content:
          'Each block contains a cryptographic fingerprint called a hash of the block before it. If someone tried to alter a historical transaction from three months ago, that block’s hash would instantly change, breaking every subsequent link in the chain. The rest of the network would reject the tampered version automatically.',
      },
      {
        id: 'consensus',
        title: 'Reaching Agreement (Consensus)',
        content:
          'Networks use consensus mechanisms to agree on the single true version of history. Early networks like Bitcoin use Proof of Work, where specialized computers solve computational puzzles. Modern networks like Ethereum use Proof of Stake, where validators lock tokens as collateral to secure the network. Both approaches eliminate the need for a central administrator.',
      },
    ],
    keyTakeaways: [
      'A blockchain is an append-only distributed ledger shared across a network of nodes.',
      'Cryptographic hashes link each block to the previous one, making history tamper-resistant.',
      'Consensus algorithms allow independent computers to agree on transaction order without central coordinators.',
    ],
  },
  {
    id: 'bitcoin-vs-altcoins',
    title: 'Bitcoin vs Altcoins',
    category: 'crypto_fundamentals',
    categoryLabel: 'Crypto Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description: 'Learn why Bitcoin is considered digital gold and how alternative cryptocurrencies (altcoins) serve distinct use cases.',
    objectives: [
      'Differentiate Bitcoin from other digital assets',
      'Understand the term "altcoin" and why thousands exist',
      'Explore use cases like smart contracts, decentralized applications, and utility tokens',
    ],
    sections: [
      {
        id: 'bitcoin-the-first',
        title: 'Bitcoin: The Pioneer and Store of Value',
        content:
          'Introduced in 2008 by the pseudonymous creator Satoshi Nakamoto, Bitcoin was the world’s first successful decentralized cryptocurrency. With a mathematically enforced supply cap of 21 million coins, Bitcoin focuses primarily on monetary predictability, security, and serving as a decentralized store of value often likened to "digital gold."',
      },
      {
        id: 'what-are-altcoins',
        title: 'Altcoins: Beyond Simple Money',
        content:
          'Any cryptocurrency other than Bitcoin is commonly referred to as an "altcoin" (alternative coin). Many altcoins were created to solve different technological challenges or power distinct ecosystems. For example, Ethereum introduced "smart contracts" — self-executing code that allows developers to build decentralized applications (dApps), lending protocols, and digital property without intermediaries.',
      },
      {
        id: 'practical-perspective',
        title: 'Hypothetical Comparison Example',
        content:
          'For learning purposes, consider an analogy: If Bitcoin is like digital gold used for preserving purchasing power, a programmable network like Ethereum is like digital electricity powering decentralized software programs. Each serves a different technical and economic function within the broader ecosystem.',
      },
    ],
    keyTakeaways: [
      'Bitcoin is the original cryptocurrency designed as a decentralized, supply-capped store of value.',
      'Altcoins encompass all other cryptocurrencies, many offering smart contract programmability or specialized utility.',
      'Different crypto assets target fundamentally different use cases and technological trade-offs.',
    ],
  },
  {
    id: 'crypto-wallets-explained',
    title: 'Crypto Wallets Explained',
    category: 'crypto_fundamentals',
    categoryLabel: 'Crypto Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description: 'Demystify public keys, private keys, seed phrases, and the vital difference between custodial and non-custodial wallets.',
    objectives: [
      'Understand that crypto wallets store keys, not actual coins',
      'Differentiate between public addresses and secret private keys',
      'Understand the trade-offs between custodial and non-custodial custody',
    ],
    sections: [
      {
        id: 'keys-not-coins',
        title: 'Wallets Store Keys, Not Coins',
        content:
          'A common beginner misconception is that crypto wallets store physical or digital coins like a leather wallet holds cash. In reality, all cryptocurrency exists on the blockchain itself. A wallet simply stores the cryptographic keys that prove you have the authority to transfer those assets.',
      },
      {
        id: 'public-vs-private',
        title: 'Public Keys vs Private Keys',
        content:
          'Think of your public address like your bank account IBAN or email address: you can safely share it with anyone who wants to send you funds. Your private key is like your secret password or digital signature: whoever holds the private key controls the funds associated with that public address. Never share private keys or recovery seed phrases.',
      },
      {
        id: 'custody-types',
        title: 'Custodial vs Self-Custody Wallets',
        content:
          'In a custodial wallet (such as a centralized exchange account), the service provider holds the private keys on your behalf. In a self-custody wallet (software or hardware device), you alone control the keys. While self-custody offers sovereign control, it also carries the responsibility that lost seed phrases cannot be recovered by customer support.',
      },
    ],
    keyTakeaways: [
      'Crypto wallets manage cryptographic keys that grant access to on-chain balances.',
      'Public addresses receive funds; private keys authorize outgoing transactions and must remain secret.',
      'Self-custody gives full control to the owner, but requires rigorous backup and security discipline.',
    ],
  },

  // ==========================================
  // CATEGORY 2: MARKET BASICS (3 Lessons)
  // ==========================================
  {
    id: 'understanding-crypto-prices',
    title: 'Understanding Crypto Prices',
    category: 'market_basics',
    categoryLabel: 'Market Basics',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description: 'Explore how supply and demand dynamics across digital asset exchanges determine the prices you see on market charts.',
    objectives: [
      'Understand how buyer and seller interaction forms market prices',
      'Learn what the order book, bid, and ask represent',
      'Recognize why crypto trades 24/7 globally without market halts',
    ],
    sections: [
      {
        id: 'supply-and-demand',
        title: 'Market Equilibrium in Action',
        content:
          'Cryptocurrency prices are not set by a single committee, company, or government. Instead, they reflect the ongoing balance between buyers and sellers across global exchanges. If more participants want to buy an asset than sell it at the current price, buyers must bid higher prices to attract sellers, driving the market price upward. Conversely, when selling pressure exceeds buying interest, prices adjust downward.',
      },
      {
        id: 'order-books',
        title: 'Bids, Asks, and Order Books',
        content:
          'Exchanges organize buyer and seller intentions into an order book. A "bid" represents the maximum price a buyer is willing to pay. An "ask" is the minimum price a seller is willing to accept. The difference between the highest bid and lowest ask is called the "bid-ask spread." The last matched trade between a buyer and seller forms the latest published market price.',
      },
      {
        id: 'global-24-7',
        title: 'The Continuous 24/7 Market',
        content:
          'Unlike traditional stock markets that open and close at fixed business hours, cryptocurrency markets trade continuously 24 hours a day, 7 days a week, 365 days a year. This global liquidity means news and sentiment can impact market valuations at any time of day or night.',
      },
    ],
    keyTakeaways: [
      'Market prices are continuously determined by the collective interaction of buyers and sellers.',
      'The order book matches bids (buy offers) and asks (sell offers); their intersection sets the market price.',
      'Crypto markets are global and operate 24/7 without geographic market closures.',
    ],
  },
  {
    id: 'market-capitalization-explained',
    title: 'Market Capitalization Explained',
    category: 'market_basics',
    categoryLabel: 'Market Basics',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description: 'Learn why the unit price of a coin does not tell you how big or valuable a cryptocurrency project truly is.',
    objectives: [
      'Calculate market capitalization using price and circulating supply',
      'Avoid the common beginner mistake of "unit bias"',
      'Categorize assets by market cap tiers (large-cap, mid-cap, small-cap)',
    ],
    sections: [
      {
        id: 'the-formula',
        title: 'What Is Market Capitalization?',
        content:
          'Market capitalization (or market cap) is the total estimated value of all circulating coins of a specific cryptocurrency. It is calculated with a simple mathematical formula:\n\nMarket Capitalization = Current Unit Price × Circulating Supply\n\nFor example, if an asset trades at $10.00 and has 1,000,000 coins in circulation, its market cap is $10,000,000.',
      },
      {
        id: 'unit-bias-trap',
        title: 'The "Unit Bias" Trap',
        content:
          'A frequent beginner error is thinking a coin trading at $0.0001 is "cheap" and has more room to grow than a coin trading at $50,000. If the $0.0001 coin has 100 trillion coins in circulation, its total valuation might already be enormous. Always evaluate an asset’s market capitalization and supply schedule rather than unit price alone.',
      },
      {
        id: 'tiers',
        title: 'Market Cap Tiers and Characteristics',
        content:
          'In general market classification: Large-cap assets (often tens of billions in market cap) generally possess deeper liquidity and historically lower relative volatility than small-cap assets. Small-cap assets often suffer from thinner order books and can experience extreme percentage swings on modest trading volume.',
      },
    ],
    keyTakeaways: [
      'Market cap equals price multiplied by circulating coin supply.',
      'Unit price alone does not indicate whether a cryptocurrency is large, small, or reasonably valued.',
      'Larger market cap assets typically offer deeper liquidity and more established trading volume.',
    ],
  },
  {
    id: 'volatility-explained',
    title: 'Volatility Explained',
    category: 'market_basics',
    categoryLabel: 'Market Basics',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description: 'Understand what price volatility is, why it occurs so frequently in crypto, and how to stay calm during market fluctuations.',
    objectives: [
      'Define market volatility in simple, practical terms',
      'Identify key drivers of price swings in digital asset markets',
      'Learn how emotional discipline helps manage unexpected price action',
    ],
    sections: [
      {
        id: 'what-is-volatility',
        title: 'Understanding Rapid Price Swings',
        content:
          'Volatility measures how quickly and dramatically the price of an asset changes over a given timeframe. If an asset typically fluctuates by 0.5% in a day, it has low volatility. If an asset routinely moves 5%, 10%, or 20% in a single day, it has high volatility. Cryptocurrency markets are among the most volatile financial markets in the world.',
      },
      {
        id: 'why-crypto-moves',
        title: 'Why Are Crypto Markets So Volatile?',
        content:
          'Several factors contribute to crypto volatility: nascent market maturity, rapid shifts in regulatory news, speculative sentiment, 24/7 global trading, and liquidations in leveraged derivative markets. Because the asset class is relatively young compared to centuries-old bond or equity markets, smaller shifts in capital can create pronounced price waves.',
      },
      {
        id: 'perspective',
        title: 'Managing Volatility Conceptually',
        content:
          'For a beginner, volatility can feel stressful. However, volatility is simply a factual characteristic of dynamic markets. Understanding that prices move in both directions helps learners resist impulsive reactions and avoid making emotional decisions during periods of heightened market turbulence.',
      },
    ],
    keyTakeaways: [
      'Volatility describes the magnitude and frequency of an asset’s price movements.',
      'Cryptocurrency markets exhibit high volatility due to youth, 24/7 trading, and sentiment sensitivity.',
      'Recognizing volatility as normal market behavior helps learners avoid emotional, impulsive decisions.',
    ],
  },

  // ==========================================
  // CATEGORY 3: TRADING FUNDAMENTALS (4 Lessons)
  // ==========================================
  {
    id: 'what-is-spot-trading',
    title: 'What Is Spot Trading?',
    category: 'trading_fundamentals',
    categoryLabel: 'Trading Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description: 'Learn the cornerstone of crypto paper trading: buying and selling the actual underlying digital asset for direct delivery.',
    objectives: [
      'Define spot trading and how it contrasts with complex derivatives',
      'Understand asset ownership in simulated spot markets',
      'Recognize why beginners start with spot paper trading',
    ],
    sections: [
      {
        id: 'spot-definition',
        title: 'Trading on the "Spot"',
        content:
          'Spot trading refers to the purchase or sale of an asset for immediate settlement and delivery "on the spot." When you execute a simulated spot BUY order on Crypto Compass, your virtual cash balance decreases by the exact cost of the purchase, and your account immediately receives the corresponding cryptocurrency quantity into your holdings.',
      },
      {
        id: 'no-debt-or-leverage',
        title: 'Ownership Without Borrowed Funds',
        content:
          'In spot trading, you trade only with the funds you possess. There is no borrowing, no leverage, no margin interest, and no risk of sudden liquidation from falling below debt maintenance ratios. If you buy 0.05 BTC in spot trading, you own 0.05 BTC regardless of how the price moves in subsequent days.',
      },
      {
        id: 'spot-foundation',
        title: 'The Safest Educational Sandbox',
        content:
          'Educational platforms prioritize spot trading because it directly reflects fundamental asset mechanics. Learning how order execution, average purchase price, and holding allocation work in a spot simulator builds solid habits without the confounding dangers of debt or complex financial instruments.',
      },
    ],
    keyTakeaways: [
      'Spot trading involves immediate exchange and ownership of the underlying asset.',
      'Spot transactions use only available account capital, avoiding debt, margin, and liquidation risks.',
      'Spot paper trading is the ideal foundation for beginners developing order execution familiarity.',
    ],
  },
  {
    id: 'market-orders-explained',
    title: 'Market Orders Explained',
    category: 'trading_fundamentals',
    categoryLabel: 'Trading Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description: 'Understand how market orders prioritize immediate execution speed over guaranteed execution price.',
    objectives: [
      'Define how a market order fills against the order book',
      'Understand the trade-off between execution speed and price certainty',
      'Explain what slippage means when orders are filled',
    ],
    sections: [
      {
        id: 'instant-fill',
        title: 'Prioritizing Speed Above All',
        content:
          'A market order is an instruction to buy or sell an asset immediately at the best currently available market price. When you submit a market order, you are telling the trading engine: "I want this order filled right now, regardless of minor fluctuations in the price."',
      },
      {
        id: 'how-it-fills',
        title: 'Matching Against Existing Bids and Asks',
        content:
          'A market BUY matches immediately with the cheapest available SELL orders (asks) in the order book. A market SELL matches immediately with the highest available BUY orders (bids). Because it consumes existing liquidity, a market order fills almost instantly.',
      },
      {
        id: 'slippage-concept',
        title: 'Understanding Execution Price and Slippage',
        content:
          'In fast-moving or thinly traded markets, the fill price of a market order can differ slightly from the quote you saw a second earlier. This difference is known as "slippage." In our paper-trading simulator, server-authoritative live prices ensure that orders reflect real market pricing at the exact moment of execution.',
      },
    ],
    keyTakeaways: [
      'Market orders execute immediately at the best available prevailing market price.',
      'They prioritize execution speed over exact price control.',
      'Understanding slippage and server-authoritative fill prices is vital for realistic simulation.',
    ],
  },
  {
    id: 'buy-vs-sell',
    title: 'Buy vs Sell Orders',
    category: 'trading_fundamentals',
    categoryLabel: 'Trading Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description: 'Explore the two primary market operations: exchanging cash for crypto, and releasing crypto holdings back into cash liquidity.',
    objectives: [
      'Understand the mechanics of acquiring assets via BUY orders',
      'Understand the mechanics of partial and full exits via SELL orders',
      'Learn why short selling is strictly prohibited in beginner paper trading',
    ],
    sections: [
      {
        id: 'buying-mechanics',
        title: 'The BUY Order: Exchanging Cash for Assets',
        content:
          'When you submit a BUY order, you commit a portion of your virtual cash balance to acquire a specific quantity of cryptocurrency. Your cash reserves decrease, and your portfolio holding in that asset increases. If you already owned some of that asset at a different price, your average buy price adjusts mathematically according to the weighted average of your purchases.',
      },
      {
        id: 'selling-mechanics',
        title: 'The SELL Order: Returning to Cash',
        content:
          'A SELL order converts a portion (or all) of an existing cryptocurrency holding back into virtual cash. The asset leaves your tracked holdings, and cash proceeds are credited to your virtual wallet. Selling allows simulated traders to rebalance their portfolio or reduce exposure to a volatile market.',
      },
      {
        id: 'no-short-selling',
        title: 'Selling What You Own vs Short Selling',
        content:
          'In spot trading, you can only sell cryptocurrency that your account actually owns. Short selling — borrowing an asset you do not own in hopes of buying it back cheaper later — introduces unlimited theoretical risk and is excluded from beginner paper-trading simulators to reinforce prudent ownership principles.',
      },
    ],
    keyTakeaways: [
      'BUY orders exchange cash reserves for asset ownership, recalculating weighted average purchase cost.',
      'SELL orders exchange asset holdings back into cash liquidity to rebalance exposure.',
      'Spot trading requires owning the asset before selling; short selling is excluded to protect capital.',
    ],
  },
  {
    id: 'understanding-trading-volume',
    title: 'Understanding Trading Volume',
    category: 'trading_fundamentals',
    categoryLabel: 'Trading Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description: 'Learn why trading volume is one of the most vital metrics for gauging market interest, liquidity, and conviction.',
    objectives: [
      'Define trading volume over a 24-hour window',
      'Recognize how volume relates to liquidity and bid-ask spreads',
      'Understand why low-volume assets pose higher execution risks',
    ],
    sections: [
      {
        id: 'what-is-volume',
        title: 'Measuring Market Activity',
        content:
          'Trading volume represents the total dollar amount of an asset that has been bought and sold across exchanges over a specified period, typically the last 24 hours. If an asset has $20 billion in 24-hour volume, it means an enormous amount of capital is actively changing hands.',
      },
      {
        id: 'volume-and-liquidity',
        title: 'Volume as a Sign of Liquidity',
        content:
          'High trading volume usually indicates deep liquidity. Deep liquidity means there are abundant buyers and sellers in the order book, allowing traders to enter or exit positions quickly with minimal slippage. Conversely, an asset with very low volume may have wide spreads between bids and asks, making it difficult to execute orders without moving the price.',
      },
      {
        id: 'educational-relevance',
        title: 'Why Volume Matters for Beginners',
        content:
          'When exploring markets, looking at 24-hour volume alongside price gives helpful context. A sudden price move accompanied by high volume indicates broad participation across market participants, whereas a price spike on tiny volume can be fragile and easily reversed.',
      },
    ],
    keyTakeaways: [
      'Trading volume tracks the total monetary value of transactions over a given timeframe.',
      'Higher volume generally translates to deeper liquidity, narrower spreads, and lower execution slippage.',
      'Volume helps learners distinguish between well-supported market moves and thin, illiquid price spikes.',
    ],
  },

  // ==========================================
  // CATEGORY 4: RISK MANAGEMENT (2 Lessons)
  // ==========================================
  {
    id: 'what-is-risk-management',
    title: 'What Is Risk Management?',
    category: 'risk_management',
    categoryLabel: 'Risk Management',
    difficulty: 'BEGINNER',
    estimatedMinutes: 6,
    description: 'Discover the single most critical discipline in trading: protecting your capital so you can survive market downturns.',
    objectives: [
      'Understand that trading is about managing risk, not predicting the future',
      'Learn the core concept of capital preservation',
      'Recognize why emotional attachment to positions leads to poor outcomes',
    ],
    sections: [
      {
        id: 'capital-preservation',
        title: 'Rule Number One: Capital Preservation',
        content:
          'Many beginners believe trading success depends entirely on picking the right coin that will increase in value. In reality, experienced practitioners know that longevity and risk management come first. If you lose 50% of your account capital, you need a 100% gain just to break even. Protecting your principal capital is the foundation of all sound trading.',
      },
      {
        id: 'managing-uncertainty',
        title: 'Accepting Market Uncertainty',
        content:
          'No indicator, algorithm, chart pattern, or analyst can guarantee future price direction. Every trade involves uncertainty. Risk management is the deliberate process of determining in advance how much you are willing to risk on a single trade and ensuring that an adverse outcome cannot jeopardize your financial well-being.',
      },
      {
        id: 'practical-mindset',
        title: 'Thinking in Probabilities',
        content:
          'Rather than viewing a single trade as "right" or "wrong," disciplined learners view trades as part of a series of probability-based decisions. By keeping simulated risk per trade modest, unexpected market drops become manageable learning events rather than catastrophic losses.',
      },
    ],
    keyTakeaways: [
      'Capital preservation is the foundational priority of every disciplined trading system.',
      'Markets are inherently uncertain; risk management prepares for unfavorable outcomes in advance.',
      'Sustaining small, controlled losses keeps an account resilient and able to continue practicing.',
    ],
  },
  {
    id: 'position-sizing-basics',
    title: 'Position Sizing Basics',
    category: 'risk_management',
    categoryLabel: 'Risk Management',
    difficulty: 'BEGINNER',
    estimatedMinutes: 6,
    description: 'Learn how to determine appropriate order sizes so that single trades never dominate your overall portfolio balance.',
    objectives: [
      'Understand position sizing as a percentage of total portfolio capital',
      'Learn how the Trade Coach classifies cash allocation and concentration',
      'Avoid the common beginner mistake of going "all-in" on one asset',
    ],
    sections: [
      {
        id: 'what-is-position-sizing',
        title: 'How Much Should You Commit?',
        content:
          'Position sizing answers the practical question: "How many dollars should I allocate to this specific trade?" If you have a $10,000 virtual balance and allocate $500 to Bitcoin, your position size is 5% of your available cash. If you commit $8,000, your position size is 80% — an extremely concentrated exposure.',
      },
      {
        id: 'trade-coach-benchmarks',
        title: 'Understanding Exposure Tiers',
        content:
          'In Crypto Compass, our Trade Coach categorizes cash commitments into clear pedagogical tiers:\n• Low Exposure: Committing under 10% of cash reserves.\n• Moderate Exposure: Committing between 10% and 25%.\n• High Exposure: Committing between 25% and 50%.\n• Very High Exposure: Committing more than 50% of available cash to a single trade.',
      },
      {
        id: 'diversification-principle',
        title: 'The Danger of the "All-In" Mentality',
        content:
          'Beginners often feel tempted to put 100% of their cash into a single coin hoping for rapid gains. However, if that single asset suffers a sudden 30% drop, the entire account is crippled. Modest position sizing preserves liquidity so you can participate in future opportunities without panic.',
      },
    ],
    keyTakeaways: [
      'Position sizing determines the percentage of your total capital allocated to an individual trade.',
      'Committing small percentages keeps cash reserves available and mitigates single-asset volatility.',
      'Avoiding concentrated "all-in" allocations is the most reliable way to maintain financial stability.',
    ],
  },

  // ==========================================
  // CATEGORY 5: TRADING DISCIPLINE (2 Lessons)
  // ==========================================
  {
    id: 'trading-with-a-plan',
    title: 'Trading With a Plan',
    category: 'trading_discipline',
    categoryLabel: 'Trading Discipline',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description: 'Discover why entering a trade without a pre-defined plan leaves you vulnerable to emotion, fear, and impulsive reactions.',
    objectives: [
      'Understand the essential components of a trading plan',
      'Learn why rules must be established before entering a trade',
      'Develop the habit of documenting trading rationale and outcomes',
    ],
    sections: [
      {
        id: 'why-plans-matter',
        title: 'Why Emotion Is the Trader’s Greatest Rival',
        content:
          'When real or simulated capital is at stake, human emotions — fear, greed, hope, and regret — activate rapidly. When the market surges, greed tempts you to buy at the top. When the market drops, fear urges you to sell in a panic. A trading plan acts as an objective, pre-calculated roadmap that guides your actions when emotions run hot.',
      },
      {
        id: 'plan-components',
        title: 'Core Elements of a Trading Plan',
        content:
          'A thorough trading plan answers four questions before clicking submit:\n1. Why am I entering this trade? (Thesis)\n2. How much capital am I allocating? (Position Sizing)\n3. At what price or condition will I accept that my thesis was wrong? (Risk Limit)\n4. At what target or condition will I take profits or rebalance? (Exit Strategy)',
      },
      {
        id: 'consistency-over-luck',
        title: 'Cultivating Systematic Discipline',
        content:
          'Anyone can get lucky on a single random trade. But consistent, repeatable improvement comes from following a systematic process. Paper trading is the ideal venue to practice adhering to your plan without real-world financial consequences.',
      },
    ],
    keyTakeaways: [
      'A trading plan removes emotion from market decisions by pre-defining entry, sizing, and exits.',
      'Deciding your risk limits before entering a trade protects you from panic during adverse price action.',
      'Long-term improvement relies on adhering consistently to a disciplined process rather than random luck.',
    ],
  },
  {
    id: 'common-beginner-mistakes',
    title: 'Common Beginner Trading Mistakes',
    category: 'trading_discipline',
    categoryLabel: 'Trading Discipline',
    difficulty: 'BEGINNER',
    estimatedMinutes: 6,
    description: 'Examine the classic pitfalls that trip up new crypto participants: FOMO, over-trading, revenge trading, and lack of patience.',
    objectives: [
      'Recognize FOMO (Fear of Missing Out) and learn how to resist it',
      'Understand the hazards of revenge trading after an unfavorable outcome',
      'Identify over-trading and recognize when to step away from the screen',
    ],
    sections: [
      {
        id: 'fomo-trap',
        title: 'The FOMO Trap (Fear of Missing Out)',
        content:
          'FOMO occurs when you see a coin’s price skyrocketing on social media or market charts, and you feel an intense urge to buy immediately so you don’t miss the gains. By the time an asset has surged 50% in a few hours, early buyers are often preparing to take profits, leaving FOMO buyers holding the asset at local peaks.',
      },
      {
        id: 'revenge-trading',
        title: 'Revenge Trading After a Loss',
        content:
          'When a trade doesn’t go as planned, the human ego feels bruised. "Revenge trading" is the impulsive act of immediately entering another, often larger trade to "win back" the lost capital. This emotional reaction frequently leads to compounded mistakes and rapid balance depletion.',
      },
      {
        id: 'overtrading',
        title: 'Over-Trading and the Need for Action',
        content:
          'Beginners often feel that they must execute multiple trades every hour to be a "real trader." However, high-quality setups are infrequent. Over-trading exhausts your mental focus and accumulates unnecessary transaction costs. Sometimes the most disciplined move in trading is doing nothing and observing.',
      },
    ],
    keyTakeaways: [
      'FOMO leads to buying extended tops; disciplined traders wait for calm, structured entries.',
      'Revenge trading magnifies errors; step away and reset emotionally after an unfavorable trade.',
      'Quality always exceeds quantity; patient observation is a hallmark of seasoned market participants.',
    ],
  },
];

module.exports = {
  CATEGORIES,
  LESSONS,
};
