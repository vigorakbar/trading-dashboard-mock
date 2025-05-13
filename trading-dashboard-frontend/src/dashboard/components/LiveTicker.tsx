import { Card, Typography, Stack, Grid } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useState } from "react";
import { useTickerStream } from "../hooks/useTickerStream";
import { Price } from "../types/types";
export const LiveTicker = (props: { symbol: string; isPending: boolean }) => {
  const [price, setPrice] = useState<Price>({ last: 0, bid: 0, ask: 0, change: 0, percentChange: 0 });

  useTickerStream(props.symbol, props.isPending, (updates) => {
    setPrice(updates[0].price);
  });

  const color = price.change > 0 ? "success" : price.change < 0 ? "error" : "text.secondary";

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        p: 1,
        pl: 2,
        display: "inline-flex",
        maxWidth: "400px",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle2">
        {props.symbol}
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={0.5} sx={{ mb: 1 }}>
            <Typography variant="h5">
              ${price.last}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="h6">
              ${price.bid} / ${price.ask}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bid / Ask
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={0.5} sx={{ mb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" color={color}>
                {`${price.change > 0 ? "+" : ""}${price.change} (${price.percentChange}%)`}
              </Typography>
              {price.change > 0 ? (
                <ArrowUpwardIcon fontSize="small" color="success" />
              ) : price.change < 0 ? (
                <ArrowDownwardIcon fontSize="small" color="error" />
              ) : null}
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Change
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};
