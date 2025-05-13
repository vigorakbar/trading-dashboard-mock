import { Card, Typography, Stack } from "@mui/material";

const symbolPositionData = {
  AAPL: { quantity: 150, averageEntry: 175 },
  MSFT: { quantity: 80, averageEntry: 340 },
  NVDA: { quantity: 50, averageEntry: 650 },
  META: { quantity: 120, averageEntry: 420 },
  GOOGL: { quantity: 30, averageEntry: 155 },
  AMZN: { quantity: 40, averageEntry: 170 },
  TSLA: { quantity: 60, averageEntry: 230 },
  NFLX: { quantity: 70, averageEntry: 550 },
  AMD: { quantity: 200, averageEntry: 140 },
  INTC: { quantity: 300, averageEntry: 38 },
  BTCUSD: { quantity: 2.5, averageEntry: 38000 },
  ETHUSD: { quantity: 15, averageEntry: 2200 },
  SPY: { quantity: 100, averageEntry: 480 },
  QQQ: { quantity: 90, averageEntry: 410 },
  VOO: { quantity: 110, averageEntry: 430 },
};
export const PositionCard = ({ symbol }: { symbol: string }) => {
  const position = symbolPositionData[symbol as keyof typeof symbolPositionData];

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        p: 2,
        display: "inline-flex",
        maxWidth: "400px",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <Stack spacing={0.5} sx={{ mb: 1 }}>
        <Typography variant="h5">
          {position.quantity} shares
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Position
        </Typography>
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="h5">
          ${position.averageEntry}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Average Entry
        </Typography>
      </Stack>
    </Card>
  );
};
