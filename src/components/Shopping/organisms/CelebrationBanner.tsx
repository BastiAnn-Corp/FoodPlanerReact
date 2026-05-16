"use client"
import { Box, Typography } from "@mui/material";

export function CelebrationBanner() {
  return (
    <Box
      sx={{
        mx: 2,
        my: 1.5,
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #2e5e14, #558b2f 60%, #6aaa2e)',
        p: '20px 18px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(86,171,47,0.3)',
        '@keyframes popIn': {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '60%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        animation: 'popIn 0.4s ease forwards',
      }}
    >
      <Typography component="span" sx={{ fontSize: '2.375rem', display: 'block', mb: 1 }}>
        🎉
      </Typography>
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
        ¡Lista completada!
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.625, lineHeight: 1.4 }}>
        Ya tienes todo lo que necesitas para cocinar esta semana.
      </Typography>
    </Box>
  );
}
