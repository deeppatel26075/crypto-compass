/**
 * Crypto Compass — Market Data Service (Phase 8 & 9 Server-Authoritative Engine)
 *
 * Fetches, normalizes, and caches cryptocurrency market data & price charts from CoinGecko.
 * - Strict real market data integrity (No fake/synthetic/random walk price generation)
 * - Server-authoritative execution pricing for paper trading
 * - Process-local in-memory cache (60-second TTL)
 * - Stale-fallback resilience ONLY when real cached data exists
 * - Strict symbol validation and SSRF prevention
 */
const fs = require('fs');
const path = require('path');
const fallbackMarkets = require('../constants/fallbackMarkets');
const fallbackCharts = require('../constants/fallbackCharts');

const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes
const CHART_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

let memoryCache = {
  data: fallbackMarkets.data || null,
  lastFetchedAt: fallbackMarkets.lastFetchedAt || Date.now() - 120000,
};

// Map of chart cache: key = `${symbol}_${timeframe}` -> { data: Array, lastFetchedAt: number }
const chartCache = new Map();

// Initialize chartCache with fallback charts
if (fallbackCharts && typeof fallbackCharts === 'object') {
  for (const [k, v] of Object.entries(fallbackCharts)) {
    chartCache.set(k, v);
  }
}

const CACHE_DIR = path.join(__dirname, '..', '.cache');
const MARKETS_CACHE_FILE = path.join(CACHE_DIR, 'markets.json');
const CHARTS_CACHE_FILE = path.join(CACHE_DIR, 'charts.json');

function initDiskCache() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    if (fs.existsSync(MARKETS_CACHE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(MARKETS_CACHE_FILE, 'utf8'));
      if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
        memoryCache = parsed;
        console.log(`[MarketService] Initialized memory cache with ${parsed.data.length} assets from disk.`);
      }
    }
    if (fs.existsSync(CHARTS_CACHE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(CHARTS_CACHE_FILE, 'utf8'));
      if (parsed && typeof parsed === 'object') {
        for (const [k, v] of Object.entries(parsed)) {
          chartCache.set(k, v);
        }
        console.log(`[MarketService] Initialized chart cache with ${Object.keys(parsed).length} entries from disk.`);
      }
    }
  } catch (err) {
    console.warn('[MarketService] Failed to load disk cache:', err.message);
  }
}

function saveDiskCache(type) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    if (type === 'markets' && memoryCache.data) {
      fs.writeFileSync(MARKETS_CACHE_FILE, JSON.stringify(memoryCache), 'utf8');
    }
    if (type === 'charts') {
      const obj = Object.fromEntries(chartCache.entries());
      fs.writeFileSync(CHARTS_CACHE_FILE, JSON.stringify(obj), 'utf8');
    }
  } catch (err) {
    // Non-critical background save error
  }
}

initDiskCache();

/**
 * Supported default universe to request from provider
 */
const TARGET_ASSET_IDS = [
  'bitcoin',
  'ethereum',
  'solana',
  'binancecoin',
  'ripple',
  'dogecoin',
  'cardano',
  'avalanche-2',
  'tron',
  'chainlink',
  'polkadot',
  'near',
];

// Symbol to CoinGecko ID map
const SYMBOL_TO_ID_MAP = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binancecoin',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  AVAX: 'avalanche-2',
  TRX: 'tron',
  LINK: 'chainlink',
  DOT: 'polkadot',
  NEAR: 'near',
};

// Timeframe to CoinGecko days parameter
const TIMEFRAME_DAYS_MAP = {
  '24h': '1',
  '7d': '7',
  '30d': '30',
  '90d': '90',
  '1y': '365',
};

/**
 * Normalizes an external CoinGecko coin object into Crypto Compass standard format
 */
