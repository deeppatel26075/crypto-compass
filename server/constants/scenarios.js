/**
 * Crypto Compass — Scenario Catalog (Phase 15)
 *
 * 10 Curated Educational Scenarios across 5 Core Categories:
 * 1. Crypto Fundamentals (2 scenarios)
 * 2. Market Basics (2 scenarios)
 * 3. Trading Fundamentals (2 scenarios)
 * 4. Risk Management (2 scenarios)
 * 5. Trading Discipline (2 scenarios)
 *
 * Content & Safety Invariants:
 * - Strictly educational decision-making in realistic educational situations.
 * - ZERO financial advice, ZERO price predictions, ZERO guaranteed profit claims.
 * - Every scenario contains EXACTLY ONE option classified as "STRONG", with remaining options
 *   classified as "REASONABLE", "RISKY", or "UNHELPFUL".
 * - All scenarios map to established Phase 13 lessons.
 */

const CATEGORIES = {
  CRYPTO_FUNDAMENTALS: { id: 'crypto_fundamentals', label: 'Crypto Fundamentals' },
  MARKET_BASICS: { id: 'market_basics', label: 'Market Basics' },
  TRADING_FUNDAMENTALS: { id: 'trading_fundamentals', label: 'Trading Fundamentals' },
  RISK_MANAGEMENT: { id: 'risk_management', label: 'Risk Management' },
  TRADING_DISCIPLINE: { id: 'trading_discipline', label: 'Trading Discipline' },
};

