// server.js

const WebSocket = require("ws");
const http = require("http");
const url = require("url");

process.env.TZ = "Asia/Singapore";

// Create an HTTP server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Common symbols and base prices
const symbols = [
  "AAPL",
  "MSFT",
  "NVDA",
  "META",
  "GOOGL",
  "AMZN",
  "TSLA",
  "NFLX",
  "AMD",
  "INTC",
  "BTCUSD",
  "ETHUSD",
  "SPY",
  "QQQ",
  "VOO",
];

const basePrices = {
  AAPL: 180,
  MSFT: 350,
  NVDA: 700,
  META: 450,
  GOOGL: 160,
  AMZN: 180,
  TSLA: 250,
  NFLX: 600,
  AMD: 150,
  INTC: 40,
  BTCUSD: 40000,
  ETHUSD: 2500,
  SPY: 500,
  QQQ: 430,
  VOO: 450,
};

// Configuration for different asset types
const CANDLE_CONFIG = {
  // Crypto - high volatility, fast updates
  crypto: { volatility: 0.018, intervalMs: 250 }, // 4 updates/sec

  // High-growth tech - medium-high volatility
  growthTech: { volatility: 0.012, intervalMs: 500 }, // 2 updates/sec

  // Large-cap tech - medium volatility
  largeTech: { volatility: 0.008, intervalMs: 1000 }, // 1 update/sec

  // Semiconductors - medium-high volatility
  semiconductors: { volatility: 0.01, intervalMs: 750 }, // ~1.3 updates/sec

  // ETFs - low volatility
  etf: { volatility: 0.003, intervalMs: 2000 }, // 0.5 updates/sec

  points: 1000, // Number of candles to generate
};

// Symbol categorization
const symbolCategories = {
  crypto: ["BTCUSD", "ETHUSD"],
  growthTech: ["NVDA", "TSLA", "META"],
  largeTech: ["AAPL", "MSFT", "GOOGL", "AMZN", "NFLX"],
  semiconductors: ["AMD", "INTC"],
  etf: ["SPY", "QQQ", "VOO"],
};

// Get category for a symbol
function getSymbolCategory(symbol) {
  for (const [category, syms] of Object.entries(symbolCategories)) {
    if (syms.includes(symbol)) return category;
  }
  return "largeTech"; // Default category
}

// --- Utility functions ---

// Generate initial candles for a symbol
function generateCandles(basePrice, volatility, points, intervalMs) {
  const candles = [];
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
    currentPrice = Math.max(
      basePrice * 0.85,
      Math.min(basePrice * 1.15, currentPrice)
    );

    const high = open + Math.abs(change) * (1 + Math.random() * 0.5);
    const low = open - Math.abs(change) * (1 + Math.random() * 0.5);
    const close = open + change;

    candles.push([
      time,
      parseFloat(open.toFixed(2)),
      parseFloat(Math.max(open, close, high).toFixed(2)),
      parseFloat(Math.min(open, close, low).toFixed(2)),
      parseFloat(close.toFixed(2)),
    ]);
  }

  return candles;
}

// Cache for initial candles (lazy loading)
const initialCandlesCache = {};

// Store the latest candle for each symbol
const latestCandles = {};

// Get initial candles for a symbol, generate if not cached
function getInitialCandles(symbol) {
  if (!initialCandlesCache[symbol]) {
    const basePrice = basePrices[symbol];
    const category = getSymbolCategory(symbol);
    const config = CANDLE_CONFIG[category];

    // Apply multipliers for certain symbols (as in your original code)
    let volatilityMultiplier = 1;
    if (symbol === "NVDA") volatilityMultiplier = 1.3;
    if (symbol === "TSLA") volatilityMultiplier = 1.5;
    if (symbol === "NFLX") volatilityMultiplier = 1.2;
    if (symbol === "INTC") volatilityMultiplier = 0.8;
    if (symbol === "QQQ") volatilityMultiplier = 1.2;

    initialCandlesCache[symbol] = generateCandles(
      basePrice,
      config.volatility * volatilityMultiplier,
      CANDLE_CONFIG.points,
      config.intervalMs
    );

    // Store the latest candle for continued trend generation
    latestCandles[symbol] = {
      close:
        initialCandlesCache[symbol][initialCandlesCache[symbol].length - 1][4],
      category,
      volatilityMultiplier,
    };
  }

  return initialCandlesCache[symbol];
}

