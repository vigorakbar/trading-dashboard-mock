import { useCallback, useEffect, useState } from 'react';
import { Candle } from '../types/types';
import { useHistoricalAndLiveCandles, useLiveCandles } from './useHistoricalAndLiveCandles';
import Highcharts, { Options } from 'highcharts/highstock'


interface CandleUpdate {
  symbol: string;
  candle: Candle;
}

interface UseCandleChartProps {
  symbol: string;
  isPending?: boolean;
  timeframe?: string;
  series?: Highcharts.Series;
}

/**
 * Hook to manage candle chart data with both historical and live updates
 * Returns candles in the format expected by Highcharts: [timestamp, open, high, low, close]
 */
export function useCandleChart({
  symbol,
  isPending = false,
  series
}: UseCandleChartProps) {

  const handleLiveUpdate = useCallback((update: CandleUpdate) => {
    if (!series) return;
    // @ts-ignore
    const data = series.options.data as Candle[],
      newPoint = update.candle,
      lastPoint = data[data.length - 1];
    if (lastPoint[0] !== newPoint[0]) {
      series.addPoint(newPoint);
    } else {
      // Existing point, update it
      // @ts-ignore
      series.options.data[data.length - 1] = newPoint;

      series.setData(data);
    }
  }, [series]);

  useLiveCandles({
    symbol,
    isPending,
    onLiveUpdate: handleLiveUpdate,
  });

}