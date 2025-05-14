import Highcharts, { Options } from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import "highcharts/css/annotations/popup.css";
import "highcharts/css/stocktools/gui.css";

import "highcharts/indicators/indicators-all";
import "highcharts/modules/drag-panes";
import "highcharts/modules/annotations-advanced";
import "highcharts/modules/price-indicator";
import "highcharts/modules/stock-tools";
import "highcharts/modules/heikinashi";
import "highcharts/modules/hollowcandlestick";
import { generateStaticOHLCmock } from "../utils";
import { symbols } from "../constants";

export const StockChart = ({ symbol }: { symbol: string }) => {
  const name = symbols.find((value) => value.symbol === symbol)?.name;
  const mockData = generateStaticOHLCmock()[symbol];
  const options: Options = {
    chart: {
      height: 600,
    },
    time: {
      timezone: "Asia/Singapore",
    },
    yAxis: [
      {
        labels: {
          align: "left",
        },
        height: "80%",
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: "left",
        },
        top: "80%",
        height: "20%",
        offset: 0,
      },
    ],
    tooltip: {
      shape: "square",
      headerShape: "callout",
      borderWidth: 0,
      shadow: false,
      fixed: true,
    },
    series: [
      {
        type: "candlestick",
        data: mockData.ohlc,
        name,
        dataGrouping: {
          groupPixelWidth: 25,
        },
      },
      {
        type: "column",
        name,
        data: mockData.volume,
        yAxis: 1,
      },
    ],
    rangeSelector: {
      selected: 4,
    },
  };
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
