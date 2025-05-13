import { Candle } from "./types/types";

function generateCandles(
  basePrice: number,
  volatility: number,
  points: number,
  intervalMs: number
): Candle[] {
  const candles: Candle[] = [];
  let currentPrice = basePrice;
  const now = Date.now();

  for (let i = points; i >= 0; i--) {
    const time = now - i * intervalMs;
    const open = currentPrice;
    const maxChange = basePrice * volatility;
    
    // Random walk with occasional spikes
    const spikeFactor = Math.random() > 0.95 ? 3 : 1; // 5% chance of spike
    const change = (Math.random() * 2 - 1) * maxChange * spikeFactor;
    currentPrice += change;
    
    // Ensure price stays within reasonable bounds
    currentPrice = Math.max(basePrice * 0.85, Math.min(basePrice * 1.15, currentPrice));
    
    const high = open + Math.abs(change) * (1 + Math.random() * 0.5);
    const low = open - Math.abs(change) * (1 + Math.random() * 0.5);
    const close = open + change;
    
    candles.push([
      time,
      parseFloat(open.toFixed(2)),
      parseFloat(Math.max(open, close, high).toFixed(2)),
      parseFloat(Math.min(open, close, low).toFixed(2)),
      parseFloat(close.toFixed(2))
    ]);
  }

  return candles;
}

// Configuration
const CANDLE_CONFIG = {
  // Crypto - high volatility, fast updates
  crypto: { volatility: 0.018, intervalMs: 250 },    // 4 updates/sec
  
  // High-growth tech - medium-high volatility
  growthTech: { volatility: 0.012, intervalMs: 500 }, // 2 updates/sec
  
  // Large-cap tech - medium volatility
  largeTech: { volatility: 0.008, intervalMs: 1000 }, // 1 update/sec
  
  // Semiconductors - medium-high volatility
  semiconductors: { volatility: 0.01, intervalMs: 750 }, // ~1.3 updates/sec
  
  // ETFs - low volatility
  etf: { volatility: 0.003, intervalMs: 2000 },      // 0.5 updates/sec
  
  points: 1000 // Number of candles to generate
};

// Base prices aligned with your earlier values
const BASE_PRICES = {
  AAPL: 180, MSFT: 350, NVDA: 700, META: 450, GOOGL: 160,
  AMZN: 180, TSLA: 250, NFLX: 600, AMD: 150, INTC: 40,
  BTCUSD: 40000, ETHUSD: 2500, SPY: 500, QQQ: 430, VOO: 450
};

// Generate all symbols with appropriate profiles
export const initialCandles: Record<string, Candle[]> = {
  // Crypto
  BTCUSD: generateCandles(BASE_PRICES.BTCUSD, CANDLE_CONFIG.crypto.volatility, CANDLE_CONFIG.points, CANDLE_CONFIG.crypto.intervalMs),
  ETHUSD: generateCandles(BASE_PRICES.ETHUSD, CANDLE_CONFIG.crypto.volatility, CANDLE_CONFIG.points, CANDLE_CONFIG.crypto.intervalMs),
  
  // High-growth tech
  NVDA: generateCandles(BASE_PRICES.NVDA, CANDLE_CONFIG.growthTech.volatility * 1.3, CANDLE_CONFIG.points, CANDLE_CONFIG.growthTech.intervalMs),
  TSLA: generateCandles(BASE_PRICES.TSLA, CANDLE_CONFIG.growthTech.volatility * 1.5, CANDLE_CONFIG.points, CANDLE_CONFIG.growthTech.intervalMs),
  META: generateCandles(BASE_PRICES.META, CANDLE_CONFIG.growthTech.volatility, CANDLE_CONFIG.points, CANDLE_CONFIG.growthTech.intervalMs),
  
  // Large-cap tech
  AAPL: generateCandles(BASE_PRICES.AAPL, CANDLE_CONFIG.largeTech.volatility, CANDLE_CONFIG.points, CANDLE_CONFIG.largeTech.intervalMs),
  MSFT: generateCandles(BASE_PRICES.MSFT, CANDLE_CONFIG.largeTech.volatility, CANDLE_CONFIG.points, CANDLE_CONFIG.largeTech.intervalMs),
  GOOGL: generateCandles(BASE_PRICES.GOOGL, CANDLE_CONFIG.largeTech.volatility, CANDLE_CONFIG.points, CANDLE_CONFIG.largeTech.intervalMs),
  AMZN: generateCandles(BASE_PRICES.AMZN, CANDLE_CONFIG.largeTech.volatility, CANDLE_CONFIG.points, CANDLE_CONFIG.largeTech.intervalMs),
  NFLX: generateCandles(BASE_PRICES.NFLX, CANDLE_CONFIG.largeTech.volatility * 1.2, CANDLE_CONFIG.points, CANDLE_CONFIG.largeTech.intervalMs),
  
  // Semiconductors
  AMD: generateCandles(BASE_PRICES.AMD, CANDLE_CONFIG.semiconductors.volatility, CANDLE_CONFIG.points, CANDLE_CONFIG.semiconductors.intervalMs),
  INTC: generateCandles(BASE_PRICES.INTC, CANDLE_CONFIG.semiconductors.volatility * 0.8, CANDLE_CONFIG.points, CANDLE_CONFIG.semiconductors.intervalMs),
  
  // ETFs
  SPY: generateCandles(BASE_PRICES.SPY, CANDLE_CONFIG.etf.volatility, CANDLE_CONFIG.points, CANDLE_CONFIG.etf.intervalMs),
  QQQ: generateCandles(BASE_PRICES.QQQ, CANDLE_CONFIG.etf.volatility * 1.2, CANDLE_CONFIG.points, CANDLE_CONFIG.etf.intervalMs),
  VOO: generateCandles(BASE_PRICES.VOO, CANDLE_CONFIG.etf.volatility, CANDLE_CONFIG.points, CANDLE_CONFIG.etf.intervalMs)
};
