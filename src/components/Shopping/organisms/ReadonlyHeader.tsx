"use client"
import { Box, Chip, Typography } from "@mui/material";

interface ReadonlyHeaderProps {
  ownerName: string;
  listName: string;
  ownerInitials: string;
}

export function ReadonlyHeader({ ownerName, listName, ownerInitials }: ReadonlyHeaderProps) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        bgcolor: 'action.hover',
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          bgcolor: 'primary.dark',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {ownerInitials}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={500}>Lista de {ownerName}</Typography>
        <Typography variant="caption" color="text.secondary">{listName}</Typography>
      </Box>
      <Chip
        label="Solo lectura"
        size="small"
        sx={{
          bgcolor: 'rgba(124,179,66,0.12)',
          color: 'primary.main',
          border: '1px solid rgba(124,179,66,0.24)',
          fontSize: '0.6875rem',
          fontWeight: 500,
        }}
      />
    </Box>
  );
}
