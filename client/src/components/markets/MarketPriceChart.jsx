import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { getMarketChart } from '../../services/marketService';
import { formatPrice, formatPercentage } from '../../utils/marketFormatters';

const TIMEFRAMES = [
  { id: '24h', label: '24H', description: 'Last 24 Hours' },
  { id: '7d', label: '7D', description: 'Last 7 Days' },
  { id: '30d', label: '30D', description: 'Last 30 Days' },
  { id: '90d', label: '90D', description: 'Last 90 Days' },
  { id: '1y', label: '1Y', description: 'Last 1 Year' },
];

/**
 * Format date for tooltip display according to timeframe
 */
function formatTooltipDate(timestamp, timeframe) {
  const d = new Date(timestamp);
  if (timeframe === '24h') {
    return (
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      ' · ' +
      d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    );
  }
  if (timeframe === '7d' || timeframe === '30d') {
    return (
      d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ' ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Smooth SVG Bezier Path Generator
 */
function generateBezierPath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let path = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const prev = points[i - 1] || current;
    const nextNext = points[i + 2] || next;

    // Catmull-Rom to Cubic Bezier control points
    const cp1x = current.x + (next.x - prev.x) / 6;
    const cp1y = current.y + (next.y - prev.y) / 6;
    const cp2x = next.x - (nextNext.x - current.x) / 6;
    const cp2y = next.y - (nextNext.y - current.y) / 6;

    path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${next.x.toFixed(2)},${next.y.toFixed(2)}`;
  }

  return path;
}

const MarketPriceChart = ({ symbol, currentPrice }) => {
  const [timeframe, setTimeframe] = useState('7d');
  const [chartPoints, setChartPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [cachedAt, setCachedAt] = useState(null);

  // Hover state
  const [hoverIndex, setHoverIndex] = useState(null);
  const chartSvgRef = useRef(null);

  // Monotonic request tracker to prevent race conditions
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  const fetchChart = useCallback(
    async (tf) => {
      const thisRequestId = ++requestIdRef.current;

      // Abort previous in-flight request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);
      setHoverIndex(null);

      try {
        const res = await getMarketChart(symbol, tf, abortControllerRef.current.signal);

        // Only commit state if this is still the most recent request
        if (thisRequestId === requestIdRef.current) {
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            setChartPoints(res.data);
            setIsStale(Boolean(res.isStale));
            setCachedAt(res.cachedAt || null);
          } else {
            throw new Error('No historical chart points returned.');
          }
        }
      } catch (err) {
        // Ignore aborted errors
        if (err.name === 'CanceledError' || err.message === 'canceled') return;

        if (thisRequestId === requestIdRef.current) {
          setError(err.message || 'Unable to load chart data.');
        }
      } finally {
        if (thisRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [symbol]
  );

  useEffect(() => {
    fetchChart(timeframe);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [timeframe, fetchChart]);

  // Chart Dimensions
  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 340;
  const PAD_TOP = 25;
  const PAD_BOTTOM = 35;
  const PAD_LEFT = 15;
  const PAD_RIGHT = 75; // for price axis labels

  const chartWidth = SVG_WIDTH - PAD_LEFT - PAD_RIGHT;
  const chartHeight = SVG_HEIGHT - PAD_TOP - PAD_BOTTOM;

  // Chart coordinates and metrics
  const {
    scaledPoints,
    minPrice,
    maxPrice,
    priceChange,
    priceChangePct,
    isPositive,
    linePath,
    areaPath,
    gridLevels,
  } = useMemo(() => {
    if (!chartPoints || chartPoints.length === 0) {
      return {
        scaledPoints: [],
        minPrice: 0,
        maxPrice: 0,
        priceChange: 0,
        priceChangePct: 0,
        isPositive: true,
        linePath: '',
        areaPath: '',
        gridLevels: [],
      };
    }

    const prices = chartPoints.map((p) => p.price);
    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);
    const spread = rawMax - rawMin || 1;

    // Add 4% vertical padding to prevent top/bottom clipping
    const min = Math.max(0, rawMin - spread * 0.04);
    const max = rawMax + spread * 0.04;
    const effectiveRange = max - min || 1;

    const len = chartPoints.length;
    const scaled = chartPoints.map((pt, idx) => {
      const x = PAD_LEFT + (idx / (len - 1 || 1)) * chartWidth;
      const y = PAD_TOP + (1 - (pt.price - min) / effectiveRange) * chartHeight;
      return {
        x,
        y,
        timestamp: pt.timestamp,
        price: pt.price,
      };
    });

    const startPrice = chartPoints[0].price;
    const endPrice = chartPoints[len - 1].price;
    const change = endPrice - startPrice;
    const changePct = startPrice !== 0 ? (change / startPrice) * 100 : 0;
    const positive = change >= 0;

    const line = generateBezierPath(scaled);
    const lastPoint = scaled[scaled.length - 1];
    const firstPoint = scaled[0];
    const baselineY = PAD_TOP + chartHeight;
    const area = `${line} L ${lastPoint.x.toFixed(2)},${baselineY.toFixed(2)} L ${firstPoint.x.toFixed(2)},${baselineY.toFixed(2)} Z`;

    // 4 Horizontal Gridlines
    const levels = [0, 0.33, 0.66, 1].map((ratio) => {
      const priceVal = min + (1 - ratio) * effectiveRange;
      const yVal = PAD_TOP + ratio * chartHeight;
      return {
        y: yVal,
        price: priceVal,
      };
    });

    return {
      scaledPoints: scaled,
      minPrice: rawMin,
      maxPrice: rawMax,
      priceChange: change,
      priceChangePct: changePct,
      isPositive: positive,
      linePath: line,
      areaPath: area,
      gridLevels: levels,
    };
  }, [chartPoints, chartWidth, chartHeight, PAD_LEFT, PAD_TOP]);

  // Pointer hover handlers
  const handlePointerMove = (e) => {
    if (!scaledPoints || scaledPoints.length === 0 || !chartSvgRef.current) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const relativeX = ((clientX - rect.left) / rect.width) * SVG_WIDTH;

    // Find closest point by X coordinate
    let closestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < scaledPoints.length; i++) {
      const dist = Math.abs(scaledPoints[i].x - relativeX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = i;
      }
    }

    setHoverIndex(closestIdx);
  };

  const handlePointerLeave = () => {
    setHoverIndex(null);
  };

  // Currently displayed point (hovered or latest)
  const activePoint =
    hoverIndex !== null && scaledPoints[hoverIndex]
      ? scaledPoints[hoverIndex]
      : scaledPoints[scaledPoints.length - 1] || null;

  // Active display values
  const displayPrice = activePoint ? activePoint.price : currentPrice || 0;
  const activeDiff =
    activePoint && chartPoints[0]
      ? activePoint.price - chartPoints[0].price
      : priceChange;
  const activeDiffPct =
    activePoint && chartPoints[0] && chartPoints[0].price !== 0
      ? (activeDiff / chartPoints[0].price) * 100
      : priceChangePct;
  const activeDiffPositive = activeDiff >= 0;

  const strokeColor = isPositive ? '#00F59B' : '#EF4444';
  const gradientId = `chartGradient_${symbol}_${isPositive ? 'green' : 'red'}`;

  return (
    <div className="rounded-2xl bg-[#0a1420]/90 border border-white/[0.08] backdrop-blur-xl p-5 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] space-y-4">
      {/* Top Controls: Price display & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              {formatPrice(displayPrice)}
            </span>
            <span
              className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded ${
                activeDiffPositive
                  ? 'text-[#00F59B] bg-[#00F59B]/10'
                  : 'text-[#EF4444] bg-[#EF4444]/10'
              }`}
            >
              {activeDiffPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {activeDiffPositive ? '+' : ''}
                {formatPrice(Math.abs(activeDiff))} ({formatPercentage(activeDiffPct)})
              </span>
            </span>
          </div>
          <div className="text-[11px] font-mono text-gray-400 mt-1 flex items-center gap-2">
            {hoverIndex !== null && activePoint ? (
              <span className="text-[#00D4FF] font-semibold">
                Scrubbing: {formatTooltipDate(activePoint.timestamp, timeframe)}
              </span>
            ) : (
              <span>
                {timeframe.toUpperCase()} Change vs period open ({formatPrice(chartPoints[0]?.price || 0)})
              </span>
            )}
            {isStale && (
              <span className="text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded text-[10px]">
                Cached
              </span>
            )}
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] self-start sm:self-auto">
          {TIMEFRAMES.map((tf) => {
            const isActive = timeframe === tf.id;
            return (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                disabled={loading && timeframe === tf.id}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-[#00F59B] text-[#020609] shadow-[0_0_15px_rgba(0,245,155,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
                title={tf.description}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full h-[320px] sm:h-[360px] select-none">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a1420]/60 backdrop-blur-sm rounded-xl">
            <RefreshCw className="w-6 h-6 text-[#00F59B] animate-spin mb-2" />
            <span className="text-xs font-mono text-gray-400">Loading {timeframe.toUpperCase()} chart data...</span>
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a1420]/80 rounded-xl p-4 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[#EF4444]" />
            <p className="text-xs font-mono text-gray-300 max-w-sm">{error}</p>
            <button
              onClick={() => fetchChart(timeframe)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Chart</span>
            </button>
          </div>
        )}

        {/* SVG Interactive Chart */}
        <svg
          ref={chartSvgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full cursor-crosshair overflow-visible"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.32" />
              <stop offset="60%" stopColor={strokeColor} stopOpacity="0.08" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid & Axis Price Labels */}
          {gridLevels.map((lvl, idx) => (
            <g key={idx}>
              <line
                x1={PAD_LEFT}
                y1={lvl.y}
                x2={PAD_LEFT + chartWidth}
                y2={lvl.y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={PAD_LEFT + chartWidth + 10}
                y={lvl.y + 4}
                fill="rgba(156, 163, 175, 0.7)"
                fontSize="10"
                fontFamily="monospace"
              >
                {formatPrice(lvl.price)}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill={`url(#${gradientId})`}
              className="transition-all duration-300"
            />
          )}

          {/* Main Price Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,245,155,0.3)]"
            />
          )}

          {/* Active / Hover Crosshair & Dot */}
          {activePoint && (
            <g className="transition-all duration-75">
              {/* Vertical Crosshair Line */}
              <line
                x1={activePoint.x}
                y1={PAD_TOP}
                x2={activePoint.x}
                y2={PAD_TOP + chartHeight}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeDasharray="2 2"
                strokeWidth="1.5"
              />

              {/* Glowing Indicator Dot */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="6"
                fill={strokeColor}
                className="animate-pulse drop-shadow-[0_0_10px_#00F59B]"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="2.5"
                fill="#020609"
              />

              {/* Floating Tooltip Box */}
              <g
                transform={`translate(${Math.min(
                  Math.max(PAD_LEFT + 60, activePoint.x),
                  SVG_WIDTH - PAD_RIGHT - 60
                )}, ${Math.max(PAD_TOP + 20, activePoint.y - 25)})`}
              >
                <rect
                  x="-60"
                  y="-22"
                  width="120"
                  height="26"
                  rx="6"
                  fill="#030910"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))"
                />
                <text
                  x="0"
                  y="-5"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {formatPrice(activePoint.price)}
                </text>
              </g>
            </g>
          )}

          {/* Invisible Overlay to Capture Pointer Events smoothly */}
          <rect
            x={PAD_LEFT}
            y={PAD_TOP}
            width={chartWidth}
            height={chartHeight}
            fill="transparent"
            className="cursor-crosshair"
          />
        </svg>
      </div>

      {/* Footer Metrics and Educational Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono text-gray-400">
        <div className="flex items-center gap-4">
          <span>
            Period Low: <strong className="text-white">{formatPrice(minPrice)}</strong>
          </span>
          <span>
            Period High: <strong className="text-white">{formatPrice(maxPrice)}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>Real Market History via CoinGecko · 60s Server Cache</span>
        </div>
      </div>
    </div>
  );
};

export default MarketPriceChart;
