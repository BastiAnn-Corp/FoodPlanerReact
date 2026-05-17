"use client"
import { Box, Typography } from "@mui/material";

export function EmptyState() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        gap: 1.75,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 76,
          height: 76,
          borderRadius: '50%',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.125rem',
          mb: 0.75,
        }}
      >
        🛒
      </Box>
      <Typography variant="h6" sx={{ fontSize: '1.0625rem' }}>
        Tu lista está vacía
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, maxWidth: 280 }}>
        Añade recetas de arriba para generar tu lista de ingredientes agrupada por pasillo
      </Typography>
    </Box>
  );
}
