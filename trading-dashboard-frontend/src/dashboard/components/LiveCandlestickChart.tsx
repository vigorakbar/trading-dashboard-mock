import Highcharts, { Options } from "highcharts/highstock";
import "highcharts/modules/price-indicator";
import HighchartsReact from "highcharts-react-official";

import { useHistoricalCandles } from "../hooks/useHistoricalAndLiveCandles";
import { useMemo, useState } from "react";
import { useCandleChart } from "../hooks/useCandleChart";
import { symbols } from "../constants";

export const LiveCandlestickChart = ({
  symbol,
  isPending,
}: {
  symbol: string;
  isPending: boolean;
}) => {
  const [series, setSeries] = useState<Highcharts.Series>();
  const { historicalCandles } = useHistoricalCandles({
    symbol,
    isPending,
  });

  useCandleChart({
    symbol,
    isPending,
    series,
  });

  const options: Options = useMemo(
    () => ({
      stockTools: {
        gui: {
          enabled: false,
        },
      },
      time: {
        timezone: "Asia/Singapore",
      },
      chart: {
        type: "candlestick",
        events: {
          load() {
            const chart = this,
              series = chart.series[0];
            setSeries(series);
          },
        },
      },
      rangeSelector: {
        buttons: [
          {
            type: "minute",
            count: 1,
            text: "1m",
          },
          {
            type: "minute",
            count: 5,
            text: "5m",
          },
          {
            type: "minute",
            count: 20,
            text: "20m",
          },
          {
            type: "all",
            count: 1,
            text: "All",
          },
        ],
        inputEnabled: false,
      },
      xAxis: {
        overscroll: "24px",
      },
      series: [
        {
          type: "candlestick",
          name: symbols.find((value) => value.symbol === symbol)?.name,
          color: "#FF7F7F",
          upColor: "#90EE90",
          data: historicalCandles,
          dataGrouping: {
            groupPixelWidth: 25,
          },
          lastPrice: {
            enabled: true,
            label: {
              enabled: true,
              backgroundColor: "#FF7F7F",
            },
          },
        },
      ],
    }),
    [historicalCandles, symbol]
  );

  return (
    <HighchartsReact
      immutable
      key={symbol}
      highcharts={Highcharts}
      options={options}
      constructorType="stockChart"
    />
  );
};
