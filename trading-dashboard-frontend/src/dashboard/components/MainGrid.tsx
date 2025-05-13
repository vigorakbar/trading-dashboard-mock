import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import ChartUserByCountry from "./ChartUserByCountry";
import CustomizedTreeView from "./CustomizedTreeView";
import CustomizedDataGrid from "./CustomizedDataGrid";
import { LiveTicker } from "./LiveTicker";
import { PnLCard } from "./PnLCard";
import { SymbolPicker } from "./SymbolPicker";
import { PositionCard } from "./PositionCard";
import { LoadingIndicator } from "./LoadingIndicator";
import { CandlestickChart } from "./CandlestickChart";

export const symbols: {
  symbol: string;
  name: string;
}[] = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
    { symbol: "META", name: "Meta Platforms Inc." },
    { symbol: "GOOGL", name: "Alphabet Inc. (Google)" },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "NFLX", name: "Netflix Inc." },
    { symbol: "AMD", name: "Advanced Micro Devices Inc." },
    { symbol: "INTC", name: "Intel Corporation" },
    { symbol: "BTCUSD", name: "Bitcoin / US Dollar" },
    { symbol: "ETHUSD", name: "Ethereum / US Dollar" },
    { symbol: "SPY", name: "SPDR S&P 500 ETF Trust" },
    { symbol: "QQQ", name: "Invesco QQQ Trust (Nasdaq-100)" },
    { symbol: "VOO", name: "Vanguard S&P 500 ETF" },
  ];

export default function MainGrid() {
  const [selectedSymbol, setSelectedSymbol] = React.useState<string>(
    symbols[0].symbol
  );
  const [isPending, startTransition] = React.useTransition();

  const startSymbolChange = React.useCallback(
    (newValue: string | null) => {
      startTransition(() => {
        setSelectedSymbol(newValue || "");
      });
    },
    [setSelectedSymbol, startTransition]
  );

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview {isPending && <span>Loading...</span>}
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid
          size={{ xs: 12, md: 6, lg: 3 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <SymbolPicker
            startSymbolChange={startSymbolChange}
            symbols={symbols}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6, lg: 3 }}
          sx={{
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingIndicator isPending={isPending} />
          <LiveTicker symbol={selectedSymbol} isPending={isPending} />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6, lg: 3 }}
          sx={{
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingIndicator isPending={isPending} />
          <PositionCard symbol={selectedSymbol} />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6, lg: 3 }}
          sx={{
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingIndicator isPending={isPending} />
          <PnLCard symbol={selectedSymbol} />
        </Grid>
        <Grid size={12} sx={{ position: "relative" }}>
          <LoadingIndicator isPending={isPending} />
          <CandlestickChart symbol={selectedSymbol} />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid symbol={selectedSymbol} />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
            <CustomizedTreeView symbol={selectedSymbol} />
            <ChartUserByCountry symbol={selectedSymbol} />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
