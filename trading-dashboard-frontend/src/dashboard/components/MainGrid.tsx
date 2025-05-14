import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LiveTicker } from "./LiveTicker";
import { PnLCard } from "./PnLCard";
import { SymbolPicker } from "./SymbolPicker";
import { PositionCard } from "./PositionCard";
import { LoadingIndicator } from "./LoadingIndicator";
import { LiveCandlestickChart } from "./LiveCandlestickChart";
import { StockChart } from "./StockChart";
import { symbols } from "../constants";

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
        Overview
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
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Stock Chart
        </Typography>
        <Grid size={12} sx={{ position: "relative", mb: 2 }}>
          <LoadingIndicator isPending={isPending} />
          <StockChart symbol={selectedSymbol} />
        </Grid>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Live Chart
        </Typography>
        <Grid size={12} sx={{ position: "relative", height: "780px" }}>
          <LoadingIndicator isPending={isPending} />
          <LiveCandlestickChart symbol={selectedSymbol} isPending={isPending} />
        </Grid>
      </Grid>
    </Box>
  );
}