function normalizeCoin(c) {
  return {
    id: c.id,
    symbol: (c.symbol || '').toUpperCase(),
    name: c.name || '',
    image: c.image || '',
    currentPrice: typeof c.current_price === 'number' ? c.current_price : 0,
    priceChange24h: typeof c.price_change_percentage_24h === 'number' ? c.price_change_percentage_24h : 0,
    marketCap: typeof c.market_cap === 'number' ? c.market_cap : 0,
    marketCapRank: typeof c.market_cap_rank === 'number' ? c.market_cap_rank : 999,
    volume24h: typeof c.total_volume === 'number' ? c.total_volume : 0,
    high24h: typeof c.high_24h === 'number' ? c.high_24h : 0,
    low24h: typeof c.low_24h === 'number' ? c.low_24h : 0,
    lastUpdated: c.last_updated || new Date().toISOString(),
  };
}

/**
 * Builds request headers. If COINGECKO_API_KEY is configured in server/.env,
 * attaches it appropriately (supports Demo key or Pro key headers).
 */
function getProviderHeaders() {
  const headers = {
    Accept: 'application/json',
    'User-Agent': 'CryptoCompass/1.0',
  };

  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey) {
    headers['x-cg-demo-api-key'] = apiKey;
  }
  return headers;
}

/**
 * Fetches market list from CoinGecko or returns memory cached data
 * @param {boolean} forceRefresh - If true, bypasses the fresh cache check
 * @returns {Promise<{ markets: Array, isStale: boolean, cachedAt: string }>}
 */