const SCENARIOS = [
  // ==========================================
  // CATEGORY 1: CRYPTO FUNDAMENTALS (2 Scenarios)
  // ==========================================
  {
    id: 'scenario-blockchain-verification',
    lessonId: 'how-blockchain-works',
    title: 'Navigating Unconfirmed Network Transactions',
    category: 'crypto_fundamentals',
    categoryLabel: 'Crypto Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description:
      'Learn how decentralized blockchain consensus and confirmation depth protect transactions from being reversed or double-spent.',
    context:
      'In a simulated educational demonstration, you initiate a digital asset transfer between two virtual demo wallets. A few seconds after broadcasting, the user interface indicates that the transaction has appeared in the network mempool, but zero cryptographic blocks have confirmed it yet. The recipient asks if they can safely consider the simulated funds final and non-reversible immediately.',
    question:
      'How should you evaluate the finality of an unconfirmed blockchain transaction based on decentralized consensus principles?',
    options: [
      {
        id: 'opt-verify-confirmations',
        text: 'Wait until the transaction is included in a block and achieves multiple network confirmations before treating it as final and irreversible.',
        explanation:
          'In decentralized proof-of-work and proof-of-stake blockchains, transactions in the mempool are unconfirmed proposals. Waiting for multiple block confirmations ensures that the decentralized network consensus has cryptographically sealed the transaction into the distributed ledger, rendering it practically irreversible.',
        educationalQuality: 'STRONG',
      },
      {
        id: 'opt-rely-on-mempool',
        text: 'Assume that appearing in the mempool guarantees final settlement because the broadcast was successful.',
        explanation:
          'Mempool appearance merely means nodes have received the transaction broadcast. Until it is included in a mined or validated block, it remains unconfirmed and could theoretically be dropped or replaced by a conflicting transaction.',
        educationalQuality: 'RISKY',
      },
      {
        id: 'opt-broadcast-repeatedly',
        text: 'Repeatedly re-broadcast the same transaction every 10 seconds to force the network nodes to confirm it faster.',
        explanation:
          'Broadcasting identical raw transactions does not alter network validation rules or block time intervals. Block inclusion depends on miner/validator block generation times and network capacity, not repeated submissions.',
        educationalQuality: 'UNHELPFUL',
      },
      {
        id: 'opt-check-node-status',
        text: 'Acknowledge receipt of the broadcast while checking a block explorer, but remind the recipient that finality requires on-chain block confirmations.',
        explanation:
          'This is a reasonable communication practice, though actively verifying the required number of block confirmations remains the definitive security standard for on-chain settlement.',
        educationalQuality: 'REASONABLE',
      },
    ],
    keyConcepts: [
      'Mempool vs Block Confirmation',
      'Transaction Finality',
      'Decentralized Consensus',
      'Double-Spend Prevention',
    ],
  },
  {
    id: 'scenario-wallet-seed-phrase-security',
    lessonId: 'crypto-wallets-explained',
    title: 'Evaluating Non-Custodial Backup Practices',
    category: 'crypto_fundamentals',
    categoryLabel: 'Crypto Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description:
      'Explore self-custody principles and identify secure practices for storing recovery seed phrases.',
    context:
      'You are setting up a non-custodial software wallet for educational practice. The wallet generates a 12-word secret recovery seed phrase on the screen, accompanied by a warning that anyone who accesses these words has unrestricted authority over all associated cryptographic addresses. You need to establish a secure backup method.',
    question:
      'Which action represents the strongest application of non-custodial security principles for managing recovery phrases?',
    options: [
      {
        id: 'opt-cloud-screenshot',
        text: 'Take a quick screenshot on your smartphone and save it to an automatic cloud photo backup folder so it cannot be physically lost.',
        explanation:
          'Storing seed phrases unencrypted in cloud storage or on internet-connected devices exposes them to malware, account takeovers, and synchronization vulnerabilities, violating non-custodial operational security.',
        educationalQuality: 'RISKY',
      },
      {
        id: 'opt-offline-physical-backup',
        text: 'Write the 12 words down legibly on physical paper or stamped metal, verify the words against the backup prompt, and store it offline in a secure, private location.',
        explanation:
          'Physical offline backups prevent digital interception and remote extraction. Because the recovery phrase directly derives your private keys, keeping it strictly isolated from internet-connected devices is the foundational rule of self-custody.',
        educationalQuality: 'STRONG',
      },
      {
        id: 'opt-email-draft',
        text: 'Save the words in an email draft addressed to yourself with a disguised subject line.',
        explanation:
          'Email accounts are frequently targeted by credential stuffing and phishing attacks. Obfuscating subject lines provides no cryptographic protection if your email provider or session is compromised.',
        educationalQuality: 'UNHELPFUL',
      },
      {
        id: 'opt-memorize-only',
        text: 'Rely solely on mental memorization of the 12 words without any physical record to avoid leaving physical traces.',
        explanation:
          'While memorization avoids physical exposure, human memory is inherently vulnerable to stress, illness, and decay. A total loss of memory results in permanent, irrecoverable loss of funds.',
        educationalQuality: 'REASONABLE',
      },
    ],
    keyConcepts: [
      'Non-Custodial Ownership',
      'Private Key Derivation',
      'Offline Storage Principles',
      'Attack Surface Reduction',
    ],
  },

  // ==========================================
  // CATEGORY 2: MARKET BASICS (2 Scenarios)
  // ==========================================
  {
    id: 'scenario-evaluating-market-cap-vs-unit-price',
    lessonId: 'market-capitalization-explained',
    title: 'Evaluating Market Capitalization vs Unit Price Bias',
    category: 'market_basics',
    categoryLabel: 'Market Basics',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description:
      'Understand why total market capitalization determines network valuation rather than the nominal per-token unit price.',
    context:
      'In an educational market study, you are comparing two simulated digital assets: Asset Alpha is priced at $0.0002 per token with a circulating supply of 500 billion tokens ($100M market cap). Asset Beta is priced at $50.00 per token with a circulating supply of 2 million tokens ($100M market cap). A peer remarks that Asset Alpha is "cheaper and has much more room to reach $1.00 than Asset Beta."',
    question:
      'How should an educated learner evaluate the economic relationship between unit price, circulating supply, and market capitalization?',
    options: [
      {
        id: 'opt-unit-bias-fallacy',
        text: 'Agree with the peer because buying millions of whole tokens for a few dollars always offers easier upside than buying fractions of a $50 token.',
        explanation:
          'This is the classic "unit bias" fallacy. A low nominal unit price often reflects a massive circulating supply. For Asset Alpha to reach $1.00, its market capitalization would have to swell to $500 billion, which requires enormous aggregate capital inflow regardless of unit price.',
        educationalQuality: 'UNHELPFUL',
      },
      {
        id: 'opt-evaluate-total-market-cap',
        text: 'Recognize that both assets currently have an identical $100M market valuation, and evaluate growth potential based on aggregate market capitalization and circulating supply rather than per-unit nominal cost.',
        explanation:
          'Market capitalization equals circulating supply multiplied by current unit price. Evaluating market valuation rather than nominal per-unit price prevents unit bias and reveals the true scale of capital required for valuation expansion.',
        educationalQuality: 'STRONG',
      },
      {
        id: 'opt-focus-only-on-supply',
        text: 'Dismiss Asset Alpha solely because its token supply is high, without considering liquidity or adoption metrics.',
        explanation:
          'While circulating supply is a vital denominator in calculating market cap, high token supply alone does not automatically invalidate a network. The key is understanding how supply and price multiply to form total valuation.',
        educationalQuality: 'REASONABLE',
      },
      {
        id: 'opt-trade-fractional-shares',
        text: 'Assume token supply is irrelevant as long as the simulated trading volume is above average.',
        explanation:
          'Trading volume indicates recent turnover, but ignoring circulating supply leaves learners blind to the overall economic size and valuation ceiling of the asset.',
        educationalQuality: 'RISKY',
      },
    ],
    keyConcepts: [
      'Market Capitalization Equation',
      'Circulating Supply Dynamics',
      'Unit Bias Cognitive Fallacy',
      'Valuation Scale',
    ],
  },
  {
    id: 'scenario-navigating-high-volatility',
    lessonId: 'volatility-explained',
    title: 'Responding to Rapid Intraday Price Swings',
    category: 'market_basics',
    categoryLabel: 'Market Basics',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description:
      'Learn how to manage emotional reactivity and apply risk management rules during periods of sharp market volatility.',
    context:
      'You are observing a simulated crypto asset in the educational simulator. Over the course of 30 minutes, broad market announcements cause the simulated price to drop by 14% on elevated volatility, breaking through short-term moving averages. Your initial paper-trading plan defined a position size based on accepting normal crypto volatility while keeping risk below 2% of total virtual capital.',
    question:
      'What is the most disciplined educational approach when facing sudden market volatility?',
    options: [
      {
        id: 'opt-panic-close-all',
        text: 'Immediately close all simulated positions in a panic without reviewing whether your predetermined risk parameters have been breached.',
        explanation:
          'Reacting impulsively to price swings without referencing your predefined plan often causes learners to exit near temporary exhaustion points, locking in losses driven by panic rather than structured analysis.',
        educationalQuality: 'UNHELPFUL',
      },
      {
        id: 'opt-double-down-unplanned',
        text: 'Double your virtual position size immediately to average down your entry cost, hoping for a fast rebound.',
        explanation:
          'Averaging down impulsively during high volatility compounds exposure and violates position-sizing discipline. If the decline continues, this uncalculated exposure severely accelerates virtual portfolio drawdowns.',
        educationalQuality: 'RISKY',
      },
      {
        id: 'opt-pause-and-review-plan',
        text: 'Pause emotional reactions, evaluate whether the price action has breached your pre-planned risk threshold, and execute planned contingency steps calmly.',
        explanation:
          'Volatility is an inherent feature of cryptocurrency markets. Disciplined traders expect price fluctuations and rely on predetermined risk limits (such as predefined invalidation levels and position size limits) rather than making reactive, emotionally charged decisions.',
        educationalQuality: 'STRONG',
      },
      {
        id: 'opt-reduce-exposure-cautiously',
        text: 'Discretionarily reduce half of your virtual position to feel more comfortable, regardless of where your plan specified invalidation.',
        explanation:
          'Taking partial risk off can reduce psychological anxiety, but making discretionary adjustments outside of a systematic plan weakens consistent execution over time.',
        educationalQuality: 'REASONABLE',
      },
    ],
    keyConcepts: [
      'Volatility Management',
      'Predefined Invalidation',
      'Emotional Control in Trading',
      'Downside Protection Rules',
    ],
  },

  // ==========================================
  // CATEGORY 3: TRADING FUNDAMENTALS (2 Scenarios)
  // ==========================================
  {
    id: 'scenario-market-order-slippage',
    lessonId: 'market-orders-explained',
    title: 'Understanding Slippage in Low-Liquidity Order Books',
    category: 'trading_fundamentals',
    categoryLabel: 'Trading Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description:
      'Examine how order book depth influences the average execution price of market orders and creates slippage.',
    context:
      'In the simulated trading terminal, you examine an altcoin with a thin order book: the best ask is $10.00 for only 5 tokens, the next ask is $10.50 for 10 tokens, and the subsequent ask is $12.00 for 50 tokens. You want to purchase 30 virtual tokens in a single transaction. You can choose between a market order or a limit order.',
    question:
      'What should a learner understand about executing a large market order into a shallow order book?',
    options: [
      {
        id: 'opt-expect-guaranteed-price',
        text: 'A market order guarantees that all 30 tokens will fill at exactly the displayed best ask of $10.00.',
        explanation:
          'Market orders guarantee immediate execution, not price. Because only 5 tokens are available at $10.00, the remaining 25 tokens will walk up the order book to higher prices ($10.50 and $12.00), resulting in a significantly higher average fill price.',
        educationalQuality: 'UNHELPFUL',
      },
      {
        id: 'opt-analyze-depth-and-slippage',
        text: 'A market order will walk the order book and suffer noticeable slippage; evaluating book depth or using a price-capped limit order is essential to control execution costs.',
        explanation:
          'When order book depth is shallow relative to order size, market orders sweep multiple price levels. Understanding slippage teaches learners to assess liquidity depth and consider limit orders to specify maximum acceptable prices.',
        educationalQuality: 'STRONG',
      },
      {
        id: 'opt-split-into-tiny-market-orders',
        text: 'Submit six consecutive smaller market orders within a few seconds without checking if the asks replenish.',
        explanation:
          'Submitting multiple rapid market orders without waiting for liquidity replenishment still walks the order book upward, incurring similar slippage and potential fee overhead.',
        educationalQuality: 'REASONABLE',
      },
      {
        id: 'opt-ignore-book-depth',
        text: 'Assume that liquidity providers will instantly match any size at the top of the book without slippage.',
        explanation:
          'Assuming infinite liquidity at top-of-book prices is a common beginner mistake that leads to severe execution surprises.',
        educationalQuality: 'RISKY',
      },
    ],
    keyConcepts: [
      'Order Book Depth',
      'Market Order Mechanics',
      'Price Slippage',
      'Limit Order Price Protection',
    ],
  },
  {
    id: 'scenario-interpreting-trading-volume',
    lessonId: 'understanding-trading-volume',
    title: 'Interpreting Breakouts on Below-Average Volume',
    category: 'trading_fundamentals',
    categoryLabel: 'Trading Fundamentals',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description:
      'Learn how trading volume provides context for price movements and helps identify false breakout signals.',
    context:
      'A simulated crypto token has traded in a tight horizontal consolidation range between $20 and $22 for several weeks with normal daily volume of $5M. Suddenly, the price ticks up to $23 on a 15-minute candle, but the trading volume during this move is only $150k—far below historical average volume.',
    question:
      'How should an educated learner interpret a price breakout that occurs on exceptionally low trading volume?',
    options: [
      {
        id: 'opt-treat-low-volume-as-strongest',
        text: 'Assume that low volume means sellers have permanently vanished, guaranteeing that the price will continue surging higher.',
        explanation:
          'Low volume does not mean buyers have overwhelming conviction; it often means very few market participants were involved in the trade, making the price easy to nudge temporarily without broad consensus.',
        educationalQuality: 'UNHELPFUL',
      },
      {
        id: 'opt-confirm-volume-validation',
        text: 'Recognize that price movements lacking volume confirmation often indicate weak market participation and carry a higher risk of being a false breakout.',
        explanation:
          'Trading volume represents liquidity and collective market participation. A breakout accompanied by heavy volume shows institutional and broad participant conviction, whereas a low-volume move indicates thin liquidity that can easily reverse once normal activity resumes.',
        educationalQuality: 'STRONG',
      },
      {
        id: 'opt-all-in-breakout',
        text: 'Immediately allocate your full virtual cash reserve to buy the breakout before anyone else notices.',
        explanation:
          'Aggressively entering positions on unconfirmed signals without risk management is a high-risk behavior that magnifies potential drawdown.',
        educationalQuality: 'RISKY',
      },
      {
        id: 'opt-set-price-alert',
        text: 'Wait and observe whether subsequent candles show expanding volume and price stability before drawing conclusions.',
        explanation:
          'Waiting for follow-through is a sensible observational tactic, though identifying that low volume currently signals weak conviction is the core analytical lesson.',
        educationalQuality: 'REASONABLE',
      },
    ],
    keyConcepts: [
      'Volume-Price Confirmation',
      'False Breakout Identification',
      'Market Participation Depth',
      'Liquidity Verification',
    ],
  },

  // ==========================================
  // CATEGORY 4: RISK MANAGEMENT (2 Scenarios)
  // ==========================================
  {
    id: 'scenario-position-sizing-discipline',
    lessonId: 'position-sizing-basics',
    title: 'Allocating Capital Across Volatile Holdings',
    category: 'risk_management',
    categoryLabel: 'Risk Management',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description:
      'Understand the mathematical importance of position sizing and avoiding excessive portfolio concentration.',
    context:
      'You are managing your virtual paper-trading balance of $10,000. You identify a promising simulated asset that you would like to test. You are tempted to allocate $8,500 (85% of your total virtual capital) to this single asset because you feel confident in its narrative.',
    question:
      'What is the sound educational assessment of allocating 85% of a portfolio to a single digital asset in a realistic educational situation?',
    options: [
      {
        id: 'opt-high-conviction-all-in',
        text: 'High concentration is optimal because if the asset performs well, you maximize overall simulated portfolio growth quickly.',
        explanation:
          'Concentrating 85% of capital in one volatile asset creates severe concentration risk. Even a moderate 25% price drop in that single asset would erase more than 21% of your entire portfolio value, making recovery mathematically difficult.',
        educationalQuality: 'RISKY',
      },
      {
        id: 'opt-disciplined-position-sizing',
        text: 'Limit position size to a modest portion of total capital (e.g. 5–15%) so that adverse moves do not jeopardize the overall portfolio.',
        explanation:
          'Prudent position sizing ensures that no single unexpected event or unfavorable asset move can inflict catastrophic damage on your aggregate capital. It protects your ability to continue learning and trading over the long run.',
        educationalQuality: 'STRONG',
      },
      {
        id: 'opt-borrow-margin-funds',
        text: 'Allocate 85% and borrow additional leverage to amplify returns even further.',
        explanation:
          'Leverage magnifies downside risk exponentially and introduces liquidation risk, completely violating beginner risk management rules.',
        educationalQuality: 'UNHELPFUL',
      },
      {
        id: 'opt-split-into-two-high-risk',
        text: 'Split the 85% equally into two highly correlated altcoins instead of just one.',
        explanation:
          'Dividing capital between two correlated assets still maintains excessive overall risk exposure without providing meaningful diversification.',
        educationalQuality: 'REASONABLE',
      },
    ],
    keyConcepts: [
      'Position Sizing Principles',
      'Concentration Risk',
      'Capital Preservation',
      'Portfolio Drawdown Math',
    ],
  },
  {
    id: 'scenario-defining-downside-risk',
    lessonId: 'what-is-risk-management',
    title: 'Establishing Predefined Risk Limits Before Trade Entry',
    category: 'risk_management',
    categoryLabel: 'Risk Management',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description:
      'Learn why determining invalidation points and acceptable downside before trade execution is vital.',
    context:
      'Before opening a virtual paper trade in the educational sandbox, a learner considers entry price, potential upside, and potential downside. A fellow learner suggests entering the position first and deciding where to exit or cut losses later depending on "how the market feels."',
    question:
      'Why is defining an invalidation point and maximum acceptable loss prior to trade execution considered essential risk management?',
    options: [
      {
        id: 'opt-trade-by-feel',
        text: 'Entering first is preferred because waiting to calculate risk levels causes analysis paralysis and delays execution.',
        explanation:
          'Entering positions without predefined risk boundaries leaves you vulnerable to emotional decision-making when prices drop, frequently leading to holding losing positions indefinitely.',
        educationalQuality: 'UNHELPFUL',
      },
      {
        id: 'opt-predefined-invalidation-plan',
        text: 'Defining your exit and invalidation criteria in advance removes emotional bias and guarantees that potential loss is calculated and acceptable before committing capital.',
        explanation:
          'Risk management begins prior to trade execution. Predefining an invalidation level establishes where your premise is proven wrong, enabling you to calculate exact position sizing and keep potential loss strictly within pre-set risk parameters.',
        educationalQuality: 'STRONG',
      },
      {
        id: 'opt-rely-on-mental-alarm',
        text: 'Enter the trade and mentally remember to check prices once or twice a day to see if losses look uncomfortable.',
        explanation:
          'Subjective mental checkpoints are easily moved or rationalized when losses occur, resulting in inconsistent risk containment.',
        educationalQuality: 'REASONABLE',
      },
      {
        id: 'opt-never-accept-losses',
        text: 'Never set an invalidation point because crypto prices always recover if you wait long enough.',
        explanation:
          'Assuming every asset will eventually recover is factually incorrect; thousands of digital assets have experienced permanent capital destruction.',
        educationalQuality: 'RISKY',
      },
    ],
    keyConcepts: [
      'Pre-Trade Risk Definition',
      'Invalidation Level',
      'Emotional Detachment in Risk',
      'Capital Defense Strategy',
    ],
  },

  // ==========================================
  // CATEGORY 5: TRADING DISCIPLINE (2 Scenarios)
  // ==========================================
  {
    id: 'scenario-sticking-to-a-trade-plan',
    lessonId: 'trading-with-a-plan',
    title: 'Adhering to Trade Plans Amidst Social Media Hype',
    category: 'trading_discipline',
    categoryLabel: 'Trading Discipline',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description:
      'Explore how to maintain trading discipline when external noise and sensational headlines tempt you to deviate from your strategy.',
    context:
      'You developed a structured virtual trading plan based on support levels, position limits, and a specific risk-reward ratio. Two days later, an anonymous influencer on social media publishes a viral video claiming a different meme token is about to "skyrocket 50x in 24 hours." Many commenters in the group are urging everyone to sell all holdings and jump in immediately.',
    question:
      'How should a disciplined learner handle unsolicited social media hype relative to their established trading plan in realistic educational situations?',
    options: [
      {
        id: 'opt-abandon-plan-for-hype',
        text: 'Immediately scrap your trading plan and reallocate your simulated balance to the trending meme token to avoid missing out on viral momentum.',
        explanation:
          'Abandoning established rules for unverified internet rumors is the antithesis of trading discipline. Most viral hype cycles peak right when retail participants are persuaded to enter, leaving latecomers exposed to severe pullbacks.',
        educationalQuality: 'UNHELPFUL',
      },
      {
        id: 'opt-honor-planned-rules',
        text: 'Filter out the emotional noise, adhere strictly to your established trading plan, and evaluate new ideas independently only if they meet your objective criteria.',
        explanation:
          'Long-term consistency in trading requires disciplined adherence to a tested system. Social media excitement is designed to trigger emotional urgency; sticking to objective rules protects you from manipulation and impulsive errors.',
        educationalQuality: 'STRONG',
      },
      {
        id: 'opt-gamble-small-portion',
        text: 'Allocate a small speculative amount to the hyped token just to silence the curiosity, even though it does not fit your criteria.',
        explanation:
          'While a small allocation limits dollar loss, developing a habit of chasing hype outside your rules erodes trading discipline over time.',
        educationalQuality: 'REASONABLE',
      },
      {
        id: 'opt-argue-with-influencer',
        text: 'Spend hours arguing with commenters on social media to prove their hype is unfounded.',
        explanation:
          'Engaging in online arguments wastes mental energy and does not improve your personal analytical framework or execution discipline.',
        educationalQuality: 'RISKY',
      },
    ],
    keyConcepts: [
      'Trade Plan Adherence',
      'Filtering Social Media Noise',
      'Objective vs Emotional Decision-Making',
      'Trading Psychology',
    ],
  },
  {
    id: 'scenario-avoiding-fomo-impulses',
    lessonId: 'common-beginner-mistakes',
    title: 'Recognizing and Countering Fear of Missing Out (FOMO)',
    category: 'trading_discipline',
    categoryLabel: 'Trading Discipline',
    difficulty: 'BEGINNER',
    estimatedMinutes: 5,
    description:
      'Identify the cognitive biases behind FOMO and understand why chasing vertical price rallies leads to poor risk-reward entries.',
    context:
      'An educational asset has climbed vertically by 60% over the last 48 hours without any consolidation. You did not participate in the move, and you feel intense frustration and regret watching others discuss their simulated gains. You feel a strong urge to click BUY immediately at the very top of the green candle.',
    question:
      'What is the most effective psychological and educational response when experiencing intense FOMO in realistic educational situations?',
    options: [
      {
        id: 'opt-market-buy-at-peak',
        text: 'Execute a full market BUY order immediately because a 60% rally proves the trend is unstoppable.',
        explanation:
          'Entering after an extended vertical rally exposes you to the worst possible risk-reward ratio. Assets that surge parabolic without consolidation typically experience sharp retracements, trapping buyers who chased at the peak.',
        educationalQuality: 'UNHELPFUL',
      },
      {
        id: 'opt-acknowledge-fomo-and-wait',
        text: 'Recognize the feeling of FOMO as an emotional warning signal, step away from the screen, and wait for the market to consolidate and present a valid setup with favorable risk-reward.',
        explanation:
          'Recognizing FOMO as an emotional impulse rather than a rational signal is a hallmark of trading discipline. Markets constantly generate new opportunities; waiting patiently for high-quality setups with defined risk protects your capital.',
        educationalQuality: 'STRONG',
      },
      {
        id: 'opt-short-the-asset-immediately',
        text: 'Immediately open a counter-trend short position assuming the price must collapse in the next minute.',
        explanation:
          'Revenge-trading or prematurely fighting strong momentum without technical exhaustion signals is equally impulsive and risky.',
        educationalQuality: 'RISKY',
      },
      {
        id: 'opt-journal-emotional-state',
        text: 'Record your emotional feelings in a trading journal to review how you felt during the rally.',
        explanation:
          'Journaling emotional reactions is a great reflective exercise, but actively stepping back and declining to chase the poor risk-reward setup is the immediate necessary action.',
        educationalQuality: 'REASONABLE',
      },
    ],
    keyConcepts: [
      'FOMO Cognitive Bias',
      'Risk-Reward Asymmetry',
      'Chasing Extended Rallies',
      'Patience in Trade Selection',
    ],
  },
];

module.exports = {
  CATEGORIES,
  SCENARIOS,
};
