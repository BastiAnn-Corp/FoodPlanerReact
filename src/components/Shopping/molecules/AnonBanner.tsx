"use client"
import { Box, IconButton, Typography } from "@mui/material";
import { CloseRounded, InfoRounded } from "@mui/icons-material";
import { LogInButton } from "@/components/Auth/LogInButton";

interface AnonBannerProps {
  onDismiss: () => void;
}

export function AnonBanner({ onDismiss }: AnonBannerProps) {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(0,131,149,0.14)',
        borderBottom: '1px solid rgba(0,188,212,0.2)',
        px: 1.5,
        py: 1.25,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <InfoRounded sx={{ color: '#4dd0e1', fontSize: 18, flexShrink: 0 }} />
      <Typography variant="body2" sx={{ flex: 1, lineHeight: 1.3 }}>
        Inicia sesión para guardar tu lista
      </Typography>
      <LogInButton
        variant="text"
        color="primary"
        size="small"
        sx={{ whiteSpace: 'nowrap', fontSize: '0.8125rem', fontWeight: 500, textTransform: 'none' }}
      />
      <IconButton size="small" onClick={onDismiss} aria-label="Cerrar" sx={{ color: 'text.secondary' }}>
        <CloseRounded sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}
