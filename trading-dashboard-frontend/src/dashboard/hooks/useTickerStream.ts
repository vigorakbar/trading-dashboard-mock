import { useEffect, useRef } from 'react';


type Price = {
  last: number;
  bid: number;
  ask: number;
  change: number;
  percentChange: number;
}

interface TickerUpdate {
  symbol: string;
  price: Price;
  timestamp: number;
}

type OnData = (updates: TickerUpdate[]) => void;

export function useTickerStream(symbol: string, isPending: boolean, onData: OnData) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let isUnmounted = false;

    const connect = () => {
      const ws = new WebSocket('ws://localhost:8080');
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'subscribe',
          channel: 'ticker',
          symbols: [symbol]
        }));
        console.log('[Ticker WS] Connected');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'ticker') {
          onData(message.data);
        }
      };

      ws.onclose = (event) => {
        console.log('[Ticker WS] Disconnected', event.code, event.reason);

        if (!isUnmounted) {
          // Auto-reconnect after 1 sec
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('[Ticker WS] Reconnecting...');
            connect();
          }, 1000);
        }
      };

      ws.onerror = (err) => {
        console.error('[Ticker WS] Error:', err);
        ws.close(); // Force close on error (triggers onclose)
      };
    };

    if (isPending) {
      onData([{ symbol, price: { last: 0, bid: 0, ask: 0, change: 0, percentChange: 0 }, timestamp: 0 }]);
    } else {
      connect();
    }

    return () => {
      isUnmounted = true;
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [symbol, isPending]);
}
