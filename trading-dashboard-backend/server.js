const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server running on ws://localhost:8080');

const symbols = [
  "AAPL", "MSFT", "NVDA", "META", "GOOGL",
  "AMZN", "TSLA", "NFLX", "AMD", "INTC",
  "BTCUSD", "ETHUSD", "SPY", "QQQ", "VOO"
];

const basePrices = {
  AAPL: 180, MSFT: 350, NVDA: 700, META: 450, GOOGL: 160,
  AMZN: 180, TSLA: 250, NFLX: 600, AMD: 150, INTC: 120,
  BTCUSD: 4000, ETHUSD: 2500, SPY: 500, QQQ: 430, VOO: 450
};

function getRandomPrice(base) {
  const volatility = base > 1000 ? 5 : base > 100 ? 1 : 0.01;
  const change = (Math.random() - 0.5) * volatility;
  return +(base + change).toFixed(2);
}

function getMockCandle(base) {
  const open = getRandomPrice(base);
  const close = getRandomPrice(base);
  const high = Math.max(open, close) + Math.random() * 2;
  const low = Math.min(open, close) - Math.random() * 2;
  return {
    open: +open.toFixed(2),
    high: +high.toFixed(2),
    low: +low.toFixed(2),
    close: +close.toFixed(2),
    timestamp: Date.now()
  };
}

let previousPrice;

// === Track subscriptions per client ===
wss.on('connection', (ws) => {
  previousPrice = 0;
  ws.subscriptions = {};  // { channel: [symbols] }

  console.log('Client connected');

  ws.on('message', (msg) => {
    try {
      const message = JSON.parse(msg);
      const { type, channel, symbols: subSymbols } = message;

      if (type === 'subscribe' && channel && Array.isArray(subSymbols)) {
        // Validate symbols
        const validSymbols = subSymbols.filter(s => symbols.includes(s));

        // Store per channel
        ws.subscriptions[channel] = validSymbols;
        console.log(`Client subscribed to [${channel}]:`, validSymbols);
      }
    } catch (err) {
      console.error('Invalid message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// === Broadcast tickers ===
setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) return;

    const subs = client.subscriptions['ticker'];
    if (subs && subs.length > 0) {
      const updates = subs.map(symbol => {
        const basePrice = basePrices[symbol];
        const last = getRandomPrice(basePrice);
        if (!previousPrice) {
          previousPrice = last;
        }
        const change = +(last - previousPrice).toFixed(2);
        const percentChange = +(((last - previousPrice) / previousPrice) * 100).toFixed(2);
        previousPrice = last;
        const bid = getRandomPrice(basePrice - 1);
        const ask = getRandomPrice(basePrice + 1);
        return ({
          symbol,
          price: {
            last,
            bid,
            ask,
            change,
            percentChange
          },
          timestamp: Date.now()
        });
      });
      client.send(JSON.stringify({ type: 'ticker', data: updates }));
    }
  });
}, 1000);

// === Broadcast candles ===
setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) return;

    const subs = client.subscriptions['candle'];
    if (subs && subs.length > 0) {
      const updates = subs.map(symbol => ({
        symbol,
        candle: getMockCandle(basePrices[symbol])
      }));
      client.send(JSON.stringify({ type: 'candle', data: updates }));
    }
  });
}, 3000);
