import Highcharts, { Options } from 'highcharts/highstock'
import HighchartsReact from "highcharts-react-official";

import { useHistoricalCandles } from '../hooks/useHistoricalAndLiveCandles';
import { useMemo, useState } from 'react';
import { useCandleChart } from '../hooks/useCandleChart';

export const CandlestickChart = ({ symbol, isPending }: { symbol: string, isPending: boolean }) => {
  const [series, setSeries] = useState<Highcharts.Series>();
  const { historicalCandles } = useHistoricalCandles({
    symbol, isPending,
  });


  useCandleChart({
    symbol,
    isPending,
    series
  });

  const options: Options = useMemo(() => ({
    time: {
      timezone: 'Asia/Singapore'
    },
    chart: {
      type: "candlestick",
      events: {
        load() {
          const chart = this,
            series = chart.series[0];
          setSeries(series);
        }
      },
    },
    rangeSelector: {
      buttons: [{
        type: 'minute',
        count: 1,
        text: '1m'
      }, {
        type: 'minute',
        count: 5,
        text: '5m'
      },
      {
        type: 'minute',
        count: 10,
        text: '10m'
      },
      {
        type: 'minute',
        count: 30,
        text: '30m'
      }, {
        type: 'all',
        count: 1,
        text: 'All'
      }],
      inputEnabled: false
    },
    series: [{
      type: "candlestick",
      color: '#FF7F7F',
      upColor: '#90EE90',
      data: historicalCandles,
      lastPrice: {
        enabled: true,
        label: {
          enabled: true,
          backgroundColor: '#FF7F7F'
        }
      },
    }],
  }), [historicalCandles, symbol]);


  return <HighchartsReact
    key={symbol}
    highcharts={Highcharts}
    options={options}
    constructorType="stockChart"
  />
};
