import { Autocomplete, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react";

// apply react.memo
export const SymbolPicker = React.memo(({ startSymbolChange, symbols }: {
  startSymbolChange: (symbol: string) => void, symbols: {
    symbol: string;
    name: string;
  }[]
}) => {
  const [symbol, setSymbol] = useState(symbols[0].symbol)


  const handleSymbolChange = (_: React.SyntheticEvent, newValue: string | null) => {
    setSymbol(newValue || "")
    startSymbolChange(newValue || "")
  };

  const symbolOptions = React.useMemo(() => symbols.map((symbol) => symbol.symbol), [symbols])
  return (
    <Stack spacing={1} width="100%">
      <Autocomplete
        options={symbolOptions}
        renderInput={(params) => <TextField {...params} label="Symbol" />}
        value={symbol}
        onChange={handleSymbolChange}
        sx={{ width: "100%", maxWidth: "400px" }}
        disableClearable
      />
      <Typography variant="body1" fontSize={15} color="text.secondary" sx={{ pl: 1.5, pt: 1 }}>
        {symbols.find((symbolValue) => symbolValue.symbol === symbol)?.name}
      </Typography>
    </Stack>
  )
})