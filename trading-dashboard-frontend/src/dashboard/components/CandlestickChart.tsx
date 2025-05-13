import Highcharts from 'highcharts/highstock'
import HighchartsReact from "highcharts-react-official";

export const CandlestickChart = ({ symbol }: { symbol: string }) => {
  const options = {
    chart: {
      type: "candlestick",
    },
    series: [{
      type: "candlestick",
      data: [
        [1435066592000, 100, 110, 90, 105],
        [1435066652000, 110, 120, 100, 115],
      ],
    }],
  };
  return <HighchartsReact
    highcharts={Highcharts}
    options={options}
    constructorType="stockChart"
  />
};
