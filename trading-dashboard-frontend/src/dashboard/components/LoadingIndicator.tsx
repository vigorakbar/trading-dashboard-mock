import { CircularProgress } from "@mui/material"

import { Box } from "@mui/material"

export const LoadingIndicator = ({ isPending }: { isPending: boolean }) => {
  return isPending ? (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        backdropFilter: "blur(2px)",
        backgroundColor: "rgba(255,255,255,0.1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      {/* <CircularProgress /> */}
    </Box>
  ) : null;
}