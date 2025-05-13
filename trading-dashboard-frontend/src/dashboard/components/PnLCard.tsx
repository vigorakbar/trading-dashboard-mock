import { Card, Typography, Stack } from "@mui/material";

const symbolData = {
  AAPL: { unrealized: 1200, realized: 850 },
  MSFT: { unrealized: 950, realized: 1100 },
  NVDA: { unrealized: 2500, realized: 1800 },
  META: { unrealized: 750, realized: 600 },
  GOOGL: { unrealized: 1100, realized: 950 },
  AMZN: { unrealized: 800, realized: 650 },
  TSLA: { unrealized: 1500, realized: 2200 },
  NFLX: { unrealized: 550, realized: 400 },
  AMD: { unrealized: 900, realized: 750 },
  INTC: { unrealized: 450, realized: 300 },
  BTCUSD: { unrealized: 3500, realized: 2800 },
  ETHUSD: { unrealized: 1800, realized: 1200 },
  SPY: { unrealized: 2000, realized: 1750 },
  QQQ: { unrealized: 1600, realized: 1400 },
  VOO: { unrealized: 1900, realized: 1650 },
};
export const PnLCard = ({ symbol }: { symbol: string }) => {
  const pnl = symbolData[symbol as keyof typeof symbolData];
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
          ${pnl.unrealized}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Unrealized PnL
        </Typography>
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="h5">
          ${pnl.realized}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Realized PnL
        </Typography>
      </Stack>
    </Card>
  );
};
