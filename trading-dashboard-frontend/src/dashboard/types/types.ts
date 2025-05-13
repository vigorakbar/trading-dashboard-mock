export type Candle = [
  timestamp: number,
  open: number,
  high: number,
  low: number,
  close: number,
];

export type Price = {
  last: number;
  bid: number;
  ask: number;
  change: number;
  percentChange: number;
}