// Generate a new candle based on previous trend
function getNextCandle(symbol) {
  if (!latestCandles[symbol]) {
    // Make sure we have initial data
    getInitialCandles(symbol);
  }

  const basePrice = basePrices[symbol];
  const category = latestCandles[symbol].category;
  const volatilityMultiplier = latestCandles[symbol].volatilityMultiplier || 1;
  const config = CANDLE_CONFIG[category];
  const volatility = config.volatility * volatilityMultiplier;

  // Use the last close price as our new open price
  const open = latestCandles[symbol].close;

  // Create a change that follows the trend with occasional spikes
  const maxChange = basePrice * volatility;
  const spikeFactor = Math.random() > 0.95 ? 3 : 1; // 5% chance of spike
  const change = (Math.random() * 2 - 1) * maxChange * spikeFactor;

  // Calculate new close price
  let close = open + change;

  // Ensure price stays within reasonable bounds
  close = Math.max(basePrice * 0.85, Math.min(basePrice * 1.15, close));

  // Create high and low with appropriate ranges based on volatility
  const high = Math.max(open, close) + Math.random() * maxChange;
  const low = Math.min(open, close) - Math.random() * maxChange;

  // Update the latest candle for this symbol
  latestCandles[symbol].close = close;

  // Return the candle in the expected format
  return [
    Math.floor(Date.now() / 1000) * 1000,
    parseFloat(open.toFixed(2)),
    parseFloat(Math.max(high).toFixed(2)),
    parseFloat(Math.min(low).toFixed(2)),
    parseFloat(close.toFixed(2)),
  ];
}

// Generate a random price variation
function getRandomPrice(base) {
  const volatility = base > 1000 ? 5 : base > 100 ? 1 : 0.01;
  const change = (Math.random() - 0.5) * volatility;
  return +(base + change).toFixed(2);
}

// --- HTTP Server handling ---
server.on("request", (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle GET request for initial candles
  if (req.method === "GET" && parsedUrl.pathname === "/api/initialCandles") {
    const requestedSymbols = parsedUrl.query.symbols
      ? parsedUrl.query.symbols.split(",").filter((s) => symbols.includes(s))
      : symbols;

    const response = {};

    requestedSymbols.forEach((symbol) => {
      response[symbol] = getInitialCandles(symbol);
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
    return;
  }

  // Handle GET request for initial ticker data
  if (req.method === "GET" && parsedUrl.pathname === "/api/initialTickers") {
    const requestedSymbols = parsedUrl.query.symbols
      ? parsedUrl.query.symbols.split(",").filter((s) => symbols.includes(s))
      : symbols;

    const response = requestedSymbols.map((symbol) => {
      const basePrice = basePrices[symbol];
      const last = getRandomPrice(basePrice);
      const bid = getRandomPrice(basePrice - 1);
      const ask = getRandomPrice(basePrice + 1);

      return {
        symbol,
        price: {
          last,
          bid,
          ask,
          change: 0,
          percentChange: 0,
        },
        timestamp: Date.now(),
      };
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
    return;
  }

  // Handle 404 for all other routes
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

// --- WebSocket Server handling ---
let previousPrices = {};

// Initialize previousPrices with base prices
symbols.forEach((symbol) => {
  previousPrices[symbol] = basePrices[symbol];
});

wss.on("connection", (ws) => {
  ws.subscriptions = {}; // { channel: [symbols] }
  console.log("Client connected");

  ws.on("message", (msg) => {
    try {
      const message = JSON.parse(msg);
      const { type, channel, symbols: subSymbols } = message;

      if (type === "subscribe" && channel && Array.isArray(subSymbols)) {
        // Validate symbols
        const validSymbols = subSymbols.filter((s) => symbols.includes(s));

        // Store per channel
        ws.subscriptions[channel] = validSymbols;
        console.log(`Client subscribed to [${channel}]:`, validSymbols);
      }
    } catch (err) {
      console.error("Invalid message:", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Broadcast tickers
setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) return;

    const subs = client.subscriptions["ticker"];
    if (subs && subs.length > 0) {
      const updates = subs.map((symbol) => {
        // For ticker prices, use the close price from the latest candle if available
        // This ensures consistency between candlestick and ticker data
        let last;
        if (latestCandles[symbol]) {
          // Add small variation to the latest close price
          const closePrice = latestCandles[symbol].close;
          const smallVariation = closePrice * 0.0005 * (Math.random() * 2 - 1); // ±0.05% variation
          last = parseFloat((closePrice + smallVariation).toFixed(2));
        } else {
          last = getRandomPrice(basePrices[symbol]);
        }

        const prevPrice = previousPrices[symbol] || basePrices[symbol];
        const change = +(last - prevPrice).toFixed(2);
        const percentChange = +(((last - prevPrice) / prevPrice) * 100).toFixed(
          2
        );
        previousPrices[symbol] = last;

        // Slightly vary bid/ask around the last price
        const spread = last * 0.001; // 0.1% spread
        const bid = parseFloat((last - spread).toFixed(2));
        const ask = parseFloat((last + spread).toFixed(2));

        return {
          symbol,
          price: {
            last,
            bid,
            ask,
            change,
            percentChange,
          },
          timestamp: Date.now(),
        };
      });

      client.send(JSON.stringify({ type: "ticker", data: updates }));
    }
  });
}, 1000);

// Broadcast candles
setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) return;

    const subs = client.subscriptions["candle"];
    if (subs && subs.length > 0) {
      const updates = subs.map((symbol) => ({
        symbol,
        candle: getNextCandle(symbol),
      }));

      client.send(JSON.stringify({ type: "candle", data: updates }));
    }
  });
}, 100);

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