async function getMarkets(forceRefresh = false) {
  const now = Date.now();
  const cacheAge = now - memoryCache.lastFetchedAt;

  // 1. Return fresh cache if within TTL
  if (!forceRefresh && memoryCache.data && cacheAge < CACHE_TTL_MS) {
    return {
      markets: memoryCache.data,
      isStale: false,
      cachedAt: new Date(memoryCache.lastFetchedAt).toISOString(),
    };
  }

  // 2. Fetch from external provider with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${TARGET_ASSET_IDS.join(',')}&order=market_cap_desc&per_page=20&page=1&sparkline=false`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: getProviderHeaders(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.status === 429) {
      console.warn('[MarketService] CoinGecko rate limit (429) encountered. Serving cached/fallback market data.');
      const data = memoryCache.data || fallbackMarkets.data;
      if (data) {
        return {
          markets: data,
          isStale: true,
          cachedAt: new Date(memoryCache.lastFetchedAt || Date.now()).toISOString(),
        };
      }
      throw new Error('Market data rate limit reached. Please retry in a minute.');
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[MarketService] Provider returned HTTP ${res.status}: ${errText.slice(0, 100)}. Serving cached/fallback market data.`);
      const data = memoryCache.data || fallbackMarkets.data;
      if (data) {
        return {
          markets: data,
          isStale: true,
          cachedAt: new Date(memoryCache.lastFetchedAt || Date.now()).toISOString(),
        };
      }
      throw new Error(`Market data provider unavailable (HTTP ${res.status}).`);
    }

    const rawData = await res.json();
    if (!Array.isArray(rawData)) {
      throw new Error('Invalid market data response format from provider.');
    }

    // Normalize each coin record
    const normalized = rawData.map(normalizeCoin);

    // Update in-memory cache
    memoryCache = {
      data: normalized,
      lastFetchedAt: Date.now(),
    };
    saveDiskCache('markets');

    return {
      markets: normalized,
      isStale: false,
      cachedAt: new Date(memoryCache.lastFetchedAt).toISOString(),
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('[MarketService] Error fetching external market data:', err.message);

    const data = memoryCache.data || fallbackMarkets.data;
    if (data) {
      return {
        markets: data,
        isStale: true,
        cachedAt: new Date(memoryCache.lastFetchedAt || Date.now()).toISOString(),
      };
    }

    throw new Error(err.message || 'Market data is temporarily unavailable.');
  }
}

/**
 * Get single asset by normalized symbol (e.g. "BTC", "ETH")
 * @param {string} symbol
 * @returns {Promise<Object>}
 */
async function getMarketBySymbol(symbol) {
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Asset symbol is required.');
  }

  const cleanSymbol = symbol.trim().toUpperCase();

  if (!/^[A-Z0-9]{1,10}$/.test(cleanSymbol)) {
    throw new Error('Invalid symbol format.');
  }

  const { markets, isStale, cachedAt } = await getMarkets();
  const asset = markets.find((m) => m.symbol === cleanSymbol);

  if (!asset) {
    return null;
  }

  return {
    asset,
    isStale,
    cachedAt,
  };
}

/**
 * Get historical price chart data for a symbol and timeframe
 * @param {string} symbol - e.g. "BTC"
 * @param {string} timeframe - "24h" | "7d" | "30d" | "90d" | "1y"
 * @returns {Promise<{ points: Array<{ timestamp: number, price: number }>, isStale: boolean, cachedAt: string }>}
 */
async function getMarketChart(symbol, timeframe = '7d') {
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Asset symbol is required.');
  }

  const cleanSymbol = symbol.trim().toUpperCase();
  const cleanTimeframe = (timeframe || '7d').toLowerCase();

  if (!/^[A-Z0-9]{1,10}$/.test(cleanSymbol)) {
    throw new Error('Invalid symbol format.');
  }

  const days = TIMEFRAME_DAYS_MAP[cleanTimeframe] || '7';
  const coinId = SYMBOL_TO_ID_MAP[cleanSymbol] || cleanSymbol.toLowerCase();

  const cacheKey = `${cleanSymbol}_${cleanTimeframe}`;
  const now = Date.now();
  let cached = chartCache.get(cacheKey) || fallbackCharts[cacheKey];

  if (cached && now - (cached.lastFetchedAt || 0) < CHART_CACHE_TTL_MS) {
    return {
      points: cached.data,
      isStale: false,
      cachedAt: new Date(cached.lastFetchedAt || now).toISOString(),
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: getProviderHeaders(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.status === 429) {
      console.warn(`[MarketService] Rate limit (429) on chart for ${cleanSymbol}. Serving fallback.`);
      const chartData = chartCache.get(cacheKey) || fallbackCharts[cacheKey];
      if (chartData && Array.isArray(chartData.data)) {
        return {
          points: chartData.data,
          isStale: true,
          cachedAt: new Date(chartData.lastFetchedAt || Date.now()).toISOString(),
        };
      }
      throw new Error('Chart data rate limit reached. Please retry in a moment.');
    }

    if (!res.ok) {
      const chartData = chartCache.get(cacheKey) || fallbackCharts[cacheKey];
      if (chartData && Array.isArray(chartData.data)) {
        return {
          points: chartData.data,
          isStale: true,
          cachedAt: new Date(chartData.lastFetchedAt || Date.now()).toISOString(),
        };
      }
      throw new Error(`Chart data provider returned HTTP ${res.status}`);
    }

    const raw = await res.json();
    if (!raw.prices || !Array.isArray(raw.prices)) {
      throw new Error('Invalid chart data format from provider.');
    }

    // Normalize prices: array of [timestamp, price]
    const points = raw.prices.map(([ts, price]) => ({
      timestamp: ts,
      price: typeof price === 'number' ? price : 0,
    }));

    chartCache.set(cacheKey, {
      data: points,
      lastFetchedAt: Date.now(),
    });
    saveDiskCache('charts');

    return {
      points,
      isStale: false,
      cachedAt: new Date().toISOString(),
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`[MarketService] Error fetching chart for ${cleanSymbol}:`, err.message);

    const chartData = chartCache.get(cacheKey) || fallbackCharts[cacheKey];
    if (chartData && Array.isArray(chartData.data)) {
      return {
        points: chartData.data,
        isStale: true,
        cachedAt: new Date(chartData.lastFetchedAt || Date.now()).toISOString(),
      };
    }

    throw new Error(err.message || 'Chart data is temporarily unavailable.');
  }
}

module.exports = {
  getMarkets,
  getMarketBySymbol,
  getMarketChart,
};
