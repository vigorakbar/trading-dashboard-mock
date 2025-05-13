import { useEffect, useRef, useState, useCallback } from "react";
import { Candle } from "../types/types";

interface CandleUpdate {
  symbol: string;
  candle: Candle;
}

interface UseHistoricalCandlesProps {
  symbol: string;
  isPending: boolean;
  onLiveUpdate: (update: CandleUpdate) => void;
}

/**
 * Improved hook for handling both historical and live candle data
 * Separates the concerns of fetching historical data and streaming live updates
 */
// Hook for fetching historical candle data
export function useHistoricalCandles({
  symbol,
  isPending,
}: Omit<UseHistoricalCandlesProps, 'onLiveUpdate'>) {
  const [historicalCandles, setHistoricalCandles] = useState<Candle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isHistoricalDataLoaded, setIsHistoricalDataLoaded] = useState(false);

  const fetchHistoricalData = useCallback(async () => {
    if (!symbol || isPending) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/initialCandles?symbols=${symbol}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch historical data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data[symbol] && Array.isArray(data[symbol])) {
        const candles = data[symbol];
        console.log(`[Candle] Loaded ${candles.length} historical candles for ${symbol}`);
        setHistoricalCandles(candles);  
        setIsHistoricalDataLoaded(true);
      } else {
        console.warn(`No historical data for symbol: ${symbol}`);
        setIsHistoricalDataLoaded(true);
      }
    } catch (err) {
      console.error("Error fetching historical candle data:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [symbol, isPending]);

  useEffect(() => {
    if (!isPending) {
      fetchHistoricalData();
    } else {
      setIsLoading(false);
      setIsHistoricalDataLoaded(false);
    }
  }, [symbol, isPending, fetchHistoricalData]);

  return {
    historicalCandles,
    isLoading,
    error,
    isHistoricalDataLoaded,
    refreshHistoricalData: fetchHistoricalData
  };
}

// Hook for handling live candle updates via WebSocket
export function useLiveCandles({
  symbol,
  isPending,
  onLiveUpdate
}: Omit<UseHistoricalCandlesProps, 'onHistoricalData'>) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "candle" && message.data && Array.isArray(message.data)) {
        message.data.forEach((update: CandleUpdate) => {
          if (update.symbol === symbol) {
            onLiveUpdate(update);
          }
        });
      }
    } catch (err) {
      console.error("[Candle WS] Failed to parse message:", err);
    }
  }, [symbol, onLiveUpdate]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("[Candle WS] Already connected");
      return;
    }

    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[Candle WS] Connected");
      ws.send(
        JSON.stringify({
          type: "subscribe",
          channel: "candle",
          symbols: [symbol],
        })
      );
    };

    ws.onmessage = handleWebSocketMessage;

    ws.onclose = (event) => {
      console.log("[Candle WS] Disconnected", event.code, event.reason);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("[Candle WS] Reconnecting...");
        connectWebSocket();
      }, 1000);
    };

    ws.onerror = (err) => {
      console.error("[Candle WS] Error:", err);
      ws.close();
    };
  }, [symbol, handleWebSocketMessage]);

  useEffect(() => {
    if (!isPending) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [symbol, isPending, connectWebSocket]);
}

export function useHistoricalAndLiveCandles(props: UseHistoricalCandlesProps) {
  const historicalData = useHistoricalCandles(props);
  useLiveCandles(props);

  return historicalData;
}